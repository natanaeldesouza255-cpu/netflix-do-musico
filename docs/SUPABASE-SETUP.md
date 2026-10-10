# Ativação da integração corrigida

## Estado desta entrega

As duas migrações foram aplicadas e verificadas no projeto remoto em 06/10/2026, após a conexão se recuperar. Todas as tabelas públicas têm RLS; permissões herdadas excessivas foram removidas. A conta Auth confirmada que correspondia ao administrador da tabela legada protegida teve seu acesso administrativo preservado, sem usar dados editáveis pelo usuário.

Uma transação de teste confirmou gravação administrativa, leitura de aula gratuita, bloqueio de aula premium para visitante/aluno pendente e bloqueio de configurações para aluno. A transação foi revertida, sem manter conteúdo de teste. Os dois cursos antigos permanecem intactos.

Ainda pendentes: login/recuperação com e-mail real, configuração do ambiente de hospedagem, importação explícita do catálogo e testes de navegação em homologação. Não houve merge nem deploy.

O advisor não apontou erros de RLS após a correção. Permanece o aviso de proteção contra senhas vazadas desativada e a informação de que a tabela legada `profiles` está fechada, sem políticas de acesso de clientes.

## Banco

1. Conferir o esquema e fazer um backup do projeto antes da migração. Verificar que ainda não existem as tabelas `ndm_*`.
2. Em um ambiente novo, aplicar em ordem `supabase/migrations/20261006233738_secure_platform.sql` e `supabase/migrations/20261006233921_harden_database_grants.sql`. No projeto conectado, ambas já estão registradas; não reaplicar.
3. O script cria tabelas novas com RLS, copia configurações de `platform_settings` se a tabela existir, e cria perfis para contas Auth existentes. Não exclui tabelas antigas nem importa dados de demonstração.
4. Contas existentes são alunos com assinatura pendente, exceto quem já tem `raw_app_meta_data.role = admin`, uma atribuição feita no servidor. Conferir a identidade da conta administradora em Authentication > Users. Se necessário, um operador autorizado deve atribuir `role = admin` e `subscription_status = active` ao UUID **verificado** dessa conta em `ndm_profiles`, pelo SQL Editor. Nunca usar e-mail fixo no frontend nem `user_metadata` para isso.
5. Entrar como administrador e ativar as assinaturas dos alunos autorizados em Alunos. Não ativar todas automaticamente.
6. A segunda migração protege os cursos legados e restringe as gravações das configurações antigas ao administrador. A tabela legada de perfis fica inacessível aos clientes. O app corrigido usa `ndm_*`.

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
