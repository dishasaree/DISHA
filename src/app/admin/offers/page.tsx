'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Offer } from '@/lib/types';

export default function OffersPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Offer[]>([]);
  const [editing, setEditing] = useState<Partial<Offer> | null>(null);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase.from('offers').select('*').order('sort_order');
    setItems((data as Offer[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.title) return;
    setError('');
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle ?? '',
      description: editing.description ?? '',
      image_url: editing.image_url ?? null,
      discount_text: editing.discount_text ?? '',
      cta_label: editing.cta_label ?? 'Shop Now',
      cta_link: editing.cta_link ?? '/shop',
      is_active: editing.is_active ?? true,
      sort_order: editing.sort_order ?? 0,
    };
    const res = editing.id
      ? await supabase.from('offers').update(payload).eq('id', editing.id)
      : await supabase.from('offers').insert(payload);
    if (res.error) return setError(res.error.message);
    setEditing(null);
    load();
  }

  async function remove(o: Offer) {
    if (!confirm(`Delete offer "${o.title}"?`)) return;
    const { error } = await supabase.from('offers').delete().eq('id', o.id);
    if (error) return alert(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-maroon-900">Offers &amp; Banners</h1>
        <button className="btn-primary" onClick={() => setEditing({ is_active: true, cta_label: 'Shop Now', cta_link: '/shop', sort_order: items.length + 1 })}>+ Add offer</button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map((o) => (
          <div key={o.id} className="card overflow-hidden">
            {o.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={o.image_url} alt={o.title} className="aspect-[16/9] w-full object-cover" />
            )}
            <div className="p-4">
              <p className="font-semibold text-maroon-900">{o.title}</p>
              <p className="text-sm text-maroon-500">{o.discount_text} · {o.is_active ? 'Active' : 'Hidden'}</p>
              <div className="mt-2 flex gap-3 text-sm">
                <button className="text-maroon-700 hover:underline" onClick={() => setEditing(o)}>Edit</button>
                <button className="text-red-600 hover:underline" onClick={() => remove(o)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-serif text-xl font-bold text-maroon-900">{editing.id ? 'Edit' : 'Add'} offer</h2>
            <div className="mt-4 space-y-4">
              <div><label className="label">Title *</label><input className="input" value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="label">Subtitle</label><input className="input" value={editing.subtitle ?? ''} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></div>
              <div><label className="label">Description</label><textarea className="input" rows={2} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><label className="label">Discount text</label><input className="input" value={editing.discount_text ?? ''} onChange={(e) => setEditing({ ...editing, discount_text: e.target.value })} placeholder="Flat 20% OFF" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Button label</label><input className="input" value={editing.cta_label ?? ''} onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })} /></div>
                <div><label className="label">Button link</label><input className="input" value={editing.cta_link ?? ''} onChange={(e) => setEditing({ ...editing, cta_link: e.target.value })} /></div>
              </div>
              <div><label className="label">Banner image</label><ImageUploader images={editing.image_url ? [editing.image_url] : []} onChange={(imgs) => setEditing({ ...editing, image_url: imgs[imgs.length - 1] ?? null })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Sort order</label><input type="number" className="input" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: parseInt(e.target.value || '0', 10) })} /></div>
                <label className="mt-7 flex items-center gap-2 text-sm font-medium text-maroon-800"><input type="checkbox" checked={editing.is_active ?? true} onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })} /> Active</label>
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-5 flex gap-3">
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
