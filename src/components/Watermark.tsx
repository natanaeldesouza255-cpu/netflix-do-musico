import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

export const Watermark: React.FC = () => {
  const { user } = useApp();
  const [position, setPosition] = useState({ top: '20%', left: '10%' });

  useEffect(() => {
    // Muda a posição da marca d'água a cada 6 segundos para evitar gravações estáticas
    const interval = setInterval(() => {
      const randomTop = Math.floor(Math.random() * 65) + 15; // De 15% a 80%
      const randomLeft = Math.floor(Math.random() * 65) + 10; // De 10% a 75%
      setPosition({
        top: `${randomTop}%`,
        left: `${randomLeft}%`
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  return (
    <div 
      className="absolute pointer-events-none select-none z-50 text-[10px] sm:text-xs font-mono font-bold text-white/10 dark:text-white/8 transition-all duration-1000 ease-in-out bg-black/10 px-2 py-1 rounded border border-white/5 whitespace-nowrap"
      style={{
        top: position.top,
        left: position.left,
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
      }}
    >
      🛡️ PLATAFORMA PROTEGIDA: {user.name} | {user.email} | ID: {user.id}
    </div>
  );
};
export default Watermark;
