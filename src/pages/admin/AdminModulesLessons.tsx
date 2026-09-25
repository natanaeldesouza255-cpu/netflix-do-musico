import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, BookOpen, Clapperboard, ChevronRight } from 'lucide-react';

export const AdminModulesLessons: React.FC = () => {
  const { courses, modules, catalogLessons, navigateTo } = useApp();

  const orderedCourses = [...courses].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Módulos e Aulas</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Organize os módulos e aulas de cada curso da plataforma.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-panel border border-zinc-800 rounded-2xl p-5">
          <BookOpen className="h-5 w-5 text-purple-400 mb-3" />
          <div className="text-2xl font-black">{courses.length}</div>
          <div className="text-xs text-zinc-500">Cursos</div>
        </div>

        <div className="glass-panel border border-zinc-800 rounded-2xl p-5">
          <Layers className="h-5 w-5 text-cyan-400 mb-3" />
          <div className="text-2xl font-black">{modules.length}</div>
          <div className="text-xs text-zinc-500">Módulos</div>
        </div>

        <div className="glass-panel border border-zinc-800 rounded-2xl p-5">
          <Clapperboard className="h-5 w-5 text-purple-400 mb-3" />
          <div className="text-2xl font-black">{catalogLessons.length}</div>
          <div className="text-xs text-zinc-500">Aulas</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {orderedCourses.map((course) => {
          const courseModules = modules.filter((m) => m.courseId === course.id);
          const courseLessons = catalogLessons.filter((l) => l.courseId === course.id);

          return (
            <button
              key={course.id}
              onClick={() =>
                navigateTo('AdminCourseEditor', { courseId: course.id })
              }
              className="glass-panel border border-zinc-800 rounded-2xl p-5 text-left hover:border-purple-500/60 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                    {course.title}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-zinc-500">
                    <span>{courseModules.length} módulo(s)</span>
                    <span>•</span>
                    <span>{courseLessons.length} aula(s)</span>
                    <span>•</span>
                    <span>
                      {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 shrink-0">
                  Gerenciar
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
