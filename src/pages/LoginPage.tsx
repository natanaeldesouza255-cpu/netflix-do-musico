import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Lock, ShieldAlert, Sparkles, UserPlus, LogIn } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginUser } = useApp();
  
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState('aluno@musico.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [instrument, setInstrument] = useState('Violão');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLoginTab) {
      const success = loginUser(email, password);
      if (!success) {
        setError('Por favor, informe um e-mail válido e uma senha com pelo menos 6 caracteres.');
      }
    } else {
      // Registrar conta simulada
      if (name.trim() === '' || email.trim() === '' || password.length < 6) {
        setError('Preencha todos os campos obrigatórios. A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      // O login fake aceita qualquer coisa
      loginUser(email, password);
    }
  };

  const handleTestLogin = () => {
    setEmail('aluno@musico.com');
    setPassword('123456');
    loginUser('aluno@musico.com', '123456');
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24" id="login-page-root">
      
      {/* Container Central com Borda Neon e Efeito de Vidro */}
      <div className="glass-panel border rounded-2xl p-6 sm:p-8 border-zinc-800 shadow-2xl relative overflow-hidden neon-glow-purple">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400" />
        
        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="inline-flex h-10 w-10 bg-purple-500/15 border border-purple-500/25 text-purple-400 items-center justify-center rounded-xl mb-3 shadow-inner">
            <Sparkles className="h-5.5 w-5.5 fill-purple-400/15" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {isLoginTab ? 'Acesse a Comunidade' : 'Crie sua Conta Premium'}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {isLoginTab 
              ? 'Insira suas credenciais para entrar na área de assinantes' 
              : 'Seja bem-vindo ao maior ecossistema de aprendizado musical'}
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-950/30 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs leading-relaxed flex items-start gap-2 mb-4 animate-shake">
            <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário Principal */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {!isLoginTab && (
            <>
              {/* Campo: Nome */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Nome Completo</label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 placeholder-zinc-550 focus:border-purple-400 focus:outline-none transition"
                  required
                  id="input-login-name"
                />
              </div>

              {/* Campo: Instrumento principal */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Instrumento Principal</label>
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 focus:border-purple-400 focus:outline-none"
                  id="select-login-instrument"
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

          {/* Campo: E-mail */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">E-mail</label>
            <div className="relative">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 pl-10 text-zinc-200 placeholder-zinc-550 focus:border-purple-400 focus:outline-none transition"
                required
                id="input-login-email"
              />
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          {/* Campo: Senha */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Senha</label>
              {isLoginTab && (
                <button 
                  type="button"
                  className="text-[10px] text-zinc-500 hover:text-cyan-400 transition"
                  onClick={() => alert('Dica: Use a senha de teste "123456"!')}
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 pl-10 text-zinc-200 placeholder-zinc-550 focus:border-purple-400 focus:outline-none transition"
                required
                id="input-login-password"
              />
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            </div>
          </div>

          {/* Botão de Envio */}
          <button 
            type="submit"
            className="mt-2 w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500 hover:opacity-90 text-white font-extrabold text-xs py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-purple-500/10 focus:outline-none"
            id="btn-login-submit"
          >
            {isLoginTab ? (
              <>
                <LogIn className="h-4 w-4" />
                <span>Entrar como Assinante</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Registrar e Acessar</span>
              </>
            )}
          </button>
        </form>

        {/* Credenciais de Teste Rápidas */}
        {isLoginTab && (
          <div className="mt-5 p-3 rounded-lg bg-zinc-950/80 border border-zinc-900/60 flex flex-col gap-2">
            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 fill-cyan-400/10" />
              Credenciais de Teste Rápidas:
            </div>
            <div className="text-[11px] text-zinc-450 leading-relaxed">
              Clique no botão abaixo para preencher os dados de teste e entrar instantaneamente na área premium do assinante!
            </div>
            <button
              onClick={handleTestLogin}
              className="mt-1 w-full bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/20 text-cyan-400 font-bold text-[10px] py-1.5 rounded transition uppercase"
              id="btn-quick-login-test"
            >
              🚀 Acesso Rápido de Teste
            </button>
          </div>
        )}

        {/* Alternar entre Login e Registro */}
        <div className="mt-6 text-center border-t border-zinc-900/60 pt-4 text-xs text-zinc-550">
          {isLoginTab ? (
            <>
              Não é um assinante?{' '}
              <button 
                onClick={() => {
                  setIsLoginTab(false);
                  setError(null);
                }}
                className="text-purple-400 font-bold hover:underline"
              >
                Crie sua conta
              </button>
            </>
          ) : (
            <>
              Já possui uma conta?{' '}
              <button 
                onClick={() => {
                  setIsLoginTab(true);
                  setError(null);
                }}
                className="text-purple-400 font-bold hover:underline"
              >
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
