# Resultado dos testes de autenticação — 2026-10-12

Ambiente: Supabase produção fsqevkrbxrmurvhvikay. Testes de impersonação SQL em transações READ ONLY com SET LOCAL ROLE e claims simulados; sem alterar registros.

## Resultados
- Aluno autenticado (AAL1): auth.uid() presente, ndm_private.is_admin() = false; apenas 1 perfil visível entre 2 existentes; tabela de auditoria sem registros visíveis.
- Aluno autenticado (AAL2): ndm_private.is_admin() = false; apenas o próprio perfil visível.
- Administrador autenticado AAL1: ndm_private.is_admin() = false.
- Administrador autenticado AAL2: ndm_private.is_admin() = true.
- Anônimo: SELECT direto de ndm_profiles rejeitado por falta de GRANT (negação correta).
- ndm_private.is_admin() verifica simultaneamente auth.jwt().aal='aal2', auth.uid(), role='admin' e status='active' no banco.
- ndm_private.update_own_profile() só grava name, bio, instrument, avatar, level no próprio perfil ativo; não permite role/status/subscription_status.
- public.ndm_commit_records() verifica ndm_private.is_admin() no servidor.
- Edge Function admin-delete-student está ACTIVE v4, verify_jwt=true, valida usuário, MFA AAL2 e papel ativo. IMPORTANTE: código publicado v4 NÃO chama ndm_check_admin_rate_limit; limitação de exclusão ainda NÃO efetiva.
- Supabase security advisor alerta leaked password protection disabled. Tabela legacy public.profiles tem RLS sem políticas (acesso negado por padrão).

## Não comprovado / bloqueadores
- Não foram executados testes HTTP completos de login, logout, token revogado, refresh token, MFA interativo ou recuperação de senha.
- Não foram executados INSERT/UPDATE/DELETE adversariais nem testes de acesso a Storage e conteúdo premium; requer contas de teste e cuidado para não alterar dados reais.
- Procurar caminhos legados de elevação de privilégio em todo o código e migrations.
- Corrigir/publicar rate limit na Edge Function e validar HTTP 429.
- Habilitar proteção contra senhas vazadas se disponível sem custo.

Conclusão: autorização RLS e MFA demonstradas em consultas SQL simuladas; tópico 1 parcialmente validado, NÃO 100% encerrado.
