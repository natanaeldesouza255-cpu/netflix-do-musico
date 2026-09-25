import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Equipment } from '../../data/mockData';
import { AdminModal, Field, inputClass } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const TYPES: Equipment['type'][] = ['Baterias', 'Violões', 'Guitarras', 'Microfones', 'Interfaces', 'Monitores', 'Plugins', 'Fones'];

export const AdminEquipment: React.FC = () => {
  const { equipments, saveEquipment, deleteEquipment } = useApp();
  const [form, setForm] = useState<(Partial<Equipment> & { name: string }) | null>(null);
  const [pending, setPending] = useState<Equipment | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black">Reviews de Equipamentos</h1>
          <p className="text-xs text-zinc-500 mt-1">Reviews dos alunos são preservados ao editar o cadastro.</p>
        </div>
        <button onClick={() => setForm({ name: '', type: 'Guitarras', description: '', imageUrl: '', brand: '', model: '', published: true, reviewText: '', videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' })} className="bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> Adicionar equipamento
        </button>
      </div>
      <div className="overflow-x-auto glass-panel border border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-3">Equipamento</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Marca / modelo</th>
              <th className="p-3">Reviews</th>
              <th className="p-3">Publicado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {equipments.map((eq) => (
              <tr key={eq.id} className="border-b border-zinc-900/80">
                <td className="p-3 font-bold">{eq.name}</td>
                <td className="p-3">{eq.type}</td>
                <td className="p-3">{eq.brand} {eq.model}</td>
                <td className="p-3">{eq.comments.length}</td>
                <td className="p-3">{eq.published === false ? 'Não' : 'Sim'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setForm({ ...eq, name: eq.name })} className="p-2 text-purple-300"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setPending(eq)} className="p-2 text-red-400"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminModal wide open={!!form} title={form?.id ? 'Editar review de equipamento' : 'Novo review de equipamento'} onClose={() => setForm(null)}>
        {form && (
          <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); saveEquipment(form); setForm(null); }}>
            <Field label="Nome"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Marca"><input className={inputClass} value={form.brand || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></Field>
              <Field label="Modelo"><input className={inputClass} value={form.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} /></Field>
            </div>
            <Field label="Categoria">
              <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Equipment['type'] })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Descrição"><textarea className={inputClass} rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Imagem (URL)"><input className={inputClass} value={form.imageUrl || ''} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={form.published !== false} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Publicado na área do aluno
            </label>
            <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
          </form>
        )}
      </AdminModal>
      <ConfirmDialog open={!!pending} title="Excluir equipamento?" message={`Remover "${pending?.name}"? Os reviews deste item também sairão da listagem.`} onCancel={() => setPending(null)} onConfirm={() => { if (pending) deleteEquipment(pending.id); setPending(null); }} />
    </div>
  );
};
