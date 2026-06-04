import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { lessonsData, equipmentsData } from '../data/mockData';
import { AICalendar } from '../components/AICalendar';
import { VideoCard } from '../components/VideoCard';
import { 
  User as UserIcon, 
  Sparkles, 
  BookOpen, 
  Heart, 
  TrendingUp, 
  Calendar, 
  Award, 
  Zap, 
  Edit3,
  Clock
} from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { 
    user, 
    completedLessons, 
    favoriteLessons, 
    favoriteEquipments, 
    communityFeed,
    updateProfile,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'evolucao' | 'favoritos' | 'calendario'>('evolucao');
  
  // Controle de edição do perfil
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [editInstrument, setEditInstrument] = useState(user?.instrument || '');

  if (!user) {
    return (
      <div className="mx-auto max-w-xl text-center py-20">
        <p className="text-zinc-400">Por favor, faça login para visualizar seu perfil.</p>
      </div>
    );
  }

  // 1. CALCULOS DE PROGRESSO
  const totalLessons = lessonsData.length;
  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100) || 0;

  // 2. BUSCA ITENS FAVORITADOS
  const favLessonsObj = lessonsData.filter(l => favoriteLessons.includes(l.id));
  const favEquipsObj = equipmentsData.filter(e => favoriteEquipments.includes(e.id));

  // 3. BUSCA POSTS DO ALUNO
  const studentPosts = communityFeed.filter(post => post.authorName === user.name);

  // 4. DADOS DO GRÁFICO DE EVOLUÇÃO TÉCNICA (MOCK EM STATE)
  const skillsData = [
    { name: 'Teoria Musical', score: 65, color: 'from-purple-500 to-fuchsia-500' },
    { name: 'Técnica & Digitação', score: 85, color: 'from-cyan-500 to-blue-500' },
    { name: 'Independência Rítmica', score: 70, color: 'from-emerald-500 to-teal-500' },
    { name: 'Produção DAW (Reaper)', score: 55, color: 'from-amber-500 to-orange-500' },
    { name: 'Improvisação & Solos', score: 45, color: 'from-red-500 to-rose-500' },
    { name: 'Repertório Prático', score: 75, color: 'from-indigo-500 to-violet-500' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      bio: editBio,
      instrument: editInstrument
    });
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-6" id="student-profile-root">
      
      {/* 1. SEÇÃO BANNER DO PERFIL (HEADER) */}
      <section className="glass-panel border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Info Aluno */}
        <div className="flex items-center gap-4 text-left flex-wrap">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-purple-500/40"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-heading text-xl sm:text-2xl font-black text-white tracking-wide">{user.name}</h2>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/25 text-cyan-400 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider font-semibold">
                Nível: {user.level}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-md font-medium">
              Instrumento: <span className="text-zinc-200 font-semibold">{user.instrument}</span>
            </p>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed max-w-lg italic line-clamp-2">
              "{user.bio}"
            </p>
          </div>
        </div>

        {/* Lado Direito: Editar ou Stats Rápidos */}
        <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-4 w-full md:w-auto">
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 flex flex-col gap-3 max-w-sm w-full animate-slide-down text-left">
              <span className="text-[9px] font-bold text-white uppercase tracking-widest block border-b border-zinc-900 pb-1.5">Editar Perfil</span>
              <div className="flex flex-col gap-1">
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Nome"
                  className="rounded bg-zinc-900 border border-zinc-800 text-[11px] px-2 py-1 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <input 
                  type="text" 
                  value={editInstrument}
                  onChange={(e) => setEditInstrument(e.target.value)}
                  placeholder="Instrumento"
                  className="rounded bg-zinc-900 border border-zinc-800 text-[11px] px-2 py-1 focus:outline-none"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Biografia curta..."
                  rows={2}
                  className="rounded bg-zinc-900 border border-zinc-800 text-[11px] px-2 py-1 focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] px-3 py-1 rounded">
                  Salvar
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="text-zinc-500 hover:text-white font-bold text-[10px] px-3 py-1">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Botão Editar */}
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-850 hover:border-zinc-700 text-zinc-300 hover:text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition focus:outline-none"
                id="btn-edit-profile"
              >
                <Edit3 className="h-4 w-4" />
                Editar Perfil
              </button>

              {/* Box XP Total */}
              <div className="bg-purple-950/40 border border-purple-500/20 text-purple-300 rounded-xl p-4 flex items-center gap-3 relative shadow-inner">
                <Zap className="h-8 w-8 text-purple-400 fill-purple-400/20 animate-pulse" />
                <div className="text-left">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Total Acumulado</div>
                  <div className="text-2xl font-black text-white font-mono leading-none mt-1">{user.xp} XP</div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2. DASHBOARD DE ESTATÍSTICAS / PROGRESSO */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Barra de Progresso Geral */}
        <div className="md:col-span-2 glass-panel border border-zinc-800 rounded-xl p-5 flex flex-col justify-center gap-3">
          <div className="flex justify-between items-center text-xs font-bold text-zinc-300 uppercase tracking-wider">
            <span>Progresso Geral da Trilha</span>
            <span className="text-cyan-400 font-mono font-bold text-sm">{progressPercent}%</span>
          </div>
          {/* Fundo da Barra */}
          <div className="w-full h-3 rounded-full bg-zinc-950 border border-zinc-900 overflow-hidden relative">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-zinc-550 leading-relaxed text-left -mt-0.5">
            Você concluiu <span className="text-white font-bold">{completedCount}</span> de <span className="text-white font-bold">{totalLessons}</span> aulas gravadas na plataforma!
          </div>
        </div>

        {/* Stat: Favoritos */}
        <div className="glass-panel border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Favoritos salvos</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{favoriteLessons.length + favoriteEquipments.length}</span>
            <span className="text-[9px] text-zinc-500 leading-none">Itens guardados</span>
          </div>
          <div className="h-9 w-9 bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center rounded-lg">
            <Heart className="h-4.5 w-4.5 fill-red-500/10" />
          </div>
        </div>

        {/* Stat: Posts da Comunidade */}
        <div className="glass-panel border border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Vídeos de Evolução</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{studentPosts.length}</span>
            <span className="text-[9px] text-zinc-500 leading-none">Postagens no feed</span>
          </div>
          <div className="h-9 w-9 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center rounded-lg">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
        </div>

      </section>

      {/* TABS DE CONTEÚDO */}
      <section className="flex flex-col gap-6">
        
        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-zinc-900 pb-1 gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('evolucao')}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition focus:outline-none border-b-2 ${
              activeTab === 'evolucao'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
            id="tab-btn-evolution"
          >
            <TrendingUp className="h-4 w-4" />
            Minha Evolução Técnica
          </button>

          <button
            onClick={() => setActiveTab('favoritos')}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition focus:outline-none border-b-2 ${
              activeTab === 'favoritos'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
            id="tab-btn-favorites"
          >
            <Heart className="h-4 w-4" />
            Favoritos Salvos ({favoriteLessons.length + favoriteEquipments.length})
          </button>

          <button
            onClick={() => setActiveTab('calendario')}
            className={`flex items-center gap-1.5 pb-2 text-xs font-bold transition focus:outline-none border-b-2 ${
              activeTab === 'calendario'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
            id="tab-btn-calendar"
          >
            <Calendar className="h-4 w-4" />
            Calendário de Estudos com IA
          </button>
        </div>

        {/* CONTEÚDO TAB: MINHA EVOLUÇÃO */}
        {activeTab === 'evolucao' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left animate-fade-in" id="evolution-tab-content">
            
            {/* Gráfico de Evolução Técnica Reativo Desenhado à mão em CSS */}
            <div className="lg:col-span-1 glass-panel border border-zinc-850 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-purple-400" />
                Nível de Habilidade Prática
              </h3>
              
              <div className="flex flex-col gap-4.5">
                {skillsData.map(skill => (
                  <div key={skill.name} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                      <span>{skill.name}</span>
                      <span className="text-zinc-200 font-mono">{skill.score}%</span>
                    </div>
                    {/* Barra de skill */}
                    <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                      <div 
                        className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Listagem de Posts de Evolução do Aluno */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">
                Meus Vídeos e Posts de Evolução ({studentPosts.length})
              </h3>
              
              {studentPosts.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {studentPosts.map(post => (
                    <div key={post.id} className="glass-panel border border-zinc-900 rounded-xl p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-300">{post.date}</span>
                        <span className="text-[9px] bg-purple-950 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-mono uppercase">
                          {post.likes} Curtidas
                        </span>
                      </div>
                      <p className="text-xs text-zinc-450 leading-relaxed">
                        {post.content}
                      </p>
                      {post.videoUrl && (
                        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-zinc-900 max-w-sm relative">
                          <iframe src={post.videoUrl} title="Evolução" className="w-full h-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 glass-panel border border-zinc-850 rounded-xl text-xs text-zinc-500 italic">
                  Você ainda não postou vídeos de evolução no feed social. Compartilhe seu progresso!
                </div>
              )}
            </div>

          </div>
        )}

        {/* CONTEÚDO TAB: FAVORITOS SALVOS */}
        {activeTab === 'favoritos' && (
          <div className="flex flex-col gap-6 text-left animate-fade-in" id="favorites-tab-content">
            
            {/* Aulas Favoritadas */}
            <div className="flex flex-col gap-3.5">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">
                Aulas Favoritas ({favLessonsObj.length})
              </h3>
              {favLessonsObj.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favLessonsObj.map(lesson => (
                    <VideoCard
                      key={lesson.id}
                      lesson={lesson}
                      onWatchClick={() => navigateTo('CategoryPage', { category: lesson.category, activeLessonId: lesson.id })}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 glass-panel border border-zinc-850 rounded-xl text-xs text-zinc-500 italic">
                  Nenhuma aula favoritada por enquanto. Clique no botão de coração de uma aula para salvá-la!
                </div>
              )}
            </div>

            {/* Equipamentos Favoritados */}
            <div className="flex flex-col gap-3.5 mt-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2">
                Equipamentos Salvos ({favEquipsObj.length})
              </h3>
              {favEquipsObj.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favEquipsObj.map(eq => (
                    <div 
                      key={eq.id}
                      onClick={() => navigateTo('EquipmentReviews', { activeEqId: eq.id })}
                      className="glass-panel border border-zinc-900 rounded-xl p-4 flex gap-3 hover:border-cyan-500/20 cursor-pointer hover:scale-[1.01] transition-all"
                    >
                      <img src={eq.imageUrl} alt={eq.name} className="h-12 w-12 rounded object-cover flex-shrink-0" />
                      <div className="text-left flex-grow">
                        <div className="text-xs font-bold text-white line-clamp-1">{eq.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">{eq.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 glass-panel border border-zinc-850 rounded-xl text-xs text-zinc-500 italic">
                  Nenhum equipamento salvo nos favoritos ainda.
                </div>
              )}
            </div>

          </div>
        )}

        {/* CONTEÚDO TAB: CALENDÁRIO IA */}
        {activeTab === 'calendario' && (
          <div className="animate-fade-in" id="calendar-tab-content">
            <AICalendar />
          </div>
        )}

      </section>

    </div>
  );
};
export default StudentProfile;
