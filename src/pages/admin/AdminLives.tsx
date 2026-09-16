import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveSession, LiveStatus } from '../../data/mockData';
import { AdminModal, Field, inputClass } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const empty: Partial<LiveSession> & { title: string } = {
  title: '',
  presenter: '',
  date: '',
  time: '20:00',
  status: 'scheduled',
  description: '',
  coverImage: '',
  link: '',
  videoUrl: '',
};

export const AdminLives: React.FC = () => {
  const { lives, saveLive, deleteLive } = useApp();
  const [form, setForm] = useState<(typeof empty & { id?: string }) | null>(null);
  const [pending, setPending] = useState<LiveSession | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-heading text-2xl font-black">Lives</h1>
          <p className="text-xs text-zinc-500 mt-1">Lives publicadas/agendadas aparecem na área do aluno.</p>
        </div>
        <button onClick={() => setForm({ ...empty })} className="bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> Criar live
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {lives.length === 0 && <div className="col-span-2 glass-panel border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">Nenhuma live cadastrada.</div>}
        {lives.map((live) => (
          <div key={live.id} className="glass-panel border border-zinc-800 rounded-2xl overflow-hidden">
            {live.coverImage && <img src={live.coverImage} alt="" className="h-32 w-full object-cover" />}
            <div className="p-4">
              <div className="text-[10px] uppercase text-cyan-400 font-bold">{live.status}</div>
              <h3 className="text-sm font-bold mt-1">{live.title}</h3>
              <p className="text-xs text-zinc-500 mt-1">{live.presenter} • {live.date} • {live.time}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setForm({ ...live, title: live.title })} className="p-2 border border-zinc-800 rounded-lg text-purple-300"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setPending(live)} className="p-2 border border-zinc-800 rounded-lg text-red-400"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AdminModal open={!!form} title={form?.id ? 'Editar live' : 'Nova live'} onClose={() => setForm(null)}>
        {form && (
          <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); saveLive(form); setForm(null); }}>
            <Field label="Título"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
            <Field label="Descrição"><textarea className={inputClass} rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Professor"><input className={inputClass} value={form.presenter || ''} onChange={(e) => setForm({ ...form, presenter: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Data"><input className={inputClass} value={form.date || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
              <Field label="Horário"><input className={inputClass} value={form.time || ''} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field>
            </div>
            <Field label="Link"><input className={inputClass} value={form.link || ''} onChange={(e) => setForm({ ...form, link: e.target.value, videoUrl: e.target.value })} /></Field>
            <Field label="Imagem / capa"><input className={inputClass} value={form.coverImage || ''} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} /></Field>
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LiveStatus })}>
                <option value="scheduled">Agendada</option>
                <option value="live">Ao vivo</option>
                <option value="finished">Finalizada</option>
                <option value="replay">Replay</option>
              </select>
            </Field>
            <Field label="URL de vídeo (replay)"><input className={inputClass} value={form.videoUrl || ''} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} /></Field>
            <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
          </form>
        )}
      </AdminModal>
      <ConfirmDialog open={!!pending} title="Excluir live?" message={`Remover "${pending?.title}" da agenda do aluno?`} onCancel={() => setPending(null)} onConfirm={() => { if (pending) deleteLive(pending.id); setPending(null); }} />
    </div>
  );
};
