/**
 * Credenciais de teste do protótipo.
 * Futuro (Supabase/Auth): substituir esta lista estática por autenticação real
 * (e-mail/senha, sessão JWT, RLS). NÃO usar este arquivo como segurança de produção.
 */
export const TEST_ACCOUNTS = {
  student: {
    email: 'aluno@musico.com',
    password: 'aluno123',
    label: 'Aluno / Assinante',
  },
  admin: {
    email: 'admin@musico.com',
    password: 'admin123',
    label: 'Administrador',
  },
} as const;

export type TestAccountRole = keyof typeof TEST_ACCOUNTS;
