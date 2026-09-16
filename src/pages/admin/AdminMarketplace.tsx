import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MarketplaceItem } from '../../data/mockData';
import { AdminModal, Field, inputClass } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const TYPES: MarketplaceItem['type'][] = ['VSTs', 'Presets', 'Sample Packs', 'Cursos', 'Materiais Digitais'];

export const AdminMarketplace: React.FC = () => {
  const { marketplaceItems, saveMarketplaceItem, deleteMarketplaceItem } = useApp();
  const [form, setForm] = useState<(Partial<MarketplaceItem> & { name: string }) | null>(null);
  const [pending, setPending] = useState<MarketplaceItem | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black">Marketplace</h1>
          <p className="text-xs text-zinc-500 mt-1">Produtos ativos aparecem para o aluno. Inativos ficam ocultos.</p>
        </div>
        <button onClick={() => setForm({ name: '', description: '', type: 'Presets', price: 0, thumbnail: '', status: 'active' })} className="bg-purple-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> Adicionar produto
        </button>
      </div>
      <div className="overflow-x-auto glass-panel border border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {marketplaceItems.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-zinc-500">Nenhum produto.</td></tr>}
            {marketplaceItems.map((item) => (
              <tr key={item.id} className="border-b border-zinc-900/80">
                <td className="p-3 font-bold">{item.name}</td>
                <td className="p-3">{item.type}</td>
                <td className="p-3">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                <td className="p-3">{item.status === 'inactive' ? 'Inativo' : 'Ativo'}</td>
                <td className="p-3 text-right">
                  <button onClick={() => setForm({ ...item, name: item.name })} className="p-2 text-purple-300"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => setPending(item)} className="p-2 text-red-400"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminModal open={!!form} title={form && 'id' in form && form.id ? 'Editar produto' : 'Novo produto'} onClose={() => setForm(null)}>
        {form && (
          <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); saveMarketplaceItem(form); setForm(null); }}>
            <Field label="Nome"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
            <Field label="Descrição"><textarea className={inputClass} rows={3} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Categoria">
              <select className={inputClass} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MarketplaceItem['type'] })}>
                {TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Preço"><input type="number" step="0.01" className={inputClass} value={form.price ?? 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} /></Field>
            <Field label="Imagem (URL)"><input className={inputClass} value={form.thumbnail || ''} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} /></Field>
            <Field label="Status">
              <select className={inputClass} value={form.status || 'active'} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </Field>
            <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
          </form>
        )}
      </AdminModal>
      <ConfirmDialog open={!!pending} title="Excluir produto?" message={`Remover "${pending?.name}" do marketplace?`} onCancel={() => setPending(null)} onConfirm={() => { if (pending) deleteMarketplaceItem(pending.id); setPending(null); }} />
    </div>
  );
};
