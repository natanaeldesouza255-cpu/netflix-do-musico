import React from 'react';
import {act,cleanup,renderHook,waitFor} from '@testing-library/react';
import {afterEach,beforeEach,it,expect,vi} from 'vitest';
const fake=vi.hoisted(()=>({user:null as any,snapshot:null as any,listener:null as any,save:vi.fn(),signOut:vi.fn(),loadError:null as any}));
vi.mock('../src/lib/supabase',()=>({isSupabaseConfigured:true,supabase:{
 auth:{getUser:async()=>({data:{user:fake.user},error:null}),onAuthStateChange:(listener:any)=>{fake.listener=listener;return {data:{subscription:{unsubscribe(){}}}};},signInWithPassword:async()=>{fake.listener('SIGNED_IN',{});return {data:{user:fake.user},error:null};},signOut:async()=>{fake.signOut();fake.user=null;return {error:null};}},
}}));
vi.mock('../src/lib/platform',async(importOriginal)=>{const original=await importOriginal<any>();return {...original,loadSnapshot:async()=>{if(fake.loadError)throw fake.loadError;return structuredClone(fake.snapshot);},saveVersioned:(...args:any[])=>fake.save(...args)};});
import {AppProvider,useApp} from '../src/context/AppContext';
import {defaultSettings} from '../src/data/seedPlatform';
import {emptyProgress} from '../src/lib/platform';
const wrapper=({children}:{children:React.ReactNode})=><AppProvider>{children}</AppProvider>;
afterEach(cleanup);
beforeEach(()=>{
 fake.loadError=null;fake.save.mockReset();fake.signOut.mockReset();fake.user={id:'real-user'};
 fake.snapshot={user:{id:'real-user',name:'Real',role:'student',status:'active',subscriptionStatus:'pending'},records:[],students:[],settings:{...defaultSettings},settingsVersion:1,progress:emptyProgress(),progressVersion:0,interactions:[]};
});
it('does not grant subscriber access to a pending account',async()=>{
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 expect(result.current.user?.id).toBe('real-user');expect(result.current.isSubscriber).toBe(false);
 act(()=>result.current.navigateTo('CategoryPage'));expect(result.current.currentScreen).toBe('MemberHome');
});
it('preserves confirmed settings when the remote save fails',async()=>{
 fake.snapshot.user.role='admin';fake.save.mockRejectedValue(new Error('Permission denied'));
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 let ok:any;await act(async()=>{ok=await result.current.saveSettings({platformName:'Unsaved'});});
 expect(ok).toBe(false);expect(result.current.settings.platformName).toBe(defaultSettings.platformName);expect(result.current.toast?.type).toBe('error');expect(result.current.isSaving).toBe(false);
});
it('clears private state immediately on Supabase sign-out',async()=>{
 fake.snapshot.user.subscriptionStatus='active';fake.snapshot.progress.favoriteLessons=['private'];
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.user).not.toBeNull());
 act(()=>fake.listener('SIGNED_OUT',null));expect(result.current.user).toBeNull();expect(result.current.favoriteLessons).toEqual([]);expect(result.current.isSubscriber).toBe(false);
});
it('opens password recovery independently of the last page',async()=>{
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 act(()=>fake.listener('PASSWORD_RECOVERY',{}));expect(result.current.isRecovery).toBe(true);expect(result.current.currentScreen).toBe('Login');
});
it('keeps login successful when Supabase emits SIGNED_IN',async()=>{
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 let ok:any;await act(async()=>{ok=await result.current.loginUser('real@test.invalid','correct-password');});
 expect(ok).toBe(true);expect(fake.signOut).not.toHaveBeenCalled();
});
it('submits the settings revision from when editing began, not a newer background refresh',async()=>{
 fake.snapshot.user.role='admin';fake.snapshot.settings._revision=1;
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 const edited={...result.current.settings,platformName:'My edit'};
 fake.snapshot.settingsVersion=2;fake.snapshot.settings={...fake.snapshot.settings,_revision:2,platformName:'Another admin'};
 await act(async()=>{await result.current.refreshData();});
 await act(async()=>{await result.current.saveSettings(edited);});
 expect(fake.save.mock.calls[0][4]).toBe(1);
});

it('preserves the confirmed snapshot when a background data read fails',async()=>{
 fake.snapshot.user.role='admin';
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 fake.loadError=new Error('Network offline');
 await act(async()=>{await result.current.refreshData();});
 expect(result.current.user?.id).toBe('real-user');expect(result.current.settings.platformName).toBe(defaultSettings.platformName);expect(result.current.dataError).toBeNull();
});
it.each(['pending','overdue','cancelled'])('blocks student content when subscription is %s',async(status)=>{
 fake.snapshot.user.subscriptionStatus=status;
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 expect(result.current.isSubscriber).toBe(false);
 act(()=>result.current.navigateTo('CategoryPage'));
 expect(result.current.currentScreen).toBe('MemberHome');
});
it('grants content access only to an active student with an active subscription',async()=>{
 fake.snapshot.user.subscriptionStatus='active';
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 expect(result.current.isSubscriber).toBe(true);
 act(()=>result.current.navigateTo('CategoryPage'));
 expect(result.current.currentScreen).toBe('CategoryPage');
});
it('blocks subscribed students during maintenance',async()=>{
 fake.snapshot.user.subscriptionStatus='active';fake.snapshot.settings.maintenanceMode=true;
 const {result}=renderHook(useApp,{wrapper});await waitFor(()=>expect(result.current.authLoading).toBe(false));
 expect(result.current.isSubscriber).toBe(false);
});
