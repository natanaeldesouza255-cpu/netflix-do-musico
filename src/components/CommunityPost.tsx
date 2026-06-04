import React, { useState } from 'react';
import { CommunityPost as PostType } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { ThumbsUp, MessageSquare, Send, Calendar, Award } from 'lucide-react';

interface CommunityPostProps {
  post: PostType;
}

export const CommunityPost: React.FC<CommunityPostProps> = ({ post }) => {
  const { user, likePost, addCommentToPost } = useApp();
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    likePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    addCommentToPost(post.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div 
      className="glass-panel rounded-xl p-4 sm:p-5 border border-zinc-800 hover:border-purple-500/20 transition-all duration-300 shadow-lg"
      id={`community-post-${post.id}`}
    >
      {/* Cabeçalho do Autor */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-purple-500/35"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-white tracking-wide">{post.authorName}</span>
              <span className="text-[10px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full font-mono uppercase">
                {post.authorInstrument}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-zinc-500 text-[10px] font-mono">
              <Calendar className="h-3 w-3 text-zinc-500" />
              <span>{post.date}</span>
              <span className="mx-1">•</span>
              <Award className="h-3 w-3 text-purple-400" />
              <span className="text-purple-400 font-semibold">{post.authorLevel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo do Post */}
      <div className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>

      {/* Evolution Video (se houver) */}
      {post.videoUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-video relative max-w-lg">
          <iframe 
            src={post.videoUrl} 
            title="Vídeo de evolução"
            className="w-full h-full"
            allowFullScreen
          />
          {/* Simulando proteção watermark discreta no vídeo da comunidade */}
          <div className="absolute top-2 right-2 text-[8px] bg-black/40 border border-white/5 text-white/30 px-1 py-0.5 font-mono select-none pointer-events-none rounded">
            Evolução Aluno
          </div>
        </div>
      )}

      {/* Ações Rápidas (Curtir & Comentar) */}
      <div className="mt-5 pt-3 border-t border-zinc-900/60 flex items-center gap-6 text-zinc-400">
        <button 
          onClick={handleLike}
          className="flex items-center gap-1.5 text-xs hover:text-cyan-400 transition focus:outline-none"
          id={`btn-like-post-${post.id}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{post.likes} {post.likes === 1 ? 'Curtida' : 'Curtidas'}</span>
        </button>

        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-xs hover:text-purple-400 transition focus:outline-none"
          id={`btn-toggle-comments-${post.id}`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{post.comments.length} {post.comments.length === 1 ? 'Comentário' : 'Comentários'}</span>
        </button>
      </div>

      {/* Seção de Comentários */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-zinc-900/60 flex flex-col gap-4">
          
          {/* Lista de Comentários */}
          {post.comments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="bg-zinc-950/40 border border-zinc-900 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-zinc-200">{comment.userName}</span>
                      <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded font-mono uppercase">
                        {comment.userInstrument}
                      </span>
                    </div>
                    <span className="text-[9px] text-zinc-600 font-mono">{comment.date}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-zinc-650 italic">
              Nenhum comentário ainda. Seja o primeiro a comentar!
            </div>
          )}

          {/* Adicionar Comentário */}
          {user && (
            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center mt-1">
              <input 
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escreva um comentário de incentivo..."
                className="flex-grow rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-500 focus:border-purple-400 focus:outline-none transition"
                id={`input-comment-${post.id}`}
              />
              <button 
                type="submit"
                className="flex-none p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg focus:outline-none transition"
                id={`btn-send-comment-${post.id}`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

        </div>
      )}

    </div>
  );
};
export default CommunityPost;
