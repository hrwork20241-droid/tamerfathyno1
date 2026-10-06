// Product catalogue in the online database (Supabase): reading for customers,
// and sign-in, editing and photo upload for the control panel.
import type { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './config';
import { CATEGORIES, type Category, type Product } from './data/products';

export const backendConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const TABLE = 'products';
const BUCKET = 'product-images';
const CACHE_KEY = 'no1:catalog';

/** A row of the `products` table (see supabase/setup.sql). */
export interface ProductRow {
  id: number;
  name: string;
  name_ar: string;
  category: string;
  price: number;
  old_price: number | null;
  seller: string;
  colors: string[] | null;
  image_url: string | null;
  rating: number | null;
  reviews: number | null;
  sold: number | null;
  stock_pct: number | null;
  active: boolean;
  created_at?: string;
}

export type ProductInput = Omit<ProductRow, 'id' | 'created_at'>;

/** Short sold count like the samples use: 950, 3.2k, 12k. */
export function soldLabel(n: number) {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return (k < 10 ? k.toFixed(1).replace(/\.0$/, '') : String(Math.round(k))) + 'k';
}

/** Convert a database row to the app's product shape. Unknown categories fall back to the first one. */
export function rowToProduct(r: ProductRow): Product {
  const price = Number(r.price);
  return {
    id: r.id,
    name: r.name,
    ar: r.name_ar || r.name,
    cat: (CATEGORIES as string[]).includes(r.category) ? (r.category as Category) : CATEGORIES[0],
    price,
    was: r.old_price && Number(r.old_price) > price ? Number(r.old_price) : price,
    rating: r.rating ?? 5,
    reviews: r.reviews ?? 0,
    sold: soldLabel(r.sold ?? 0),
    pct: Math.max(0, Math.min(100, r.stock_pct ?? 0)),
    seller: r.seller || 'NO1',
    img: '',
    colors: r.colors?.filter(Boolean).length ? r.colors.filter(Boolean) : ['Default'],
    image: r.image_url || undefined,
    fromDb: true,
  };
}

let client: Promise<SupabaseClient> | null = null;

/** The Supabase client, loaded only when the app is connected to a database. */
export function supabase(): Promise<SupabaseClient> {
  if (!backendConfigured) return Promise.reject(new Error('Database not configured'));
  client ??= import('@supabase/supabase-js').then(m => m.createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  return client;
}

/** Visible products for customers, newest first. */
export async function fetchVisibleProducts(): Promise<Product[]> {
  const db = await supabase();
  const { data, error } = await db.from(TABLE).select('*').eq('active', true).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(rowToProduct);
}

/** Last catalogue loaded from the database, so the app opens instantly and keeps working offline. */
export function readCachedCatalog(): Product[] | null {
  if (!backendConfigured) return null;
  try {
    const list = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
    return Array.isArray(list) && list.length ? list : null;
  } catch {
    return null;
  }
}

export function writeCachedCatalog(list: Product[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch { /* storage unavailable */ }
}

// ---- Control panel ----

export async function signIn(email: string, password: string) {
  const db = await supabase();
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signOut() {
  const db = await supabase();
  await db.auth.signOut();
}

export async function currentUserEmail(): Promise<string | null> {
  const db = await supabase();
  const { data } = await db.auth.getSession();
  return data.session?.user.email ?? null;
}

/** Every product, including hidden ones (admin only). */
export async function fetchAllProducts(): Promise<ProductRow[]> {
  const db = await supabase();
  const { data, error } = await db.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as ProductRow[];
}

export async function saveProduct(input: ProductInput, id?: number) {
  const db = await supabase();
  const { error } = id
    ? await db.from(TABLE).update(input).eq('id', id)
    : await db.from(TABLE).insert(input);
  if (error) throw error;
}

export async function deleteProduct(id: number) {
  const db = await supabase();
  const { error } = await db.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}

/** Upload a product photo and return its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const db = await supabase();
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
