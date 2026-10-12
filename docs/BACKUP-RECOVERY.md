# Backup e recuperacao - Netflix do Musico

## Status em 12/10/2026
- Projeto Supabase confirmado ACTIVE_HEALTHY; isso nao comprova backup disponivel.
- Script de backup e restauracao criado em scripts/database-recovery.mjs.
- Ainda NAO foi feito backup real, nem restauracao testada: computador sem pg_dump/pg_restore instalados e nenhuma credencial de conexao de banco foi solicitada.
- Nao existe evidencia de backups automaticos ativos neste plano. Verificar no painel Supabase > Database > Backups.
- Banco PostgreSQL e arquivos binarios do Storage sao componentes diferentes. pg_dump nao copia o conteudo dos arquivos MP4; exigir estrategia de exportacao do bucket privado ndm-lesson-videos.
- Migrations no GitHub sao historico de estrutura, nao substituem backup de dados.

## Backup manual sem expor senhas
1. Instalar ferramentas cliente PostgreSQL 17 (pg_dump e pg_restore) no computador.
2. No Supabase, obter connection string PostgreSQL com permissao de backup. Nao colar credenciais no ChatGPT, GitHub, logs ou arquivos do projeto.
3. Configurar NDM_BACKUP_DATABASE_URL como variavel de ambiente local e temporaria; usar SSL na conexao.
4. Executar: node scripts/database-recovery.mjs backup C:\\BackupsPrivados\\NetflixDoMusico
5. O script produz .dump fora do repositorio e valida a leitura do catalogo com pg_restore --list.
6. Criptografar o arquivo antes de qualquer sincronizacao ou copia para nuvem; guardar chave separada, proteger acesso e manter segunda copia offline.
7. Backup de MP4: exportar objetos do bucket privado com permissao administrativa para pasta separada e criptografada; guardar manifesto de caminhos/tamanhos e validar integridade.
8. Frequencia inicial: diariamente para banco; apos cada upload relevante para Storage; manter 7 copias diarias e 4 semanais, sujeito a espaco e LGPD.
9. Revisar retencao, permissoes, chaves e capacidade de recuperacao periodicamente.

## Restauracao segura
1. Criar banco PostgreSQL de TESTES separado, vazio e compativel; verificar custos antes de criar recursos.
2. Usar NDM_BACKUP_DATABASE_URL para origem e NDM_RESTORE_DATABASE_URL para o banco de testes. O script recusa strings identicas, mas NAO prova que apontam para bancos distintos: conferir manualmente host, porta e nome do banco.
3. Executar: node scripts/database-recovery.mjs restore CAMINHO_DO_ARQUIVO.dump --confirm-restore
4. Conferir esquema, contagens de registros, integridade referencial, usuarios, RLS, autenticacao, matriculas, cursos, progresso e trilha de auditoria.
5. Restaurar MP4 no bucket de testes e testar reproducao autenticada e acesso negado.
6. Registrar data, duracao, versoes, contagens e evidencias. So depois declarar recuperacao validada.
7. NUNCA restaurar sobre producao sem janela de manutencao, autorizacao expressa, backup adicional e plano de reversao.

## Incidente
- Suspender operacoes de escrita se houver corrupcao confirmada, sem destruir evidencias.
- Revogar chaves comprometidas e preservar logs de auditoria.
- Determinar ponto de recuperacao e impacto em alunos e pagamentos.
- Restaurar primeiro em ambiente isolado, validar e documentar.
- Avaliar obrigacoes de comunicacao LGPD com responsavel apropriado.

## Limitacoes importantes
- Exportacao de auth e storage por pg_dump pode exigir permissoes elevadas; um dump parcial nao equivale a backup completo.
- Restauracao de esquemas gerenciados pelo Supabase em PostgreSQL generico pode falhar por dependencias/extensoes. Preferir ambiente Supabase isolado para ensaio.
- URLs assinadas nao preservam arquivos: apenas referencias no banco nao permitem recuperar videos perdidos.
- O script NAO e backup automatico e NAO deve ser usado com credenciais de producao em computador compartilhado.
