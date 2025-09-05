import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' &&
    supabaseAnonKey !== 'your_supabase_anon_key' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('.supabase.co'));
};

// Only create client if properly configured, otherwise use a mock
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') })
        }),
        insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null })
      }
    } as any;


export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}