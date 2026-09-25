import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, inputClass } from '../../components/admin/AdminModal';
import { ArrowDown, ArrowUp, Eye, EyeOff } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, saveSettings } = useApp();
  const [form, setForm] = useState(settings);

  useEffect(() => setForm(settings), [settings]);

  const moveMenuItem = (id: string, direction: 'up' | 'down') => {
    const menu = [...(form.adminMenu || [])].sort((a, b) => a.order - b.order);
    const index = menu.findIndex((item) => item.id === id);
    const target = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || target < 0 || target >= menu.length) return;
    [menu[index], menu[target]] = [menu[target], menu[index]];
    setForm({ ...form, adminMenu: menu.map((item, order) => ({ ...item, order })) });
  };

  const updateMenuItem = (id: string, patch: { label?: string; visible?: boolean }) => {
    setForm({
      ...form,
      adminMenu: (form.adminMenu || []).map((item) => item.id === id ? { ...item, ...patch } : item),
    });
  };

  return (
    <div className="max-w-3xl flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Configurações</h1>
        <p className="text-xs text-zinc-500 mt-1">Personalize a plataforma sem precisar alterar o código.</p>
      </div>

      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings(form);
        }}
      >
        <section className="glass-panel border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
          <div>
            <h2 className="font-bold text-sm">Geral</h2>
            <p className="text-[11px] text-zinc-500">Informações principais da plataforma.</p>
          </div>
          <Field label="Nome da plataforma"><input className={inputClass} value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} /></Field>
          <Field label="Informações gerais / tagline"><input className={inputClass} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
          <Field label="E-mail de suporte"><input className={inputClass} value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} /></Field>
          <Field label="Nome do plano"><input className={inputClass} value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} /></Field>
          <Field label="Valor do plano (mock)"><input type="number" step="0.01" className={inputClass} value={form.planPrice} onChange={(e) => setForm({ ...form, planPrice: Number(e.target.value) })} /></Field>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
            Modo manutenção
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={form.allowRegistrations} onChange={(e) => setForm({ ...form, allowRegistrations: e.target.checked })} />
            Permitir novos cadastros de alunos
          </label>
        </section>

        <section className="glass-panel border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
          <div>
            <h2 className="font-bold text-sm">Menu administrativo</h2>
            <p className="text-[11px] text-zinc-500">Renomeie, oculte ou altere a ordem dos itens do menu. A rota interna permanece segura mesmo se o nome mudar.</p>
          </div>
          {[...(form.adminMenu || [])].sort((a, b) => a.order - b.order).map((item, index, list) => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
              <input
                className={`${inputClass} flex-1`}
                value={item.label}
                onChange={(e) => updateMenuItem(item.id, { label: e.target.value })}
                aria-label={`Nome do item ${item.label}`}
              />
              <div className="flex gap-1">
                <button type="button" title={item.visible ? 'Ocultar' : 'Mostrar'} onClick={() => updateMenuItem(item.id, { visible: !item.visible })} className="p-2 rounded-lg border border-zinc-800 text-zinc-300">
                  {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button type="button" title="Mover para cima" disabled={index === 0} onClick={() => moveMenuItem(item.id, 'up')} className="p-2 rounded-lg border border-zinc-800 text-zinc-300 disabled:opacity-30">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button type="button" title="Mover para baixo" disabled={index === list.length - 1} onClick={() => moveMenuItem(item.id, 'down')} className="p-2 rounded-lg border border-zinc-800 text-zinc-300 disabled:opacity-30">
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          <p className="text-[10px] text-zinc-600">Dica: mantenha “Configurações” visível para conseguir voltar a esta tela pelo menu.</p>
        </section>

        <button className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold py-3 rounded-lg">
          Salvar alterações
        </button>
      </form>
    </div>
  );
};
