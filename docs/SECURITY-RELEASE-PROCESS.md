# Processo de seguranca e publicacao

1. Alterar codigo somente em branch; abrir PR para revisao de codigo e configuracao.
2. Exigir CI aprovado, revisao independente e branch protection no main. Configurar manualmente no GitHub Settings.
3. Usar npm ci e package-lock.json; Dependabot propõe atualizacoes semanais. Revisar e testar cada PR.
4. CI deve ter permissao minima e nao receber credenciais de producao.
5. Desenvolvimento, teste e producao devem usar projetos e segredos separados. Aplicar as mesmas migracoes e politicas, sem copiar dados reais.
6. Supabase Auth: habilitar protecao de senhas vazadas, senha minima forte, MFA administrativo, CAPTCHA e limites de tentativas. Verificar no painel.
7. Nao armazenar senhas no aplicativo, nem enviar tokens para logs ou URLs de consulta.
8. Validar JWT, permissao, MFA e limites no backend; RLS para dados individuais.
9. Testar anonimo, aluno A e aluno B; confirmar que nao acessam dados uns dos outros.
10. Revisar Supabase Security Advisors, Cloudflare headers, logs, backups e restauracao antes de publicar.
11. Fazer verificacao de seguranca apos deploy e manter plano de reversao.
12. Nunca fazer merge do PR #3 ou publicar frontend sem autorizacao expressa.

Pendencias de configuracao externa: regras de protecao do main, revisao independente, protecao de senhas vazadas, CAPTCHA e rate limit Auth, configuracao de Cloudflare e limpeza de dist/node_modules ja versionados. O arquivo de configuracao nao prova ativacao externa.
