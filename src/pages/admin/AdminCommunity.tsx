import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityPost } from '../../data/mockData';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminCommunity: React.FC = () => {
  const { communityFeed, deleteCommunityPost, setPostModeration } = useApp();
  const [pending, setPending] = useState<CommunityPost | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-heading text-2xl font-black">Comunidade</h1>
        <p className="text-xs text-zinc-500 mt-1">Moderação básica. O feed do aluno continua na CommunityPage existente.</p>
      </div>
      <div className="flex flex-col gap-3">
        {communityFeed.length === 0 && <div className="glass-panel border border-zinc-800 rounded-2xl p-8 text-center text-zinc-500">Nenhuma publicação.</div>}
        {communityFeed.map((post) => (
          <div key={post.id} className="glass-panel border border-zinc-800 rounded-2xl p-4">
            <div className="flex justify-between gap-3 flex-wrap">
              <div>
                <div className="text-sm font-bold">{post.authorName}</div>
                <div className="text-[11px] text-zinc-500">{post.date} • {post.authorInstrument}</div>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800">{post.moderationStatus || 'visible'}</span>
                <span className="text-red-400">{post.reports || 0} denúncias</span>
              </div>
            </div>
            <p className="text-xs text-zinc-300 mt-3 leading-relaxed">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => setPostModeration(post.id, 'visible')} className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-emerald-500/40">Tornar visível</button>
              <button onClick={() => setPostModeration(post.id, 'hidden')} className="text-[11px] px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-amber-500/40">Ocultar</button>
              <button onClick={() => setPending(post)} className="text-[11px] px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400">Excluir</button>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDialog open={!!pending} title="Excluir publicação?" message="A postagem desaparecerá do feed da comunidade." onCancel={() => setPending(null)} onConfirm={() => { if (pending) deleteCommunityPost(pending.id); setPending(null); }} />
    </div>
  );
};
