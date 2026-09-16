import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { MusicCategory } from '../data/mockData';
import { Play, Info, Flame, History, Award, BookOpen, Clock, Heart } from 'lucide-react';

export const MemberHome: React.FC = () => {
  const { navigateTo, watchedHistory, publishedLessons, publishedCourses } = useApp();
  const [showHeroDetails, setShowHeroDetails] = useState(false);

  // 1. DADOS DAS CATEGORIAS PREMIUM
  const categoriesList: { name: MusicCategory; img: string; desc: string }[] = [
    { 
      name: 'Violão', 
      img: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
      desc: 'Domine acordes, ritmos, dedilhados e técnicas de fingerstyle no violão acústico.'
    },
    { 
      name: 'Bateria', 
      img: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=600&q=80',
      desc: 'Desenvolva pegada de baquetas, grooves clássicos, pedal duplo e polirritmias avançadas.'
    },
    { 
      name: 'Contrabaixo', 
      img: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=600&q=80',
      desc: 'Aprenda slap percussivo, walking bass de blues, escalas e condução de harmonia.'
    },
    { 
      name: 'Reaper', 
      img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
      desc: 'Grave e edite áudios e MIDIs como profissional na DAW mais flexível do mercado.'
    },
    { 
      name: 'Mixagem', 
      img: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=600&q=80',
      desc: 'Entenda equalização, compressão dinâmica, efeitos e masterização em produções musicais.'
    },
    { 
      name: 'Podcast', 
      img: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80',
      desc: 'Grave múltiplos participantes fáceis, retire ruídos e edite episódios de áudio limpos.'
    }
  ];

  // 2. BUSCA AULAS DO HISTÓRICO "CONTINUAR ASSISTINDO"
  const getContinueWatchingLessons = () => {
    return watchedHistory
      .map(id => publishedLessons.find(l => l.id === id))
      .filter((l): l is typeof publishedLessons[0] => !!l);
  };

  const continueWatching = getContinueWatchingLessons();

  const handleCategoryClick = (category: MusicCategory, courseId?: string) => {
    navigateTo('CategoryPage', { category, courseId });
  };

  const handleLessonHistoryClick = (lesson: any) => {
    navigateTo('CategoryPage', { category: lesson.category, courseId: lesson.courseId, activeLessonId: lesson.id });
  };

  const heroLesson = publishedLessons.find(l => l.id === 'mix-04') || publishedLessons[0];

  return (
    <div className="flex flex-col gap-8 pb-12" id="member-home-root">
      
      {/* 1. HERO BANNER PRINCIPAL (NETFLIX STYLE) */}
      <section className="relative w-full aspect-[21/9] min-h-[340px] md:min-h-[440px] flex items-center overflow-hidden border-b border-zinc-900">
        
        {/* Background Image / Video Simulado */}
        <img 
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80" 
          alt="Mixagem de Heavy Metal"
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none scale-102"
        />
        
        {/* Camadas de Overlay Escuro para Legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-black/10" />
        <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />

        {/* Detalhes do Conteúdo Hero */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 w-full text-left flex flex-col gap-3.5 sm:gap-4 z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 font-mono tracking-widest uppercase">
            <Flame className="h-4 w-4 fill-cyan-400/20 animate-pulse text-cyan-400" />
            Em Destaque Hoje
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight max-w-xl">
            Mixagem de Metal & Guitarras de Alto Ganho
          </h1>

          <p className="text-xs sm:text-sm text-zinc-350 max-w-lg leading-relaxed line-clamp-3">
            Descubra o segredo por trás de mixagens de guitarras pesadas e limpas. Escultura de frequências médias e o uso correto da compressão paralela no barramento de bateria no Rock e Metal.
          </p>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleLessonHistoryClick(heroLesson)}
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-5 py-3 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-lg hover:shadow-purple-500/10 focus:outline-none"
              id="btn-hero-play"
            >
              <Play className="h-4 w-4 fill-white" />
              Assistir Agora
            </button>
            
            <button 
              onClick={() => setShowHeroDetails(!showHeroDetails)}
              className="bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs px-5 py-3 rounded-lg flex items-center justify-center gap-1.5 transition focus:outline-none"
            >
              <Info className="h-4.5 w-4.5" />
              Mais Informações
            </button>
          </div>

          {/* Gaveta de detalhes extras */}
          {showHeroDetails && (
            <div className="mt-3 p-4 rounded-xl glass-panel border border-zinc-800 max-w-lg animate-slide-down">
              <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                <span>Duração: {heroLesson.duration}</span>
                <span>•</span>
                <span className="text-purple-400 font-bold">{heroLesson.level}</span>
                <span>•</span>
                <span>Categoria: {heroLesson.category}</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                Nesta aula avançada, o Engenheiro de Áudio desmistifica o ganho digital, mostrando na prática como empilhar overdrives e amp simulators de alto ganho sem embolar as baixas frequências na mix.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SEÇÃO INTERNA DE CONTEÚDO */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 w-full flex flex-col gap-10">

        {/* 2. CONTINUAR ASSISTINDO (REATIVO) */}
        {continueWatching.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-sm font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-widest font-mono">
              <History className="h-4 w-4 text-cyan-400" />
              Continuar de Onde Parou
            </h2>
            
            {/* Fileira Deslizante */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3">
              {continueWatching.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonHistoryClick(lesson)}
                  className="group relative flex-none w-64 sm:w-72 aspect-video rounded-xl overflow-hidden border border-zinc-850 hover:border-cyan-400/40 text-left bg-zinc-900/60 focus:outline-none transition-all duration-350"
                  id={`continue-watch-${lesson.id}`}
                >
                  <img 
                    src={lesson.thumbnail} 
                    alt={lesson.title} 
                    className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-101 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  
                  {/* Categoria Badge */}
                  <span className="absolute top-2.5 left-2.5 text-[8px] bg-zinc-950 border border-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">
                    {lesson.category}
                  </span>

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-cyan-500/90 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                      <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Detalhes */}
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] text-zinc-400 font-mono">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <span className="text-purple-400 font-bold">{lesson.level}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. FILEIRAS HORIZONTAIS DE CATEGORIAS (NETFLIX STYLE) */}
        <section className="flex flex-col gap-6">
          <div className="border-b border-zinc-900 pb-3">
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide">
              Trilhas de Estudo por Instrumento & Prática
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Selecione uma categoria para listar as aulas estruturadas por níveis musicais.</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
              {(publishedCourses.length > 0 ? publishedCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    categoryName={course.title}
                    imageUrl={course.coverImage}
                    lessonCount={publishedLessons.filter(l => l.courseId === course.id).length}
                    description={course.description}
                    onClick={() => handleCategoryClick(course.category, course.id)}
                  />
                )) : categoriesList.map((cat) => {
                const count = publishedLessons.filter(l => l.category === cat.name).length;
                return (
                  <CourseCard
                    key={cat.name}
                    categoryName={cat.name}
                    imageUrl={cat.img}
                    lessonCount={count}
                    description={cat.desc}
                    onClick={() => handleCategoryClick(cat.name)}
                  />
                );
              }))}
            </div>
          </div>
        </section>

        {/* 4. SEÇÃO IA E COMUNIDADE ATALHO */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Caixa 1: IA Calendar */}
          <div className="glass-panel border border-zinc-800 rounded-2xl p-5 sm:p-6 text-left flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex h-9 w-9 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 items-center justify-center rounded-lg mb-3">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide">
                Calendário de Estudos com IA
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Nossa IA inteligente organiza sua rotina, horários livres e metas semanais em um cronograma didático perfeito para o seu nível musical.
              </p>
            </div>
            <button 
              onClick={() => navigateTo('StudentProfile', { tab: 'calendario' })}
              className="w-fit bg-zinc-850 hover:bg-cyan-500 hover:text-zinc-950 border border-zinc-700 hover:border-transparent font-bold text-xs px-4 py-2 rounded-lg transition"
              id="btn-goto-ai-calendar"
            >
              Organizar Meus Estudos
            </button>
          </div>

          {/* Caixa 2: Comunidade */}
          <div className="glass-panel border border-zinc-800 rounded-2xl p-5 sm:p-6 text-left flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex h-9 w-9 bg-purple-500/10 border border-purple-500/20 text-purple-400 items-center justify-center rounded-lg mb-3">
                <Award className="h-4.5 w-4.5" />
              </div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide">
                Feed de Evolução da Comunidade
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Poste seus vídeos treinando, avalie os equipamentos de outros músicos e dê like nas postagens de conquistas dos seus amigos de classe!
              </p>
            </div>
            <button 
              onClick={() => navigateTo('CommunityPage')}
              className="w-fit bg-zinc-850 hover:bg-purple-600 hover:text-white border border-zinc-700 hover:border-transparent font-bold text-xs px-4 py-2 rounded-lg transition"
              id="btn-goto-community"
            >
              Entrar no Feed Social
            </button>
          </div>
        </section>

      </div>

    </div>
  );
};
export default MemberHome;
