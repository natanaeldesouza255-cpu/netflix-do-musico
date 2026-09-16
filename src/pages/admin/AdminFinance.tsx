import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentStatus } from '../../data/mockData';

export const AdminFinance: React.FC = () => {
  const { payments, students, settings } = useApp();
  const [status, setStatus] = useState<'all' | PaymentStatus>('all');
  const [period, setPeriod] = useState<'all' | 'month' | 'prev'>('all');

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (period === 'month') return (p.paidAt || p.dueDate).startsWith('2026-09');
      if (period === 'prev') return (p.paidAt || p.dueDate).startsWith('2026-08');
      return true;
    });
  }, [payments, status, period]);

  const paid = payments.filter((p) => p.status === 'paid');
  const total = paid.reduce((a, p) => a + p.amount, 0);
  const monthly = paid.filter((p) => (p.paidAt || '').startsWith('2026-09')).reduce((a, p) => a + p.amount, 0);
  const activeSubs = students.filter((s) => s.subscriptionStatus === 'active').length;
  const cancelled = students.filter((s) => s.subscriptionStatus === 'cancelled').length;
  const pending = payments.filter((p) => p.status === 'pending').length;
  const overdue = payments.filter((p) => p.status === 'overdue').length;
  const ticket = paid.length ? total / paid.length : 0;

  const cards = [
    { label: 'Receita total', value: `R$ ${total.toFixed(2).replace('.', ',')}` },
    { label: 'Receita mensal', value: `R$ ${monthly.toFixed(2).replace('.', ',')}` },
    { label: 'Assinaturas ativas', value: activeSubs },
    { label: 'Canceladas', value: cancelled },
    { label: 'Pagamentos pendentes', value: pending },
    { label: 'Inadimplência', value: overdue },
    { label: 'Ticket médio', value: `R$ ${ticket.toFixed(2).replace('.', ',')}` },
    { label: 'Plano mock', value: `R$ ${settings.planPrice.toFixed(2).replace('.', ',')}` },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Financeiro</h1>
        <p className="text-xs text-zinc-500 mt-1">Protótipo sem gateway real. Estrutura pronta para futura integração de pagamentos.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="glass-panel border border-zinc-800 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-widest text-zinc-500">{c.label}</div>
            <div className="text-lg font-black mt-1">{c.value}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {(['all', 'paid', 'pending', 'overdue', 'cancelled'] as const).map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`text-[11px] px-3 py-1.5 rounded-full border ${status === s ? 'border-purple-500 text-purple-300' : 'border-zinc-800 text-zinc-400'}`}>
            {s === 'all' ? 'Todos status' : s}
          </button>
        ))}
        {(['all', 'month', 'prev'] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] px-3 py-1.5 rounded-full border ${period === p ? 'border-cyan-500 text-cyan-300' : 'border-zinc-800 text-zinc-400'}`}>
            {p === 'all' ? 'Todo período' : p === 'month' ? 'Set/2026' : 'Ago/2026'}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto glass-panel border border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-3">Assinante</th>
              <th className="p-3">Plano</th>
              <th className="p-3">Valor</th>
              <th className="p-3">Situação</th>
              <th className="p-3">Pagamento</th>
              <th className="p-3">Vencimento</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-zinc-500">Nenhum pagamento neste filtro.</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-zinc-900/80">
                <td className="p-3">
                  <div className="font-bold text-white">{p.studentName}</div>
                  <div className="text-zinc-500">{p.email}</div>
                </td>
                <td className="p-3">{p.plan}</td>
                <td className="p-3 font-mono">R$ {p.amount.toFixed(2).replace('.', ',')}</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3">{p.paidAt || '—'}</td>
                <td className="p-3">{p.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
