import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, BookOpen, Star, AlertCircle, Sparkles, CheckSquare, RotateCcw } from 'lucide-react';

export const AICalendar: React.FC = () => {
  const { aiCalendar, generateStudyCalendar, user } = useApp();
  
  const [routine, setRoutine] = useState(aiCalendar.routine || '');
  const [hours, setHours] = useState(aiCalendar.hours || '4');
  const [availability, setAvailability] = useState(aiCalendar.availability || '3 vezes na semana');
  const [goal, setGoal] = useState(aiCalendar.goal || 'Dominar solos de rock e harmonia');
  const [isLoading, setIsLoading] = useState(false);

  // Controle de dias concluídos do cronograma gerado (local para interatividade rápida)
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (routine.trim() === '' || goal.trim() === '') return;

    setIsLoading(true);
    // Simula tempo de processamento da IA
    setTimeout(() => {
      generateStudyCalendar(routine, hours, availability, goal);
      setIsLoading(false);
      setCompletedDays([]);
    }, 1500);
  };

  const toggleDayComplete = (dia: string) => {
    setCompletedDays(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia) 
        : [...prev, dia]
    );
  };

  const resetCalendar = () => {
    // Apenas limpa localmente para permitir refazer
    setRoutine('');
    setHours('4');
    setAvailability('3 vezes na semana');
    setGoal('');
  };

  return (
    <div className="w-full flex flex-col gap-6" id="ai-calendar-root">
      
      {/* SEÇÃO PRINCIPAL - FORMULÁRIO OU RESULTADO */}
      {!aiCalendar.generatedSchedule ? (
        
        // FORMULÁRIO DE INPUT DO ALUNO
        <form onSubmit={handleGenerate} className="glass-panel rounded-xl p-5 sm:p-6 border border-zinc-800 flex flex-col gap-5">
          <div className="flex items-center gap-2.5 text-cyan-400">
            <Sparkles className="h-5.5 w-5.5 fill-cyan-400/20 animate-pulse" />
            <h3 className="text-base sm:text-lg font-bold font-heading text-white">
              Calendário de Estudos com IA
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed -mt-2">
            Informe sua rotina, tempo livre e objetivos. Nossa Inteligência Artificial musical analisará seus dados e gerará um cronograma personalizado de treinos com focos bem distribuídos para você evoluir mais rápido.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campo: Rotina diária */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300">Minha Rotina Diária</label>
              <input 
                type="text"
                value={routine}
                onChange={(e) => setRoutine(e.target.value)}
                placeholder="Ex: Trabalho das 8h às 18h, faculdade à noite"
                className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
                required
                id="input-ai-routine"
              />
            </div>

            {/* Campo: Objetivo principal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300">Meu Objetivo Musical Principal</label>
              <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: Dominar dedilhado, aprender a improvisar blues"
                className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 placeholder-zinc-500 focus:border-cyan-400 focus:outline-none transition"
                required
                id="input-ai-goal"
              />
            </div>

            {/* Campo: Horas disponíveis */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300">Disponibilidade Semanal de Estudo</label>
              <select 
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 focus:border-cyan-400 focus:outline-none"
                id="select-ai-hours"
              >
                <option value="2">2 horas por semana (Pouco tempo)</option>
                <option value="4">4 horas por semana (Ideal Iniciante)</option>
                <option value="7">7 horas por semana (Constante e sólido)</option>
                <option value="10">10+ horas por semana (Foco Profissional)</option>
              </select>
            </div>

            {/* Campo: Frequência ideal */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-zinc-300">Como prefere distribuir os estudos?</label>
              <select 
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="rounded-lg bg-zinc-950 border border-zinc-800 text-xs px-3.5 py-2 text-zinc-200 focus:border-cyan-400 focus:outline-none"
                id="select-ai-frequency"
              >
                <option value="3 vezes na semana">3 vezes na semana (Seg / Qua / Sex)</option>
                <option value="4 vezes na semana">4 vezes na semana (Dia sim, Dia não)</option>
                <option value="finais de semana">Finais de Semana (Treinos longos de sábado/domingo)</option>
                <option value="diária">Treino diário (Todo dia um pouco - Altamente Recomendado)</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full sm:w-auto self-end bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-zinc-950 font-extrabold text-xs px-6 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition duration-300 focus:outline-none disabled:opacity-50"
            id="btn-generate-ai-calendar"
          >
            {isLoading ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                Analisando rotina com IA musical...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-zinc-950" />
                Gerar Meu Cronograma de Estudos (+75XP)
              </>
            )}
          </button>
        </form>

      ) : (

        // CRONOGRAMA GERADO PELA IA
        <div className="flex flex-col gap-6 animate-fade-in" id="ai-calendar-result">
          
          {/* Resumo da IA */}
          <div className="glass-panel rounded-xl p-5 border border-zinc-850 bg-cyan-950/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-2xl" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 flex items-center justify-center rounded-lg shadow-inner">
                  <Sparkles className="h-5 w-5 fill-cyan-400/20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cronograma IA Ativo</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Mapeado para {user?.name} | Objetivo: {aiCalendar.goal}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-semibold px-3 py-1 rounded">
                  Tempo total: {aiCalendar.generatedSchedule.tempoTreino}
                </div>
                <div className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-semibold px-3 py-1 rounded">
                  Frequência: {aiCalendar.generatedSchedule.frequenciaRecomendada}
                </div>
                <button 
                  onClick={resetCalendar}
                  className="bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition"
                  title="Refazer perguntas da IA"
                  id="btn-reset-ai-calendar"
                >
                  <RotateCcw className="h-3 w-3" />
                  Refazer
                </button>
              </div>
            </div>

            {/* Balão de Dicas da IA */}
            <div className="mt-4 p-3 bg-zinc-950/80 border border-zinc-900 rounded-lg text-xs leading-relaxed text-zinc-300 flex items-start gap-2.5">
              <AlertCircle className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cyan-400">Dica da IA do Músico: </span>
                {aiCalendar.generatedSchedule.dicaIA}
              </div>
            </div>
          </div>

          {/* Divisão: Metas da Semana e Cronograma Diário */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Metas Semanais */}
            <div className="lg:col-span-1 glass-panel rounded-xl p-5 border border-zinc-850 h-fit">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3 mb-3">
                <Star className="h-4 w-4 text-purple-400 fill-purple-400/20" />
                Metas Semanais
              </h4>
              <ul className="flex flex-col gap-3">
                {aiCalendar.generatedSchedule.metasSemanais.map((meta: string, index: number) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
                    <span className="flex-none h-5 w-5 bg-purple-950/50 border border-purple-500/20 text-purple-400 rounded-full flex items-center justify-center font-mono font-bold text-[10px]">
                      {index + 1}
                    </span>
                    <span>{meta}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cronograma de Dias */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Calendar className="h-4 w-4 text-cyan-400" />
                Divisão Diária de Estudos
              </h4>

              <div className="flex flex-col gap-3">
                {aiCalendar.generatedSchedule.cronograma.map((item: any) => {
                  const isDone = completedDays.includes(item.dia);
                  return (
                    <div 
                      key={item.dia} 
                      className={`glass-panel border rounded-xl p-4 transition-all duration-300 flex flex-col sm:flex-row justify-between gap-4 ${
                        item.estudar 
                          ? isDone 
                            ? 'border-green-500/30 bg-green-950/5 opacity-80' 
                            : 'border-zinc-800 hover:border-zinc-700' 
                          : 'border-zinc-900 bg-zinc-950/20 opacity-70'
                      }`}
                    >
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-white">{item.dia}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase ${
                            item.estudar 
                              ? 'bg-purple-950/50 border border-purple-500/25 text-purple-400' 
                              : 'bg-zinc-950 border border-zinc-800 text-zinc-500'
                          }`}>
                            {item.estudar ? `ESTUDAR • ${item.tempoTotal}` : 'DESCANSO'}
                          </span>
                          {item.estudar && (
                            <span className="text-[10px] text-zinc-400 font-medium">
                              Foco: {item.foco}
                            </span>
                          )}
                        </div>

                        {/* Detalhes de Tarefas do Dia se for Dia de Estudar */}
                        {item.estudar && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-zinc-900/60 pt-2.5">
                            {item.divisao.map((div: any, i: number) => (
                              <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                                <Clock className="h-3 w-3 text-cyan-400 flex-shrink-0" />
                                <span className="font-mono text-zinc-500 text-[10px]">{div.tempo}</span>
                                <span className="line-clamp-1">{div.tarefa}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {!item.estudar && (
                          <div className="mt-1 text-xs text-zinc-500">
                            Dia importante de recuperação fisiológica e reflexão.
                          </div>
                        )}
                      </div>

                      {/* Checkbox de dia concluído */}
                      {item.estudar && (
                        <div className="flex-none self-end sm:self-center">
                          <button
                            onClick={() => toggleDayComplete(item.dia)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition focus:outline-none ${
                              isDone
                                ? 'bg-green-950/40 border-green-500/30 text-green-400'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/80'
                            }`}
                            id={`btn-complete-day-${item.dia.toLowerCase()}`}
                          >
                            <CheckSquare className={`h-4 w-4 ${isDone ? 'fill-green-950 text-green-400' : ''}`} />
                            <span>{isDone ? 'Concluído!' : 'Marcar Treinado'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      )}

    </div>
  );
};
export default AICalendar;
