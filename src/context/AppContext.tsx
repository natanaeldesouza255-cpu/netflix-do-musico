import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Lesson, 
  Equipment, 
  LiveSession, 
  MarketplaceItem, 
  CommunityPost, 
  initialPosts, 
  lessonsData, 
  equipmentsData 
} from '../data/mockData';

// Definição do Perfil de Usuário
export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  instrument: string;
  level: string;
  bio: string;
  xp: number;
}

export type ScreenName = 
  | 'PublicHome' 
  | 'Login' 
  | 'MemberHome' 
  | 'CategoryPage' 
  | 'CommunityPage' 
  | 'EquipmentReviews' 
  | 'StudentProfile' 
  | 'LivePage' 
  | 'MarketplacePage';

interface AppContextType {
  user: StudentProfile | null;
  isSubscriber: boolean;
  currentScreen: ScreenName;
  screenParams: any;
  historyStack: { screen: ScreenName; params: any }[];
  watchedHistory: string[]; // ids de aulas assistidas recentemente
  completedLessons: string[]; // ids de aulas concluídas
  favoriteLessons: string[]; // ids de aulas favoritas
  favoriteEquipments: string[]; // ids de equipamentos favoritos
  communityFeed: CommunityPost[];
  equipments: Equipment[];
  aiCalendar: {
    routine: string;
    hours: string;
    availability: string;
    goal: string;
    generatedSchedule: any | null;
  };
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  navigateTo: (screen: ScreenName, params?: any) => void;
  goBack: () => void;
  loginUser: (email: string, password: string) => boolean;
  logoutUser: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleLessonFavorite: (lessonId: string) => void;
  toggleEquipmentFavorite: (eqId: string) => void;
  addToWatchedHistory: (lessonId: string) => void;
  createNewPost: (content: string, videoUrl?: string) => void;
  likePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => void;
  addCommentToEquipment: (eqId: string, rating: number, text: string) => void;
  generateStudyCalendar: (routine: string, hours: string, availability: string, goal: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicializa Estados a partir do LocalStorage ou Padrões
  const [user, setUser] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem('ndm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isSubscriber, setIsSubscriber] = useState<boolean>(() => {
    return localStorage.getItem('ndm_isSubscriber') === 'true';
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    return (localStorage.getItem('ndm_currentScreen') as ScreenName) || 'PublicHome';
  });

  const [screenParams, setScreenParams] = useState<any>(() => {
    const saved = localStorage.getItem('ndm_screenParams');
    return saved ? JSON.parse(saved) : null;
  });

  const [historyStack, setHistoryStack] = useState<{ screen: ScreenName; params: any }[]>(() => {
    const saved = localStorage.getItem('ndm_historyStack');
    return saved ? JSON.parse(saved) : [];
  });

  const [watchedHistory, setWatchedHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('ndm_watchedHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('ndm_completedLessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteLessons, setFavoriteLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('ndm_favoriteLessons');
    return saved ? JSON.parse(saved) : [];
  });

  const [favoriteEquipments, setFavoriteEquipments] = useState<string[]>(() => {
    const saved = localStorage.getItem('ndm_favoriteEquipments');
    return saved ? JSON.parse(saved) : [];
  });

  const [communityFeed, setCommunityFeed] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('ndm_communityFeed');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('ndm_equipments');
    return saved ? JSON.parse(saved) : equipmentsData;
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [aiCalendar, setAiCalendar] = useState(() => {
    const saved = localStorage.getItem('ndm_aiCalendar');
    return saved ? JSON.parse(saved) : {
      routine: '',
      hours: '',
      availability: '',
      goal: '',
      generatedSchedule: null
    };
  });

  // Salvar estados reativos no LocalStorage quando alterados
  useEffect(() => {
    if (user) {
      localStorage.setItem('ndm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ndm_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ndm_isSubscriber', String(isSubscriber));
  }, [isSubscriber]);

  useEffect(() => {
    localStorage.setItem('ndm_currentScreen', currentScreen);
    if (screenParams) {
      localStorage.setItem('ndm_screenParams', JSON.stringify(screenParams));
    } else {
      localStorage.removeItem('ndm_screenParams');
    }
  }, [currentScreen, screenParams]);

  useEffect(() => {
    localStorage.setItem('ndm_historyStack', JSON.stringify(historyStack));
  }, [historyStack]);

  useEffect(() => {
    localStorage.setItem('ndm_watchedHistory', JSON.stringify(watchedHistory));
  }, [watchedHistory]);

  useEffect(() => {
    localStorage.setItem('ndm_completedLessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('ndm_favoriteLessons', JSON.stringify(favoriteLessons));
  }, [favoriteLessons]);

  useEffect(() => {
    localStorage.setItem('ndm_favoriteEquipments', JSON.stringify(favoriteEquipments));
  }, [favoriteEquipments]);

  useEffect(() => {
    localStorage.setItem('ndm_communityFeed', JSON.stringify(communityFeed));
  }, [communityFeed]);

  useEffect(() => {
    localStorage.setItem('ndm_equipments', JSON.stringify(equipments));
  }, [equipments]);

  useEffect(() => {
    localStorage.setItem('ndm_aiCalendar', JSON.stringify(aiCalendar));
  }, [aiCalendar]);

  // NAVEGAÇÃO REATIVA (Pilha de histórico)
  const navigateTo = (screen: ScreenName, params: any = null) => {
    setHistoryStack(prev => [...prev, { screen: currentScreen, params: screenParams }]);
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack(prevStack => prevStack.slice(0, prevStack.length - 1));
      setCurrentScreen(prev.screen);
      setScreenParams(prev.params);
    } else {
      // Fallback padrão se a pilha estiver vazia
      setCurrentScreen(isSubscriber ? 'MemberHome' : 'PublicHome');
    }
  };

  // AUTENTICAÇÃO MOCK
  const loginUser = (email: string, password: string): boolean => {
    // Qualquer e-mail e senha funcionam, mas se for o oficial 'aluno@musico.com' damos um perfil completo
    if (email.trim() !== '' && password.length >= 6) {
      const defaultUser: StudentProfile = {
        id: 'user-789',
        name: email.split('@')[0].toUpperCase(),
        email: email,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
        instrument: 'Violão & Guitarra',
        level: 'Mediano',
        bio: 'Músico apaixonado por rock dos anos 80, gravando minhas próprias produções no Reaper e sonhando em lançar meu primeiro EP.',
        xp: 1250
      };
      setUser(defaultUser);
      setIsSubscriber(true);
      setCurrentScreen('MemberHome');
      setHistoryStack([]);
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setUser(null);
    setIsSubscriber(false);
    setCurrentScreen('PublicHome');
    setHistoryStack([]);
    setWatchedHistory([]);
    setCompletedLessons([]);
    setFavoriteLessons([]);
    setFavoriteEquipments([]);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setUser(prev => prev ? { ...prev, ...updated } : null);
  };

  // PROGRESSO & COMPLEMENTOS
  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => {
      const index = prev.indexOf(lessonId);
      if (index > -1) {
        // Remover conclusão e tirar XP
        if (user) updateProfile({ xp: Math.max(0, user.xp - 100) });
        return prev.filter(id => id !== lessonId);
      } else {
        // Adicionar conclusão e dar XP
        if (user) updateProfile({ xp: user.xp + 100 });
        return [...prev, lessonId];
      }
    });
  };

  const toggleLessonFavorite = (lessonId: string) => {
    setFavoriteLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };

  const toggleEquipmentFavorite = (eqId: string) => {
    setFavoriteEquipments(prev => 
      prev.includes(eqId) 
        ? prev.filter(id => id !== eqId) 
        : [...prev, eqId]
    );
  };

  const addToWatchedHistory = (lessonId: string) => {
    setWatchedHistory(prev => {
      const filtered = prev.filter(id => id !== lessonId);
      return [lessonId, ...filtered].slice(0, 10); // Histórico dos últimos 10
    });
  };

  // FEED DA COMUNIDADE
  const createNewPost = (content: string, videoUrl?: string) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: user.name,
      authorInstrument: user.instrument,
      authorLevel: user.level,
      authorAvatar: user.avatar,
      content,
      videoUrl: videoUrl || undefined,
      likes: 0,
      comments: [],
      date: 'Agora mesmo'
    };
    setCommunityFeed(prev => [newPost, ...prev]);
    // Ganha XP ao postar evolução!
    updateProfile({ xp: user.xp + 50 });
  };

  const likePost = (postId: string) => {
    setCommunityFeed(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 } 
          : post
      )
    );
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!user) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userName: user.name,
      userInstrument: user.instrument,
      content: commentText,
      date: 'Agora mesmo'
    };
    setCommunityFeed(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, comments: [...post.comments, newComment] } 
          : post
      )
    );
  };

  // REVIEWS DE EQUIPAMENTOS
  const addCommentToEquipment = (eqId: string, rating: number, text: string) => {
    if (!user) return;
    const newComment = {
      user: user.name,
      text,
      rating
    };
    setEquipments(prev => 
      prev.map(eq => 
        eq.id === eqId 
          ? { 
              ...eq, 
              comments: [...eq.comments, newComment],
              // Recalcula média de estrelas
              rating: Number(((eq.comments.reduce((acc, c) => acc + c.rating, 0) + rating) / (eq.comments.length + 1)).toFixed(1))
            } 
          : eq
      )
    );
  };

  // CRONOGRAMA DE ESTUDOS IA (MOCK ALGORITMO)
  const generateStudyCalendar = (routine: string, hours: string, availability: string, goal: string) => {
    // Organiza um cronograma dinâmico baseado em inputs
    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    
    // Constrói metas com base na rotina e tempo disponível
    const hrs = parseInt(hours) || 4;
    const minDiarios = Math.round((hrs * 60) / (availability.toLowerCase() === 'diária' ? 7 : availability.toLowerCase() === 'finais de semana' ? 2 : 4));

    const agenda: any[] = [];
    
    dias.forEach((dia, index) => {
      // Decidir se estuda nesse dia
      let treina = false;
      if (availability.toLowerCase() === 'diária') treina = true;
      else if (availability.toLowerCase() === 'finais de semana' && (dia === 'Sábado' || dia === 'Domingo')) treina = true;
      else if (availability.toLowerCase() === '3 vezes na semana' && (index === 0 || index === 2 || index === 4)) treina = true;
      else if (availability.toLowerCase() === '4 vezes na semana' && (index === 0 || index === 1 || index === 3 || index === 4)) treina = true;

      if (treina) {
        // Sequência didática simulada: Técnica -> Teoria -> Repertório -> Criatividade/Gravação
        const tempoTec = Math.round(minDiarios * 0.3);
        const tempoTeo = Math.round(minDiarios * 0.2);
        const tempoRep = Math.round(minDiarios * 0.4);
        const tempoCri = Math.round(minDiarios * 0.1);

        agenda.push({
          dia,
          estudar: true,
          foco: index % 2 === 0 ? 'Técnica e Repertório' : 'Teoria e Produção',
          tempoTotal: `${minDiarios} min`,
          divisao: [
            { tarefa: 'Aquecimento e Técnica Dedos', tempo: `${tempoTec} min` },
            { tarefa: `Estudo de Teoria / Harmonias para ${goal}`, tempo: `${tempoTeo} min` },
            { tarefa: 'Aplicação prática no Repertório', tempo: `${tempoRep} min` },
            { tarefa: 'Gravação de evolução ou Improviso', tempo: `${tempoCri} min` }
          ]
        });
      } else {
        agenda.push({
          dia,
          estudar: false,
          foco: 'Descanso e Audição Ativa',
          tempoTotal: '0 min',
          divisao: [
            { tarefa: 'Ouvir discos novos de referência', tempo: '15 min' },
            { tarefa: 'Descanso de articulações e ouvidos', tempo: 'Completo' }
          ]
        });
      }
    });

    const metasSemanais = [
      `Aumentar velocidade de treino em 5 BPM utilizando metrônomo`,
      `Gravar 1 vídeo de evolução no final de semana para postar na Comunidade`,
      `Concluir pelo menos 2 aulas na categoria escolhida`
    ];

    setAiCalendar({
      routine,
      hours,
      availability,
      goal,
      generatedSchedule: {
        cronograma: agenda,
        metasSemanais,
        tempoTreino: `${hrs} horas por semana`,
        frequenciaRecomendada: `${availability}`,
        dicaIA: `Músico, dado seu objetivo de '${goal}', nossa IA recomenda focar os primeiros 10 minutos de cada sessão exclusivamente em micro-treinos de técnica lenta no metrônomo para solidificar postura. Não pule o dia de descanso auditivo!`
      }
    });

    if (user) {
      updateProfile({ xp: user.xp + 75 });
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      isSubscriber,
      currentScreen,
      screenParams,
      historyStack,
      watchedHistory,
      completedLessons,
      favoriteLessons,
      favoriteEquipments,
      communityFeed,
      equipments,
      aiCalendar,
      searchQuery,
      setSearchQuery,
      navigateTo,
      goBack,
      loginUser,
      logoutUser,
      updateProfile,
      toggleLessonComplete,
      toggleLessonFavorite,
      toggleEquipmentFavorite,
      addToWatchedHistory,
      createNewPost,
      likePost,
      addCommentToPost,
      addCommentToEquipment,
      generateStudyCalendar
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado com um AppProvider');
  }
  return context;
};
