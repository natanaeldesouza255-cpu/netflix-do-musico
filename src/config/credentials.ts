/**
 * Credenciais de teste do protótipo.
 * Futuro: substituir por autenticação real (Supabase/Auth).
 */
export const TEST_ACCOUNTS = {
  student: {
    email: 'aluno@musico.com',
    password: '123456',
    label: 'Aluno / Assinante',
  },
  admin: {
    email: 'natanaeldesouza255@gmail.com',
    password: 'admin123',
    label: 'Administrador',
  },
} as const;

export type TestAccountRole = keyof typeof TEST_ACCOUNTS;
