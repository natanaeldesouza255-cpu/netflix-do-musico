import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ManagedUser } from '../../data/seedPlatform';
import { Search } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const { students, completedLessons, catalogLessons, navigateTo, toggleStudentStatus } = useApp();
  const [query, setQuery] = useState('');

  const list = useMemo(() => {
    const q = query.toLowerCase();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.instrument.toLowerCase().includes(q)
    );
  }, [students, query]);

  const progressFor = (student: ManagedUser) => {
    const total = catalogLessons.filter((l) => (l.status ?? 'published') === 'published').length || 1;
    if (student.email === 'aluno@musico.com') {
      return Math.round((completedLessons.length / total) * 100);
    }
    return Math.min(100, Math.round((student.xp / 20)));
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Alunos / Usuários</h1>
        <p className="text-xs text-zinc-500 mt-1">Pesquise, visualize progresso e ative/desative contas no protótipo.</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar por nome, e-mail ou instrumento"
          className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs pl-9 pr-3 py-2"
        />
      </div>
      <div className="overflow-x-auto glass-panel border border-zinc-800 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="p-3">Aluno</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Assinatura</th>
              <th className="p-3">Cadastro</th>
              <th className="p-3">XP</th>
              <th className="p-3">Progresso</th>
              <th className="p-3">Conta</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-zinc-500">Nenhum aluno encontrado.</td></tr>
            )}
            {list.map((student) => (
              <tr key={student.id} className="border-b border-zinc-900/80">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <img src={student.avatar} className="h-8 w-8 rounded-full object-cover" alt="" />
                    <div>
                      <div className="font-bold text-white">{student.name}</div>
                      <div className="text-zinc-500">{student.instrument}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3">{student.email}</td>
                <td className="p-3 capitalize">{student.subscriptionStatus}</td>
                <td className="p-3 font-mono">{student.createdAt}</td>
                <td className="p-3">{student.xp}</td>
                <td className="p-3">{progressFor(student)}%</td>
                <td className="p-3">
                  <span className={student.status === 'active' ? 'text-emerald-400' : 'text-zinc-500'}>{student.status}</span>
                </td>
                <td className="p-3 text-right">
                  <button onClick={() => navigateTo('AdminStudentDetail', { studentId: student.id })} className="text-purple-400 font-bold mr-3">Ver perfil</button>
                  <button onClick={() => toggleStudentStatus(student.id)} className="text-cyan-400 font-bold">
                    {student.status === 'active' ? 'Desativar' : 'Ativar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
