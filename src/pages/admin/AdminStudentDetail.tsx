import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Field, inputClass } from '../../components/admin/AdminModal';
import { ChevronLeft } from 'lucide-react';

export const AdminStudentDetail: React.FC = () => {
  const { screenParams, students, courses, completedLessons, catalogLessons, navigateTo, saveStudent } = useApp();
  const student = students.find((s) => s.id === screenParams?.studentId);
  const [form, setForm] = useState(student);

  if (!student || !form) {
    return (
      <div className="text-sm text-zinc-400">
        Aluno não encontrado. <button className="text-purple-400" onClick={() => navigateTo('AdminStudents')}>Voltar</button>
      </div>
    );
  }

  const started = courses.filter((c) => student.startedCourseIds.includes(c.id));
  const completed = courses.filter((c) => student.completedCourseIds.includes(c.id));
  const total = catalogLessons.filter((l) => (l.status ?? 'published') === 'published').length || 1;
  const progress = student.email === 'aluno@musico.com'
    ? Math.round((completedLessons.length / total) * 100)
    : Math.min(100, Math.round(student.xp / 20));

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <button onClick={() => navigateTo('AdminStudents')} className="text-xs text-zinc-400 flex items-center gap-1">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </button>
      <div className="glass-panel border border-zinc-800 rounded-2xl p-5 flex gap-4">
        <img src={student.avatar} className="h-16 w-16 rounded-full object-cover" alt="" />
        <div>
          <h1 className="font-heading text-xl font-black">{student.name}</h1>
          <p className="text-xs text-zinc-500">{student.email}</p>
          <p className="text-xs text-cyan-400 mt-1">Progresso estimado: {progress}% • XP {student.xp}</p>
        </div>
      </div>
      <form
        className="glass-panel border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          saveStudent(form);
        }}
      >
        <h2 className="text-sm font-bold">Informações administrativas</h2>
        <Field label="Nome"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="E-mail"><input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Instrumento"><input className={inputClass} value={form.instrument} onChange={(e) => setForm({ ...form, instrument: e.target.value })} /></Field>
        <Field label="Nível"><input className={inputClass} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} /></Field>
        <Field label="XP"><input type="number" className={inputClass} value={form.xp} onChange={(e) => setForm({ ...form, xp: Number(e.target.value) })} /></Field>
        <Field label="Assinatura">
          <select className={inputClass} value={form.subscriptionStatus} onChange={(e) => setForm({ ...form, subscriptionStatus: e.target.value as any })}>
            <option value="active">Ativa</option>
            <option value="pending">Pendente</option>
            <option value="overdue">Inadimplente</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </Field>
        <Field label="Bio"><textarea className={inputClass} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></Field>
        <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
      </form>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-panel border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cursos iniciados</h3>
          <ul className="mt-2 text-xs text-zinc-300 space-y-1">
            {started.length === 0 && <li className="text-zinc-600">Nenhum</li>}
            {started.map((c) => <li key={c.id}>{c.title}</li>)}
          </ul>
        </div>
        <div className="glass-panel border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cursos concluídos</h3>
          <ul className="mt-2 text-xs text-zinc-300 space-y-1">
            {completed.length === 0 && <li className="text-zinc-600">Nenhum</li>}
            {completed.map((c) => <li key={c.id}>{c.title}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};
