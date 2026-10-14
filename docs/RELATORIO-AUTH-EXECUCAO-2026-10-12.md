# Autenticação e permissões — relatório de execução

Data: 2026-10-12. Ambiente: Supabase fsqevkrbxrmurvhvikay.

## Verificado
- RLS ativo nas seis tabelas principais: ndm_profiles, ndm_records, ndm_progress, ndm_interactions, ndm_settings, ndm_security_audit.
- Impersonação SQL em transações somente leitura: aluno AAL1/AAL2 não é admin; só visualiza próprio perfil; auditoria invisível.
- Admin AAL1 não recebe autorização administrativa; admin AAL2 recebe.
- Perfil de aluno não tem GRANT UPDATE direto em ndm_profiles, nem INSERT na auditoria.
- Função ndm_private.update_own_profile só permite name, bio, instrument, avatar, level do próprio usuário; não permite alterar role, status ou subscription_status.
- ndm_private.is_admin verifica auth.uid(), papel admin, status active e MFA AAL2 no banco.
- ndm_commit_records exige is_admin no servidor.
- Edge Function admin-delete-student v5 implantada ACTIVE, verify_jwt=true, MFA AAL2, validação de papel, UUID, tamanho e rate limit atômico 5/15min via ndm_check_admin_rate_limit; bloqueio 429, falha fechada 503.
- Frontend usa Supabase Auth getUser/signInWithPassword/signOut/onAuthStateChange, refresh automático de sessão e role derivado de ndm_profiles.

## Não comprovado em teste de ponta a ponta
- Logout e revogação real de token, refresh, recuperação de senha, múltiplas abas e sessões expiradas.
- Testes HTTP com duas contas autenticadas e uma anônima; tentativa real de UPDATE/INSERT/DELETE indevido e armazenamento privado.
- HTTP 429 da Edge Function v5 (não disparar exclusões reais para testar).
- Busca exaustiva de caminhos legados de login e permissões em todos os arquivos.

## Alertas relacionados
- Security Advisor: leaked-password protection disabled; https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Legacy public.profiles com RLS sem policy; acesso negado por padrão.

Conclusão: controles críticos verificados e rate limit publicado; o tópico não deve ser marcado 100% concluído sem testes HTTP de sessão e de acesso cruzado. Não foi feito merge do PR nem deploy do frontend.
