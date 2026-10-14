/** Legacy prototype-only account labels. Never use for authentication or authorization. */
export const TEST_ACCOUNTS = {
  student: { email: '', password: '', label: 'Aluno / Assinante' },
  admin: { email: '', password: '', label: 'Administrador' },
} as const;

export type TestAccountRole = keyof typeof TEST_ACCOUNTS;
