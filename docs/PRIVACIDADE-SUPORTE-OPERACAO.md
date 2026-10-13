# Privacidade, suporte e operação — MVP

## Fluxo de solicitações
- O titular autenticado registra solicitações de acesso, correção, exclusão, portabilidade ou consentimento em Privacidade.
- Chamados de suporte são registrados em Suporte.
- O usuário só pode visualizar os próprios registros, sem alterar status ou excluir histórico.
- Operação interna: consultar filas no painel Supabase usando acesso administrativo, validar identidade, registrar providências e atualizar status manualmente.
- Antes de excluir conta, avaliar retenção legal, obrigações financeiras e backups; não prometer exclusão imediata de todas as cópias.
- Evitar coletar documentos, senhas, tokens e informações bancárias nos chamados.
- Incidentes: registrar horário, alcance, sistemas afetados, medidas de contenção, avaliação de risco e decisão documentada sobre comunicação à ANPD/titulares.

## Consultas operacionais (executar com conta administrativa)
```sql
select id,user_id,request_type,status,created_at from public.ndm_privacy_requests where status in ('pending','reviewing') order by created_at;
select id,user_id,subject,status,created_at from public.ndm_support_tickets where status in ('open','in_progress') order by created_at;
```

## Antes da venda comercial
- Confirmar razão social/CNPJ ou dados corretos do responsável e contato do encarregado/canal LGPD.
- Revisão jurídica da política de privacidade, bases legais, operadores, transferências internacionais e prazos de retenção.
- Publicar condições definitivas de assinatura, cancelamento e reembolso.
- Definir prazo de resposta e responsável por triagem; configurar notificações internas.
- Testar ciclo completo com dois usuários diferentes e validar isolamento RLS.
- Revisar backups, recuperação, segurança de pagamentos e logs.

## Estado
Páginas informativas são preliminares. Não representam política definitiva aprovada nem prometem prazo de atendimento.
