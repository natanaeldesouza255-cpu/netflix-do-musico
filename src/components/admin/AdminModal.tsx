import React from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({ open, title, onClose, children, wide }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} glass-panel border border-zinc-800 rounded-2xl overflow-hidden max-h-[90vh] flex flex-col`}>
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/70">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="flex flex-col gap-1 text-left">
    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{label}</span>
    {children}
  </label>
);

export const inputClass =
  'rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3 py-2 text-zinc-200 placeholder-zinc-600 focus:border-purple-400 focus:outline-none';
