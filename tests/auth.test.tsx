import React from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
const api = vi.hoisted(() => ({
  auth: {
    signInWithPassword: vi.fn(async () => ({ data: { user: null, session: null }, error: { message: 'Invalid login' } })),
    getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe() {} } } })),
    signOut: vi.fn(async () => ({ error: null })),
  },
  from: vi.fn(() => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }) })),
}));
vi.mock('../src/lib/supabase', () => ({ supabase: api, isSupabaseConfigured: true }));
import { AppProvider, useApp } from '../src/context/AppContext';
const wrapper = ({ children }: { children: React.ReactNode }) => <AppProvider>{children}</AppProvider>;
afterEach(cleanup);
beforeEach(() => localStorage.clear());
describe('authentication boundary', () => {
  it('does not accept demo credentials after Supabase rejects them', async () => {
    const { result } = renderHook(useApp, { wrapper });
    let accepted: boolean | undefined;
    await act(async () => { accepted = await result.current.loginUser('natanaeldesouza255@gmail.com', 'admin123'); });
    expect(accepted).toBe(false);
    expect(result.current.user).toBeNull();
  });
  it('does not restore an administrator from browser storage', async () => {
    localStorage.setItem('ndm_user', JSON.stringify({ id: 'forged', role: 'admin' }));
    localStorage.setItem('ndm_isSubscriber', 'true');
    const { result } = renderHook(useApp, { wrapper });
    await waitFor(() => expect(result.current.user).toBeNull());
    expect(result.current.isSubscriber).toBe(false);
  });
});
