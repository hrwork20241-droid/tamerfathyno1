// Online database for the product catalogue and the control panel (Supabase).
// Both values are safe to publish: the anon key only allows what the database's
// row-level security rules permit (customers can read visible products; only a
// signed-in admin can change them). See supabase/setup.sql.
//
// Leave them empty to run on the built-in sample products.
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
