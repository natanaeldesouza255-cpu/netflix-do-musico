import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { PublicHome } from './pages/PublicHome';
import { LoginPage } from './pages/LoginPage';
import { MemberHome } from './pages/MemberHome';
import { CategoryPage } from './pages/CategoryPage';
import { CommunityPage } from './pages/CommunityPage';
import { EquipmentReviews } from './pages/EquipmentReviews';
import { StudentProfile } from './pages/StudentProfile';
import { LivePage } from './pages/LivePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { ShieldCheck, Lock, Heart, Award, Sparkles } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentScreen, isSubscriber, navigateTo } = useApp();

  // 1. REGRAS DE SEGURANÇA E BLOQUEIOS CONTRA CÓPIAS (PREVENT DEFAULT COPIES)
  useEffect(() => {
    // Apenas aplica proteções de segurança mais rígidas para assinantes premium para não incomodar o visitante comum
    if (!isSubscriber) return;

    // A. Bloquear clique direito (contextmenu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert('🛡️ Netflix do Músico: Por motivos de segurança e proteção de direitos autorais de nossos instrutores, o clique direito está desabilitado na área premium.');
    };

    // B. Bloquear atalhos de desenvolvedor comuns (inspeção de mídia e antidownload)
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        alert('🛡️ Acesso de desenvolvedor bloqueado na área de assinantes.');
      }
      // Ctrl+Shift+I ou Ctrl+Shift+J ou Ctrl+Shift+C (Inspecionar)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        alert('🛡️ Ferramentas de inspeção bloqueadas para segurança do streaming protegido.');
      }
      // Ctrl+U (Visualizar código fonte)
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        alert('🛡️ Criptografia de código fonte ativa.');
      }
      // Ctrl+S (Salvar página)
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        alert('🛡️ Download offline bloqueado para segurança DRM.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubscriber]);

  // ROTEAMENTO POR ESTADO GLOBAL
  const renderScreen = () => {
    // Proteção de rotas premium (não logados vão para PublicHome ou Login)
    if (!isSubscriber && currentScreen !== 'PublicHome' && currentScreen !== 'Login') {
      return <PublicHome />;
    }

    switch (currentScreen) {
      case 'PublicHome':
        return <PublicHome />;
      case 'Login':
        return <LoginPage />;
      case 'MemberHome':
        return <MemberHome />;
      case 'CategoryPage':
        return <CategoryPage />;
      case 'CommunityPage':
        return <CommunityPage />;
      case 'EquipmentReviews':
        return <EquipmentReviews />;
      case 'StudentProfile':
        // Se houver aba específica nos params (ex: 'calendario'), o StudentProfile carrega reativo
        return <StudentProfile />;
      case 'LivePage':
        return <LivePage />;
      case 'MarketplacePage':
        return <MarketplacePage />;
      default:
        return <PublicHome />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#09090b] text-[#f4f4f5] antialiased">
      
      {/* Luz Neon Decorativa no Background */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[60vh] right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* NAVBAR SUPERIOR */}
      <div className="z-40">
        <Navbar />
      </div>

      {/* CONTEÚDO PRINCIPAL ROTEADO */}
      <main className="flex-grow z-10 w-full relative">
        {renderScreen()}
      </main>

      {/* RODAPÉ PREMIUM (FOOTER) */}
      <footer className="z-10 border-t border-zinc-900 bg-zinc-950/60 py-8 px-4 sm:px-6 flex-shrink-0 text-zinc-500 text-xs mt-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Lado Esquerdo: Marca */}
          <div className="text-center md:text-left">
            <div className="font-heading text-base font-extrabold text-zinc-350 flex items-center justify-center md:justify-start gap-1">
              🎸 NETFLIX DO MÚSICO
              <span className="text-[9px] border border-zinc-700/60 px-1 py-0.2 rounded font-sans uppercase font-light text-zinc-500 tracking-wider">
                MVP v0.1
              </span>
            </div>
            <p className="text-[10px] text-zinc-650 mt-1 max-w-xs leading-normal">
              A maior e mais completa plataforma de ensino e ecossistema digital para músicos e produtores do Brasil.
            </p>
          </div>

          {/* Links Rápidos Fake */}
          <div className="flex gap-6 flex-wrap justify-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Termos de Uso</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Privacidade</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Suporte VIP</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Imprensa</button>
          </div>

          {/* Lado Direito: Segurança */}
          <div className="flex flex-col items-center md:items-end gap-1.5 text-zinc-650 text-[10px] text-center md:text-right font-medium">
            <div className="flex items-center gap-1 text-cyan-400/80 font-bold uppercase tracking-wider font-mono">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Conexão Segura Ativa (DRM & Watermark)
            </div>
            <span>© {new Date().getFullYear()} Netflix do Músico S.A. Todos os direitos reservados.</span>
          </div>

        </div>
      </footer>

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
