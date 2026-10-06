import React, { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { Lesson, Equipment, LiveSession, MarketplaceItem, CommunityPost, Course, CourseModule, MusicCategory, MusicLevel } from '../data/mockData';
import type { ActivityLog, ManagedUser, PaymentRecord, PlatformSettings } from '../data/seedPlatform';
import { defaultSettings } from '../data/seedPlatform';
import { legacyChanges } from '../lib/legacyImport';
import { uid, nowLabel } from '../lib/storage';
import { supabase } from '../lib/supabase';
import { commitRecords, emptyProgress, isFeatureEnabled, loadSnapshot, saveVersioned, type Snapshot, type RecordKind, type Progress } from '../lib/platform';
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
  importLegacyContent: () => Promise<boolean>;
  authLoading: boolean; dataWarning: string | null; dataError: string | null; isSaving: boolean; isRecovery: boolean;
  refreshData: () => Promise<boolean>;
  finishRecovery: () => Promise<void>;
  registerUser: (email:string,password:string,name:string,instrument:string) => Promise<boolean>;
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
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => void;
  updateProfile: (updated: Partial<StudentProfile>) => Promise<boolean>;
  toggleLessonComplete: (lessonId: string) => void;
  toggleLessonFavorite: (lessonId: string) => void;
  toggleEquipmentFavorite: (eqId: string) => void;
  addToWatchedHistory: (lessonId: string) => void;
  createNewPost: (content: string, videoUrl?: string) => Promise<boolean>;
  likePost: (postId: string) => void;
  addCommentToPost: (postId: string, commentText: string) => Promise<boolean>;
  addCommentToEquipment: (eqId: string, rating: number, text: string) => Promise<boolean>;
  generateStudyCalendar: (routine: string, hours: string, availability: string, goal: string) => void;
  reportPost: (postId: string) => void;
  showToast: (type: ToastState['type'], message: string) => void;
  clearToast: () => void;
  publishedLessons: Lesson[];
  publishedCourses: Course[];
  saveCourse: (input: Partial<Course> & { title: string }) => Promise<string | null>;
  deleteCourse: (courseId: string) => void;
  toggleCoursePublish: (courseId: string) => void;
  saveModule: (input: Partial<CourseModule> & { courseId: string; name: string }) => Promise<string | null>;
  deleteModule: (moduleId: string) => void;
  moveModule: (moduleId: string, direction: 'up' | 'down') => void;
  saveLesson: (input: Partial<Lesson> & { title: string; courseId: string; moduleId: string }) => Promise<string | null>;
  deleteLesson: (lessonId: string) => void;
  moveLesson: (lessonId: string, direction: 'up' | 'down') => void;
  toggleLessonPublish: (lessonId: string) => void;
  saveLive: (input: Partial<LiveSession> & { title: string }) => Promise<string | null>;
  deleteLive: (liveId: string) => void;
  saveMarketplaceItem: (input: Partial<MarketplaceItem> & { name: string }) => Promise<string | null>;
  deleteMarketplaceItem: (itemId: string) => void;
  saveEquipment: (input: Partial<Equipment> & { name: string }) => Promise<string | null>;
  deleteEquipment: (eqId: string) => void;
  deleteCommunityPost: (postId: string) => void;
  setPostModeration: (postId: string, status: CommunityPost['moderationStatus']) => void;
  saveStudent: (input: Partial<ManagedUser> & { id?: string }) => Promise<boolean>;
  toggleStudentStatus: (studentId: string) => void;
  saveSettings: (updated: Partial<PlatformSettings>) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const initialSettings = {...defaultSettings, adminMenu:defaultSettings.adminMenu.map(item=>({...item,visible:item.id==='marketplace'?false:item.visible}))};
const emptySnapshot = (): Snapshot => ({user:null,records:[],students:[],settings:initialSettings,settingsVersion:0,progress:emptyProgress(),progressVersion:0,interactions:[]});
const screenFeature: Partial<Record<ScreenName,string>> = {CommunityPage:'community',LivePage:'lives',MarketplacePage:'marketplace',EquipmentReviews:'equipment'};

export const AppProvider: React.FC<{children:React.ReactNode}> = ({children}) => {
  const [snapshot,setSnapshot]=useState<Snapshot>(emptySnapshot);
  const state=useRef(snapshot); state.current=snapshot;
  const [authLoading,setAuthLoading]=useState(true);
  const [dataError,setDataError]=useState<string|null>(null);
  const [dataWarning,setDataWarning]=useState<string|null>(null);
  const [isSaving,setIsSaving]=useState(false);
  const saving=useRef(false);
  const signingIn=useRef(false);
  const generation=useRef(0);
  const alive=useRef(true);
  const recovery=useRef(new URLSearchParams(window.location.hash.slice(1)).get('type')==='recovery');
  const [isRecovery,setIsRecovery]=useState(recovery.current);
  const [currentScreen,setCurrentScreen]=useState<ScreenName>('PublicHome');
  const [screenParams,setScreenParams]=useState<any>(null);
  const [historyStack,setHistoryStack]=useState<{screen:ScreenName;params:any}[]>([]);
  const [searchQuery,setSearchQuery]=useState('');
  const [toast,setToast]=useState<ToastState|null>(null);
  const showToast=(type:ToastState['type'],message:string)=>setToast({type,message});
  const user=snapshot.user;
  const settings=snapshot.settings;
  const isSubscriber=!!user && user.role==='student' && user.status==='active' && user.subscriptionStatus==='active' && !settings.maintenanceMode;
  const {watchedHistory,completedLessons,favoriteLessons,favoriteEquipments,aiCalendar}=snapshot.progress;

  const refreshData=useCallback(async ():Promise<boolean>=>{
    if(!supabase) {setDataError('Configure a conexão com o Supabase para utilizar a plataforma.');setAuthLoading(false);return false;}
    const request=++generation.current;
    let preserveConfirmed=state.current.settingsVersion>0;
    try {
      const {data,error}=await supabase.auth.getUser();
      // A missing session is a normal anonymous visit. Other auth errors fail closed.
      if(error && error.name!=='AuthSessionMissingError') {
        preserveConfirmed=preserveConfirmed && (error.name==='AuthRetryableFetchError' || Number(error.status)>=500);
        throw error;
      }
      if(state.current.user?.id!==data.user?.id) preserveConfirmed=false;
      const next=await loadSnapshot(supabase,data.user);
      if(!alive.current || request!==generation.current) return false;
      const previous=state.current.user;
      setSnapshot(next); state.current=next;
      setDataError(null);setDataWarning(null);
      if(previous?.id!==next.user?.id) {
        setHistoryStack([]);setScreenParams(null);setSearchQuery('');
        setCurrentScreen(next.user?.role==='admin'?'AdminDashboard':next.user?'MemberHome':'PublicHome');
      }
      return true;
    } catch(error) {
      if(alive.current && request===generation.current) {
        const message=error instanceof Error?error.message:'Não foi possível carregar os dados. Tente novamente.';
        if(preserveConfirmed && state.current.settingsVersion>0){
          setDataWarning('Não foi possível atualizar os dados. Seus rascunhos foram preservados. Tente atualizar novamente.');
        }else{
          setSnapshot(emptySnapshot());state.current=emptySnapshot();setDataWarning(null);setDataError(message);
        }
      }
      return false;
    } finally { if(alive.current && request===generation.current) setAuthLoading(false); }
  },[]);

  useEffect(()=>{
    alive.current=true;
    void refreshData();
    const subscription=supabase?.auth.onAuthStateChange((event)=>{
      if(event==='INITIAL_SESSION' || (event==='SIGNED_IN' && signingIn.current)) return;
      if(event==='PASSWORD_RECOVERY'){recovery.current=true;setIsRecovery(true);setCurrentScreen('Login');}
      if(event==='SIGNED_OUT'){
        ++generation.current;setDataWarning(null);setSnapshot(emptySnapshot());state.current=emptySnapshot();setHistoryStack([]);setScreenParams(null);setCurrentScreen('Login');
      }
      // Keep Supabase calls outside the auth callback's lock.
      window.setTimeout(()=>{if(alive.current) void refreshData();},0);
    }).data.subscription;
    const refresh=()=>{if(!document.hidden && !saving.current && !signingIn.current) void refreshData();};
    window.addEventListener('focus',refresh);
    const timer=window.setInterval(refresh,30000);
    return ()=>{alive.current=false;++generation.current;subscription?.unsubscribe();clearInterval(timer);window.removeEventListener('focus',refresh);};
  },[refreshData]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(null),5000);return()=>clearTimeout(timer);},[toast]);

  const allowed=(screen:ScreenName)=>{
    if(screen==='Login'||screen==='PublicHome')return true;
    if(!user||user.status!=='active')return false;
    if(isAdminScreen(screen))return user.role==='admin';
    if(user.role!=='admin' && !isSubscriber)return screen==='MemberHome';
    const feature=screenFeature[screen];return !feature||isFeatureEnabled(settings,feature);
  };
  const navigateTo=(screen:ScreenName,params:any=null)=>{
    if(!allowed(screen)){showToast('error','Esta área não está disponível para sua conta.');return;}
    setHistoryStack(prev=>[...prev,{screen:currentScreen,params:screenParams}]);setCurrentScreen(screen);setScreenParams(params);
  };
  const goBack=()=>{
    const previous=[...historyStack].reverse().find(item=>allowed(item.screen));
    setHistoryStack([]);setCurrentScreen(previous?.screen || (user?.role==='admin'?'AdminDashboard':user?'MemberHome':'PublicHome'));setScreenParams(previous?.params||null);
  };
  useEffect(()=>{
    if(!allowed(currentScreen)){setCurrentScreen(user?.role==='admin'?'AdminDashboard':user?'MemberHome':'PublicHome');setScreenParams(null);}
  },[user,settings,currentScreen,isSubscriber]);

  const loginUser=async(email:string,password:string)=>{
    if(!supabase){showToast('error','Supabase não está configurado.');return false;}
    signingIn.current=true;
    try {
      const {error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password});
      if(error){showToast('error','E-mail ou senha inválidos, ou serviço indisponível.');return false;}
      const ok=await refreshData();
      const profile=state.current.user;
      if(!ok||!profile||profile.status!=='active'){
        await supabase.auth.signOut();showToast('error','Conta indisponível. Contate o administrador.');return false;
      }
      setCurrentScreen(profile.role==='admin'?'AdminDashboard':'MemberHome');setHistoryStack([]);return true;
    }catch{showToast('error','Não foi possível entrar. Tente novamente.');return false;}finally{signingIn.current=false;}
  };
  const logoutUser=async()=>{
    if(!supabase)return;
    const {error}=await supabase.auth.signOut();
    if(error){showToast('error','Não foi possível encerrar a sessão. Tente novamente.');return;}
    ++generation.current;setSnapshot(emptySnapshot());state.current=emptySnapshot();setCurrentScreen('Login');setHistoryStack([]);setScreenParams(null);setSearchQuery('');
  };
  const registerUser=async(email:string,password:string,name:string,instrument:string)=>{
    if(!supabase||!settings.allowRegistrations)return false;
    try {
      const {error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password,options:{data:{name,instrument}}});
      if(error)throw error;
      showToast('success','Cadastro recebido. Confira seu e-mail; o acesso depende da ativação da assinatura.');return true;
    }catch{showToast('error','Não foi possível concluir o cadastro. Tente novamente.');return false;}
  };
  const finishRecovery=async()=>{recovery.current=false;setIsRecovery(false);await logoutUser();};

  const rows=<T,>(kind:RecordKind):T[]=>snapshot.records.filter(row=>row.kind===kind).map(row=>({...row.data,_revision:row.version}));
  const courses=rows<Course>('course'),modules=rows<CourseModule>('module'),catalogLessons=rows<Lesson>('lesson');
  const lives=useMemo(()=>rows<LiveSession>('live'),[snapshot.records]);
  const marketplaceItems=rows<MarketplaceItem>('marketplace');
  const students=snapshot.students,payments=rows<PaymentRecord>('payment'),activities=rows<ActivityLog>('activity');
  const interactions=(kind:string,id:string,action:string)=>snapshot.interactions.filter(row=>row.record_kind===kind&&row.record_id===id&&row.action===action);
  const communityFeed=rows<CommunityPost>('post').map(post=>({...post,
    likes:interactions('post',post.id,'like').length,reports:interactions('post',post.id,'report').length,
    comments:interactions('post',post.id,'comment').map(row=>({id:row.id,userName:row.data.name||'Aluno',userInstrument:row.data.instrument||'',content:row.data.text,date:new Date(row.created_at).toLocaleString('pt-BR')})),
  }));
  const equipments=useMemo(()=>rows<Equipment>('equipment').map(eq=>{const reviews=interactions('equipment',eq.id,'review');return {...eq,
    comments:reviews.map(row=>({user:row.data.name||'Aluno',text:row.data.text,rating:Number(row.data.rating)})),
    rating:reviews.length?reviews.reduce((sum,row)=>sum+Number(row.data.rating),0)/reviews.length:eq.rating,
  };}),[snapshot.records,snapshot.interactions]);
  const publishedCourses=useMemo(()=>courses.filter(c=>c.status==='published').sort((a,b)=>a.displayOrder-b.displayOrder),[snapshot.records]);
  const publishedLessons=useMemo(()=>{
    const publishedIds=new Set(publishedCourses.map(c=>c.id));
    return catalogLessons.filter(l=>l.status==='published' && publishedIds.has(l.courseId||'') && modules.some(m=>m.id===l.moduleId&&m.courseId===l.courseId))
      .sort((a,b)=>{
        const ca=publishedCourses.find(c=>c.id===a.courseId)?.displayOrder||0,cb=publishedCourses.find(c=>c.id===b.courseId)?.displayOrder||0;
        const ma=modules.find(m=>m.id===a.moduleId)?.order||0,mb=modules.find(m=>m.id===b.moduleId)?.order||0;
        return ca-cb||ma-mb||(a.order||0)-(b.order||0);
      });
  },[snapshot.records]);

  const mutate=async(action:()=>Promise<void>,message='Alterações salvas.'):Promise<boolean>=>{
    if(dataWarning){showToast('error','Atualize os dados antes de salvar. Seu rascunho foi preservado.');return false;}
    if(!supabase||saving.current){showToast('error','Aguarde a operação atual terminar.');return false;}
    saving.current=true;setIsSaving(true);
    try{await action();const refreshed=await refreshData();if(!refreshed)throw new Error('Operação enviada, mas não foi possível conferir o resultado. Atualize antes de tentar novamente.');showToast('success',message);return true;}
    catch(error){showToast('error',error instanceof Error?error.message:'Não foi possível salvar.');return false;}
    finally{saving.current=false;setIsSaving(false);}
  };
  const change=(kind:RecordKind,id:string,data?:any)=>({kind,id,op:data?'upsert':'delete',version:state.current.records.find(row=>row.kind===kind&&row.id===id)?.version||0,...(data?{data}: {})});
  const saveRecord=async(kind:RecordKind,input:any,defaults:any={}):Promise<string|null>=>{
    if(user?.role!=='admin')return null;
    const id=input.id||uid(kind);
    const existing=state.current.records.find(row=>row.kind===kind&&row.id===id)?.data||{};
    const {_revision,...fields}=input;
    const entry=change(kind,id,{...defaults,...existing,...fields,id});
    if(_revision!==undefined) entry.version=_revision;
    const ok=await mutate(()=>commitRecords(supabase!,[entry]));return ok?id:null;
  };
  const deleteRecord=async(kind:RecordKind,id:string)=>{
    if(user?.role!=='admin')return;
    await mutate(()=>commitRecords(supabase!,[change(kind,id)]),'Conteúdo excluído.');
  };
  const reorder=async(kind:'module'|'lesson',id:string,direction:'up'|'down')=>{
    const current=state.current.records.find(row=>row.kind===kind&&row.id===id);if(!current)return;
    const parent=kind==='module'?'courseId':'moduleId';
    const siblings=state.current.records.filter(row=>row.kind===kind&&row.data[parent]===current.data[parent]).sort((a,b)=>(a.data.order||0)-(b.data.order||0));
    const i=siblings.findIndex(row=>row.id===id),j=i+(direction==='up'?-1:1);if(j<0||j>=siblings.length)return;
    [siblings[i],siblings[j]]=[siblings[j],siblings[i]];
    await mutate(()=>commitRecords(supabase!,siblings.map((row,index)=>change(kind,row.id,{...row.data,order:index}))));
  };
  const saveCourse=(input:Partial<Course>&{title:string})=>saveRecord('course',input,{description:'',category:'Violão',instructor:'',level:'Nível Zero',coverImage:'',status:'draft',displayOrder:courses.length});
  const saveModule=(input:Partial<CourseModule>&{courseId:string;name:string})=>saveRecord('module',input,{description:'',order:modules.filter(m=>m.courseId===input.courseId).length});
  const saveLesson=(input:Partial<Lesson>&{title:string;courseId:string;moduleId:string})=>{
    const course=courses.find(c=>c.id===input.courseId);
    return saveRecord('lesson',input,{description:'',duration:'',videoUrl:'',thumbnail:course?.coverImage||'',category:course?.category||'Violão',level:course?.level||'Nível Zero',isFree:false,status:'draft',order:catalogLessons.filter(l=>l.moduleId===input.moduleId).length});
  };
  const saveLive=(input:Partial<LiveSession>&{title:string})=>saveRecord('live',input,{presenter:'',date:'',time:'',status:'scheduled'});
  const saveMarketplaceItem=(input:Partial<MarketplaceItem>&{name:string})=>saveRecord('marketplace',input,{type:'Cursos',price:0,description:'',thumbnail:'',status:'inactive'});
  const saveEquipment=(input:Partial<Equipment>&{name:string})=>saveRecord('equipment',input,{type:'Baterias',imageUrl:'',rating:0,description:'',reviewText:'',videoDemoUrl:'',comments:[],published:false});
  const toggleCoursePublish=async(id:string)=>{const row=courses.find(c=>c.id===id);if(row)await saveCourse({...row,status:row.status==='published'?'draft':'published'});};
  const toggleLessonPublish=async(id:string)=>{const row=catalogLessons.find(c=>c.id===id);if(row)await saveLesson({...row,courseId:row.courseId!,moduleId:row.moduleId!,status:row.status==='published'?'draft':'published'});};
  const setPostModeration=async(id:string,status:CommunityPost['moderationStatus'])=>{await saveRecord('post',{id,moderationStatus:status});};
  const importLegacyContent=async()=>{
    if(user?.role!=='admin')return false;
    return mutate(async()=>{const changes=legacyChanges(localStorage,state.current.records);if(!changes.length)throw new Error('Não há conteúdo local novo para importar.');await commitRecords(supabase!,changes);},'Conteúdo importado para o Supabase.');
  };
  const saveSettings=async(updated:Partial<PlatformSettings>)=>{
    if(user?.role!=='admin')return false;
    const {_revision,...data}={...state.current.settings,...updated};
    return mutate(()=>saveVersioned(supabase!,'ndm_settings','main',data,updated._revision ?? state.current.settingsVersion),'Configurações salvas no Supabase.');
  };
  const saveStudent=async(input:Partial<ManagedUser>&{id?:string})=>{
    if(!input.id||user?.role!=='admin')return false;
    const existing=students.find(s=>s.id===input.id);if(!existing)return false;
    return mutate(async()=>{
      const {_revision,role,status,subscriptionStatus,id,email,createdAt,...data}={...existing,...input};
      const result=await supabase!.from('ndm_profiles').update({status,subscription_status:subscriptionStatus,data,version:(_revision||1)+1}).eq('id',id).eq('version',_revision||1).select('id').single();
      if(result.error||!result.data)throw new Error('Não foi possível salvar o aluno.');
    });
  };
  const toggleStudentStatus=async(id:string)=>{const student=students.find(s=>s.id===id);if(student)await saveStudent({id,status:student.status==='active'?'inactive':'active'});};
  const updateProfile=async(updated:Partial<StudentProfile>)=>{
    if(!user)return false;
    return mutate(async()=>{const {error}=await supabase!.rpc('ndm_update_profile',{changes:updated});if(error)throw error;});
  };
  const saveProgress=async(update:(prev:Progress)=>Progress)=>{
    if(!isSubscriber){showToast('error','A prévia não altera o progresso. É necessário um aluno com assinatura ativa.');return;}
    await mutate(()=>saveVersioned(supabase!,'ndm_progress',user!.id,update(state.current.progress),state.current.progressVersion));
  };
  const toggle=(list:string[],id:string)=>list.includes(id)?list.filter(x=>x!==id):[...list,id];
  const toggleLessonComplete=(id:string)=>saveProgress(p=>({...p,completedLessons:toggle(p.completedLessons,id)}));
  const toggleLessonFavorite=(id:string)=>saveProgress(p=>({...p,favoriteLessons:toggle(p.favoriteLessons,id)}));
  const toggleEquipmentFavorite=(id:string)=>saveProgress(p=>({...p,favoriteEquipments:toggle(p.favoriteEquipments,id)}));
  const addToWatchedHistory=(id:string)=>{if(isSubscriber&&state.current.progress.watchedHistory[0]!==id)void saveProgress(p=>({...p,watchedHistory:[id,...p.watchedHistory.filter(x=>x!==id)].slice(0,10)}));};
  const createNewPost=async(content:string,videoUrl?:string)=>{
    if(!isSubscriber){showToast('error','Entre como aluno com assinatura ativa para publicar.');return false;}
    return mutate(async()=>{const {error}=await supabase!.from('ndm_records').insert({kind:'post',id:uid('post'),author_id:user!.id,data:{content,videoUrl,moderationStatus:'visible'}});if(error)throw error;});
  };
  const interact=async(kind:'post'|'equipment',id:string,action:string,data:any={})=>{
    if(!isSubscriber){showToast('error','Entre como aluno com assinatura ativa para interagir.');return false;}
    return mutate(async()=>{const {error}=await supabase!.from('ndm_interactions').insert({record_kind:kind,record_id:id,author_id:user!.id,action,data:{...data,name:user!.name,instrument:user!.instrument}});if(error)throw new Error(error.code==='23505'?'Você já realizou esta ação.':error.message);});
  };
  const generateStudyCalendar = (routine: string, hours: string, availability: string, goal: string) => {
    const dias = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    const hrs = parseInt(hours) || 4;
    const minDiarios = Math.round((hrs * 60) / (availability.toLowerCase() === 'diária' ? 7 : availability.toLowerCase() === 'finais de semana' ? 2 : 4));
    const agenda: any[] = [];

    dias.forEach((dia, index) => {
      let treina = false;
      if (availability.toLowerCase() === 'diária') treina = true;
      else if (availability.toLowerCase() === 'finais de semana' && (dia === 'Sábado' || dia === 'Domingo')) treina = true;
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
          foco: index % 2 === 0 ? 'Técnica e Repertório' : 'Teoria e Produção',
          tempoTotal: `${minDiarios} min`,
          divisao: [
            { tarefa: 'Aquecimento e Técnica Dedos', tempo: `${tempoTec} min` },
            { tarefa: `Estudo de Teoria / Harmonias para ${goal}`, tempo: `${tempoTeo} min` },
            { tarefa: 'Aplicação prática no Repertório', tempo: `${tempoRep} min` },
            { tarefa: 'Gravação de evolução ou Improviso', tempo: `${tempoCri} min` },
          ],
        });
      } else {
        agenda.push({
          dia,
          estudar: false,
          foco: 'Descanso e Audição Ativa',
          tempoTotal: '0 min',
          divisao: [
            { tarefa: 'Ouvir discos novos de referência', tempo: '15 min' },
            { tarefa: 'Descanso de articulações e ouvidos', tempo: 'Completo' },
          ],
        });
      }
    });

    return saveProgress(p => ({ ...p, aiCalendar: {
      routine,
      hours,
      availability,
      goal,
      generatedSchedule: {
        cronograma: agenda,
        metasSemanais: [
          'Aumentar velocidade de treino em 5 BPM utilizando metrônomo',
          'Gravar 1 vídeo de evolução no final de semana para postar na Comunidade',
          'Concluir pelo menos 2 aulas na categoria escolhida',
        ],
        tempoTreino: `${hrs} horas por semana`,
        frequenciaRecomendada: `${availability}`,
        dicaIA: `Músico, dado seu objetivo de '${goal}', nossa IA recomenda focar os primeiros 10 minutos de cada sessão exclusivamente em micro-treinos de técnica lenta no metrônomo para solidificar postura. Não pule o dia de descanso auditivo!`,
      },
    }}));
  };

  return <AppContext.Provider value={{importLegacyContent,user,isSubscriber,authLoading,dataError,dataWarning,isSaving,isRecovery,refreshData,finishRecovery,registerUser,
    currentScreen,screenParams,historyStack,watchedHistory,completedLessons,favoriteLessons,favoriteEquipments,communityFeed,equipments,catalogLessons,courses,modules,lives,marketplaceItems,students,payments,settings,activities,toast,aiCalendar,searchQuery,setSearchQuery,navigateTo,goBack,loginUser,logoutUser,updateProfile,toggleLessonComplete,toggleLessonFavorite,toggleEquipmentFavorite,addToWatchedHistory,createNewPost,
    likePost:(id)=>{void interact('post',id,'like');},addCommentToPost:(id,text)=>interact('post',id,'comment',{text}),addCommentToEquipment:(id,rating,text)=>interact('equipment',id,'review',{rating,text}),generateStudyCalendar,reportPost:(id)=>{void interact('post',id,'report');},showToast,clearToast:()=>setToast(null),publishedLessons,publishedCourses,saveCourse,deleteCourse:(id)=>{void deleteRecord('course',id);},toggleCoursePublish,saveModule,deleteModule:(id)=>{void deleteRecord('module',id);},moveModule:(id,d)=>{void reorder('module',id,d);},saveLesson,deleteLesson:(id)=>{void deleteRecord('lesson',id);},moveLesson:(id,d)=>{void reorder('lesson',id,d);},toggleLessonPublish,saveLive,deleteLive:(id)=>{void deleteRecord('live',id);},saveMarketplaceItem,deleteMarketplaceItem:(id)=>{void deleteRecord('marketplace',id);},saveEquipment,deleteEquipment:(id)=>{void deleteRecord('equipment',id);},deleteCommunityPost:(id)=>{void deleteRecord('post',id);},setPostModeration,saveStudent,toggleStudentStatus,saveSettings}}>{children}</AppContext.Provider>;
};
export const useApp=()=>{const context=useContext(AppContext);if(!context)throw new Error('useApp deve ser usado com um AppProvider');return context;};
