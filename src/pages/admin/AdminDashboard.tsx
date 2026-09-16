import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, BookOpen, Clapperboard, Radio, Wallet, Sparkles, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { students, courses, catalogLessons, lives, payments, communityFeed, marketplaceItems, activities, settings } = useApp();
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const activeSubs = students.filter((s) => s.subscriptionStatus === 'active').length;
  const publishedContent = catalogLessons.filter((l) => (l.status ?? 'published') === 'published').length;
  const monthRevenue = payments.filter((p) => p.status === 'paid' && (p.paidAt || '').startsWith('2026-09')).reduce((a, p) => a + p.amount, 0);

  const cards = [
    { label: 'Alunos', value: students.length, icon: Users, hint: `${activeStudents} ativos` },
    { label: 'Cursos', value: courses.length, icon: BookOpen, hint: `${courses.filter((c) => c.status === 'published').length} publicados` },
    { label: 'Aulas', value: catalogLessons.length, icon: Clapperboard, hint: `${publishedContent} publicadas` },
    { label: 'Lives', value: lives.length, icon: Radio, hint: `${lives.filter((l) => l.status === 'scheduled' || l.status === 'live').length} na agenda` },
    { label: 'Assinaturas ativas', value: activeSubs, icon: CheckCircle2, hint: `${students.filter((s) => s.subscriptionStatus === 'cancelled').length} canceladas` },
    { label: 'Receita do mês (sim.)', value: `R$ ${monthRevenue.toFixed(2).replace('.', ',')}`, icon: Wallet, hint: settings.planName },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-black text-white">Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-1">Visão geral da operação da plataforma (dados simulados / persistidos no navegador).</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-panel border border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">{card.label}</span>
                <Icon className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-black mt-2">{card.value}</div>
              <div className="text-[11px] text-cyan-400 mt-1">{card.hint}</div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-panel border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-cyan-400" /> Conteúdos publicados</h2>
          <ul className="mt-4 text-xs text-zinc-400 space-y-2">
            <li>Cursos publicados: {courses.filter((c) => c.status === 'published').length}</li>
            <li>Aulas publicadas: {publishedContent}</li>
            <li>Produtos ativos: {marketplaceItems.filter((i) => i.status !== 'inactive').length}</li>
            <li>Posts visíveis: {communityFeed.filter((p) => p.moderationStatus !== 'hidden').length}</li>
          </ul>
        </div>
        <div className="glass-panel border border-zinc-800 rounded-2xl p-5">
          <h2 className="text-sm font-bold">Atividades recentes</h2>
          <div className="mt-3 flex flex-col gap-3 max-h-64 overflow-y-auto">
            {activities.length === 0 && <p className="text-xs text-zinc-500 italic">Nenhuma atividade ainda.</p>}
            {activities.map((act) => (
              <div key={act.id} className="border-b border-zinc-900 pb-2">
                <p className="text-xs text-zinc-300">{act.message}</p>
                <p className="text-[10px] text-zinc-600 font-mono mt-1">{act.at}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
