'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Category, Product } from '@/lib/types';

type FormState = {
  product_code: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  collection: string;
  price: string;
  discount_price: string;
  stock: string;
  is_available: boolean;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_best_seller: boolean;
  images: string[];
};

const EMPTY: FormState = {
  product_code: '', name: '', slug: '', description: '', category_id: '', collection: '',
  price: '', discount_price: '', stock: '0', is_available: true, is_featured: false,
  is_new_arrival: false, is_best_seller: false, images: [],
};

export default function ProductFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === 'new';
  const supabase = createClient();

  const [form, setForm] = useState<FormState>(EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [slugEdited, setSlugEdited] = useState(!isNew);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('sort_order');
      setCategories((cats as Category[]) ?? []);
      if (!isNew) {
        const { data } = await supabase.from('products').select('*').eq('id', params.id).single();
        if (data) {
          const p = data as Product;
          setForm({
            product_code: p.product_code, name: p.name, slug: p.slug, description: p.description,
            category_id: p.category_id ?? '', collection: p.collection,
            price: String(p.price), discount_price: p.discount_price != null ? String(p.discount_price) : '',
            stock: String(p.stock), is_available: p.is_available, is_featured: p.is_featured,
            is_new_arrival: p.is_new_arrival, is_best_seller: p.is_best_seller, images: p.images ?? [],
          });
        }
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || !form.product_code.trim()) {
      setError('Product name and code are required.');
      return;
    }
    setSaving(true);
    const payload = {
      product_code: form.product_code.trim(),
      name: form.name.trim(),
      slug: (form.slug || slugify(form.name)).trim(),
      description: form.description,
      category_id: form.category_id || null,
      collection: form.collection,
      price: parseFloat(form.price || '0'),
      discount_price: form.discount_price ? parseFloat(form.discount_price) : null,
      stock: parseInt(form.stock || '0', 10),
      is_available: form.is_available,
      is_featured: form.is_featured,
      is_new_arrival: form.is_new_arrival,
      is_best_seller: form.is_best_seller,
      images: form.images,
    };
    const res = isNew
      ? await supabase.from('products').insert(payload)
      : await supabase.from('products').update(payload).eq('id', params.id);
    setSaving(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    router.push('/admin/products');
    router.refresh();
  }

  if (loading) return <p className="text-maroon-400">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-maroon-900">{isNew ? 'Add product' : 'Edit product'}</h1>
      <form onSubmit={save} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Product name *</label>
            <input className="input" value={form.name} onChange={(e) => { set('name', e.target.value); if (!slugEdited) set('slug', slugify(e.target.value)); }} />
          </div>
          <div>
            <label className="label">Product code (SKU) *</label>
            <input className="input" value={form.product_code} onChange={(e) => set('product_code', e.target.value)} placeholder="SR-0001" />
          </div>
        </div>
        <div>
          <label className="label">URL slug</label>
          <input className="input" value={form.slug} onChange={(e) => { setSlugEdited(true); set('slug', slugify(e.target.value)); }} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.category_id} onChange={(e) => set('category_id', e.target.value)}>
              <option value="">— Select —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Collection</label>
            <input className="input" value={form.collection} onChange={(e) => set('collection', e.target.value)} placeholder="Festive 2025" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Price (₹) *</label>
            <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label className="label">Discount price (₹)</label>
            <input type="number" step="0.01" className="input" value={form.discount_price} onChange={(e) => set('discount_price', e.target.value)} />
          </div>
          <div>
            <label className="label">Stock</label>
            <input type="number" className="input" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Product images</label>
          <ImageUploader images={form.images} onChange={(imgs) => set('images', imgs)} />
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-xl bg-maroon-50 p-4 sm:grid-cols-4">
          {([
            ['is_available', 'Available'],
            ['is_featured', 'Featured'],
            ['is_new_arrival', 'New arrival'],
            ['is_best_seller', 'Best seller'],
          ] as [keyof FormState, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm font-medium text-maroon-800">
              <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked as never)} />
              {label}
            </label>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save product'}</button>
          <button type="button" className="btn-outline" onClick={() => router.push('/admin/products')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
