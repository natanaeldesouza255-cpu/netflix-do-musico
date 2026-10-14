import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type Factor = { id: string; status: string; friendly_name?: string };
type Enrollment = { id: string; qr_code: string; secret: string };

export const AdminMfaGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<'loading'|'setup'|'verify'|'ready'|'error'>('loading');
  const [factor, setFactor] = useState<Factor | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!supabase) { setState('error'); setMessage('Supabase não configurado.'); return; }
    setState('loading');
    const [factors, assurance] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    if (factors.error || assurance.error) {
      setMessage('Não foi possível verificar a autenticação em duas etapas.');
      setState('error');
      return;
    }
    const verified = factors.data.totp.find(item => item.status === 'verified');
    if (verified) {
      setFactor(verified);
      setState(assurance.data.currentLevel === 'aal2' ? 'ready' : 'verify');
    } else {
      setState('setup');
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const enroll = async () => {
    if (!supabase || busy) return;
    setBusy(true); setMessage('');
    try {
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Netflix do Músico Admin' });
      if (error) throw error;
      setEnrollment({ id: data.id, qr_code: data.totp.qr_code, secret: data.totp.secret });
      setFactor({ id: data.id, status: 'unverified' });
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Falha ao configurar autenticação.'); }
    finally { setBusy(false); }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!supabase || !factor || busy) return;
    setBusy(true); setMessage('');
    try {
      const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: factor.id });
      if (challengeError) throw challengeError;
      const { error } = await supabase.auth.mfa.verify({ factorId: factor.id, challengeId: challenge.id, code: code.trim() });
      if (error) throw error;
      setCode(''); setEnrollment(null);
      await refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Código inválido.'); }
    finally { setBusy(false); }
  };

  if (state === 'ready') return <>{children}</>;
  return <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-5">
    <section className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-6 space-y-5">
      <h1 className="text-xl font-bold">Segurança do administrador</h1>
      <p className="text-sm text-zinc-300">Para acessar o painel, confirme sua identidade com um aplicativo autenticador, como Google Authenticator ou Microsoft Authenticator.</p>
      {state === 'loading' && <p role="status">Verificando segurança...</p>}
      {state === 'error' && <button className="rounded bg-purple-600 px-4 py-2" onClick={() => void refresh()}>Tentar novamente</button>}
      {state === 'setup' && !enrollment && <button disabled={busy} className="rounded bg-purple-600 px-4 py-2 disabled:opacity-50" onClick={() => void enroll()}>Configurar autenticação em duas etapas</button>}
      {enrollment && <div className="space-y-3">
        <p className="text-sm">Escaneie o QR Code com seu aplicativo autenticador. Guarde o código de recuperação da configuração em local seguro.</p>
        <img src={enrollment.qr_code} alt="QR Code para configurar o autenticador" className="w-48 h-48 bg-white p-2 rounded" />
        <details className="text-sm"><summary>Não consigo escanear o QR Code</summary><code className="block mt-2 break-all select-all">{enrollment.secret}</code></details>
      </div>}
      {(state === 'verify' || enrollment) && <form onSubmit={verify} className="space-y-3">
        <label className="block text-sm">Código de 6 dígitos<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value)} className="mt-2 block w-full rounded bg-zinc-950 border border-zinc-600 px-3 py-3" /></label>
        <button disabled={busy} className="w-full rounded bg-purple-600 px-4 py-3 font-bold disabled:opacity-50">{busy ? 'Aguarde...' : 'Confirmar código'}</button>
      </form>}
      {message && <p role="alert" className="text-sm text-amber-300">{message}</p>}
      <button className="text-sm underline text-zinc-300" onClick={() => void supabase?.auth.signOut()}>Sair da conta</button>
    </section>
  </main>;
};
