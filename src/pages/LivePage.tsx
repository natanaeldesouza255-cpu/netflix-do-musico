import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { livesData, LiveSession } from '../data/mockData';
import { Watermark } from '../components/Watermark';
import { 
  Radio, 
  Send, 
  Calendar, 
  Play, 
  MessageSquare, 
  Users, 
  Clock, 
  Sparkles,
  Lock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  userName: string;
  userInstrument: string;
  text: string;
  time: string;
}

export const LivePage: React.FC = () => {
  const { user } = useApp();
  const [activeLive, setActiveLive] = useState<LiveSession | null>(
    // Pega o primeiro replay por padrão para simular a visualização de vídeo de live
    livesData.find(l => l.status === 'replay') || null
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', userName: 'Mateus Guitar', userInstrument: 'Guitarrista', text: 'Fala pessoal! Animado pra essa masterclass hoje!', time: '20:00' },
    { id: '2', userName: 'Rodrigo Batera', userInstrument: 'Baterista', text: 'Salve galera da música! Timbre tá absurdo!', time: '20:01' },
    { id: '3', userName: 'Mari Bass', userInstrument: 'Baixista', text: 'Esse reverb do pedal dele é impressionante kkkkk', time: '20:01' }
  ]);

  const [myMessage, setMyMessage] = useState('');
  
  // Agenda e Replays
  const scheduledLives = livesData.filter(l => l.status === 'scheduled');
  const replayLives = livesData.filter(l => l.status === 'replay');

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // SIMULADOR DE CHAT DA LIVE EM TEMPO REAL (MOCK CHAT FEED)
  useEffect(() => {
    const randomComments = [
      { name: 'Arthur Drum', inst: 'Baterista', text: 'Qual o driver de som que você tá usando no Reaper?' },
      { name: 'Carol Violão', inst: 'Violonista', text: 'Que técnica limpa, inspiração pura!' },
      { name: 'Danilo Mix', inst: 'Produtor', text: 'A compressão paralela no barramento de bateria faz milagre.' },
      { name: 'Aline Voice', inst: 'Cantora', text: 'Qual interface de áudio você recomenda de entrada?' },
      { name: 'Bruno Shred', inst: 'Guitarrista', text: 'Esses arpejos são surreais de velozes' },
      { name: 'Gabi Bass', inst: 'Baixista', text: 'Focusrite Scarleet 2i2 Gen 4 é braba demais, uso e recomendo!' }
    ];

    const interval = setInterval(() => {
      // Sorteia um comentário
      const randomItem = randomComments[Math.floor(Math.random() * randomComments.length)];
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newMsg: ChatMessage = {
        id: `chat-${Date.now()}-${Math.random()}`,
        userName: randomItem.name,
        userInstrument: randomItem.inst,
        text: randomItem.text,
        time: timeStr
      };

      setChatMessages(prev => [...prev, newMsg].slice(-25)); // Limita a 25 msgs na DOM
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Scroll automático do chat para o último comentário
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || myMessage.trim() === '') return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `my-${Date.now()}`,
      userName: user.name,
      userInstrument: user.instrument,
      text: myMessage.trim(),
      time: timeStr
    };

    setChatMessages(prev => [...prev, newMsg]);
    setMyMessage('');
  };

  const handleSelectLive = (live: LiveSession) => {
    if (live.status === 'replay') {
      setActiveLive(live);
    } else {
      alert(`Esta live está agendada para ${live.date} às ${live.time}. Um link de acesso VIP privado será enviado por e-mail para você 15 minutos antes do início!`);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 flex flex-col gap-8" id="live-page-root">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
        <div>
          <h2 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Radio className="h-5.5 w-5.5 text-purple-500 animate-pulse" />
            Transmissões & Mentorias Privadas
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Assista a mentorias coletivas, tire dúvidas em tempo real e assista aos replays das transmissões de estúdio passadas.
          </p>
        </div>
      </div>

      {/* GRADE PRINCIPAL: PLAYER DE LIVE E CHAT INTEGRADO */}
      {activeLive && (
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Esquerda: Player de Vídeo da Live */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
              {activeLive.videoUrl ? (
                <iframe 
                  src={`${activeLive.videoUrl}?autoplay=1&modestbranding=1&controls=0`} 
                  title={activeLive.title}
                  className="w-full h-full object-cover"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-2 p-6 text-center">
                  <Lock className="h-10 w-10 text-zinc-600 mb-2" />
                  <p className="text-sm font-bold text-white">Live VIP Agendada</p>
                  <p className="text-xs">Esta live ainda não iniciou. Inicia em {activeLive.date} às {activeLive.time}.</p>
                </div>
              )}

              {/* MARCA D'ÁGUA DINÂMICA INTEGRADA (PROTEÇÃO DA LIVE) */}
              <Watermark />

              {/* Badge indicando status */}
              <span className="absolute top-4 left-4 bg-red-600 border border-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 font-mono uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                SIMULADO AO VIVO
              </span>
            </div>

            {/* Descrição da Mentoria */}
            <div className="glass-panel border border-zinc-800 rounded-2xl p-4.5 text-left">
              <span className="text-[10px] bg-purple-950/50 border border-purple-500/25 text-purple-400 px-2 py-0.5 rounded font-mono uppercase">
                Apresentado por {activeLive.presenter}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide mt-2">
                {activeLive.title}
              </h3>
            </div>

          </div>

          {/* Coluna Direita: Caixa de Chat da Live Reativa */}
          <div className="lg:col-span-1 glass-panel border border-zinc-800 rounded-2xl flex flex-col h-[400px] lg:h-auto overflow-hidden">
            
            {/* Cabeçalho do Chat */}
            <div className="p-3 bg-zinc-950/60 border-b border-zinc-900 flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                Chat da Mentoria (Ao Vivo)
              </span>
              <div className="flex items-center gap-1 text-[10px] bg-cyan-950 border border-cyan-500/25 text-cyan-400 px-2 py-0.5 rounded-full font-mono font-semibold">
                <Users className="h-3 w-3" />
                124 online
              </div>
            </div>

            {/* Conteúdo de Mensagens */}
            <div 
              ref={chatContainerRef}
              className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 no-scrollbar bg-zinc-950/20"
            >
              {chatMessages.map(msg => (
                <div key={msg.id} className="text-left text-xs leading-relaxed">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-extrabold text-zinc-200">{msg.userName}</span>
                    <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-500 px-1.5 py-0.1 rounded font-mono uppercase">
                      {msg.userInstrument}
                    </span>
                    <span className="text-[9px] text-zinc-650 font-mono ml-auto">{msg.time}</span>
                  </div>
                  <p className="text-zinc-400 mt-1 leading-normal">
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Enviar Mensagem */}
            {user && (
              <form 
                onSubmit={handleSendMessage}
                className="p-3 bg-zinc-950/60 border-t border-zinc-900 flex gap-2 items-center flex-shrink-0"
              >
                <input 
                  type="text"
                  value={myMessage}
                  onChange={(e) => setMyMessage(e.target.value)}
                  placeholder="Envie sua pergunta pro chat VIP..."
                  className="flex-grow rounded-lg bg-zinc-900 border border-zinc-800 text-xs px-3 py-2 text-zinc-200 placeholder-zinc-500 focus:border-purple-400 focus:outline-none"
                  id="input-live-chat-message"
                />
                <button
                  type="submit"
                  className="flex-none p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg focus:outline-none transition"
                  id="btn-send-live-chat"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}

          </div>

        </section>
      )}

      {/* AGENDA E HISTÓRICO DE REPLAY */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        
        {/* Agenda de Mentorias Próximas */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-cyan-400" />
            Agenda de Mentorias Coletivas
          </h3>

          <div className="flex flex-col gap-3">
            {scheduledLives.map(live => (
              <div 
                key={live.id}
                onClick={() => handleSelectLive(live)}
                className="glass-panel border border-zinc-900 hover:border-zinc-800 rounded-xl p-4 flex justify-between items-center gap-4 cursor-pointer hover:scale-[1.01] transition-all"
                id={`live-sched-${live.id}`}
              >
                <div className="text-left flex flex-col gap-1">
                  <h4 className="text-xs font-bold text-white leading-normal line-clamp-1">{live.title}</h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Com {live.presenter}</span>
                </div>
                <div className="flex-none text-right flex flex-col gap-1">
                  <span className="text-[10px] bg-cyan-950 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-mono font-semibold">
                    {live.date}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono flex items-center justify-end gap-1">
                    <Clock className="h-3 w-3" />
                    {live.time}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catálogo de Replays Gravados */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono border-b border-zinc-900 pb-2 flex items-center gap-1.5">
            <Play className="h-4 w-4 text-purple-400 fill-purple-400/15" />
            Replays Gravados de Lives Passadas
          </h3>

          <div className="flex flex-col gap-3">
            {replayLives.map(live => (
              <div 
                key={live.id}
                onClick={() => handleSelectLive(live)}
                className={`glass-panel border rounded-xl p-4 flex justify-between items-center gap-4 cursor-pointer hover:scale-[1.01] transition-all ${
                  activeLive?.id === live.id 
                    ? 'border-purple-500/50 bg-purple-950/5' 
                    : 'border-zinc-900 hover:border-zinc-800'
                }`}
                id={`live-replay-${live.id}`}
              >
                <div className="text-left flex flex-col gap-1">
                  <h4 className={`text-xs font-bold leading-normal line-clamp-1 ${activeLive?.id === live.id ? 'text-purple-400' : 'text-white'}`}>
                    {live.title}
                  </h4>
                  <span className="text-[10px] text-zinc-500 font-mono">Com {live.presenter}</span>
                </div>
                <div className="flex-none text-right flex flex-col gap-1">
                  <span className="text-[10px] bg-purple-950/40 border border-purple-500/20 text-purple-400 px-2.5 py-0.5 rounded font-mono font-bold flex items-center gap-1 justify-end">
                    <Sparkles className="h-3 w-3" />
                    Assista Replay
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">Gravado {live.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
export default LivePage;
