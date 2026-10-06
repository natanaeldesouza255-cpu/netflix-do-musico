# PR #3: correções de integração

Objetivo: remover autenticação simulada, obter identidade/permissões do Supabase, persistir operações entre dispositivos e corrigir navegação/publicação sem redesenhar a interface.

Arquitetura: tabelas ndm_* separadas dos dados legados desconhecidos; perfis associados a auth.users, permissões no banco, conteúdo por registro com revisão para impedir sobrescrita concorrente, progresso por usuário. Operações aguardam confirmação; nenhuma importação automática de mocks/localStorage. Configurações legadas só são copiadas pela migração, sem excluir dados.

Plano:
- [x] Testes reproduzindo fallback de login e categoria vazia.
- [x] Repositório Supabase, sessão validada, RLS, escrita atômica e progresso isolado.
- [x] Conteúdo filtrado/ordenado, formulários assíncronos e prévia restaurável.
- [x] Testes de regressão e SQL, instalação limpa, build e revisão independente.

A conexão remota se recuperou em 06/10/2026. O esquema foi inspecionado e as duas migrações foram aplicadas e verificadas sem excluir os dados legados.

## Revisão e decisões

- Revisão independente encontrou quatro falhas; todas foram reproduzidas e corrigidas: URL executável em vídeo de aluno, versão incorreta ao salvar formulário antigo, descarte de rascunho em falha de atualização e limpeza prematura de publicações/comentários.
- A autorização usa perfis protegidos pelo banco; nenhuma conta é promovida por e-mail fixo ou dados enviados pelo usuário.
- Dados antigos ficam preservados. Importação de conteúdo é explícita e não importa usuários, funções ou progresso.
- Migrações remotas concluídas. Testes reais de login/recuperação e homologação continuam pendentes, conforme docs/SUPABASE-SETUP.md.
- Fluxos antigos de pagamento/chat simulados não fazem parte da correção e não estão liberados para operação comercial.
- Padrão de instalação/CI: pnpm, conforme AI_RULES.md.txt.

## Validação final

- `pnpm install --frozen-lockfile`: concluído.
- `pnpm test`: 33 testes passaram em 8 arquivos.
- `pnpm build`: TypeScript e build de produção concluídos.
- Teste transacional remoto aprovado: escrita administrativa, acesso gratuito e bloqueio premium/configurações. Conteúdo de teste revertido.
- Regressão adicional reproduz permissões padrão do Supabase para impedir privilégios excessivos e proteger cursos legados.
- Login por e-mail e testes manuais de homologação permanecem pendentes conforme SUPABASE-SETUP.md.
