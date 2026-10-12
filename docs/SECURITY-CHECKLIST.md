# Security release checklist — Netflix do Músico

## Verified 2026-10-12
- Production npm dependency audit: 0 reported vulnerabilities at time of scan.
- Supabase RLS policies exist for ndm_profiles, ndm_records, ndm_progress, ndm_interactions and settings; manual abuse tests still required.
- Supabase security advisor warns that leaked-password protection is disabled. Enable in Auth settings.
- Legacy public.profiles has RLS with no policy; inspect before changing or deleting.
- GitHub CI builds and tests on PR/push.
- Repository still tracks generated dist/ and node_modules/; schedule separate index cleanup and review impact before mass deletion.

## Mandatory before production
- Enforce MFA on owner GitHub, Supabase, domain registrar and hosting; store recovery codes offline.
- Protect main branch and require passing CI + review for merges. Audit collaborators and deploy tokens.
- Rotate any secret ever committed or exposed. Never use Supabase service-role or Mercado Pago tokens in browser.
- Test unauthorized API access with separate student and unauthenticated sessions, not just UI guards.
- Use hosted Mercado Pago checkout; never store full card numbers, CVV or customer passwords.
- Test private video signed URL expiration and access revocation; short-lived URLs are bearer links, not DRM.
- Configure rate limiting, bot protections, monitoring and tested database backups.
- Define retention, privacy notice, access requests and incident response under LGPD.

## Registro de teste e revisao visual - 2026-10-12
- Conta de aluno entrou pela janela anonima e visualizou a home; isso nao comprova acesso a conteudo premium.
- Pendente: conferir status da assinatura e publicacao do curso, testar abertura da aula e reproducao de video com assinatura pendente/inativa.
- Pendente: teste de acesso indevido via API entre duas contas distintas e conta anonima.
- Design aluno (prioridade apos seguranca): revisar logotipo quebrado, tipografia, nomes/textos estranhos, menu superior apertado, hero muito grande, alinhamento e responsividade mobile.

## Atualizacao de seguranca - 2026-10-12

### Concluido e verificado
- Cloudflare Pages conectada ao GitHub; publicacoes automaticas de producao e preview desativadas.
- Edge Function admin-delete-student v3 ativa no Supabase, JWT obrigatorio, MFA AAL2 e corpo limitado a 1 KB.
- Cabecalhos de seguranca adicionados em public/_headers; ainda nao implantados na Cloudflare.
- Links assinados dos videos privados reduzidos de 3600 para 900 segundos; ainda nao implantados na Cloudflare.
- npm audit de dependencias de producao: zero vulnerabilidades reportadas no momento da verificacao.
- Build e 39 testes automatizados aprovados.
- Auditoria do banco de dados registra mudancas sensiveis em perfis; falta testar gatilho e sincronizar migracao local.

### Bloqueadores antes de disponibilizar alunos
- Uma implantacao de producao permanece ativa na Cloudflare; API recusou exclui-la enquanto ativa. Nao considerar site privado.
- Zero Trust gratuito requer metodo de pagamento na conta; nao ativado.
- Publicar pagina de manutencao ou implantar outra restricao antes de testes publicos.
- Configurar variaveis publicas VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY com cuidado; nunca service_role no frontend.
- Configurar limitacao de taxa em endpoints Supabase e protecao contra abuso.
- Revisar SSRF/RCE nas funcoes futuras e validar dependencias em CI.
- Revisar firewall, colaboradores, tokens e acessos remotos.
- Testar backup e restauracao, sem tocar nos dados de producao sem planejamento.
- Testar videos longos e seek apos expiracao de URL assinada.
- Nao fazer merge do PR #3 sem autorizacao expressa.

## Firewall e limites - 2026-10-12
- Cloudflare nao possui zona de dominio proprio nesta conta; WAF por zona nao pode ser aplicado diretamente ao pages.dev.
- Limite atomico no banco criado: ate 5 tentativas de exclusao por administrador a cada 15 minutos; acesso RPC somente service_role.
- Codigo da Edge Function com verificacao de limite salvo e testado no GitHub (commit a31ae0b).
- BLOQUEADO: Supabase deploy_edge_function retornou erro interno em duas tentativas; versao remota continua v3 sem rate limit. Nao considerar ativado ate publicar v4 e validar 429.
- Pendente: regras anti-bot e rate limits para Auth e demais APIs; backup/restauracao e revisao WAF apos dominio proprio.

## Backup e recuperacao - 2026-10-12
- Procedimento criado: docs/BACKUP-RECOVERY.md.
- Script scripts/database-recovery.mjs criado, sintaxe validada; exige conexoes via variaveis de ambiente, impede pasta dentro do repositorio, e exige confirmacao explicita para restauracao.
- Nao concluido: pg_dump e pg_restore nao estao instalados no computador; nao foi gerado backup real, nem testada restauracao; disponibilidade de backups gerenciados do Supabase ainda nao confirmada.
- Storage MP4 precisa de copia independente: dump PostgreSQL nao contem bytes dos videos.
- Proxima validacao: obter ferramentas PostgreSQL, executar backup real criptografado, ensaiar restauracao em banco isolado e comparar dados.
