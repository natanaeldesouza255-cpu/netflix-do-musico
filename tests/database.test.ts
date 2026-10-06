// @vitest-environment node
import {PGlite} from '@electric-sql/pglite';
import {readFileSync} from 'node:fs';
import {beforeAll,afterAll,it,expect} from 'vitest';
let db:PGlite;
const admin='11111111-1111-4111-8111-111111111111',alice='22222222-2222-4222-8222-222222222222',bob='33333333-3333-4333-8333-333333333333';
async function asUser<T>(id:string,fn:()=>Promise<T>){await db.exec(`set role authenticated; select set_config('request.jwt.claim.sub','${id}',false)`);try{return await fn();}finally{await db.exec('reset role');}}
beforeAll(async()=>{
 db=new PGlite();
 await db.exec(`create role anon; create role authenticated; create schema auth;
 create table auth.users(id uuid primary key,email text,raw_app_meta_data jsonb default '{}',raw_user_meta_data jsonb default '{}');
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
 alter default privileges in schema public grant all on tables to anon,authenticated;
 create table public.courses(id bigint primary key,name text,visible boolean);
 insert into public.courses values(1,'Visible',true),(2,'Hidden',false);
 create table public.profiles(id bigint primary key,email text,role text);
 alter table public.profiles enable row level security;
 create table public.platform_settings(id text primary key);
 alter table public.platform_settings enable row level security;
 create policy "platform settings authenticated update" on public.platform_settings for update to authenticated using(true) with check(true);
 create policy "platform settings authenticated write" on public.platform_settings for insert to authenticated with check(true);
 grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;
 insert into auth.users(id,email,raw_app_meta_data) values ('${admin}','admin@test.invalid','{"role":"admin"}'),('${alice}','alice@test.invalid','{}'),('${bob}','bob@test.invalid','{}');`);
 await db.exec(readFileSync('supabase/migrations/20261006233738_secure_platform.sql','utf8'));
 await db.exec(readFileSync('supabase/migrations/20261006233921_harden_database_grants.sql','utf8'));
 await db.exec(`update ndm_profiles set subscription_status='active' where id='${alice}';
 insert into ndm_records(kind,id,data) values ('course','course1','{"title":"Published","status":"published"}'),('course','draft1','{"status":"draft"}');
 insert into ndm_records(kind,id,data) values ('module','module1','{"courseId":"course1"}'),('module','draftmodule','{"courseId":"draft1"}');
 insert into ndm_records(kind,id,data) values
 ('lesson','paid','{"courseId":"course1","moduleId":"module1","status":"published","isFree":false}'),
 ('lesson','free','{"courseId":"course1","moduleId":"module1","status":"published","isFree":true}'),
 ('lesson','hidden','{"courseId":"draft1","moduleId":"draftmodule","status":"published","isFree":true}');`);
},30000);
afterAll(async()=>{await db?.close();});
it('denies privilege escalation and activation by an ordinary student',async()=>{
 await asUser(bob,async()=>{
  await expect(db.exec(`update ndm_profiles set role='admin' where id='${bob}'`)).rejects.toThrow();
  await db.exec(`update ndm_profiles set subscription_status='active' where id='${bob}'`);
  await expect(db.query('select ndm_commit_records($1)',[JSON.stringify([{kind:'course',id:'hack',version:0,data:{status:'published'}}])])).rejects.toThrow(/restrito/);
 });
 const {rows}=await db.query<any>(`select role,subscription_status from ndm_profiles where id='${bob}'`);
 expect(rows[0]).toMatchObject({role:'student',subscription_status:'pending'});
});
it('filters unpublished ancestors and paid lessons at the database boundary',async()=>{
 await asUser(alice,async()=>{
  const {rows}=await db.query<any>("select id from ndm_records where kind='lesson' order by id");expect(rows.map(r=>r.id)).toEqual(['free','paid']);
 });
 await asUser(bob,async()=>{
  const {rows}=await db.query<any>("select id from ndm_records where kind='lesson' order by id");expect(rows.map(r=>r.id)).toEqual(['free']);
 });
});
it('isolates progress for different accounts',async()=>{
 await asUser(alice,()=>db.query('insert into ndm_progress(user_id,data) values($1,$2)',[alice,{completedLessons:['paid']} ]));
 await asUser(bob,async()=>{
  expect((await db.query('select * from ndm_progress')).rows).toHaveLength(0);
  await expect(db.query('insert into ndm_progress(user_id,data) values($1,$2)',[alice,{}])).rejects.toThrow();
 });
});
it('keeps admin changes shared and rejects stale writes atomically',async()=>{
 await asUser(admin,async()=>{
  await db.query('select ndm_commit_records($1)',[JSON.stringify([{kind:'course',id:'course1',version:1,data:{title:'Updated',status:'published'}}])]);
  await expect(db.query('select ndm_commit_records($1)',[JSON.stringify([{kind:'course',id:'new',version:0,data:{title:'rollback',status:'draft'}},{kind:'course',id:'course1',version:1,data:{status:'draft'}}])])).rejects.toThrow(/outra sessão/);
 });
 await asUser(alice,async()=>{const {rows}=await db.query<any>("select data from ndm_records where id='course1'");expect(rows[0].data.title).toBe('Updated');});
 expect((await db.query("select * from ndm_records where id='new'")).rows).toHaveLength(0);
});
it('does not allow students to change settings',async()=>{
 await asUser(alice,()=>db.exec(`update ndm_settings set data='{}' where id='main'`));
 expect((await db.query<any>('select data from ndm_settings')).rows[0].data.platformName).toBe('Netflix do Músico');
});
it('rejects a lesson pointing to a module of another course',async()=>{
 await asUser(admin,async()=>{await expect(db.query('select ndm_commit_records($1)',[JSON.stringify([{kind:'lesson',id:'wrong',version:0,data:{courseId:'draft1',moduleId:'module1',status:'published'}}])])).rejects.toThrow(/não pertence/);});
});
it('creates new users as pending students regardless of user metadata',async()=>{
 const id='44444444-4444-4444-8444-444444444444';
 await db.query('insert into auth.users(id,email,raw_user_meta_data) values($1,$2,$3)',[id,'new@test.invalid',{role:'admin',subscription_status:'active'}]);
 const {rows}=await db.query<any>('select role,subscription_status from ndm_profiles where id=$1',[id]);
 expect(rows[0]).toMatchObject({role:'student',subscription_status:'pending'});
});
it('denies record writes from an anonymous session',async()=>{
 await db.exec("set role anon; select set_config('request.jwt.claim.sub','',false)");
 try{await expect(db.exec("insert into ndm_records(kind,id,data) values('course','anon','{}')")).rejects.toThrow();}finally{await db.exec('reset role');}
});
it('keeps reported posts visible but hides moderated posts and disabled sections',async()=>{
 await asUser(alice,()=>db.query("insert into ndm_records(kind,id,author_id,data) values('post','p1',$1,$2)",[alice,{content:'Real post',moderationStatus:'visible',authorName:'Spoofed'}]));
 const post=(await db.query<any>("select data from ndm_records where id='p1'")).rows[0].data;
 expect(post.authorName).not.toBe('Spoofed');expect(post.authorId).toBe(alice);
 await db.exec("update ndm_records set data=data||'{\"moderationStatus\":\"reported\"}' where id='p1'");
 await asUser(alice,async()=>expect((await db.query("select id from ndm_records where id='p1'")).rows).toHaveLength(1));
 await db.exec("update ndm_records set data=data||'{\"moderationStatus\":\"hidden\"}' where id='p1'");
 await asUser(alice,async()=>expect((await db.query("select id from ndm_records where id='p1'")).rows).toHaveLength(0));
 await db.exec(`insert into ndm_records(kind,id,data) values ('equipment','eq1','{"published":true}');
 update ndm_settings set data=jsonb_set(data,'{adminMenu}','[{"id":"equipment","visible":false}]');`);
 await asUser(alice,async()=>expect((await db.query("select id from ndm_records where id='eq1'")).rows).toHaveLength(0));
});
it('cascades a deleted course to modules and lessons',async()=>{
 await asUser(admin,()=>db.query('select ndm_commit_records($1)',[JSON.stringify([{kind:'course',id:'draft1',version:1,op:'delete'}])]));
 expect((await db.query("select id from ndm_records where id in ('draft1','draftmodule','hidden')")).rows).toHaveLength(0);
});
it('does not permit registration when settings disable it',async()=>{
 await db.exec("update ndm_settings set data=jsonb_set(data,'{allowRegistrations}','false')");
 await expect(db.exec("insert into auth.users(id,email) values('55555555-5555-4555-8555-555555555555','blocked@test.invalid')")).rejects.toThrow(/desativados/);
});
it('rejects executable and untrusted video URLs in student posts',async()=>{
 await asUser(alice,async()=>{
  await expect(db.query("insert into ndm_records(kind,id,author_id,data) values('post','unsafe',$1,$2)",[alice,{content:'unsafe',videoUrl:'javascript:parent.alert(1)',moderationStatus:'visible'}])).rejects.toThrow();
 });
});

it('removes inherited destructive grants and protects legacy course visibility',async()=>{
 const {rows}=await db.query<any>("select has_table_privilege('anon','ndm_progress','TRUNCATE') as truncate,has_column_privilege('authenticated','ndm_profiles','role','UPDATE') as role_update");
 expect(rows[0]).toEqual({truncate:false,role_update:false});
 await db.exec('set role anon');
 try {expect((await db.query<any>('select name from courses')).rows).toEqual([{name:'Visible'}]); await expect(db.exec("delete from courses")).rejects.toThrow();}
 finally {await db.exec('reset role');}
});
