import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  Lesson,
  Equipment,
  LiveSession,
  MarketplaceItem,
  CommunityPost,
  Course,
  CourseModule,
  PublishStatus,
  MusicCategory,
  MusicLevel,
} from '../data/mockData';
import { TEST_ACCOUNTS } from '../config/credentials';
import { loadJSON, saveJSON, uid, nowLabel } from '../lib/storage';
import { supabase } from '../lib/supabase';
import {
  ActivityLog,
  ManagedUser,
  PaymentRecord,
  PlatformSettings,
  buildSeedCatalog,
  defaultAdminProfile,
  defaultSettings,
  defaultStudentProfile,
  seedActivities,
  seedCommunity,
  seedEquipments,
  seedLives,
  seedMarketplace,
  seedPayments,
  seedStudents,
} from '../data/seedPlatform';

export type UserRole = 'student' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  instrument: string;
  level: string;
  bio: string;
  xp: number;
  role: UserRole;
  status?: 'active' | 'inactive';
  subscriptionStatus?: 'active' | 'cancelled' | 'pending' | 'overdue';
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
  | 'MarketplacePage'
  | 'AdminDashboard'
  | 'AdminCourses'
  | 'AdminModulesLessons'
  | 'AdminCourseEditor'
  | 'AdminStudents'
  | 'AdminStudentDetail'
  | 'AdminFinance'
  | 'AdminLives'
  | 'AdminCommunity'
  | 'AdminMarketplace'
  | 'AdminEquipment'
  | 'AdminSettings';

export const ADMIN_SCREENS: ScreenName[] = [
  'AdminDashboard',
  'AdminCourses',
  'AdminModulesLessons',
  'AdminCourseEditor',
  'AdminStudents',
  'AdminStudentDetail',
  'AdminFinance',
  'AdminLives',
  'AdminCommunity',
  'AdminMarketplace',
  'AdminEquipment',
  'AdminSettings',
];

export function isAdminScreen(screen: ScreenName) {
  return ADMIN_SCREENS.includes(screen);
}

export interface ToastState {
  type: 'success' | 'error';
  message: string;
}

interface AppContextType {
  user: StudentProfile | null;
  isSubscriber: boolean;
  currentScreen: ScreenName;
  screenParams: any;
  historyStack: { screen: ScreenName; params: any }[];
  watchedHistory: string[];
  completedLessons: string[];
  favoriteLessons: string[];
  favoriteEquipments: string[];
  communityFeed: CommunityPost[];
  equipments: Equipment[];
  catalogLessons: Lesson[];
  courses: Course[];
  modules: CourseModule[];
  lives: LiveSession[];
  marketplaceItems: MarketplaceItem[];
  students: ManagedUser[];
  payments: PaymentRecord[];
  settings: PlatformSettings;
  activities: ActivityLog[];
  toast: ToastState | null;
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
  reportPost: (postId: string) => void;
  showToast: (type: ToastState['type'], message: string) => void;
  clearToast: () => void;
  publishedLessons: Lesson[];
  publishedCourses: Course[];
  saveCourse: (input: Partial<Course> & { title: string }) => string;
  deleteCourse: (courseId: string) => void;
  toggleCoursePublish: (courseId: string) => void;
  saveModule: (input: Partial<CourseModule> & { courseId: string; name: string }) => string;
  deleteModule: (moduleId: string) => void;
  moveModule: (moduleId: string, direction: 'up' | 'down') => void;
  saveLesson: (input: Partial<Lesson> & { title: string; courseId: string; moduleId: string }) => string;
  deleteLesson: (lessonId: string) => void;
  moveLesson: (lessonId: string, direction: 'up' | 'down') => void;
  toggleLessonPublish: (lessonId: string) => void;
  saveLive: (input: Partial<LiveSession> & { title: string }) => string;
  deleteLive: (liveId: string) => void;
  saveMarketplaceItem: (input: Partial<MarketplaceItem> & { name: string }) => string;
  deleteMarketplaceItem: (itemId: string) => void;
  saveEquipment: (input: Partial<Equipment> & { name: string }) => string;
  deleteEquipment: (eqId: string) => void;
  deleteCommunityPost: (postId: string) => void;
  setPostModeration: (postId: string, status: CommunityPost['moderationStatus']) => void;
  saveStudent: (input: Partial<ManagedUser> & { id?: string }) => void;
  toggleStudentStatus: (studentId: string) => void;
  saveSettings: (updated: Partial<PlatformSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const seedCatalog = buildSeedCatalog();

function moveByOrder<T extends { id: string; order: number }>(items: T[], id: string, direction: 'up' | 'down'): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((item) => item.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= sorted.length) return items;
  const current = sorted[index];
  const neighbor = sorted[swapIndex];
  return items.map((item) => {
    if (item.id === current.id) return { ...item, order: neighbor.order };
    if (item.id === neighbor.id) return { ...item, order: current.order };
    return item;
  });
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(() => {
    const saved = loadJSON<StudentProfile | null>('user', null);
    if (saved && !saved.role) return { ...saved, role: 'student' };
    return saved;
  });
  const [isSubscriber, setIsSubscriber] = useState<boolean>(() => loadJSON('isSubscriber', false));
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => loadJSON('currentScreen', 'PublicHome'));
  const [screenParams, setScreenParams] = useState<any>(() => loadJSON('screenParams', null));
  const [historyStack, setHistoryStack] = useState<{ screen: ScreenName; params: any }[]>(() => loadJSON('historyStack', []));
  const [watchedHistory, setWatchedHistory] = useState<string[]>(() => loadJSON('watchedHistory', []));
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => loadJSON('completedLessons', []));
  const [favoriteLessons, setFavoriteLessons] = useState<string[]>(() => loadJSON('favoriteLessons', []));
  const [favoriteEquipments, setFavoriteEquipments] = useState<string[]>(() => loadJSON('favoriteEquipments', []));
  const [communityFeed, setCommunityFeed] = useState<CommunityPost[]>(() => loadJSON('communityFeed', seedCommunity));
  const [equipments, setEquipments] = useState<Equipment[]>(() => loadJSON('equipments', seedEquipments));
  const [catalogLessons, setCatalogLessons] = useState<Lesson[]>(() => loadJSON('catalogLessons', seedCatalog.lessons));
  const [courses, setCourses] = useState<Course[]>(() => loadJSON('courses', seedCatalog.courses));
  const [modules, setModules] = useState<CourseModule[]>(() => loadJSON('modules', seedCatalog.modules));
  const [lives, setLives] = useState<LiveSession[]>(() => loadJSON('lives', seedLives));
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(() => loadJSON('marketplaceItems', seedMarketplace));
  const [students, setStudents] = useState<ManagedUser[]>(() => loadJSON('students', seedStudents));
  const [payments, setPayments] = useState<PaymentRecord[]>(() => loadJSON('payments', seedPayments));
  const [settings, setSettings] = useState<PlatformSettings>(() => {
    const saved = loadJSON<Partial<PlatformSettings>>('settings', defaultSettings);
    return { ...defaultSettings, ...saved, adminMenu: saved.adminMenu || defaultSettings.adminMenu };
  });
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadJSON('activities', seedActivities));
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [aiCalendar, setAiCalendar] = useState(() =>
    loadJSON('aiCalendar', {
      routine: '',
      hours: '',
      availability: '',
      goal: '',
      generatedSchedule: null as any,
    })
  );

  const showToast = (type: ToastState['type'], message: string) => {
    setToast({ type, message });
  };
  const clearToast = () => setToast(null);

  const logActivity = (message: string) => {
    setActivities((prev) => [{ id: uid('act'), message, at: nowLabel() }, ...prev].slice(0, 40));
  };

  useEffect(() => { user ? saveJSON('user', user) : localStorage.removeItem('ndm_user'); }, [user]);
  useEffect(() => { saveJSON('isSubscriber', isSubscriber); }, [isSubscriber]);
  useEffect(() => {
    saveJSON('currentScreen', currentScreen);
    screenParams ? saveJSON('screenParams', screenParams) : localStorage.removeItem('ndm_screenParams');
  }, [currentScreen, screenParams]);
  useEffect(() => { saveJSON('historyStack', historyStack); }, [historyStack]);
  useEffect(() => { saveJSON('watchedHistory', watchedHistory); }, [watchedHistory]);
  useEffect(() => { saveJSON('completedLessons', completedLessons); }, [completedLessons]);
  useEffect(() => { saveJSON('favoriteLessons', favoriteLessons); }, [favoriteLessons]);
  useEffect(() => { saveJSON('favoriteEquipments', favoriteEquipments); }, [favoriteEquipments]);
  useEffect(() => { saveJSON('communityFeed', communityFeed); }, [communityFeed]);
  useEffect(() => { saveJSON('equipments', equipments); }, [equipments]);
  useEffect(() => { saveJSON('catalogLessons', catalogLessons); }, [catalogLessons]);
  useEffect(() => { saveJSON('courses', courses); }, [courses]);
  useEffect(() => { saveJSON('modules', modules); }, [modules]);
  useEffect(() => { saveJSON('lives', lives); }, [lives]);
  useEffect(() => { saveJSON('marketplaceItems', marketplaceItems); }, [marketplaceItems]);
  useEffect(() => { saveJSON('students', students); }, [students]);
  useEffect(() => { saveJSON('payments', payments); }, [payments]);
  useEffect(() => { saveJSON('settings', settings); }, [settings]);
  useEffect(() => { saveJSON('activities', activities); }, [activities]);
  useEffect(() => { saveJSON('aiCalendar', aiCalendar); }, [aiCalendar]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let cancelled = false;

    const loadSettingsFromSupabase = async () => {
      const { data, error } = await client
        .from('platform_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error || !data || cancelled) return;

      setSettings((prev) => ({
        ...prev,
        platformName: data.platform_name,
        tagline: data.tagline,
        supportEmail: data.support_email,
        planName: data.plan_name,
        planPrice: Number(data.plan_price),
        maintenanceMode: data.maintenance_mode,
        allowRegistrations: data.allow_registrations,
        adminMenu: Array.isArray(data.admin_menu) ? data.admin_menu : prev.adminMenu,
      }));
    };

    void loadSettingsFromSupabase();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (user?.role === 'student' && isAdminScreen(currentScreen)) {
      setCurrentScreen('MemberHome');
      setScreenParams(null);
    }
  }, [user, currentScreen]);

  const publishedCourses = useMemo(
    () => [...courses].filter((c) => c.status === 'published').sort((a, b) => a.displayOrder - b.displayOrder),
    [courses]
  );

  const publishedLessons = useMemo(() => {
    const publishedIds = new Set(publishedCourses.map((c) => c.id));
    const validModuleIds = new Set(modules.filter((m) => publishedIds.has(m.courseId)).map((m) => m.id));
    return catalogLessons.filter(
      (lesson) =>
        (lesson.status ?? 'published') === 'published' &&
        (!lesson.courseId || publishedIds.has(lesson.courseId)) &&
        (!lesson.moduleId || validModuleIds.has(lesson.moduleId))
    );
  }, [catalogLessons, publishedCourses, modules]);

  const navigateTo = (screen: ScreenName, params: any = null) => {
    if (user?.role === 'student' && isAdminScreen(screen)) {
      showToast('error', 'Acesso administrativo restrito.');
      return;
    }
    setHistoryStack((prev) => [...prev, { screen: currentScreen, params: screenParams }]);
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const goBack = () => {
    if (historyStack.length > 0) {
      const prev = historyStack[historyStack.length - 1];
      setHistoryStack((prevStack) => prevStack.slice(0, prevStack.length - 1));
      if (user?.role === 'student' && isAdminScreen(prev.screen)) {
        setCurrentScreen('MemberHome');
        setScreenParams(null);
        return;
      }
      setCurrentScreen(prev.screen);
      setScreenParams(prev.params);
    } else {
      setCurrentScreen(user?.role === 'admin' ? 'AdminDashboard' : isSubscriber ? 'MemberHome' : 'PublicHome');
    }
  };

  // Futuro: autenticar via Supabase Auth (signInWithPassword) e carregar role da tabela profiles.
  const loginUser = (email: string, password: string): boolean => {
    const normalized = email.trim().toLowerCase();

    if (normalized === TEST_ACCOUNTS.admin.email && password === TEST_ACCOUNTS.admin.password) {
      setUser({ ...defaultAdminProfile });
      setIsSubscriber(false);
      setCurrentScreen('AdminDashboard');
      setHistoryStack([]);
      showToast('success', 'Bem-vindo ao painel administrativo.');
      return true;
    }

    if (normalized === TEST_ACCOUNTS.student.email && password === TEST_ACCOUNTS.student.password) {
      const stored = students.find((s) => s.email.toLowerCase() === normalized);
      const profile: StudentProfile = stored
        ? {
            id: stored.id,
            name: stored.name,
            email: stored.email,
            avatar: stored.avatar,
            instrument: stored.instrument,
            level: stored.level,
            bio: stored.bio,
            xp: stored.xp,
            role: 'student',
            status: stored.status,
            subscriptionStatus: stored.subscriptionStatus,
          }
        : { ...defaultStudentProfile };
      if (profile.status === 'inactive') {
        showToast('error', 'Esta conta de aluno estÃ¡ desativada.');
        return false;
      }
      setUser(profile);
      setIsSubscriber(true);
      setCurrentScreen('MemberHome');
      setHistoryStack([]);
      showToast('success', 'Login de aluno realizado.');
      return true;
    }
    showToast('error', 'E-mail ou senha inválidos.');
    return false;
  };

  const logoutUser = () => {
    setUser(null);
    setIsSubscriber(false);
    setCurrentScreen('Login');
    setHistoryStack([]);
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
    if (user) {
      setStudents((prev) =>
        prev.map((student) => (student.id === user.id ? { ...student, ...updated } : student))
      );
    }
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const exists = prev.includes(lessonId);
      if (exists) {
        if (user) updateProfile({ xp: Math.max(0, user.xp - 100) });
        return prev.filter((id) => id !== lessonId);
      }
      if (user) updateProfile({ xp: user.xp + 100 });
      const lesson = catalogLessons.find((l) => l.id === lessonId);
      if (lesson?.courseId && user) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student.id === user.id && !student.startedCourseIds.includes(lesson.courseId!)
              ? { ...student, startedCourseIds: [...student.startedCourseIds, lesson.courseId!] }
              : student
          )
        );
      }
      return [...prev, lessonId];
    });
  };

  const toggleLessonFavorite = (lessonId: string) => {
    setFavoriteLessons((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
  };

  const toggleEquipmentFavorite = (eqId: string) => {
    setFavoriteEquipments((prev) =>
      prev.includes(eqId) ? prev.filter((id) => id !== eqId) : [...prev, eqId]
    );
  };

  const addToWatchedHistory = (lessonId: string) => {
    setWatchedHistory((prev) => {
      const filtered = prev.filter((id) => id !== lessonId);
      return [lessonId, ...filtered].slice(0, 10);
    });
  };

  const createNewPost = (content: string, videoUrl?: string) => {
    if (!user) return;
    const newPost: CommunityPost = {
      id: uid('post'),
      authorName: user.name,
      authorInstrument: user.instrument,
      authorLevel: user.level,
      authorAvatar: user.avatar,
      content,
      videoUrl: videoUrl || undefined,
      likes: 0,
      comments: [],
      date: 'Agora mesmo',
      reports: 0,
      moderationStatus: 'visible',
    };
    setCommunityFeed((prev) => [newPost, ...prev]);
    updateProfile({ xp: user.xp + 50 });
    logActivity(`${user.name} publicou na comunidade.`);
  };

  const likePost = (postId: string) => {
    setCommunityFeed((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    );
  };

  const addCommentToPost = (postId: string, commentText: string) => {
    if (!user) return;
    const newComment = {
      id: uid('c'),
      userName: user.name,
      userInstrument: user.instrument,
      content: commentText,
      date: 'Agora mesmo',
    };
    setCommunityFeed((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )
    );
  };

  const reportPost = (postId: string) => {
    setCommunityFeed((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              reports: (post.reports || 0) + 1,
              moderationStatus: 'reported',
            }
          : post
      )
    );
    showToast('success', 'DenÃºncia enviada para moderaÃ§Ã£o.');
  };

  const addCommentToEquipment = (eqId: string, rating: number, text: string) => {
    if (!user) return;
    const newComment = { user: user.name, text, rating };
    setEquipments((prev) =>
      prev.map((eq) =>
        eq.id === eqId
          ? {
              ...eq,
              comments: [...eq.comments, newComment],
              rating: Number(
                ((eq.comments.reduce((acc, c) => acc + c.rating, 0) + rating) / (eq.comments.length + 1)).toFixed(1)
              ),
            }
          : eq
      )
    );
  };

  const generateStudyCalendar = (routine: string, hours: string, availability: string, goal: string) => {
    const dias = ['Segunda-feira', 'TerÃ§a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'SÃ¡bado', 'Domingo'];
    const hrs = parseInt(hours) || 4;
    const minDiarios = Math.round((hrs * 60) / (availability.toLowerCase() === 'diÃ¡ria' ? 7 : availability.toLowerCase() === 'finais de semana' ? 2 : 4));
    const agenda: any[] = [];

    dias.forEach((dia, index) => {
      let treina = false;
      if (availability.toLowerCase() === 'diÃ¡ria') treina = true;
      else if (availability.toLowerCase() === 'finais de semana' && (dia === 'SÃ¡bado' || dia === 'Domingo')) treina = true;
      else if (availability.toLowerCase() === '3 vezes na semana' && (index === 0 || index === 2 || index === 4)) treina = true;
      else if (availability.toLowerCase() === '4 vezes na semana' && (index === 0 || index === 1 || index === 3 || index === 4)) treina = true;

      if (treina) {
        const tempoTec = Math.round(minDiarios * 0.3);
        const tempoTeo = Math.round(minDiarios * 0.2);
        const tempoRep = Math.round(minDiarios * 0.4);
        const tempoCri = Math.round(minDiarios * 0.1);
        agenda.push({
          dia,
          estudar: true,
          foco: index % 2 === 0 ? 'TÃ©cnica e RepertÃ³rio' : 'Teoria e ProduÃ§Ã£o',
          tempoTotal: `${minDiarios} min`,
          divisao: [
            { tarefa: 'Aquecimento e TÃ©cnica Dedos', tempo: `${tempoTec} min` },
            { tarefa: `Estudo de Teoria / Harmonias para ${goal}`, tempo: `${tempoTeo} min` },
            { tarefa: 'AplicaÃ§Ã£o prÃ¡tica no RepertÃ³rio', tempo: `${tempoRep} min` },
            { tarefa: 'GravaÃ§Ã£o de evoluÃ§Ã£o ou Improviso', tempo: `${tempoCri} min` },
          ],
        });
      } else {
        agenda.push({
          dia,
          estudar: false,
          foco: 'Descanso e AudiÃ§Ã£o Ativa',
          tempoTotal: '0 min',
          divisao: [
            { tarefa: 'Ouvir discos novos de referÃªncia', tempo: '15 min' },
            { tarefa: 'Descanso de articulaÃ§Ãµes e ouvidos', tempo: 'Completo' },
          ],
        });
      }
    });

    setAiCalendar({
      routine,
      hours,
      availability,
      goal,
      generatedSchedule: {
        cronograma: agenda,
        metasSemanais: [
          'Aumentar velocidade de treino em 5 BPM utilizando metrÃ´nomo',
          'Gravar 1 vÃ­deo de evoluÃ§Ã£o no final de semana para postar na Comunidade',
          'Concluir pelo menos 2 aulas na categoria escolhida',
        ],
        tempoTreino: `${hrs} horas por semana`,
        frequenciaRecomendada: `${availability}`,
        dicaIA: `MÃºsico, dado seu objetivo de '${goal}', nossa IA recomenda focar os primeiros 10 minutos de cada sessÃ£o exclusivamente em micro-treinos de tÃ©cnica lenta no metrÃ´nomo para solidificar postura. NÃ£o pule o dia de descanso auditivo!`,
      },
    });

    if (user) updateProfile({ xp: user.xp + 75 });
  };

  const saveCourse = (input: Partial<Course> & { title: string }) => {
    const id = input.id || uid('course');
    setCourses((prev) => {
      const exists = prev.find((c) => c.id === id);
      if (exists) {
        return prev.map((c) => (c.id === id ? { ...c, ...input, id } : c));
      }
      const nextOrder = prev.reduce((max, c) => Math.max(max, c.displayOrder), -1) + 1;
      return [
        ...prev,
        {
          id,
          title: input.title,
          description: input.description || '',
          category: (input.category || 'ViolÃ£o') as MusicCategory,
          instructor: input.instructor || 'Instrutor',
          level: (input.level || 'NÃ­vel Zero') as MusicLevel,
          coverImage: input.coverImage || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
          status: input.status || 'draft',
          displayOrder: input.displayOrder ?? nextOrder,
        },
      ];
    });
    logActivity(`Curso "${input.title}" foi salvo.`);
    showToast('success', 'Curso salvo com sucesso.');
    return id;
  };

  const deleteCourse = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setModules((prev) => prev.filter((m) => m.courseId !== courseId));
    setCatalogLessons((prev) => prev.filter((l) => l.courseId !== courseId));
    logActivity(`Curso "${course?.title || courseId}" foi excluÃ­do.`);
    showToast('success', 'Curso excluÃ­do.');
  };

  const toggleCoursePublish = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, status: (c.status === 'published' ? 'draft' : 'published') as PublishStatus } : c
      )
    );
    showToast('success', 'Status de publicaÃ§Ã£o atualizado.');
  };

  const saveModule = (input: Partial<CourseModule> & { courseId: string; name: string }) => {
    const id = input.id || uid('mod');
    setModules((prev) => {
      const exists = prev.find((m) => m.id === id);
      if (exists) return prev.map((m) => (m.id === id ? { ...m, ...input, id } : m));
      const siblings = prev.filter((m) => m.courseId === input.courseId);
      const nextOrder = siblings.reduce((max, m) => Math.max(max, m.order), -1) + 1;
      return [...prev, { id, courseId: input.courseId, name: input.name, description: input.description || '', order: input.order ?? nextOrder }];
    });
    showToast('success', 'MÃ³dulo salvo.');
    return id;
  };

  const deleteModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setCatalogLessons((prev) => prev.filter((l) => l.moduleId !== moduleId));
    showToast('success', 'MÃ³dulo excluÃ­do.');
  };

  const moveModule = (moduleId: string, direction: 'up' | 'down') => {
    const current = modules.find((m) => m.id === moduleId);
    if (!current) return;
    setModules((prev) => {
      const siblings = prev.filter((m) => m.courseId === current.courseId);
      const moved = moveByOrder(siblings, moduleId, direction);
      const others = prev.filter((m) => m.courseId !== current.courseId);
      return [...others, ...moved];
    });
  };

  const saveLesson = (input: Partial<Lesson> & { title: string; courseId: string; moduleId: string }) => {
    const id = input.id || uid('lesson');
    const course = courses.find((c) => c.id === input.courseId);
    setCatalogLessons((prev) => {
      const exists = prev.find((l) => l.id === id);
      const payload: Lesson = {
        id,
        title: input.title,
        duration: input.duration || '10 min',
        description: input.description || '',
        category: (input.category || course?.category || 'ViolÃ£o') as MusicCategory,
        level: (input.level || course?.level || 'NÃ­vel Zero') as MusicLevel,
        videoUrl: input.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isFree: input.isFree || false,
        thumbnail: input.thumbnail || course?.coverImage || 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        courseId: input.courseId,
        moduleId: input.moduleId,
        order: input.order ?? 0,
        status: input.status || 'published',
        complementaryUrl: input.complementaryUrl || '',
      };
      if (exists) return prev.map((l) => (l.id === id ? { ...exists, ...payload } : l));
      const siblings = prev.filter((l) => l.moduleId === input.moduleId);
      payload.order = input.order ?? siblings.reduce((max, l) => Math.max(max, l.order ?? 0), -1) + 1;
      return [...prev, payload];
    });
    showToast('success', 'Aula salva.');
    logActivity(`Aula "${input.title}" foi atualizada.`);
    return id;
  };

  const deleteLesson = (lessonId: string) => {
    setCatalogLessons((prev) => prev.filter((l) => l.id !== lessonId));
    showToast('success', 'Aula excluÃ­da.');
  };

  const moveLesson = (lessonId: string, direction: 'up' | 'down') => {
    const current = catalogLessons.find((l) => l.id === lessonId);
    if (!current?.moduleId) return;
    setCatalogLessons((prev) => {
      const siblings = prev
        .filter((l) => l.moduleId === current.moduleId)
        .map((l) => ({ ...l, order: l.order ?? 0 }));
      const moved = moveByOrder(siblings, lessonId, direction);
      const others = prev.filter((l) => l.moduleId !== current.moduleId);
      return [...others, ...moved];
    });
  };

  const toggleLessonPublish = (lessonId: string) => {
    setCatalogLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId ? { ...l, status: l.status === 'draft' ? 'published' : 'draft' } : l
      )
    );
  };

  const saveLive = (input: Partial<LiveSession> & { title: string }) => {
    const id = input.id || uid('lv');
    setLives((prev) => {
      const exists = prev.find((l) => l.id === id);
      const payload: LiveSession = {
        id,
        title: input.title,
        presenter: input.presenter || 'Instrutor',
        date: input.date || new Date().toLocaleDateString('pt-BR'),
        time: input.time || '20:00',
        status: input.status || 'scheduled',
        videoUrl: input.videoUrl,
        description: input.description || '',
        coverImage: input.coverImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        link: input.link || input.videoUrl,
      };
      if (exists) return prev.map((l) => (l.id === id ? payload : l));
      return [payload, ...prev];
    });
    showToast('success', 'Live salva.');
    logActivity(`Live "${input.title}" foi salva.`);
    return id;
  };

  const deleteLive = (liveId: string) => {
    setLives((prev) => prev.filter((l) => l.id !== liveId));
    showToast('success', 'Live excluÃ­da.');
  };

  const saveMarketplaceItem = (input: Partial<MarketplaceItem> & { name: string }) => {
    const id = input.id || uid('mkt');
    setMarketplaceItems((prev) => {
      const exists = prev.find((i) => i.id === id);
      const payload: MarketplaceItem = {
        id,
        name: input.name,
        type: input.type || 'Presets',
        price: Number(input.price ?? 0),
        description: input.description || '',
        thumbnail: input.thumbnail || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
        status: input.status || 'active',
      };
      if (exists) return prev.map((i) => (i.id === id ? payload : i));
      return [payload, ...prev];
    });
    showToast('success', 'Produto salvo.');
    return id;
  };

  const deleteMarketplaceItem = (itemId: string) => {
    setMarketplaceItems((prev) => prev.filter((i) => i.id !== itemId));
    showToast('success', 'Produto excluÃ­do.');
  };

  const saveEquipment = (input: Partial<Equipment> & { name: string }) => {
    const id = input.id || uid('eq');
    setEquipments((prev) => {
      const exists = prev.find((e) => e.id === id);
      const payload: Equipment = {
        id,
        name: input.name,
        type: input.type || 'Guitarras',
        imageUrl: input.imageUrl || 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
        rating: input.rating ?? 0,
        description: input.description || '',
        reviewText: input.reviewText || input.description || '',
        videoDemoUrl: input.videoDemoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        comments: input.comments || exists?.comments || [],
        brand: input.brand || '',
        model: input.model || '',
        published: input.published ?? true,
      };
      if (exists) return prev.map((e) => (e.id === id ? { ...exists, ...payload, comments: exists.comments } : e));
      return [payload, ...prev];
    });
    showToast('success', 'Equipamento salvo.');
    return id;
  };

  const deleteEquipment = (eqId: string) => {
    setEquipments((prev) => prev.filter((e) => e.id !== eqId));
    showToast('success', 'Equipamento excluÃ­do.');
  };

  const deleteCommunityPost = (postId: string) => {
    setCommunityFeed((prev) => prev.filter((p) => p.id !== postId));
    showToast('success', 'PublicaÃ§Ã£o removida.');
  };

  const setPostModeration = (postId: string, status: CommunityPost['moderationStatus']) => {
    setCommunityFeed((prev) => prev.map((p) => (p.id === postId ? { ...p, moderationStatus: status } : p)));
    showToast('success', 'ModeraÃ§Ã£o atualizada.');
  };

  const saveStudent = (input: Partial<ManagedUser> & { id?: string }) => {
    if (!input.id) return;
    setStudents((prev) => prev.map((s) => (s.id === input.id ? { ...s, ...input } : s)));
    if (user?.id === input.id) {
      setUser((prev) => (prev ? { ...prev, ...input, role: prev.role } : prev));
    }
    showToast('success', 'Aluno atualizado.');
  };

  const toggleStudentStatus = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
      )
    );
    showToast('success', 'Status do aluno atualizado.');
  };

  const saveSettings = (updated: Partial<PlatformSettings>) => {
    const next = { ...settings, ...updated };
    setSettings(next);

    if (supabase) {
      void supabase
        .from('platform_settings')
        .upsert({
          id: 'main',
          platform_name: next.platformName,
          tagline: next.tagline,
          support_email: next.supportEmail,
          plan_name: next.planName,
          plan_price: next.planPrice,
          maintenance_mode: next.maintenanceMode,
          allow_registrations: next.allowRegistrations,
          admin_menu: next.adminMenu,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }) => {
          if (error) {
            showToast('error', 'Não foi possível salvar as configurações no Supabase.');
            return;
          }
          showToast('success', 'Configurações salvas no Supabase.');
        });
    } else {
      showToast('success', 'Configurações salvas localmente.');
    }

    logActivity('Configurações da plataforma foram atualizadas.');
  };

  return (
    <AppContext.Provider
      value={{
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
        catalogLessons,
        courses,
        modules,
        lives,
        marketplaceItems,
        students,
        payments,
        settings,
        activities,
        toast,
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
        generateStudyCalendar,
        reportPost,
        showToast,
        clearToast,
        publishedLessons,
        publishedCourses,
        saveCourse,
        deleteCourse,
        toggleCoursePublish,
        saveModule,
        deleteModule,
        moveModule,
        saveLesson,
        deleteLesson,
        moveLesson,
        toggleLessonPublish,
        saveLive,
        deleteLive,
        saveMarketplaceItem,
        deleteMarketplaceItem,
        saveEquipment,
        deleteEquipment,
        deleteCommunityPost,
        setPostModeration,
        saveStudent,
        toggleStudentStatus,
        saveSettings,
      }}
    >
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


