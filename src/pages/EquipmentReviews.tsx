import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../data/mockData';
import { EquipmentCard } from '../components/EquipmentCard';
import { Star, X, MessageSquare, Play, Send, CheckCircle, Award } from 'lucide-react';

export const EquipmentReviews: React.FC = () => {
  const { equipments, addCommentToEquipment, screenParams, user } = useApp();
  const publishedEquipments = equipments.filter((eq) => eq.published !== false);

  const [activeFilter, setActiveFilter] = useState<string>('Tudo');
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  
  // Controles do Formulário de Review do Aluno
  const [rating, setRating] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>('');

  const filtersList = [
    'Tudo', 
    'Baterias', 
    'Violões', 
    'Guitarras', 
    'Microfones', 
    'Interfaces', 
    'Monitores', 
    'Plugins', 
    'Fones'
  ];

  // Filtra equipamentos reativamente
  const filteredEquipments = activeFilter === 'Tudo' 
    ? publishedEquipments 
    : publishedEquipments.filter(eq => eq.type === activeFilter);

  // Monitora redirecionamento via busca rápida (com activeEqId nos params)
  useEffect(() => {
    if (screenParams?.activeEqId) {
      const match = publishedEquipments.find(e => e.id === screenParams.activeEqId);
      if (match) setSelectedEq(match);
    }
  }, [screenParams, equipments]);

  const handleOpenDetails = (eq: Equipment) => {
    setSelectedEq(eq);
    setRating(5);
    setCommentText('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq || commentText.trim() === '') return;

    addCommentToEquipment(selectedEq.id, rating, commentText.trim());
    
    // Atualiza o modal reativo localmente com o novo comentário
    const updated = equipments.find(e => e.id === selectedEq.id);
    if (updated) {
      setSelectedEq(updated);
    }
    
    setCommentText('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-6" id="equipment-reviews-root">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Award className="h-5.5 w-5.5 text-cyan-400" />
            Reviews de Equipamentos
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Mapeamento técnico completo e reviews sinceros de equipamentos, softwares, VSTs e plugins feitos por professores e alunos.
          </p>
        </div>
      </div>

      {/* FILTROS POR CATEGORIA DE EQUIPAMENTO */}
      <section className="flex gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-zinc-900/60 -mx-4 px-4 sm:mx-0 sm:px-0">
        {filtersList.map(filt => (
          <button
            key={filt}
            onClick={() => setActiveFilter(filt)}
            className={`flex-none text-xs font-bold px-4 py-2 rounded-full border transition focus:outline-none ${
              activeFilter === filt
                ? 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400'
                : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
            }`}
            id={`filter-eq-${filt.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {filt}
          </button>
        ))}
      </section>

      {/* GRADE DE CARDS DE EQUIPAMENTOS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipments.length > 0 ? (
          filteredEquipments.map(eq => (
            <EquipmentCard
              key={eq.id}
              equipment={eq}
              onViewDetails={() => handleOpenDetails(eq)}
            />
          ))
        ) : (
          <div className="text-center py-12 col-span-3 glass-panel border border-zinc-850 rounded-2xl text-xs text-zinc-500 italic">
            Nenhum equipamento cadastrado nesta categoria de review por enquanto.
          </div>
        )}
      </section>

      {/* MODAL DETALHADO DO REVIEW DO EQUIPAMENTO */}
      {selectedEq && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="w-full max-w-4xl h-[90vh] glass-panel border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl animate-scale-up flex flex-col">
            
            {/* Cabeçalho do Modal */}
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/60 flex-shrink-0">
              <div>
                <span className="text-[9px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Review Completo • {selectedEq.type}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-1 line-clamp-1">
                  {selectedEq.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEq(null)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/80 p-1.5 rounded-full transition focus:outline-none"
                id="btn-close-eq-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Conteúdo Rolável do Modal */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow flex flex-col gap-6 text-left">
              
              {/* Seção 1: Imagem, Infos e Nota */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagem do Produto */}
                <div className="rounded-xl overflow-hidden aspect-video relative border border-zinc-850">
                  <img 
                    src={selectedEq.imageUrl} 
                    alt={selectedEq.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Resumo Técnico */}
                <div className="flex flex-col justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Média Geral:</span>
                      <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/25 px-2 py-0.5 rounded text-xs text-yellow-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-yellow-500" />
                        {selectedEq.rating}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-350 italic leading-relaxed">
                      "{selectedEq.description}"
                    </p>
                  </div>

                  {/* Pequenos Specs */}
                  <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3.5 text-zinc-400 text-xs">
                    <span className="font-bold text-white uppercase tracking-widest text-[9px] block mb-1">Especificações Rápidas</span>
                    • Testado em DAW Reaper v7.x<br />
                    • Avaliado por professores especializados<br />
                    • Foco didático e portabilidade residencial
                  </div>
                </div>
              </div>

              {/* Seção 2: Review Técnico Textual Escrito */}
              <div className="flex flex-col gap-2 border-t border-zinc-900/60 pt-4">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono">Review Técnico do Especialista</h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                  {selectedEq.reviewText}
                </p>
              </div>

              {/* Seção 3: Vídeo Demonstrativo */}
              <div className="flex flex-col gap-3 border-t border-zinc-900/60 pt-4 max-w-2xl">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Play className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
                  Vídeo Demonstrativo / Comparativo
                </h4>
                <div className="aspect-video bg-black rounded-xl overflow-hidden border border-zinc-850">
                  <iframe 
                    src={selectedEq.videoDemoUrl} 
                    title={`Demonstração ${selectedEq.name}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Seção 4: Comentários e Reviews de Alunos */}
              <div className="border-t border-zinc-900/60 pt-5 flex flex-col gap-4">
                <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <MessageSquare className="h-4 w-4" />
                  Opinião dos Alunos Assinantes ({selectedEq.comments.length})
                </h4>

                {/* Lista de Comentários */}
                <div className="flex flex-col gap-3">
                  {selectedEq.comments.map((comm, idx) => (
                    <div key={idx} className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3.5 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white">{comm.user}</span>
                        <div className="flex items-center gap-0.5 bg-yellow-500/10 text-yellow-500 px-1.5 py-0.2 rounded text-[9px] font-bold">
                          <Star className="h-2.5 w-2.5 fill-yellow-500" />
                          {comm.rating}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-450 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Adicionar Review por Aluno Logado */}
                {user && (
                  <form onSubmit={handleReviewSubmit} className="mt-2 bg-zinc-950/80 border border-zinc-850 rounded-xl p-4 flex flex-col gap-4">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest block border-b border-zinc-900 pb-1.5">Enviar sua avaliação do produto</span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400">Sua nota:</span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            className="focus:outline-none transition group"
                            id={`btn-star-rating-${num}`}
                          >
                            <Star className={`h-5 w-5 ${num <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-650'}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 items-end">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Escreva sua experiência sincera com este equipamento em estúdio..."
                        rows={2}
                        className="flex-grow rounded-lg bg-zinc-900 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-550 focus:border-cyan-400 focus:outline-none transition resize-none leading-relaxed"
                        required
                        id="textarea-eq-review"
                      />
                      <button 
                        type="submit"
                        className="flex-none p-3.5 bg-cyan-500 text-zinc-950 rounded-lg hover:bg-cyan-400 focus:outline-none transition-all shadow-lg shadow-cyan-500/10"
                        id="btn-send-eq-review"
                      >
                        <Send className="h-4 w-4 fill-zinc-950" />
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default EquipmentReviews;
