import type { PlatformRecord, RecordKind } from './platform';
// Read only after the authenticated administrator explicitly requests an import.
// Never import profiles, roles, payments, sessions or somebody else's progress.
export function legacyChanges(storage: Pick<Storage,'getItem'>, existing: PlatformRecord[]) {
  const sources: [string,RecordKind][]=[['courses','course'],['modules','module'],['catalogLessons','lesson'],['lives','live'],['marketplaceItems','marketplace'],['equipments','equipment']];
  return sources.flatMap(([key,kind])=>{
    let values:unknown;try{values=JSON.parse(storage.getItem(`ndm_${key}`)||'[]');}catch{throw new Error(`Não foi possível ler ${key}. Os dados originais foram preservados.`);}
    if(!Array.isArray(values))throw new Error(`Formato inválido em ${key}.`);
    return values.filter(data=>data&&typeof data.id==='string'&&!existing.some(row=>row.kind===kind&&row.id===data.id)).map(data=>({kind,id:data.id,version:0,op:'upsert',data}));
  });
}
