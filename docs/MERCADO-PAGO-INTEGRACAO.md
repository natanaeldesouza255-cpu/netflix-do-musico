# Mercado Pago + Supabase — integração segura (planejamento, sem cobrança)

Estado: **não habilitado**. Nenhuma cobrança é criada por este documento.

## Fluxo previsto
1. Aluno autenticado solicita assinatura. O navegador envia apenas a intenção; não escolhe preço, destinatário ou estado da assinatura.
2. Uma Edge Function do Supabase valida o JWT, busca o plano/preço no servidor e cria a preferência ou assinatura usando credencial Mercado Pago guardada exclusivamente como segredo da função.
3. A resposta fornece a URL oficial de checkout de teste; nenhuma credencial privada chega ao navegador.
4. O webhook público recebe apenas o identificador da notificação. O servidor consulta a API Mercado Pago com credencial própria, valida status, valor, referência do aluno e ambiente, e registra o evento de forma idempotente.
5. Apenas após confirmação confiável o servidor atualiza `ndm_profiles.subscription_status`. Falha, atraso, reembolso e cancelamento precisam de regras próprias.

## Regras obrigatórias antes de ativar
- Usar conta e credenciais de **teste** Mercado Pago, jamais token de produção neste estágio.
- Nunca confiar em `status=approved` vindo do cliente, query string ou corpo do webhook isoladamente.
- Validar assinatura/autenticidade do webhook conforme documentação atual do Mercado Pago, além de consultar o pagamento na API.
- Não usar service-role no frontend. Não registrar tokens, CPF ou dados de cartão em logs.
- Guardar `external_reference`, identificador externo, estado e histórico de eventos em tabela com RLS sem escrita pelo aluno.
- Evitar pagamento duplicado com chave idempotente e transações; garantir que o webhook repetido não duplique acesso.
- Manter a cobrança **desabilitada** até testes de aprovação, recusa, duplicação, cancelamento e expiração.
- Decidir o produto Mercado Pago adequado à cobrança recorrente antes de implementar endpoints específicos (assinatura recorrente vs checkout avulso).

## Próxima execução
Confirmar o tipo de assinatura (mensal recorrente), obter credenciais de teste no painel Mercado Pago, criar migração auditável e Edge Functions em ambiente de teste, e testar o webhook ponta a ponta. Sem aplicar migração ou implantar funções de pagamento até revisão.
