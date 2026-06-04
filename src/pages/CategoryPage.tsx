import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { lessonsData, Lesson, MusicCategory, MusicLevel } from '../data/mockData';
import { EpisodeCard } from '../components/EpisodeCard';
import { Watermark } from '../components/Watermark';
import { 
  Play, 
  ChevronLeft, 
  ShieldAlert, 
  Lock, 
  Settings, 
  Volume2, 
  Maximize2, 
  Sparkles,
  Info,
  Clock,
  Layers,
  Heart,
  CheckCircle
} from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { 
    screenParams, 
    goBack, 
    addToWatchedHistory, 
    favoriteLessons, 
    completedLessons,
    toggleLessonFavorite,
    toggleLessonComplete 
  } = useApp();

  const activeCategory: MusicCategory = screenParams?.category || 'Violão';

  // 1. FILTRAGEM DE AULAS DA CATEGORIA
  const categoryLessons = lessonsData.filter(l => l.category === activeCategory);

  // 2. CONTROLE DE NÍVEL (TEMPORADA) ATIVO
  const levelsOrder: MusicLevel[] = ['Nível Zero', 'Aprendiz', 'Mediano', 'Profissional', 'Avançado'];
  
  // Decide qual nível selecionar por padrão: se houver aula ativa no params, pega o dela. Senão o primeiro nível disponível com aulas.
  const [activeLevel, setActiveLevel] = useState<MusicLevel>(() => {
    if (screenParams?.activeLessonId) {
      const match = lessonsData.find(l => l.id === screenParams.activeLessonId);
      if (match) return match.level;
    }
    // Procura primeiro nível que tem aula
    for (const lvl of levelsOrder) {
      if (categoryLessons.some(l => l.level === lvl)) return lvl;
    }
    return 'Nível Zero';
  });

  // Aulas do nível/temporada ativa
  const levelLessons = categoryLessons.filter(l => l.level === activeLevel);

  // 3. CONTROLE DE AULA ATIVA (EPISÓDIO ATIVO)
  const [activeLesson, setActiveLesson] = useState<Lesson>(() => {
    if (screenParams?.activeLessonId) {
      const match = lessonsData.find(l => l.id === screenParams.activeLessonId);
      if (match) return match;
    }
    return levelLessons[0] || categoryLessons[0];
  });

  // Atualiza a aula ativa se os parâmetros mudarem (ex: busca rápida clicada)
  useEffect(() => {
    if (screenParams?.activeLessonId) {
      const match = lessonsData.find(l => l.id === screenParams.activeLessonId);
      if (match) {
        setActiveLesson(match);
        setActiveLevel(match.level);
      }
    }
  }, [screenParams]);

  // Grava no histórico de "Continuar Assistindo" quando a aula é iniciada
  useEffect(() => {
    if (activeLesson) {
      addToWatchedHistory(activeLesson.id);
    }
  }, [activeLesson]);

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleLevelChange = (level: MusicLevel) => {
    setActiveLevel(level);
    const firstLessonInLevel = categoryLessons.find(l => l.level === level);
    if (firstLessonInLevel) {
      setActiveLesson(firstLessonInLevel);
    }
  };

  const isFavorited = favoriteLessons.includes(activeLesson.id);
  const isCompleted = completedLessons.includes(activeLesson.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 flex flex-col gap-6" id="category-page-root">
      
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <button 
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition focus:outline-none"
          id="btn-category-back"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
          Voltar
        </button>
        <h2 className="font-heading text-lg sm:text-2xl font-black text-white uppercase tracking-wider">
          Curso: {activeCategory}
        </h2>
        <div className="text-[10px] bg-purple-950/40 border border-purple-500/25 text-purple-400 px-3 py-1 rounded font-mono uppercase">
          Área do Aluno Premium
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA - PLAYER SEGURO & DETALHES DA AULA (LARGURA 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* PLAYER DE VÍDEO SEGURO COM WATERMARK */}
          <div 
            className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-2xl relative"
            id="premium-video-player-container"
          >
            
            {/* Player de Iframe real mockado com Embed de YouTube */}
            <iframe 
              src={`${activeLesson.videoUrl}?autoplay=1&modestbranding=1&controls=0&rel=0`} 
              title={activeLesson.title}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media; gyroscope"
              allowFullScreen
            />

            {/* MARCA D'ÁGUA DINÂMICA INTEGRADA (PROTEÇÃO ANTICLONE) */}
            <Watermark />

            {/* Simulação de Controles Customizados Premium Sobrepostos */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/40 to-transparent p-3 sm:p-4 flex items-center justify-between gap-4 pointer-events-none opacity-80 sm:opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                  <Play className="h-3.5 w-3.5 fill-white text-white ml-0.5" />
                </div>
                <div className="text-[10px] text-zinc-300 font-mono">
                  0:00 / {activeLesson.duration}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="h-4.5 w-4.5 text-zinc-300" />
                <Settings className="h-4.5 w-4.5 text-zinc-300" />
                <Maximize2 className="h-4.5 w-4.5 text-zinc-300" />
              </div>
            </div>

            {/* Alerta de Link Protegido */}
            <div className="absolute top-3 left-3 bg-black/70 border border-red-500/20 text-red-400 text-[8px] sm:text-[9px] font-mono px-2 py-0.5 rounded flex items-center gap-1 pointer-events-none">
              <Lock className="h-3 w-3" />
              URL PROTEGIDA POR DRM E IP
            </div>
          </div>

          {/* DETALHES DA AULA SELECIONADA */}
          <div className="glass-panel border border-zinc-800 rounded-2xl p-5 text-left flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <span className="text-[10px] bg-purple-950/50 border border-purple-500/25 text-purple-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Aula {levelLessons.indexOf(activeLesson) + 1} • {activeLevel}
                </span>
                <h3 className="text-base sm:text-xl font-bold text-white tracking-wide mt-2">
                  {activeLesson.title}
                </h3>
              </div>

              {/* Botões rápidos: Favoritar e Concluir */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLessonFavorite(activeLesson.id)}
                  className={`p-2 rounded-lg border focus:outline-none transition ${
                    isFavorited 
                      ? 'text-red-500 border-red-500/20 bg-red-950/20' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                  title={isFavorited ? 'Remover dos favoritos' : 'Favoritar aula'}
                >
                  <Heart className={`h-4.5 w-4.5 ${isFavorited ? 'fill-red-500' : ''}`} />
                </button>

                <button
                  onClick={() => toggleLessonComplete(activeLesson.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold focus:outline-none transition ${
                    isCompleted 
                      ? 'bg-green-950/20 border-green-500/20 text-green-400' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>Concluída (+100XP)</span>
                    </>
                  ) : (
                    <>
                      <span>Marcar Concluída</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {activeLesson.description}
            </p>

            {/* EXPLICAÇÃO TÉCNICA DA ARQUITETURA DRM (SEGURANÇA MVP) */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 mt-1 flex flex-col gap-2">
              <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-cyan-400" />
                Arquitetura de Segurança de Vídeo & DRM
              </div>
              <p className="text-[11px] text-zinc-450 leading-relaxed">
                Este MVP simula proteções de segurança completas para impedir clonagem e roubo de arquivos digitais:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-zinc-550 list-disc list-inside">
                <li><strong className="text-zinc-400">Marca D'água Dinâmica:</strong> Renderiza dados do usuário em posições randômicas reativas.</li>
                <li><strong className="text-zinc-400">Proteção de Download:</strong> Links ocultados na DOM; bloqueio de clique direito e F12.</li>
                <li><strong className="text-zinc-400">DRM Baseado em Chaves:</strong> Preparado para descriptografia Widevine e FairPlay em produção.</li>
                <li><strong className="text-zinc-400">URLs Temporárias:</strong> Abstracionismo de endpoints de streaming assinados via tokens HMAC.</li>
              </ul>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA - SELETOR DE TEMPORADAS E EPISÓDIOS (LARGURA 1/3) */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          
          {/* SELETOR DE NÍVEL (TEMPORADA) */}
          <div className="glass-panel border border-zinc-800 rounded-2xl p-4 text-left">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Selecione o Nível (Temporada)
            </label>
            <div className="relative">
              <select
                value={activeLevel}
                onChange={(e) => handleLevelChange(e.target.value as MusicLevel)}
                className="w-full rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 focus:border-purple-400 focus:outline-none"
                id="select-category-level"
              >
                {levelsOrder.map((lvl) => {
                  const count = categoryLessons.filter(l => l.level === lvl).length;
                  return (
                    <option key={lvl} value={lvl} disabled={count === 0}>
                      {lvl} ({count} {count === 1 ? 'aula' : 'aulas'})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* LISTA DE EPISÓDIOS */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">
              Episódios Disponíveis ({levelLessons.length})
            </h4>

            {levelLessons.length > 0 ? (
              <div className="flex flex-col gap-3 max-h-[460px] overflow-y-auto pr-1">
                {levelLessons.map((lesson, idx) => (
                  <EpisodeCard
                    key={lesson.id}
                    lesson={lesson}
                    episodeNumber={idx + 1}
                    isActive={activeLesson.id === lesson.id}
                    onWatchClick={() => handleLessonSelect(lesson)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 glass-panel border border-zinc-850 rounded-2xl text-xs text-zinc-500 italic">
                Nenhuma aula gravada para este nível ainda. Selecione outro nível acima!
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
export default CategoryPage;
