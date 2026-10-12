# Auditoria de autenticação e permissões — 2026-10-12

Escopo: branch feature/admin-aluno-integracao. Não realizar merge nem publicar sem autorização.

## Seis subitens e evidências
1. MFA de administradores — PARCIALMENTE VERIFICADO: Edge Function admin-delete-student v3 exige JWT e AAL2; conferir se TODAS as operações administrativas exigem MFA, inclusive RPC e gravações diretas.
2. RLS e isolamento — IMPLEMENTADO, TESTE DE ABUSO PENDENTE: RLS em ndm_profiles, ndm_records, ndm_progress, ndm_interactions e ndm_settings. Testar usuário A, usuário B, anônimo e admin com SELECT/INSERT/UPDATE/DELETE; verificar storage.
3. Permissões de administrador — AUDITAR: AppContext.allowed() impede navegação admin para alunos; isso é UX, não fronteira de segurança. Conferir políticas e funções SECURITY DEFINER por auth.uid(), papel no banco, status e MFA quando necessário. Validar usuário desativado.
4. Privilégio por e-mail/local — CÓDIGO PRINCIPAL REVISADO: loadSnapshot lê ndm_profiles do Supabase e perfil.role; login usa auth.signInWithPassword. Procurar outros caminhos legados e fallback de contas de teste, inclusive políticas SQL e código Edge; não confiar em user_metadata ou localStorage para privilégios.
5. Acesso indevido — PENDENTE: testar conta anônima, dois alunos distintos e admin contra endpoints PostgREST, RPCs e storage; testar mudança de role, status e subscription_status por aluno; testar curso não publicado. Usar contas descartáveis e não alterar dados reais.
6. Sessões e tokens — PARCIAL: createClient tem persistSession:true, autoRefreshToken:true e detectSessionInUrl:true; AppContext ouve onAuthStateChange, SIGNED_OUT e faz refresh. Testar expiração, logout em outra aba, recuperação de senha, troca de privilégios durante sessão, sessão revogada, refresh falho e MFA após login.

## Achados concretos de código
- src/context/AppContext.tsx: allowed() bloqueia navegação admin com base em user.role, e refreshData() chama supabase.auth.getUser() e loadSnapshot().
- src/lib/platform.ts: loadSnapshot() carrega ndm_profiles e identifica o perfil por authUser.id; a proteção final depende das políticas RLS, não do filtro no browser.
- src/lib/supabase.ts: Supabase Auth gerencia persistência e refresh do token.
- src/context/AppContext.tsx: refreshData() pode exibir error.message bruto em dataError; tratar no tópico de erros seguros, evitando detalhes internos ao cliente.
- Supabase security advisor: proteção contra senhas vazadas desabilitada; ativar se disponível no plano sem custo.

## Critérios de conclusão
- Nenhum usuário anônimo ou aluno acessa/modifica dados de outro aluno ou administração, mesmo por requisição direta.
- Operações administrativas sensíveis exigem identidade e papel verificados no servidor; MFA conforme criticidade.
- Aluno não consegue alterar role/status/subscription_status por API.
- Revogação/logout/expiração de sessão bloqueiam novas operações protegidas.
- Testes reproduzíveis aprovados, sem expor credenciais ou afetar produção.

Status geral: NÃO CONCLUÍDO. Auditoria de código iniciada; testes adversariais ainda pendentes.
