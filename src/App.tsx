import React, { useEffect } from 'react';
import { AppProvider, useApp, isAdminScreen } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastHost } from './components/ToastHost';
import { PublicHome } from './pages/PublicHome';
import { LoginPage } from './pages/LoginPage';
import { MemberHome } from './pages/MemberHome';
import { CategoryPage } from './pages/CategoryPage';
import { CommunityPage } from './pages/CommunityPage';
import { EquipmentReviews } from './pages/EquipmentReviews';
import { StudentProfile } from './pages/StudentProfile';
import { LivePage } from './pages/LivePage';
import { MarketplacePage } from './pages/MarketplacePage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCourses } from './pages/admin/AdminCourses';
import { AdminCourseEditor } from './pages/admin/AdminCourseEditor';
import { AdminModulesLessons } from './pages/admin/AdminModulesLessons';
import { AdminStudents } from './pages/admin/AdminStudents';
import { AdminStudentDetail } from './pages/admin/AdminStudentDetail';
import { AdminFinance } from './pages/admin/AdminFinance';
import { AdminLives } from './pages/admin/AdminLives';
import { AdminCommunity } from './pages/admin/AdminCommunity';
import { AdminMarketplace } from './pages/admin/AdminMarketplace';
import { AdminEquipment } from './pages/admin/AdminEquipment';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ShieldCheck } from 'lucide-react';
import { isSupabaseConfigured, supabase } from './lib/supabase';

const MainLayout: React.FC = () => {
  const [adminPreview, setAdminPreview] = React.useState(false);
  const { currentScreen, isSubscriber, navigateTo, user } = useApp();
  const showStudentNavbar = isSubscriber || (user?.role === 'admin' && adminPreview);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      console.warn('[Supabase] Configuração local não encontrada.');
      return;
    }

    supabase.auth.getSession().then(({ error }) => {
      if (error) {
        console.error('[Supabase] Falha no teste de conexão:', error.message);
        return;
      }
      console.info('[Supabase] Conexão com a API confirmada.');
    });
  }, []);

  useEffect(() => {
    if (!isSubscriber) return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      alert('ðŸ›¡ï¸ Netflix do MÃºsico: Por motivos de seguranÃ§a e proteÃ§Ã£o de direitos autorais de nossos instrutores, o clique direito estÃ¡ desabilitado na Ã¡rea premium.');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') {
        e.preventDefault();
        alert('ðŸ›¡ï¸ Acesso de desenvolvedor bloqueado na Ã¡rea de assinantes.');
      }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        alert('ðŸ›¡ï¸ Ferramentas de inspeÃ§Ã£o bloqueadas para seguranÃ§a do streaming protegido.');
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        alert('ðŸ›¡ï¸ Criptografia de cÃ³digo fonte ativa.');
      }
      if (e.ctrlKey && (e.key === 'S' || e.key === 's')) {
        e.preventDefault();
        alert('ðŸ›¡ï¸ Download offline bloqueado para seguranÃ§a DRM.');
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubscriber]);

  const renderAdminScreen = () => {
    switch (currentScreen) {
      case 'AdminDashboard':
        return <AdminDashboard />;
      case 'AdminCourses':
        return <AdminCourses />;
      case 'AdminCourseEditor':
        return <AdminCourseEditor />;
      case 'AdminModulesLessons':
        return <AdminModulesLessons />;
      case 'AdminStudents':
        return <AdminStudents />;
      case 'AdminStudentDetail':
        return <AdminStudentDetail />;
      case 'AdminFinance':
        return <AdminFinance />;
      case 'AdminLives':
        return <AdminLives />;
      case 'AdminCommunity':
        return <AdminCommunity />;
      case 'AdminMarketplace':
        return <AdminMarketplace />;
      case 'AdminEquipment':
        return <AdminEquipment />;
      case 'AdminSettings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  if (user?.role === 'admin' && isAdminScreen(currentScreen) && !adminPreview) {
    return (
      <>
        <>
  <AdminLayout>{renderAdminScreen()}</AdminLayout>

  <button
    onClick={() => {
      setAdminPreview(true);
      navigateTo('MemberHome');
    }}
    className="fixed bottom-6 right-6 z-[9999] rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-2xl hover:scale-105 transition"
  >
    👁 Visualizar como aluno
  </button>
</>
        <ToastHost />
      </>
    );
  }

  const renderScreen = () => {
    if (!user && currentScreen !== 'PublicHome' && currentScreen !== 'Login') {
      return <PublicHome />;
    }
    if (user?.role === 'student' && isAdminScreen(currentScreen)) {
      return <MemberHome />;
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
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-[60vh] right-1/4 translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      <div className="z-40">
        {showStudentNavbar && <Navbar forceSubscriberView={user?.role === 'admin' && adminPreview} />}

{user?.role === 'admin' && adminPreview && (
  <button
    onClick={() => {
      setAdminPreview(false);
      navigateTo('AdminDashboard');
    }}
    className="fixed top-5 right-5 z-[9999] rounded-xl bg-purple-600 px-5 py-3 text-sm font-bold text-white shadow-2xl hover:bg-purple-500 transition"
  >
    ← Voltar ao Admin
  </button>
)}
      </div>

      <main className="flex-grow z-10 w-full relative">
        {renderScreen()}
      </main>

      <footer className="z-10 border-t border-zinc-900 bg-zinc-950/60 py-8 px-4 sm:px-6 flex-shrink-0 text-zinc-500 text-xs mt-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-heading text-base font-extrabold text-zinc-350 flex items-center justify-center md:justify-start gap-1">
              ðŸŽ¸ NETFLIX DO MÃšSICO
              <span className="text-[9px] border border-zinc-700/60 px-1 py-0.2 rounded font-sans uppercase font-light text-zinc-500 tracking-wider">
                MVP v0.2
              </span>
            </div>
            <p className="text-[10px] text-zinc-650 mt-1 max-w-xs leading-normal">
              A maior e mais completa plataforma de ensino e ecossistema digital para mÃºsicos e produtores do Brasil.
            </p>
          </div>

          <div className="flex gap-6 flex-wrap justify-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Termos de Uso</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Privacidade</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Suporte VIP</button>
            <button onClick={() => navigateTo('PublicHome')} className="hover:text-zinc-300">Imprensa</button>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1.5 text-zinc-650 text-[10px] text-center md:text-right font-medium">
            <div className="flex items-center gap-1 text-cyan-400/80 font-bold uppercase tracking-wider font-mono">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              ConexÃ£o Segura Ativa (DRM & Watermark)
            </div>
            <span>Â© {new Date().getFullYear()} Netflix do MÃºsico S.A. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>
      <ToastHost />
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



