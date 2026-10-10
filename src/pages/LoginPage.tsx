import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export const LoginPage: React.FC = () => {
  const {loginUser,registerUser,settings,isRecovery,finishRecovery}=useApp();
  const [mode,setMode]=useState<'login'|'register'|'forgot'>('login');
  const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[instrument,setInstrument]=useState('Violão');
  const [confirm,setConfirm]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState<string|null>(null),[message,setMessage]=useState('');
  const [done,setDone]=useState(false);
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();if(busy)return;setBusy(true);setError(null);setMessage('');
    try{
      if(!supabase)throw new Error('A plataforma ainda não foi configurada.');
      if(isRecovery){
        if(password.length<8||password!==confirm)throw new Error('Use pelo menos 8 caracteres e confirme a mesma senha.');
        const {error}=await supabase.auth.updateUser({password});if(error)throw new Error('Link inválido ou expirado. Solicite um novo link.');
        setDone(true);window.history.replaceState({},document.title,window.location.pathname);
      }else if(mode==='forgot'){
        const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+window.location.pathname});
        if(error)throw new Error('Não foi possível solicitar o link. Tente novamente.');
        setMessage('Se houver uma conta com esse e-mail, você receberá o link de recuperação.');
      }else if(mode==='register'){
        if(!settings.allowRegistrations)throw new Error('Novos cadastros estão desativados.');
        if(!name.trim()||password.length<8)throw new Error('Informe seu nome e uma senha com pelo menos 8 caracteres.');
        if(!await registerUser(email,password,name,instrument))throw new Error('Não foi possível cadastrar. Confira os dados e tente novamente.');
        setMessage('Confira seu e-mail para confirmar o cadastro. A assinatura precisa ser ativada pelo administrador.');
      }else if(!await loginUser(email,password))throw new Error('Não foi possível entrar. Confira os dados e tente novamente.');
    }catch(err){setError(err instanceof Error?err.message:'Não foi possível concluir.');}finally{setBusy(false);}
  };
  const input='rounded-lg bg-zinc-950 border border-zinc-700 px-3 py-3 text-sm w-full';
  return <div className="mx-auto max-w-md px-4 py-12"><div className="glass-panel border border-zinc-800 rounded-2xl p-6 space-y-5">
    <h1 className="text-xl font-bold">{isRecovery?'Criar nova senha':mode==='register'?'Criar conta':mode==='forgot'?'Recuperar senha':'Entrar na plataforma'}</h1>
    {error&&<p role="alert" className="text-red-400">{error}</p>}{message&&<p role="status" className="text-emerald-400">{message}</p>}
    {done?<><p>Senha alterada com sucesso.</p><button onClick={()=>void finishRecovery()}>Ir para o login</button></>:<form onSubmit={submit} className="space-y-4">
      <fieldset disabled={busy} className="space-y-4">
        {!isRecovery&&<label className="block">E-mail<input className={input} type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
        {mode==='register'&&!isRecovery&&<><label className="block">Nome<input className={input} required value={name} onChange={e=>setName(e.target.value)}/></label><label className="block">Instrumento<input className={input} value={instrument} onChange={e=>setInstrument(e.target.value)}/></label></>}
        {(isRecovery||mode!=='forgot')&&<label className="block">{isRecovery?'Nova senha':'Senha'}<input className={input} type="password" autoComplete={isRecovery||mode==='register'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)}/></label>}
        {isRecovery&&<label className="block">Confirmar senha<input className={input} type="password" autoComplete="new-password" required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>}
        <button type="submit" className="w-full rounded-lg bg-purple-600 px-4 py-3 font-bold">{busy?'Aguarde…':isRecovery?'Salvar nova senha':mode==='register'?'Cadastrar':mode==='forgot'?'Enviar link':'Entrar'}</button>
      </fieldset>
    </form>}
    {!isRecovery&&<div className="flex flex-wrap gap-4 text-sm"><button onClick={()=>{setMode(mode==='login'?'forgot':'login');setError(null);setMessage('');}}>{mode==='login'?'Esqueci minha senha':'Voltar ao login'}</button>{settings.allowRegistrations&&mode==='login'&&<button onClick={()=>setMode('register')}>Criar conta</button>}</div>}
  </div></div>;
};
