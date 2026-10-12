# Teste de isolamento — dois alunos temporários

Data: 2026-10-12. Supabase produção. Duas identidades de teste foram inseridas em `auth.users`, gerando perfis por trigger. Ambas tiveram assinatura ativa **somente dentro de transação SQL**, com JWT claims simulados para `authenticated` AAL1 e `SET LOCAL ROLE authenticated`.

## Resultado: 7/7 aprovados
1. Aluno A lê próprio perfil: PASSOU.
2. Aluno A não lê perfil B: PASSOU.
3. Aluno B lê próprio perfil: PASSOU.
4. Aluno B não lê perfil A: PASSOU.
5. Aluno A não obtém papel admin: PASSOU.
6. Aluno A não consegue promover próprio perfil com UPDATE direto: PASSOU (SQLSTATE 42501).
7. Aluno A não executa `ndm_commit_records`: PASSOU (SQLSTATE P0001).

Todos os testes ocorreram na mesma transação, encerrada por `ROLLBACK`. Consulta posterior confirmou **0 contas temporárias em auth.users** e **0 perfis temporários em ndm_profiles**.

**Limitação:** testes de isolamento são SQL com contexto de autenticação simulado; não representam duas sessões HTTP reais, nem demonstram refresh/logout/revogação de token. O teste HTTP anônimo da Edge Function retornou 401 e a suíte local teve 39/39 testes aprovados. Não foi feito merge nem deploy do frontend.
