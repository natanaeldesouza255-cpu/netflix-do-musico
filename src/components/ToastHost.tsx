import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, XCircle, X } from 'lucide-react';

export const ToastHost: React.FC = () => {
  const { toast, clearToast } = useApp();
  if (!toast) return null;
  const ok = toast.type === 'success';
  return (
    <div className="fixed bottom-6 right-6 z-[90] max-w-sm">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl ${
          ok
            ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
            : 'bg-red-950/90 border-red-500/30 text-red-200'
        }`}
      >
        {ok ? <CheckCircle className="h-4 w-4 mt-0.5" /> : <XCircle className="h-4 w-4 mt-0.5" />}
        <p className="text-xs leading-relaxed flex-1">{toast.message}</p>
        <button onClick={clearToast} className="text-zinc-400 hover:text-white">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
