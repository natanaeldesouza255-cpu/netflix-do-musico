import {expect,it} from 'vitest';
import {legacyChanges} from '../src/lib/legacyImport';
it('imports content in parent order without restoring identities or replacing remote records',()=>{
 const local:any={ndm_courses:JSON.stringify([{id:'keep'},{id:'new'}]),ndm_modules:JSON.stringify([{id:'module',courseId:'new'}]),ndm_user:JSON.stringify({role:'admin'}),ndm_students:JSON.stringify([{role:'admin'}])};
 const changes=legacyChanges({getItem:(key)=>local[key]||null},[{kind:'course',id:'keep',data:{title:'remote'},version:2}]);
 expect(changes.map(c=>[c.kind,c.id])).toEqual([['course','new'],['module','module']]);
});
