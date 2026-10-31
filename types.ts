// Shared TypeScript types mirroring the database schema.

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  product_code: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  collection: string;
  price: number;
  discount_price: number | null;
  stock: number;
  is_available: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  images: string[];
  created_at: string;
  updated_at: string;
  categories?: Pick<Category, 'id' | 'name' | 'slug'> | null;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string | null;
  cta_label: string;
  cta_link: string;
  discount_text: string;
  is_active: boolean;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  product_id: string | null;
  product_code: string | null;
  product_name: string | null;
  quantity: number;
  unit_price: number | null;
  notes: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp_number: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  instagram_url: string;
  facebook_url: string;
  seo_title: string;
  seo_description: string;
  seo_og_image: string | null;
  nav_links: { label: string; href: string }[];
  footer_text: string;
  updated_at: string;
}

export interface PageContent<T = Record<string, unknown>> {
  key: string;
  data: T;
  updated_at: string;
}
