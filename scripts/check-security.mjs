import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const tracked=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
const failures=[];
for(const file of tracked){
  if(/^\.env(?:\.|$)/.test(file)&&file!=='.env.example')failures.push(file+': environment file tracked');
  if(!/^(src\/|supabase\/functions\/|scripts\/|\.github\/)/.test(file)||!(/\.(tsx?|jsx?|mjs|cjs|ya?ml)$/.test(file)))continue;
  let content;try{content=readFileSync(file,'utf8')}catch{continue}
  if(/(?:SUPABASE_SERVICE_ROLE_KEY|service_role_key)\s*[:=]\s*['"][^'"]{20,}['"]/i.test(content))failures.push(file+': service-role secret literal');
  if(/(?:MERCADO_PAGO_ACCESS_TOKEN|MP_ACCESS_TOKEN)\s*[:=]\s*['"][^'"]{12,}['"]/i.test(content))failures.push(file+': payment secret literal');
}
if(failures.length){console.error('Security checks failed:\n'+failures.join('\n'));process.exit(1)}
console.log('Security checks passed: no tracked env secrets or obvious hardcoded service/payment tokens.');
