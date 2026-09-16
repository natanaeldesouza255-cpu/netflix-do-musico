import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CourseModule, Lesson } from '../../data/mockData';
import { AdminModal, Field, inputClass } from '../../components/admin/AdminModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ArrowDown, ArrowUp, ChevronLeft, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

export const AdminCourseEditor: React.FC = () => {
  const {
    screenParams,
    courses,
    modules,
    catalogLessons,
    navigateTo,
    saveModule,
    deleteModule,
    moveModule,
    saveLesson,
    deleteLesson,
    moveLesson,
    toggleLessonPublish,
  } = useApp();

  const course = courses.find((c) => c.id === screenParams?.courseId) || courses[0];
  const courseModules = useMemo(
    () => modules.filter((m) => m.courseId === course?.id).sort((a, b) => a.order - b.order),
    [modules, course]
  );

  const [moduleForm, setModuleForm] = useState<Partial<CourseModule> & { name: string; courseId: string } | null>(null);
  const [lessonForm, setLessonForm] = useState<(Partial<Lesson> & { title: string; courseId: string; moduleId: string }) | null>(null);
  const [deleteMod, setDeleteMod] = useState<CourseModule | null>(null);
  const [deleteLes, setDeleteLes] = useState<Lesson | null>(null);

  if (!course) {
    return (
      <div className="text-sm text-zinc-400">
        Nenhum curso selecionado.{' '}
        <button className="text-purple-400" onClick={() => navigateTo('AdminCourses')}>Voltar para cursos</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <button onClick={() => navigateTo('AdminCourses')} className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 w-fit">
        <ChevronLeft className="h-4 w-4" /> Voltar aos cursos
      </button>
      <div>
        <h1 className="font-heading text-2xl font-black">{course.title}</h1>
        <p className="text-xs text-zinc-500 mt-1">A ordem dos módulos e aulas aqui é a mesma apresentada ao aluno.</p>
      </div>

      <button
        onClick={() => setModuleForm({ courseId: course.id, name: '', description: '' })}
        className="w-fit bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> Adicionar módulo
      </button>

      {courseModules.length === 0 && (
        <div className="glass-panel border border-zinc-800 rounded-2xl p-8 text-center text-sm text-zinc-500">
          Nenhum módulo neste curso. Adicione o primeiro para começar a cadastrar aulas.
        </div>
      )}

      {courseModules.map((mod, index) => {
        const lessons = catalogLessons.filter((l) => l.moduleId === mod.id).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return (
          <section key={mod.id} className="glass-panel border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-white">{mod.name}</h2>
                <p className="text-xs text-zinc-500">{mod.description || 'Sem descrição'} • {lessons.length} aula(s)</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <button title="Subir módulo" onClick={() => moveModule(mod.id, 'up')} disabled={index === 0} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                <button title="Descer módulo" onClick={() => moveModule(mod.id, 'down')} disabled={index === courseModules.length - 1} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                <button onClick={() => setModuleForm({ ...mod, name: mod.name, courseId: mod.courseId })} className="p-2 rounded-lg border border-zinc-800 text-purple-300"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteMod(mod)} className="p-2 rounded-lg border border-zinc-800 text-red-400"><Trash2 className="h-4 w-4" /></button>
                <button
                  onClick={() => setLessonForm({
                    title: '',
                    description: '',
                    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    duration: '10 min',
                    complementaryUrl: '',
                    status: 'published',
                    isFree: false,
                    courseId: course.id,
                    moduleId: mod.id,
                    category: course.category,
                    level: course.level,
                    thumbnail: course.coverImage,
                  })}
                  className="px-3 py-2 rounded-lg bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Adicionar aula
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {lessons.length === 0 && <p className="text-xs text-zinc-600 italic">Nenhuma aula neste módulo.</p>}
              {lessons.map((lesson, li) => (
                <div key={lesson.id} className="flex flex-col md:flex-row md:items-center gap-3 border border-zinc-800 rounded-xl p-3 bg-zinc-950/50">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{li + 1}. {lesson.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">{lesson.duration} • {(lesson.status ?? 'published') === 'published' ? 'Publicada' : 'Rascunho'} {lesson.isFree ? '• Preview grátis' : ''}</div>
                  </div>
                  <div className="flex gap-1">
                    <button title="Subir aula" onClick={() => moveLesson(lesson.id, 'up')} disabled={li === 0} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button title="Descer aula" onClick={() => moveLesson(lesson.id, 'down')} disabled={li === lessons.length - 1} className="p-2 rounded-lg border border-zinc-800 disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button title="Publicar/rascunho" onClick={() => toggleLessonPublish(lesson.id)} className="p-2 rounded-lg border border-zinc-800">
                      {(lesson.status ?? 'published') === 'published' ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button onClick={() => setLessonForm({
                      ...lesson,
                      title: lesson.title,
                      courseId: lesson.courseId || course.id,
                      moduleId: lesson.moduleId || mod.id,
                    })} className="p-2 rounded-lg border border-zinc-800 text-purple-300"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteLes(lesson)} className="p-2 rounded-lg border border-zinc-800 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <AdminModal open={!!moduleForm} title={moduleForm?.id ? 'Editar módulo' : 'Novo módulo'} onClose={() => setModuleForm(null)}>
        {moduleForm && (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              saveModule(moduleForm);
              setModuleForm(null);
            }}
          >
            <Field label="Nome"><input className={inputClass} value={moduleForm.name} onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })} required /></Field>
            <Field label="Descrição"><textarea className={inputClass} rows={3} value={moduleForm.description || ''} onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })} /></Field>
            <button className="bg-purple-600 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
          </form>
        )}
      </AdminModal>

      <AdminModal wide open={!!lessonForm} title={lessonForm?.id ? 'Editar aula' : 'Nova aula'} onClose={() => setLessonForm(null)}>
        {lessonForm && (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              saveLesson(lessonForm);
              setLessonForm(null);
            }}
          >
            <Field label="Título"><input className={inputClass} value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} required /></Field>
            <Field label="Descrição"><textarea className={inputClass} rows={3} value={lessonForm.description || ''} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} /></Field>
            <Field label="URL do vídeo (embed)"><input className={inputClass} value={lessonForm.videoUrl || ''} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Duração"><input className={inputClass} value={lessonForm.duration || ''} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} /></Field>
              <Field label="Status">
                <select className={inputClass} value={lessonForm.status || 'published'} onChange={(e) => setLessonForm({ ...lessonForm, status: e.target.value as Lesson['status'] })}>
                  <option value="published">Publicada</option>
                  <option value="draft">Rascunho</option>
                </select>
              </Field>
            </div>
            <Field label="Material complementar (link)"><input className={inputClass} value={lessonForm.complementaryUrl || ''} onChange={(e) => setLessonForm({ ...lessonForm, complementaryUrl: e.target.value })} /></Field>
            <Field label="Thumbnail (URL)"><input className={inputClass} value={lessonForm.thumbnail || ''} onChange={(e) => setLessonForm({ ...lessonForm, thumbnail: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-xs text-zinc-300">
              <input type="checkbox" checked={!!lessonForm.isFree} onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })} />
              Aula gratuita / preview
            </label>
            <button className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold py-2.5 rounded-lg">Salvar</button>
          </form>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!deleteMod}
        title="Excluir módulo?"
        message={`O módulo "${deleteMod?.name}" e todas as aulas dele serão removidos.`}
        onCancel={() => setDeleteMod(null)}
        onConfirm={() => {
          if (deleteMod) deleteModule(deleteMod.id);
          setDeleteMod(null);
        }}
      />
      <ConfirmDialog
        open={!!deleteLes}
        title="Excluir aula?"
        message={`A aula "${deleteLes?.title}" será removida da trilha do aluno.`}
        onCancel={() => setDeleteLes(null)}
        onConfirm={() => {
          if (deleteLes) deleteLesson(deleteLes.id);
          setDeleteLes(null);
        }}
      />
    </div>
  );
};
