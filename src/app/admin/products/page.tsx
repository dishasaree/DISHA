'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice, slugify } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, categories(id,name,slug)')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) return alert(error.message);
    load();
  }

  async function duplicate(p: Product) {
    const code = `${p.product_code}-COPY-${Math.floor(Math.random() * 1000)}`;
    const { id, created_at, updated_at, categories, ...rest } = p;
    const { error } = await supabase.from('products').insert({
      ...rest,
      product_code: code,
      name: `${p.name} (Copy)`,
      slug: slugify(`${p.name}-copy-${Math.floor(Math.random() * 1000)}`),
    });
    if (error) return alert(error.message);
    load();
  }

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.product_code.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-maroon-900">Products</h1>
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
      </div>

      <input className="input mt-5 max-w-sm" placeholder="Search by name or code…" value={q} onChange={(e) => setQ(e.target.value)} />

      <div className="mt-5 card overflow-x-auto">
        {loading ? (
          <p className="p-6 text-maroon-400">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-maroon-400">No products found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-maroon-50 text-maroon-500">
              <tr>
                <th className="p-3">Image</th><th>Name</th><th>Code</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-maroon-100 align-middle">
                  <td className="p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images?.[0] || ''} alt="" className="h-12 w-10 rounded object-cover bg-maroon-100" />
                  </td>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.product_code}</td>
                  <td>{p.categories?.name ?? '—'}</td>
                  <td>{formatPrice(p.discount_price && p.discount_price < p.price ? p.discount_price : p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`badge ${p.is_available && p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.is_available && p.stock > 0 ? 'Available' : 'Sold out'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">
                    <Link href={`/admin/products/${p.id}`} className="text-maroon-700 hover:underline">Edit</Link>
                    <button onClick={() => duplicate(p)} className="ml-3 text-maroon-600 hover:underline">Duplicate</button>
                    <button onClick={() => remove(p)} className="ml-3 text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
