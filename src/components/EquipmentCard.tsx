import React from 'react';
import { Equipment } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, Heart, FileText } from 'lucide-react';

interface EquipmentCardProps {
  equipment: Equipment;
  onViewDetails: () => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onViewDetails }) => {
  const { favoriteEquipments, toggleEquipmentFavorite } = useApp();
  const isFavorited = favoriteEquipments.includes(equipment.id);

  return (
    <div 
      className="group glass-panel rounded-xl overflow-hidden hover:scale-[1.01] hover:-translate-y-0.5 transition-glow transition-all duration-300 border border-zinc-800 hover:border-cyan-500/40 neon-glow-cyan flex flex-col justify-between"
      id={`eq-card-${equipment.id}`}
    >
      <div>
        {/* Foto do Equipamento */}
        <div className="relative aspect-4/3 overflow-hidden">
          <img 
            src={equipment.imageUrl} 
            alt={equipment.name} 
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          
          {/* Tipo de Equipamento Badge */}
          <span className="absolute top-2.5 left-2.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-950/80 border border-zinc-700 text-cyan-400 px-2 py-0.5 rounded">
            {equipment.type}
          </span>

          {/* Favoritar */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleEquipmentFavorite(equipment.id);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md focus:outline-none transition ${
              isFavorited 
                ? 'bg-red-500/20 text-red-500 border border-red-500/40' 
                : 'bg-black/50 border border-white/10 text-zinc-400 hover:text-white'
            }`}
            title={isFavorited ? 'Remover dos salvos' : 'Salvar equipamento'}
            id={`btn-fav-eq-${equipment.id}`}
          >
            <Heart className={`h-3.5 w-3.5 ${isFavorited ? 'fill-red-500' : ''}`} />
          </button>
        </div>

        {/* Detalhes */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-white tracking-wide group-hover:text-cyan-400 transition-colors line-clamp-1">
              {equipment.name}
            </h3>
            
            {/* Nota de Estrelas */}
            <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/25 px-1.5 py-0.5 rounded text-[10px] text-yellow-500 font-bold">
              <Star className="h-3 w-3 fill-yellow-500" />
              {equipment.rating}
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
            {equipment.description}
          </p>
        </div>
      </div>

      {/* Rodapé e Botão de Ação */}
      <div className="p-4 pt-0 flex items-center justify-between gap-3 border-t border-zinc-900/40 mt-2">
        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
          <MessageSquare className="h-3 w-3 text-zinc-500" />
          {equipment.comments.length} {equipment.comments.length === 1 ? 'review' : 'reviews'}
        </span>

        <button
          onClick={onViewDetails}
          className="bg-zinc-800 hover:bg-cyan-500 text-zinc-300 hover:text-zinc-950 border border-zinc-700 hover:border-transparent font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition duration-350 focus:outline-none"
          id={`btn-details-eq-${equipment.id}`}
        >
          <FileText className="h-3.5 w-3.5" />
          Ler Review Completo
        </button>
      </div>

    </div>
  );
};
export default EquipmentCard;
