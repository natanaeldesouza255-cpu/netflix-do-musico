import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course, MusicCategory, MusicLevel } from '../../data/mockData';
import { MUSIC_CATEGORIES, MUSIC_LEVELS } from '../../data/seedPlatform';
import { AdminModal, Field, inputClass } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Plus, Pencil, Trash2, Layers, Eye, EyeOff } from 'lucide-react';

const emptyCourse = {
  title: '',
  description: '',
  category: 'Violão' as MusicCategory,
  instructor: '',
  level: 'Nível Zero' as MusicLevel,
  coverImage: '',
  status: 'draft' as const,
  displayOrder: 0,
};

export const AdminCourses: React.FC = () => {
  const { courses, modules, catalogLessons, saveCourse, deleteCourse, toggleCoursePublish, navigateTo } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<typeof emptyCourse & { id?: string }>(emptyCourse);
  const [pendingDelete, setPendingDelete] = useState<Course | null>(null);

  const startCreate = () => {
    setForm({ ...emptyCourse, displayOrder: courses.length });
    setOpen(true);
  };

  const startEdit = (course: Course) => {
    setForm({ ...course });
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCourse(form);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-black">Cursos</h1>
          <p className="text-xs text-zinc-500 mt-1">Crie, publique e organize as trilhas que o aluno vê na home.</p>
        </div>
        <button onClick={startCreate} className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="h-4 w-4" /> Adicionar curso
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="glass-panel border border-zinc-800 rounded-2xl p-10 text-center text-sm text-zinc-500">Nenhum curso cadastrado.</div>
      ) : (
        <div className="overflow-x-auto glass-panel border border-zinc-800 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-3">Curso</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Instrutor</th>
                <th className="p-3">Ordem</th>
                <th className="p-3">Módulos</th>
                <th className="p-3">Aulas</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {[...courses].sort((a, b) => a.displayOrder - b.displayOrder).map((course) => {
                const mods = modules.filter((m) => m.courseId === course.id).length;
                const lessons = catalogLessons.filter((l) => l.courseId === course.id).length;
                return (
                  <tr key={course.id} className="border-b border-zinc-900/80 hover:bg-zinc-900/40">
                    <td className="p-3">
                      <div className="font-bold text-white">{course.title}</div>
                      <div className="text-zinc-500 line-clamp-1 max-w-xs">{course.description}</div>
                    </td>
                    <td className="p-3">{course.category}</td>
                    <td className="p-3">{course.instructor}</td>
                    <td className="p-3 font-mono">{course.displayOrder}</td>
                    <td className="p-3">{mods}</td>
                    <td className="p-3">{lessons}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${course.status === 'published' ? 'bg-emerald-950 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 justify-end">
                        <button title="Módulos e aulas" onClick={() => navigateTo('AdminCourseEditor', { courseId: course.id })} className="p-2 rounded-lg hover:bg-zinc-800 text-cyan-400">
                          <Layers className="h-4 w-4" />
                        </button>
                        <button title={course.status === 'published' ? 'Despublicar' : 'Publicar'} onClick={() => toggleCoursePublish(course.id)} className="p-2 rounded-lg hover:bg-zinc-800">
                          {course.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button title="Editar" onClick={() => startEdit(course)} className="p-2 rounded-lg hover:bg-zinc-800 text-purple-300">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button title="Excluir" onClick={() => setPendingDelete(course)} className="p-2 rounded-lg hover:bg-zinc-800 text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={open} title={form.id ? 'Editar curso' : 'Novo curso'} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Field label="Título"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
          <Field label="Descrição"><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria">
              <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as MusicCategory })}>
                {MUSIC_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Nível">
              <select className={inputClass} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as MusicLevel })}>
                {MUSIC_LEVELS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Professor / Instrutor"><input className={inputClass} value={form.instructor} onChange={(e) => setForm({ ...form, instructor: e.target.value })} required /></Field>
          <Field label="Imagem / capa (URL)"><input className={inputClass} value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'published' | 'draft' })}>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
              </select>
            </Field>
            <Field label="Ordem de exibição">
              <input type="number" className={inputClass} value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })} />
            </Field>
          </div>
          <button type="submit" className="mt-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
        </form>
      </AdminModal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Excluir curso?"
        message={`Isso também remove módulos e aulas de "${pendingDelete?.title}". A área do aluno será atualizada.`}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteCourse(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
