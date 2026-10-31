'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import type { Category } from '@/lib/types';

export default function CategoriesPage() {
  const supabase = createClient();
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [error, setError] = useState('');

  async function load() {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setItems((data as Category[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.name) return;
    setError('');
    const payload = {
      name: editing.name,
      slug: editing.slug || slugify(editing.name),
      description: editing.description ?? '',
      image_url: editing.image_url ?? null,
      sort_order: editing.sort_order ?? 0,
      is_active: editing.is_active ?? true,
    };
    const res = editing.id
      ? await supabase.from('categories').update(payload).eq('id', editing.id)
      : await supabase.from('categories').insert(payload);
    if (res.error) return setError(res.error.message);
    setEditing(null);
    load();
  }

  async function remove(c: Category) {
    if (!confirm(`Delete category "${c.name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('id', c.id);
    if (error) return alert(error.message);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-bold text-maroon-900">Categories</h1>
        <button className="btn-primary" onClick={() => setEditing({ is_active: true, sort_order: items.length + 1 })}>+ Add category</button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <div key={c.id} className="card p-4">
            <div className="flex gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.image_url || ''} alt="" className="h-16 w-14 rounded object-cover bg-maroon-100" />
              <div className="flex-1">
                <p className="font-semibold text-maroon-900">{c.name}</p>
                <p className="text-xs text-maroon-400">/{c.slug}</p>
                <p className="mt-1 text-xs">{c.is_active ? 'Active' : 'Hidden'} · order {c.sort_order}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-3 text-sm">
              <button className="text-maroon-700 hover:underline" onClick={() => setEditing(c)}>Edit</button>
              <button className="text-red-600 hover:underline" onClick={() => remove(c)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-serif text-xl font-bold text-maroon-900">{editing.id ? 'Edit' : 'Add'} category</h2>
            <div className="mt-4 space-y-4">
              <div><label className="label">Name *</label><input className="input" value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} /></div>
              <div><label className="label">Slug</label><input className="input" value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
              <div><label className="label">Description</label><textarea className="input" rows={2} value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><label className="label">Image</label><ImageUploader images={editing.image_url ? [editing.image_url] : []} onChange={(imgs) => setEditing({ ...editing, image_url: imgs[imgs.length - 1] ?? null })} /></div>
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
