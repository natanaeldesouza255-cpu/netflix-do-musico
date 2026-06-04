import React from 'react';
import { Lesson } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Play, CheckCircle, Circle, Heart } from 'lucide-react';

interface EpisodeCardProps {
  lesson: Lesson;
  episodeNumber: number;
  isActive: boolean;
  onWatchClick: () => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({ 
  lesson, 
  episodeNumber, 
  isActive, 
  onWatchClick 
}) => {
  const { completedLessons, favoriteLessons, toggleLessonComplete, toggleLessonFavorite } = useApp();
  const isCompleted = completedLessons.includes(lesson.id);
  const isFavorited = favoriteLessons.includes(lesson.id);

  return (
    <div 
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isActive 
          ? 'bg-purple-950/20 border-purple-500/50 shadow-md shadow-purple-950/10' 
          : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/60'
      }`}
      id={`ep-card-${lesson.id}`}
    >
      <div className="flex items-start gap-4">
        {/* Número do Episódio */}
        <div className="flex-none flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-500 font-mono">EP</span>
          <span className="text-lg font-bold font-heading text-zinc-300">
            {episodeNumber}
          </span>
        </div>

        {/* Informações da Aula */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`text-sm font-bold tracking-wide ${isActive ? 'text-purple-400' : 'text-white'}`}>
              {lesson.title}
            </h4>
            <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-850">
              {lesson.duration}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed max-w-xl">
            {lesson.description}
          </p>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3.5 pl-6 md:pl-0 border-t border-zinc-800 md:border-t-0 pt-2.5 md:pt-0">
        
        {/* Favorito */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLessonFavorite(lesson.id);
          }}
          className={`p-2 rounded-lg hover:bg-zinc-800/60 border border-zinc-800/80 focus:outline-none transition ${
            isFavorited ? 'text-red-500 border-red-500/20 bg-red-950/20' : 'text-zinc-500 hover:text-zinc-300'
          }`}
          title={isFavorited ? 'Remover dos favoritos' : 'Favoritar aula'}
          id={`btn-fav-lesson-${lesson.id}`}
        >
          <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-red-500' : ''}`} />
        </button>

        {/* Concluído/Não Concluído */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleLessonComplete(lesson.id);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none transition ${
            isCompleted 
              ? 'bg-green-950/20 border-green-500/20 text-green-400 hover:bg-green-950/40' 
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
          }`}
          title={isCompleted ? 'Marcar como não assistida' : 'Marcar como concluída'}
          id={`btn-comp-lesson-${lesson.id}`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="h-4.5 w-4.5 text-green-400 fill-green-950/20" />
              <span>Concluída (+100XP)</span>
            </>
          ) : (
            <>
              <Circle className="h-4.5 w-4.5" />
              <span>Marcar Concluída</span>
            </>
          )}
        </button>

        {/* Assistir */}
        <button
          onClick={onWatchClick}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-bold text-xs focus:outline-none transition-glow transition ${
            isActive 
              ? 'bg-purple-500 hover:bg-purple-400 text-white shadow-lg shadow-purple-500/20' 
              : 'bg-zinc-100 hover:bg-white text-zinc-950'
          }`}
          id={`btn-play-lesson-${lesson.id}`}
        >
          <Play className={`h-3 w-3 ${isActive ? 'fill-white' : 'fill-zinc-950'}`} />
          Assistir
        </button>
      </div>

    </div>
  );
};
export default EpisodeCard;
