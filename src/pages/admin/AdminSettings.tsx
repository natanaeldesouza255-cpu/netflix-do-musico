import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, inputClass } from '../../components/admin/AdminModal';

export const AdminSettings: React.FC = () => {
  const { settings, saveSettings } = useApp();
  const [form, setForm] = useState(settings);

  return (
    <div className="max-w-xl flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Configurações</h1>
        <p className="text-xs text-zinc-500 mt-1">Estrutura pronta para futura leitura/gravação no Supabase (tabela platform_settings).</p>
      </div>
      <form
        className="glass-panel border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          saveSettings(form);
        }}
      >
        <Field label="Nome da plataforma"><input className={inputClass} value={form.platformName} onChange={(e) => setForm({ ...form, platformName: e.target.value })} /></Field>
        <Field label="Informações gerais / tagline"><input className={inputClass} value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} /></Field>
        <Field label="E-mail de suporte"><input className={inputClass} value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} /></Field>
        <Field label="Nome do plano"><input className={inputClass} value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} /></Field>
        <Field label="Valor do plano (mock)"><input type="number" step="0.01" className={inputClass} value={form.planPrice} onChange={(e) => setForm({ ...form, planPrice: Number(e.target.value) })} /></Field>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
          Modo manutenção (aviso visual no login)
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={form.allowRegistrations} onChange={(e) => setForm({ ...form, allowRegistrations: e.target.checked })} />
          Permitir novos cadastros de alunos
        </label>
        <button className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold py-2.5 rounded-lg mt-2">Salvar</button>
      </form>
    </div>
  );
};
