import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CommunityPost } from '../components/CommunityPost';
import { Users, Send, Video, Sparkles, AlertCircle } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const { communityFeed, createNewPost, user } = useApp();
  const visibleCommunityFeed = communityFeed.filter((post) => (post.moderationStatus || 'visible') === 'visible');
  
  const [postContent, setPostContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postContent.trim() === '') return;

    createNewPost(postContent.trim(), videoUrl.trim() || undefined);
    setPostContent('');
    setVideoUrl('');
    setShowVideoInput(false);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 flex flex-col gap-6" id="community-page-root">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Users className="h-5.5 w-5.5 text-purple-500" />
            Comunidade de Alunos
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Interaja com outros músicos, comente sobre aulas e compartilhe sua evolução prática!</p>
        </div>
        
        {user && (
          <div className="text-xs bg-purple-950/30 border border-purple-500/25 text-purple-300 px-3.5 py-1 rounded-full font-mono flex items-center gap-1.5 self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 fill-purple-400/20 text-purple-400" />
            <span>Postar Evolução ganha +50 XP!</span>
          </div>
        )}
      </div>

      {/* CAIXA DE CRIAÇÃO DE POST (APENAS PARA USUÁRIOS LOGADOS) */}
      {user && (
        <form 
          onSubmit={handleSubmit} 
          className="glass-panel border border-zinc-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-lg relative overflow-hidden"
          id="community-create-post-form"
        >
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border border-purple-500/30"
            />
            <div className="text-left">
              <span className="text-xs font-bold text-white">{user.name}</span>
              <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono uppercase ml-2">
                {user.instrument}
              </span>
            </div>
          </div>

          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Compartilhe suas vitórias nos treinos, dúvidas sobre acordes ou reaper com a galera..."
            rows={3}
            className="w-full rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs px-3.5 py-2.5 text-zinc-200 placeholder-zinc-500 focus:border-purple-400 focus:outline-none transition resize-none leading-relaxed"
            required
            id="textarea-post-content"
          />

          {/* INPUT DO VIDEO DE EVOLUÇÃO (MOCKADO OU YOUTUBE EMBED) */}
          {showVideoInput && (
            <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-zinc-950 border border-zinc-900 animate-slide-down">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                <Video className="h-3.5 w-3.5 text-cyan-400" />
                Cole a URL de vídeo de evolução (YouTube/Vimeo)
              </label>
              <input 
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ex: https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="rounded-lg bg-zinc-900 border border-zinc-800 text-xs px-3 py-1.5 text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
                id="input-post-video-url"
              />
              <span className="text-[9px] text-zinc-550 leading-normal flex items-start gap-1">
                <AlertCircle className="h-3 w-3 text-zinc-500 flex-shrink-0 mt-0.5" />
                Apenas links que suportam iFrames são exibidos na comunidade para segurança de dados.
              </span>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 mt-1">
            <button
              type="button"
              onClick={() => setShowVideoInput(!showVideoInput)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border focus:outline-none transition ${
                showVideoInput 
                  ? 'bg-cyan-950/40 border-cyan-500/20 text-cyan-400' 
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              id="btn-toggle-video-input"
            >
              <Video className="h-4 w-4" />
              <span>Anexar Vídeo de Evolução</span>
            </button>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 transition shadow focus:outline-none"
              id="btn-publish-post"
            >
              <Send className="h-3.5 w-3.5" />
              Publicar
            </button>
          </div>
        </form>
      )}

      {/* FEED DE POSTAGENS */}
      <div className="flex flex-col gap-5">
        {visibleCommunityFeed.length > 0 ? (
          visibleCommunityFeed.map(post => (
            <CommunityPost 
              key={post.id} 
              post={post} 
            />
          ))
        ) : (
          <div className="text-center py-12 glass-panel border border-zinc-850 rounded-2xl text-xs text-zinc-500 italic">
            Nenhuma postagem na comunidade no momento.
          </div>
        )}
      </div>

    </div>
  );
};
export default CommunityPage;
