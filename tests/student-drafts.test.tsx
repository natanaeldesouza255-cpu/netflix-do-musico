import React from 'react';
import {render,screen,fireEvent,waitFor,cleanup} from '@testing-library/react';
import {afterEach,it,expect,vi} from 'vitest';
const state=vi.hoisted(()=>({user:{name:'Student',avatar:'',level:'Nível Zero'},communityFeed:[],createNewPost:vi.fn(async()=>false)}));
vi.mock('../src/context/AppContext',()=>({useApp:()=>state}));
import {CommunityPage} from '../src/pages/CommunityPage';
afterEach(cleanup);
it('keeps an unpublished draft when remote persistence fails',async()=>{
 render(<CommunityPage/>);
 const input=screen.getByRole('textbox');fireEvent.change(input,{target:{value:'Keep my draft'}});
 fireEvent.submit(input.closest('form')!);
 await waitFor(()=>expect(state.createNewPost).toHaveBeenCalled());
 expect((input as HTMLTextAreaElement).value).toBe('Keep my draft');
});
