// Server-side data fetchers used by Server Components.
import { createClient } from './src/lib/supabase/server';
import type { SiteSettings, Product, Category, Offer, PageContent } from './types';

const FALLBACK_SETTINGS: SiteSettings = {
  id: 'global',
  business_name: 'Saanvi Sarees',
  logo_url: null,
  favicon_url: null,
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_FALLBACK || '919876543210',
  contact_email: 'hello@saanvisarees.com',
  contact_phone: '+91 98765 43210',
  address: '',
  instagram_url: '',
  facebook_url: '',
  seo_title: 'Saanvi Sarees — Premium Handcrafted Sarees',
  seo_description: 'Shop premium silk, cotton, bridal and party-wear sarees. Order easily on WhatsApp.',
  seo_og_image: null,
  nav_links: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Offers', href: '/offers' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  footer_text: '© 2025 Saanvi Sarees.',
  updated_at: new Date(0).toISOString(),
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
    return data ? { ...FALLBACK_SETTINGS, ...data } : FALLBACK_SETTINGS;
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getProducts(opts: {
  categorySlug?: string;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  limit?: number;
} = {}): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase
    .from('products')
    .select('*, categories(id,name,slug)')
    .order('created_at', { ascending: false });

  if (opts.featured) query = query.eq('is_featured', true);
  if (opts.newArrival) query = query.eq('is_new_arrival', true);
  if (opts.bestSeller) query = query.eq('is_best_seller', true);
  if (opts.limit) query = query.limit(opts.limit);

  const { data } = await query;
  let products = (data ?? []) as Product[];
  if (opts.categorySlug) {
    products = products.filter((p) => p.categories?.slug === opts.categorySlug);
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from('products')
    .select('*, categories(id,name,slug)')
    .eq('slug', slug)
    .single();
  return (data as Product) ?? null;
}

export async function getOffers(): Promise<Offer[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from('offers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  return data ?? [];
}

export async function getPageContent<T = Record<string, unknown>>(
  key: string,
): Promise<T | null> {
  const supabase = createClient();
  const { data } = await supabase.from('page_content').select('*').eq('key', key).single();
  return (data as PageContent<T> | null)?.data ?? null;
}
