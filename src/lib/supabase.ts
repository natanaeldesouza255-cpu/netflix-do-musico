import { createClient, type SupabaseClient } from '@supabase/supabase-js';
function configuredClient(): SupabaseClient | null {
  const url=import.meta.env.VITE_SUPABASE_URL;
  const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return null;
  try {return createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}
  catch {return null;}
}
export const supabase=configuredClient();
export const isSupabaseConfigured=!!supabase;
