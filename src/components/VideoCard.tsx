import React from 'react';
import { Lesson } from '../data/mockData';
import { Play, Clock } from 'lucide-react';

interface VideoCardProps {
  lesson: Lesson;
  onWatchClick: (lesson: Lesson) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ lesson, onWatchClick }) => {
  return (
    <div 
      className="group glass-panel rounded-xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-glow transition-all duration-300 border border-zinc-800 hover:border-cyan-500/40 neon-glow-cyan"
      id={`vid-card-${lesson.id}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={lesson.thumbnail} 
          alt={lesson.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Play Icon Badge */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="h-12 w-12 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Play className="h-6 w-6 text-black fill-black ml-0.5" />
          </div>
        </div>

        {/* Categoria Badge */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-700 text-zinc-300 px-2 py-0.5 rounded">
          {lesson.category}
        </span>

        {/* Duração Badge */}
        <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 text-[10px] font-mono bg-zinc-950/80 text-zinc-300 px-1.5 py-0.5 rounded">
          <Clock className="h-3 w-3" />
          {lesson.duration}
        </span>
      </div>

      {/* Detalhes */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-wide line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {lesson.title}
          </h3>
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
            {lesson.description}
          </p>
        </div>

        <button 
          onClick={() => onWatchClick(lesson)}
          className="mt-4 w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-300"
          id={`btn-watch-${lesson.id}`}
        >
          <Play className="h-3 w-3 fill-zinc-950" />
          Assistir Grátis
        </button>
      </div>
    </div>
  );
};
export default VideoCard;
