import React, { useState } from 'react';
import { useApp, ScreenName } from '../../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Users,
  Wallet,
  Radio,
  MessagesSquare,
  ShoppingBag,
  Guitar,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV: { label: string; screen: ScreenName; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Dashboard', screen: 'AdminDashboard', icon: LayoutDashboard },
  { label: 'Cursos', screen: 'AdminCourses', icon: BookOpen },
  { label: 'Módulos e Aulas', screen: 'AdminCourses', icon: Layers },
  { label: 'Alunos', screen: 'AdminStudents', icon: Users },
  { label: 'Financeiro', screen: 'AdminFinance', icon: Wallet },
  { label: 'Lives', screen: 'AdminLives', icon: Radio },
  { label: 'Comunidade', screen: 'AdminCommunity', icon: MessagesSquare },
  { label: 'Marketplace', screen: 'AdminMarketplace', icon: ShoppingBag },
  { label: 'Equipamentos', screen: 'AdminEquipment', icon: Guitar },
  { label: 'Configurações', screen: 'AdminSettings', icon: Settings },
];

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, currentScreen, navigateTo, logoutUser, settings } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-zinc-800 bg-zinc-950/90 backdrop-blur-xl transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="px-5 py-5 border-b border-zinc-800">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 font-bold">Admin Studio</div>
          <div className="font-heading text-lg font-black mt-1 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {settings.platformName}
          </div>
        </div>
        <nav className="p-3 flex flex-col gap-1">
          {NAV.map((item, index) => {
            const Icon = item.icon;
            const active =
              currentScreen === item.screen ||
              (item.label === 'Módulos e Aulas' && currentScreen === 'AdminCourseEditor') ||
              (item.label === 'Cursos' && currentScreen === 'AdminCourseEditor' && index === 1);
            const isModulesShortcut = item.label === 'Módulos e Aulas';
            return (
              <button
                key={`${item.label}-${index}`}
                onClick={() => {
                  navigateTo(item.screen);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                  active && !isModulesShortcut
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                    : currentScreen === 'AdminCourseEditor' && isModulesShortcut
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <img src={user?.avatar} alt="" className="h-8 w-8 rounded-full object-cover border border-purple-500/30" />
            <div>
              <div className="text-xs font-bold">{user?.name}</div>
              <div className="text-[10px] text-zinc-500">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-950/40 text-red-300 text-xs font-bold py-2 hover:bg-red-900/40"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between">
          <button className="lg:hidden text-zinc-300" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-xs text-zinc-500 hidden sm:block">
            Protótipo administrativo — autenticação mock, não usar em produção.
          </div>
          <div className="text-[10px] font-mono text-cyan-400 border border-cyan-500/20 px-2 py-1 rounded-full">
            {user?.role?.toUpperCase()}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};
