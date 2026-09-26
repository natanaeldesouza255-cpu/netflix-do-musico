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
  Eye,
  Pencil,
} from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  courses: BookOpen,
  content: Layers,
  students: Users,
  finance: Wallet,
  lives: Radio,
  community: MessagesSquare,
  marketplace: ShoppingBag,
  equipment: Guitar,
  settings: Settings,
};

export const AdminLayout: React.FC<{ children: React.ReactNode; onPreviewStudent?: () => void }> = ({ children, onPreviewStudent }) => {
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
          {[...(settings.adminMenu || [])]
            .filter((item) => item.visible)
            .sort((a, b) => a.order - b.order)
            .map((item) => {
            const Icon = ICONS[item.id] || Settings;
            const screen = item.screen as ScreenName;
            const active = currentScreen === screen || (item.id === 'content' && currentScreen === 'AdminCourseEditor');
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigateTo(screen);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                  active
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/20'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
          <div className="mt-3 pt-3 border-t border-zinc-800 flex flex-col gap-1">
            <button
              onClick={() => { navigateTo('AdminSettings'); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
            >
              <Pencil className="h-4 w-4" />
              Editar menu
            </button>
            <button
              onClick={() => { onPreviewStudent?.(); setOpen(false); }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left text-cyan-300 hover:bg-cyan-950/30 border border-transparent"
            >
              <Eye className="h-4 w-4" />
              Visualizar como aluno
            </button>
          </div>
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
            Painel administrativo — Supabase Auth conectado.
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



