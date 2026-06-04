import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { lessonsData, Lesson } from '../data/mockData';
import { VideoCard } from '../components/VideoCard';
import { Sparkles, Music, Shield, Play, X, UserCheck, Flame } from 'lucide-react';

export const PublicHome: React.FC = () => {
  const { navigateTo } = useApp();
  const [activePreview, setActivePreview] = useState<Lesson | null>(null);

  const freeLessons = lessonsData.filter(lesson => lesson.isFree);

  const handleWatchFree = (lesson: Lesson) => {
    setActivePreview(lesson);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-10" id="public-home-root">
      
      {/* 1. HERO BANNER - CHAMADA PARA AÇÃO (CTA) */}
      <section className="relative glass-panel rounded-2xl p-6 sm:p-12 border border-zinc-800 text-center overflow-hidden flex flex-col items-center justify-center gap-4">
        {/* Fundo decorativo animado */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-purple-900/10 via-black to-cyan-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />

        <div className="flex items-center gap-1.5 bg-purple-950/60 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest uppercase animate-bounce mt-2">
          <Flame className="h-4 w-4 text-purple-400 fill-purple-400/20" />
          Acesso Aberto de Demonstração
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl leading-tight sm:leading-none mt-2">
          O Ecossistema Definitivo para <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">
            Músicos e Produtores
          </span>
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed mt-2">
          Aprenda violão, bateria, contrabaixo, gravação no Reaper, mixagem profissional e podcast. Conecte-se com alunos, compre VSTs e organize seus estudos com nossa IA.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 w-full sm:w-auto">
          <button 
            onClick={() => navigateTo('Login')}
            className="w-full sm:w-auto relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-extrabold text-zinc-950 rounded-lg group bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
            id="btn-join-community-hero"
          >
            <span className="w-full sm:w-auto relative px-8 py-3 transition-all ease-in duration-75 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 rounded-lg text-zinc-950 font-extrabold hover:bg-none group-hover:bg-opacity-0 hover:text-white">
              Entrar na Comunidade Premium
            </span>
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById('free-lessons-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-white font-bold text-sm px-8 py-3.5 rounded-lg transition focus:outline-none"
          >
            Explorar Aulas Gratuitas
          </button>
        </div>

        {/* Pequenos Badges de Vantagens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-zinc-900/60 w-full text-zinc-500 text-xs">
          <div className="flex items-center justify-center gap-2">
            <Music className="h-4 w-4 text-purple-500" />
            <span>Múltiplos Instrumentos</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Cronograma de Estudo IA</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <UserCheck className="h-4 w-4 text-purple-500" />
            <span>Comunidade Ativa</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span>Streaming Protegido</span>
          </div>
        </div>
      </section>

      {/* 2. GRADE DE VÍDEOS GRATUITOS (ESTILO YOUTUBE) */}
      <section className="flex flex-col gap-6" id="free-lessons-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide">
              Conteúdos Gratuitos Disponíveis
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Aulas completas e gratuitas liberadas para degustação.</p>
          </div>
          <div className="text-xs bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-semibold">
            {freeLessons.length} Aulas Disponíveis
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeLessons.map(lesson => (
            <VideoCard 
              key={lesson.id} 
              lesson={lesson} 
              onWatchClick={handleWatchFree} 
            />
          ))}
        </div>
      </section>

      {/* 3. PROPAGANDA DA COMUNIDADE */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-zinc-950 to-purple-950/20">
        <div className="max-w-xl text-left">
          <h3 className="font-heading text-base sm:text-xl font-extrabold text-white tracking-wide">
            Cansado de estudar sozinho sem rumo na internet?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed">
            No <span className="text-cyan-400 font-semibold">Netflix do Músico</span>, você tem um roteiro sequencial perfeito do Nível Zero ao Avançado. Compartilhe sua evolução, receba feedbacks de professores, faça reviews de equipamentos e interaja com outros músicos!
          </p>
        </div>
        <button 
          onClick={() => navigateTo('Login')}
          className="flex-none bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-purple-500/10 focus:outline-none"
          id="btn-join-community-bottom"
        >
          Participar da Comunidade Premium
        </button>
      </section>

      {/* 4. PLAYER DE PREVIEW MODAL */}
      {activePreview && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="w-full max-w-3xl glass-panel border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl animate-scale-up">
            
            {/* Cabeçalho do Modal */}
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-950/60">
              <div>
                <span className="text-[9px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                  Aula Gratuita • {activePreview.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                  {activePreview.title}
                </h4>
              </div>
              <button 
                onClick={() => setActivePreview(null)}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/80 p-1.5 rounded-full transition focus:outline-none"
                id="btn-close-preview"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Vídeo / Iframe */}
            <div className="relative aspect-video bg-black">
              <iframe 
                src={activePreview.videoUrl} 
                title={activePreview.title}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
              
              {/* Marca d'água dinâmica do Convidado para simular segurança */}
              <div className="absolute top-4 left-4 pointer-events-none select-none text-[8px] sm:text-[10px] font-mono bg-black/60 border border-white/5 text-white/20 px-2 py-0.5 rounded">
                👤 CONVIDADO DEMONSTRAÇÃO | ID: GUEST-000 | NETFLIX DO MÚSICO
              </div>
            </div>

            {/* Rodapé Informativo / Conversão */}
            <div className="p-4 sm:p-5 border-t border-zinc-900 bg-zinc-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[11px] text-zinc-400 text-center sm:text-left leading-normal max-w-md">
                Gostou desta aula? Inscreva-se agora para liberar mais de <span className="text-white font-bold">120 aulas premium</span> organizadas por níveis e temporadas!
              </p>
              <button 
                onClick={() => {
                  setActivePreview(null);
                  navigateTo('Login');
                }}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition"
                id="btn-subscribe-preview"
              >
                Assinar Plataforma
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default PublicHome;
