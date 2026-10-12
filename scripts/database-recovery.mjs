import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, realpathSync, statSync, chmodSync } from 'node:fs';
import { resolve, dirname, relative, basename, join } from 'node:path';

const [action, fileArg, flag] = process.argv.slice(2);
const root = realpathSync(resolve(import.meta.dirname, '..'));
const insideProject = (path) => {
  const rel = relative(root, resolve(path));
  return rel === '' || (!rel.startsWith('..') && !rel.startsWith('/') && !rel.startsWith('\\'));
};
function run(binary, args, connection) {
  const result = spawnSync(binary, args, {
    stdio: 'inherit', shell: false,
    env: { ...process.env, PGDATABASE: connection },
  });
  if (result.error) throw new Error(binary + ' nao encontrado. Instale PostgreSQL client tools 17 ou superior.');
  if (result.status !== 0) throw new Error(binary + ' falhou (codigo ' + result.status + ').');
}
if (action === 'backup') {
  const source = process.env.NDM_BACKUP_DATABASE_URL;
  if (!source) throw new Error('Defina NDM_BACKUP_DATABASE_URL fora do repositorio.');
  const folder = resolve(fileArg || join(process.env.USERPROFILE || process.env.HOME || '.', 'ndm-backups'));
  if (insideProject(folder)) throw new Error('Nunca salve backups dentro do repositorio.');
  mkdirSync(folder, { recursive: true });
  const name = 'ndm-' + new Date().toISOString().replace(/[:.]/g, '-') + '.dump';
  const output = join(folder, name);
  run('pg_dump', ['--format=custom', '--no-owner', '--no-acl', '--file', output], source);
  if (statSync(output).size < 100) throw new Error('Backup muito pequeno: verificar arquivo.');
  if (process.platform !== 'win32') chmodSync(output, 0o600);
  run('pg_restore', ['--list', output], source);
  console.log('Backup criado e catalogo verificado: ' + output);
  console.log('IMPORTANTE: arquivo contem dados privados. Criptografe e armazene fora do computador.');
} else if (action === 'verify') {
  const file = resolve(fileArg || '');
  if (!fileArg || !existsSync(file)) throw new Error('Informe um arquivo .dump existente.');
  run('pg_restore', ['--list', file], '');
  console.log('Catalogo legivel; integridade logica e restauracao ainda nao comprovadas.');
} else if (action === 'restore') {
  const file = resolve(fileArg || '');
  const target = process.env.NDM_RESTORE_DATABASE_URL;
  const source = process.env.NDM_BACKUP_DATABASE_URL;
  if (!fileArg || !existsSync(file)) throw new Error('Informe um arquivo .dump existente.');
  if (!target || !source) throw new Error('Defina NDM_RESTORE_DATABASE_URL e NDM_BACKUP_DATABASE_URL.');
  if (target === source) throw new Error('Origem e destino iguais. Restauracao bloqueada.');
  if (flag !== '--confirm-restore') throw new Error('Restauracao bloqueada. Use --confirm-restore apenas em banco vazio de testes.');
  console.log('Restaurando em ambiente de testes. Nao use um banco com dados importantes.');
  run('pg_restore', ['--no-owner', '--no-acl', '--exit-on-error', file], target);
  console.log('Comando concluido. Valide tabelas, contagens, RLS, usuarios e Storage antes de declarar recuperacao.');
} else {
  console.log('Uso: node scripts/database-recovery.mjs backup [PASTA_FORA_DO_REPO]');
  console.log('     node scripts/database-recovery.mjs verify ARQUIVO.dump');
  console.log('     node scripts/database-recovery.mjs restore ARQUIVO.dump --confirm-restore');
  process.exitCode = 1;
}
