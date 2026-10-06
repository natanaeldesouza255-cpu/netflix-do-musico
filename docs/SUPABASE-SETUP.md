# Ativação da integração corrigida

## Estado desta entrega

A migração foi validada em PostgreSQL local (PGlite), incluindo RLS e isolamento entre contas. **Não foi aplicada ao projeto remoto:** o conector retornou timeout mesmo para `select 1`. Não publicar esta versão antes de completar os passos abaixo. A aplicação falha de forma fechada caso faltem as tabelas; não recorre a dados de demonstração.

## Banco

1. Conferir o esquema e fazer um backup do projeto antes da migração. Verificar que ainda não existem as tabelas `ndm_*`.
2. Aplicar uma única vez `supabase/migrations/20261006173000_secure_platform.sql` pelo SQL Editor ou pelo fluxo de migrações Supabase.
3. O script cria tabelas novas com RLS, copia configurações de `platform_settings` se a tabela existir, e cria perfis para contas Auth existentes. Não exclui tabelas antigas nem importa dados de demonstração.
4. Contas existentes são alunos com assinatura pendente, exceto quem já tem `raw_app_meta_data.role = admin`, uma atribuição feita no servidor. Conferir a identidade da conta administradora em Authentication > Users. Se necessário, um operador autorizado deve atribuir `role = admin` e `subscription_status = active` ao UUID **verificado** dessa conta em `ndm_profiles`, pelo SQL Editor. Nunca usar e-mail fixo no frontend nem `user_metadata` para isso.
5. Entrar como administrador e ativar as assinaturas dos alunos autorizados em Alunos. Não ativar todas automaticamente.
6. Rever as políticas das tabelas legadas antes de expô-las a outros clientes. O app corrigido usa `ndm_*`; esta migração não remove políticas desconhecidas de tabelas antigas.

## Aplicação

- Usar `.env.example` como referência; configurar as duas variáveis também no ambiente de hospedagem e executar novo build. Nunca usar `service_role` no frontend.
- Em Auth > URL Configuration, cadastrar a URL real em Site URL e Redirect URLs para confirmação de cadastro e recuperação de senha.
- `pnpm install --frozen-lockfile`, `pnpm test` e `pnpm build` precisam passar.
- O catálogo remoto começa vazio. No navegador que contém o conteúdo antigo, entrar como administrador e usar Configurações > Recuperar conteúdo da versão anterior. A importação é explícita, atômica, preserva registros existentes no banco e não importa contas, permissões ou progresso compartilhado.
- O conteúdo é atualizado após cada gravação, quando a janela ganha foco e a cada 30 segundos. Não há promessa de sincronização instantânea via Realtime.

## Teste de aceitação em homologação

1. Admin real entra; senha inválida e antigos atalhos de teste não entram. Recarregar e sair preservam corretamente a sessão.
2. Aluno pendente/inativo não recebe aulas premium. Aluno não consegue atualizar `ndm_settings` ou promover seu perfil pela API.
3. Admin cria curso, módulo e aula; aluno em outro navegador enxerga após atualizar. Rascunhos não aparecem nem pela API.
4. Simular falha de rede ao salvar: formulário e dados confirmados permanecem, sem mensagem falsa de sucesso. Duas sessões editando a mesma revisão recebem conflito em vez de sobrescrita silenciosa.
5. Ocultar seção bloqueia menu, busca, atalhos e API. Denúncia não oculta publicação automaticamente; ocultação pelo moderador sim.
6. Abrir prévia do aluno, atualizar a página, sair/entrar e voltar ao Admin no desktop e celular.
7. Recuperar senha por link real; confirmar cadastro novo; conferir o novo UUID e assinatura pendente.

O visualizador de vídeos utiliza embeds. Não implementa DRM nem protege um link de vídeo público fora da plataforma. Marketplace e chat ainda contêm simulações anteriores; mantê-los fora do lançamento comercial até integrar pagamento/chat reais.
