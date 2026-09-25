import {
  Course,
  CourseModule,
  Lesson,
  LiveSession,
  MarketplaceItem,
  Equipment,
  CommunityPost,
  MusicCategory,
  MusicLevel,
  lessonsData,
  livesData,
  marketplaceData,
  equipmentsData,
  initialPosts,
} from './mockData';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  instrument: string;
  level: string;
  bio: string;
  xp: number;
  role: 'student' | 'admin';
  status: 'active' | 'inactive';
  subscriptionStatus: 'active' | 'cancelled' | 'pending' | 'overdue';
  createdAt: string;
  startedCourseIds: string[];
  completedCourseIds: string[];
}

export interface PaymentRecord {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  plan: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paidAt?: string;
  dueDate: string;
}

export interface AdminMenuItem {
  id: string;
  label: string;
  screen: string;
  visible: boolean;
  order: number;
}

export interface PlatformSettings {
  platformName: string;
  tagline: string;
  supportEmail: string;
  planName: string;
  planPrice: number;
  maintenanceMode: boolean;
  allowRegistrations: boolean;
  adminMenu: AdminMenuItem[];
}

export interface ActivityLog {
  id: string;
  message: string;
  at: string;
}

export const MUSIC_CATEGORIES: MusicCategory[] = [
  'Violão', 'Bateria', 'Contrabaixo', 'Reaper', 'Mixagem', 'Podcast',
];

export const MUSIC_LEVELS: MusicLevel[] = [
  'Nível Zero', 'Aprendiz', 'Mediano', 'Profissional', 'Avançado',
];

const COURSE_META: Record<MusicCategory, { instructor: string; cover: string; desc: string }> = {
  Violão: {
    instructor: 'Prof. Thiago Rodrigues',
    cover: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    desc: 'Domine acordes, ritmos, dedilhados e técnicas de fingerstyle no violão acústico.',
  },
  Bateria: {
    instructor: 'Prof. Lucas Drummond',
    cover: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&w=800&q=80',
    desc: 'Desenvolva pegada de baquetas, grooves clássicos, pedal duplo e polirritmias avançadas.',
  },
  Contrabaixo: {
    instructor: 'Profa. Gabi Bass',
    cover: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?auto=format&fit=crop&w=800&q=80',
    desc: 'Aprenda slap percussivo, walking bass de blues, escalas e condução de harmonia.',
  },
  Reaper: {
    instructor: 'Prof. Rafael Bittencourt',
    cover: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80',
    desc: 'Grave e edite áudios e MIDIs como profissional na DAW mais flexível do mercado.',
  },
  Mixagem: {
    instructor: 'Eng. Adair Daufembach',
    cover: 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80',
    desc: 'Entenda equalização, compressão dinâmica, efeitos e masterização em produções musicais.',
  },
  Podcast: {
    instructor: 'Profa. Jéssica Cast',
    cover: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    desc: 'Grave múltiplos participantes, retire ruídos e edite episódios de áudio limpos.',
  },
};

export function buildSeedCatalog() {
  const courses: Course[] = [];
  const modules: CourseModule[] = [];
  const lessons: Lesson[] = [];

  MUSIC_CATEGORIES.forEach((category, courseIndex) => {
    const meta = COURSE_META[category];
    const courseId = `course-${category.toLowerCase()}`;
    const catLessons = lessonsData.filter((l) => l.category === category);
    const highestLevel = catLessons[catLessons.length - 1]?.level || 'Nível Zero';

    courses.push({
      id: courseId,
      title: `Trilha Completa de ${category}`,
      description: meta.desc,
      category,
      instructor: meta.instructor,
      level: highestLevel,
      coverImage: meta.cover,
      status: 'published',
      displayOrder: courseIndex,
    });

    MUSIC_LEVELS.forEach((level, moduleIndex) => {
      const levelLessons = catLessons.filter((l) => l.level === level);
      if (levelLessons.length === 0) return;
      const moduleId = `${courseId}-mod-${moduleIndex}`;
      modules.push({
        id: moduleId,
        courseId,
        name: `Módulo ${moduleIndex + 1} — ${level}`,
        description: `Aulas do nível ${level} na trilha de ${category}.`,
        order: moduleIndex,
      });
      levelLessons.forEach((lesson, lessonIndex) => {
        lessons.push({
          ...lesson,
          courseId,
          moduleId,
          order: lessonIndex,
          status: 'published',
          complementaryUrl: '',
        });
      });
    });
  });

  return { courses, modules, lessons };
}

export const defaultSettings: PlatformSettings = {
  platformName: 'Netflix do Músico',
  tagline: 'O ecossistema definitivo para músicos e produtores',
  supportEmail: 'suporte@netflixdomusico.com',
  planName: 'Assinatura Premium Mensal',
  planPrice: 47.9,
  maintenanceMode: false,
  allowRegistrations: true,
  adminMenu: [
    { id: 'dashboard', label: 'Dashboard', screen: 'AdminDashboard', visible: true, order: 0 },
    { id: 'courses', label: 'Cursos', screen: 'AdminCourses', visible: true, order: 1 },
    { id: 'content', label: 'Conteúdo', screen: 'AdminModulesLessons', visible: true, order: 2 },
    { id: 'students', label: 'Alunos', screen: 'AdminStudents', visible: true, order: 3 },
    { id: 'finance', label: 'Financeiro', screen: 'AdminFinance', visible: true, order: 4 },
    { id: 'lives', label: 'Lives', screen: 'AdminLives', visible: true, order: 5 },
    { id: 'community', label: 'Comunidade', screen: 'AdminCommunity', visible: true, order: 6 },
    { id: 'marketplace', label: 'Marketplace', screen: 'AdminMarketplace', visible: true, order: 7 },
    { id: 'equipment', label: 'Reviews de Equipamentos', screen: 'AdminEquipment', visible: true, order: 8 },
    { id: 'settings', label: 'Configurações', screen: 'AdminSettings', visible: true, order: 9 },
  ],
};

export const seedStudents: ManagedUser[] = [
  {
    id: 'user-student-demo',
    name: 'ALUNO TESTE',
    email: 'aluno@musico.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    instrument: 'Violão & Guitarra',
    level: 'Mediano',
    bio: 'Músico apaixonado por rock dos anos 80, gravando no Reaper e sonhando em lançar o primeiro EP.',
    xp: 1250,
    role: 'student',
    status: 'active',
    subscriptionStatus: 'active',
    createdAt: '2026-01-12',
    startedCourseIds: ['course-violão', 'course-mixagem'],
    completedCourseIds: [],
  },
  {
    id: 'user-001',
    name: 'Gabriel Nogueira',
    email: 'gabriel@aluno.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    instrument: 'Guitarra',
    level: 'Aprendiz',
    bio: 'Focado em pestanas e repertório de rock nacional.',
    xp: 820,
    role: 'student',
    status: 'active',
    subscriptionStatus: 'active',
    createdAt: '2026-02-03',
    startedCourseIds: ['course-violão'],
    completedCourseIds: [],
  },
  {
    id: 'user-002',
    name: 'Mariana Costa',
    email: 'mariana@aluno.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    instrument: 'Violão',
    level: 'Aprendiz',
    bio: 'Estudando fingerstyle nas noites após o trabalho.',
    xp: 640,
    role: 'student',
    status: 'active',
    subscriptionStatus: 'active',
    createdAt: '2026-03-18',
    startedCourseIds: ['course-violão', 'course-podcast'],
    completedCourseIds: [],
  },
  {
    id: 'user-003',
    name: 'Felipe Batera',
    email: 'felipe@aluno.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    instrument: 'Bateria',
    level: 'Mediano',
    bio: 'Pedal duplo e rudimentos no praticável todos os dias.',
    xp: 1540,
    role: 'student',
    status: 'active',
    subscriptionStatus: 'pending',
    createdAt: '2025-11-09',
    startedCourseIds: ['course-bateria'],
    completedCourseIds: [],
  },
  {
    id: 'user-004',
    name: 'Arthur Mix',
    email: 'arthur@aluno.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    instrument: 'Produção',
    level: 'Profissional',
    bio: 'Mixando metal e podcasts no home studio.',
    xp: 2100,
    role: 'student',
    status: 'inactive',
    subscriptionStatus: 'cancelled',
    createdAt: '2025-08-22',
    startedCourseIds: ['course-reaper', 'course-mixagem'],
    completedCourseIds: ['course-reaper'],
  },
  {
    id: 'user-005',
    name: 'Carol Violão',
    email: 'carol@aluno.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    instrument: 'Violão',
    level: 'Nível Zero',
    bio: 'Começando do zero com a trilha de violão.',
    xp: 180,
    role: 'student',
    status: 'active',
    subscriptionStatus: 'overdue',
    createdAt: '2026-07-01',
    startedCourseIds: ['course-violão'],
    completedCourseIds: [],
  },
];

export const seedPayments: PaymentRecord[] = [
  { id: 'pay-01', studentId: 'user-student-demo', studentName: 'ALUNO TESTE', email: 'aluno@musico.com', plan: 'Premium Mensal', amount: 47.9, status: 'paid', paidAt: '2026-09-01', dueDate: '2026-10-01' },
  { id: 'pay-02', studentId: 'user-001', studentName: 'Gabriel Nogueira', email: 'gabriel@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'paid', paidAt: '2026-09-03', dueDate: '2026-10-03' },
  { id: 'pay-03', studentId: 'user-002', studentName: 'Mariana Costa', email: 'mariana@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'paid', paidAt: '2026-09-05', dueDate: '2026-10-05' },
  { id: 'pay-04', studentId: 'user-003', studentName: 'Felipe Batera', email: 'felipe@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'pending', dueDate: '2026-09-20' },
  { id: 'pay-05', studentId: 'user-004', studentName: 'Arthur Mix', email: 'arthur@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'cancelled', dueDate: '2026-08-22' },
  { id: 'pay-06', studentId: 'user-005', studentName: 'Carol Violão', email: 'carol@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'overdue', dueDate: '2026-08-01' },
  { id: 'pay-07', studentId: 'user-001', studentName: 'Gabriel Nogueira', email: 'gabriel@aluno.com', plan: 'Premium Mensal', amount: 47.9, status: 'paid', paidAt: '2026-08-03', dueDate: '2026-09-03' },
];

export const seedActivities: ActivityLog[] = [
  { id: 'act-1', message: 'Novo aluno Gabriel Nogueira assinou o plano Premium.', at: '2026-09-12 09:14' },
  { id: 'act-2', message: 'Live "Improvisação na Pentatônica" foi agendada.', at: '2026-09-11 18:02' },
  { id: 'act-3', message: 'Curso de Mixagem recebeu nova aula publicada.', at: '2026-09-10 14:40' },
];

export const seedLives: LiveSession[] = livesData.map((live, index) => ({
  ...live,
  description: live.title,
  coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  link: live.videoUrl || 'https://meet.example.com/live-vip',
  status: live.status === 'replay' ? 'finished' : live.status,
}));

export const seedMarketplace: MarketplaceItem[] = marketplaceData.map((item) => ({
  ...item,
  status: 'active' as const,
}));

export const seedEquipments: Equipment[] = equipmentsData.map((eq) => {
  const [brand, ...rest] = eq.name.split(' ');
  return {
    ...eq,
    brand,
    model: rest.join(' ') || eq.name,
    published: true,
  };
});

export const seedCommunity: CommunityPost[] = initialPosts.map((post, i) => ({
  ...post,
  reports: i === 1 ? 2 : 0,
  moderationStatus: i === 1 ? 'reported' : 'visible',
}));

export const defaultStudentProfile = {
  id: 'user-student-demo',
  name: 'ALUNO TESTE',
  email: 'aluno@musico.com',
  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
  instrument: 'Violão & Guitarra',
  level: 'Mediano',
  bio: 'Músico apaixonado por rock dos anos 80, gravando minhas próprias produções no Reaper e sonhando em lançar meu primeiro EP.',
  xp: 1250,
  role: 'student' as const,
  status: 'active' as const,
  subscriptionStatus: 'active' as const,
};

export const defaultAdminProfile = {
  id: 'user-admin-demo',
  name: 'Admin Studio',
  email: 'admin@musico.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
  instrument: 'Gestão da Plataforma',
  level: 'Administrador',
  bio: 'Operação e curadoria do Netflix do Músico.',
  xp: 0,
  role: 'admin' as const,
  status: 'active' as const,
  subscriptionStatus: 'active' as const,
};
