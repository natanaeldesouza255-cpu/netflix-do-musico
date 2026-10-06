import React from 'react';
import {render,screen,cleanup,fireEvent} from '@testing-library/react';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
const context=vi.hoisted(()=>({value:{} as any}));
vi.mock('../src/context/AppContext',()=>({AppProvider:({children}:any)=>children,useApp:()=>context.value,isAdminScreen:(screen:string)=>screen.startsWith('Admin')}));
vi.mock('../src/pages/MemberHome',()=>({MemberHome:()=> <div>Student home</div>}));
vi.mock('../src/pages/LoginPage',()=>({LoginPage:()=> <div>Recovery or login</div>}));
vi.mock('../src/pages/admin/AdminDashboard',()=>({AdminDashboard:()=> <div>Admin dashboard</div>}));
vi.mock('../src/components/Navbar',()=>({Navbar:()=> <div>Navigation</div>}));
import {App} from '../src/App';
import {defaultSettings} from '../src/data/seedPlatform';
beforeEach(()=>{context.value={user:{id:'admin',role:'admin'},currentScreen:'MemberHome',isSubscriber:false,authLoading:false,dataError:null,isSaving:false,isRecovery:false,settings:defaultSettings,navigateTo:vi.fn(),toast:null,logoutUser:vi.fn()};});
afterEach(cleanup);
it('keeps the return-to-admin action after remounting the student preview',()=>{
 const first=render(<App/>);expect(screen.getByText('← Voltar ao Admin')).toBeTruthy();first.unmount();
 render(<App/>);fireEvent.click(screen.getByText('← Voltar ao Admin'));expect(context.value.navigateTo).toHaveBeenCalledWith('AdminDashboard');
});
it('does not keep preview mode after switching back to an administrator dashboard',()=>{
 const view=render(<App/>);context.value.currentScreen='AdminDashboard';view.rerender(<App/>);
 expect(screen.getByText('Admin dashboard')).toBeTruthy();expect(screen.queryByText('Student home')).toBeNull();
});
it('does not render premium content for a non-subscriber',()=>{
 context.value.user={id:'pending',role:'student'};render(<App/>);
 expect(screen.getByText('Acesso às aulas indisponível')).toBeTruthy();expect(screen.queryByText('Student home')).toBeNull();
});
it('shows recovery even when the previous screen was administrative',()=>{
 context.value.currentScreen='AdminDashboard';context.value.isRecovery=true;render(<App/>);
 expect(screen.getByText('Recovery or login')).toBeTruthy();expect(screen.queryByText('Admin dashboard')).toBeNull();
});
