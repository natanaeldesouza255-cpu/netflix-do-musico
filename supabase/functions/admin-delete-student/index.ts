import { createClient } from 'npm:@supabase/supabase-js@2';
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};
Deno.serve(async (req: Request) => {
  const fail = (status: number, error: string) => new Response(JSON.stringify({ error }), { status, headers: cors });
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST') return fail(405, 'Método não permitido.');
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !anon || !service) return fail(500, 'Configuração do servidor incompleta.');
  const authorization = req.headers.get('Authorization') ?? '';
  const token = authorization.replace(/^Bearer\s+/i, '');
  if (!token || token === authorization) return fail(401, 'Faça login novamente.');
  const client = createClient(url, anon, { auth: { persistSession: false } });
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return fail(401, 'Sessão inválida. Entre novamente.');
  // Verify the AAL claim only after Supabase Auth has validated this JWT.
  const payload = (() => { try { return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch { return null; } })();
  if (payload?.aal !== 'aal2') return fail(403, 'Confirme a autenticação em duas etapas e tente novamente.');
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { data: actor, error: actorError } = await admin.from('ndm_profiles').select('role,status').eq('id', user.id).single();
  if (actorError || actor?.role !== 'admin' || actor.status !== 'active') return fail(403, 'Apenas administradores ativos podem excluir alunos.');
  let body: { studentId?: string };
  try { body = await req.json(); } catch { return fail(400, 'Solicitação inválida.'); }
  const id = body.studentId;
  if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) || id === user.id) return fail(400, 'Aluno inválido.');
  const { data: target, error: targetError } = await admin.from('ndm_profiles').select('role').eq('id', id).single();
  if (targetError || target?.role !== 'student') return fail(403, 'Somente contas de aluno podem ser excluídas.');
  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) { console.error('admin-delete-student failed', deleteError.message); return fail(500, 'Falha no servidor ao excluir a conta.'); }
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
});