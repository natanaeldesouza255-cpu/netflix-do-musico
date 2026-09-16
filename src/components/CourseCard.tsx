import React from 'react';
import { Play, Layers } from 'lucide-react';

interface CourseCardProps {
  categoryName: string;
  imageUrl: string;
  lessonCount: number;
  description: string;
  onClick: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  categoryName, 
  imageUrl, 
  lessonCount, 
  description,
  onClick 
}) => {
  return (
    <button 
      onClick={onClick}
      className="group relative flex-none w-56 sm:w-64 aspect-[16/10] rounded-lg overflow-hidden border border-zinc-800 hover:border-purple-500/40 hover:scale-[1.04] transition-all duration-300 neon-glow-purple text-left focus:outline-none focus:ring-1 focus:ring-purple-400"
      id={`course-card-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Background Image */}
      <img 
        src={imageUrl} 
        alt={categoryName} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      
      {/* Overlay Escuro Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent group-hover:via-zinc-950/20 transition-all duration-300" />
      
      {/* Detalhes sobre o Card */}
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex flex-col justify-end">
        <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase mb-0.5 flex items-center gap-1">
          <Layers className="h-3 w-3" />
          {lessonCount} {lessonCount === 1 ? 'AULA' : 'AULAS'}
        </span>
        <h3 className="font-heading text-base sm:text-lg font-extrabold text-white tracking-tight group-hover:text-purple-400 transition-colors">
          {categoryName}
        </h3>
        <p className="text-[10px] text-zinc-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {description}
        </p>
      </div>

      {/* Ícone de Play Flutuante */}
      <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-purple-500/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg shadow-purple-500/30">
        <Play className="h-4 w-4 fill-white ml-0.5" />
      </div>
    </button>
  );
};
export default CourseCard;
