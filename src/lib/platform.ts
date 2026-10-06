import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { ManagedUser, PlatformSettings } from '../data/seedPlatform';

export type RecordKind = 'course'|'module'|'lesson'|'live'|'marketplace'|'equipment'|'post'|'payment'|'activity';
export interface PlatformRecord { kind: RecordKind; id: string; data: any; version: number; author_id?: string; }
export interface Progress { watchedHistory: string[]; completedLessons: string[]; favoriteLessons: string[]; favoriteEquipments: string[]; aiCalendar: {routine:string;hours:string;availability:string;goal:string;generatedSchedule:any}; }
export const emptyProgress = (): Progress => ({watchedHistory:[],completedLessons:[],favoriteLessons:[],favoriteEquipments:[],aiCalendar:{routine:'',hours:'',availability:'',goal:'',generatedSchedule:null}});
export interface Snapshot { user: ManagedUser|null; records: PlatformRecord[]; settings: PlatformSettings; settingsVersion: number; students: ManagedUser[]; progress: Progress; progressVersion: number; interactions: any[]; }
export const profileFromRow = (row: any): ManagedUser => ({
  _revision:row.version,id:row.id,email:row.email,name:row.data?.name || 'Aluno',avatar:row.data?.avatar || '',instrument:row.data?.instrument || '',
  level:row.data?.level || 'Nível Zero',bio:row.data?.bio || '',xp:Number(row.data?.xp || 0),role:row.role,status:row.status,
  subscriptionStatus:row.subscription_status,createdAt:row.created_at,startedCourseIds:row.data?.startedCourseIds || [],completedCourseIds:row.data?.completedCourseIds || [],
});
function ensure<T extends {error:any}>(result:T):T { if(result.error) throw new Error(result.error.message || 'Não foi possível acessar os dados.'); return result; }
export async function loadSnapshot(client: SupabaseClient, authUser: User|null): Promise<Snapshot> {
  const profiles = authUser ? ensure(await client.from('ndm_profiles').select('*')).data || [] : [];
  const self = profiles.find((row:any)=>row.id===authUser?.id);
  if(authUser && !self) throw new Error('Seu perfil ainda não foi configurado. Contate o administrador.');
  const [content, configuration, progress, interactions] = await Promise.all([
    client.from('ndm_records').select('*'),
    client.from('ndm_settings').select('*').eq('id','main').single(),
    authUser ? client.from('ndm_progress').select('*').eq('user_id',authUser.id).maybeSingle() : Promise.resolve({data:null,error:null}),
    authUser ? client.from('ndm_interactions').select('*') : Promise.resolve({data:[],error:null}),
  ]);
  [content,configuration,progress,interactions].forEach(ensure);
  return {user:self ? profileFromRow(self) : null,records:content.data || [],settings:{...configuration.data.data,_revision:configuration.data.version},
    settingsVersion:configuration.data.version,students:profiles.map(profileFromRow),
    progress:{...emptyProgress(),...progress.data?.data},progressVersion:progress.data?.version || 0,interactions:interactions.data || []};
}
export async function commitRecords(client:SupabaseClient, changes:any[]) {
  ensure(await client.rpc('ndm_commit_records',{changes}));
}
export async function saveVersioned(client:SupabaseClient, table:'ndm_settings'|'ndm_progress', id:string, data:any, version:number) {
  const key=table==='ndm_settings'?'id':'user_id';
  const result=version===0
    ? await client.from(table).insert({[key]:id,data,version:1}).select(key).single()
    : await client.from(table).update({data,version:version+1}).eq(key,id).eq('version',version).select(key).single();
  if(result.error?.code==='PGRST116'||result.error?.code==='23505') throw new Error('Os dados mudaram em outra sessão. Reabra o formulário e tente novamente.');
  ensure(result);
  if(!result.data) throw new Error('Os dados mudaram em outra sessão. Atualize e tente novamente.');
}
export function isFeatureEnabled(settings:PlatformSettings,id:string) { return settings.adminMenu?.find(item=>item.id===id)?.visible!==false; }
