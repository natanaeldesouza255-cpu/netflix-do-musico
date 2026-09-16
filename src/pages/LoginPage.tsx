import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TEST_ACCOUNTS } from '../config/credentials';
import { Mail, Lock, ShieldAlert, Sparkles, UserPlus, LogIn, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser, settings } = useApp();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState(TEST_ACCOUNTS.student.email);
  const [password, setPassword] = useState(TEST_ACCOUNTS.student.password);
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('Violão');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLoginTab) {
      const success = loginUser(email, password);
      if (!success) {
        setError('Credenciais inválidas. Use as contas de teste ou uma senha com pelo menos 6 caracteres.');
      }
    } else {
      if (name.trim() === '' || email.trim() === '' || password.length < 6) {
        setError('Preencha todos os campos obrigatórios. A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      const success = loginUser(email, password);
      if (!success) setError('Não foi possível criar a conta neste momento.');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24" id="login-page-root">
      <div className="glass-panel border rounded-2xl p-6 sm:p-8 border-zinc-800 shadow-2xl relative overflow-hidden neon-glow-purple">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />

        <div className="text-center mb-6">
          <div className="inline-flex h-10 w-10 bg-purple-500/15 border border-purple-500/25 text-purple-400 items-center justify-center rounded-xl mb-3 shadow-inner">
            <Sparkles className="h-5 w-5 fill-purple-400/15" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {isLoginTab ? 'Acesse a Plataforma' : 'Crie sua Conta Premium'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLoginTab
              ? 'Área do aluno e painel administrativo usam credenciais distintas'
              : 'Seja bem-vindo ao maior ecossistema de aprendizado musical'}
          </p>
        </div>

        {settings.maintenanceMode && (
          <div className="bg-amber-950/40 border border-amber-500/20 text-amber-300 p-3 rounded-lg text-xs mb-4">
            A plataforma está em modo manutenção. Logins de teste continuam disponíveis para o time.
          </div>
        )}

        {error && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginTab && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 focus:border-purple-400 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Instrumento Principal</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 focus:border-purple-400 focus:outline-none"
                >
                  <option value="Violão">Violão</option>
                  <option value="Guitarra">Guitarra</option>
                  <option value="Bateria">Bateria</option>
                  <option value="Contrabaixo">Contrabaixo</option>
                  <option value="Produtor/Reaper">Reaper / Mixagem</option>
                  <option value="Vocal/Podcast">Voz / Podcast</option>
                </select>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">E-mail</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 pl-10 text-zinc-200 focus:border-purple-400 focus:outline-none"
                required
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Senha</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 pl-10 text-zinc-200 focus:border-purple-400 focus:outline-none"
                required
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5"
          >
            {isLoginTab ? <><LogIn className="h-4 w-4" /><span>Entrar</span></> : <><UserPlus className="h-4 w-4" /><span>Registrar e Acessar</span></>}
          </button>
        </form>

        {isLoginTab && (
          <div className="mt-5 space-y-3">
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-900/60">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Acesso rápido — Aluno
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {TEST_ACCOUNTS.student.email} / {TEST_ACCOUNTS.student.password}
              </p>
              <button
                onClick={() => loginUser(TEST_ACCOUNTS.student.email, TEST_ACCOUNTS.student.password)}
                className="mt-2 w-full bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] py-1.5 rounded uppercase"
              >
                Entrar como aluno
              </button>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950/80 border border-purple-500/20">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                Acesso rápido — Administrador
              </div>
              <p className="text-[11px] text-zinc-400 mt-1">
                {TEST_ACCOUNTS.admin.email} / {TEST_ACCOUNTS.admin.password}
              </p>
              <button
                onClick={() => loginUser(TEST_ACCOUNTS.admin.email, TEST_ACCOUNTS.admin.password)}
                className="mt-2 w-full bg-purple-950/40 hover:bg-purple-950/80 border border-purple-500/20 text-purple-300 font-bold text-[10px] py-1.5 rounded uppercase"
              >
                Entrar como administrador
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 text-center border-t border-zinc-900/60 pt-4 text-xs text-zinc-550">
          {isLoginTab ? (
            <>
              Não é um assinante?{' '}
              <button onClick={() => { setIsLoginTab(false); setError(null); }} className="text-purple-400 font-bold hover:underline">
                Crie sua conta
              </button>
            </>
          ) : (
            <>
              Já possui uma conta?{' '}
              <button onClick={() => { setIsLoginTab(true); setError(null); }} className="text-purple-400 font-bold hover:underline">
                Faça login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
