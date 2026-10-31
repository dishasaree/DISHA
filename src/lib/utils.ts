// Small shared helpers.
import type { Product } from './types';

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function discountPercent(price: number, discount: number | null): number | null {
  if (!discount || discount >= price || price <= 0) return null;
  return Math.round(((price - discount) / price) * 100);
}

export function effectivePrice(p: { price: number; discount_price: number | null }): number {
  return p.discount_price && p.discount_price < p.price ? p.discount_price : p.price;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export interface ProductFilters {
  q?: string;
  availability?: string; // 'in' | 'out'
  sort?: string; // price-asc | price-desc | name-asc
}

export function filterAndSortProducts(products: Product[], f: ProductFilters): Product[] {
  let out = [...products];
  if (f.q) {
    const term = f.q.toLowerCase();
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.product_code.toLowerCase().includes(term) ||
        p.collection.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term),
    );
  }
  if (f.availability === 'in') out = out.filter((p) => p.is_available && p.stock > 0);
  if (f.availability === 'out') out = out.filter((p) => !p.is_available || p.stock <= 0);

  switch (f.sort) {
    case 'price-asc':
      out.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      break;
    case 'price-desc':
      out.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      break;
    case 'name-asc':
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }
  return out;
}
