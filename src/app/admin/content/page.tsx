'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';

type Field = { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'list' };

const PAGES: { key: string; label: string; href: string; fields: Field[] }[] = [
  {
    key: 'home', label: 'Home', href: '/',
    fields: [
      { key: 'hero_title', label: 'Hero title', type: 'text' },
      { key: 'hero_subtitle', label: 'Hero subtitle', type: 'textarea' },
      { key: 'hero_cta', label: 'Hero button text', type: 'text' },
      { key: 'hero_image', label: 'Hero image', type: 'image' },
      { key: 'feature_strip', label: 'Feature strip (one per line)', type: 'list' },
    ],
  },
  {
    key: 'about', label: 'About Us', href: '/about',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
      { key: 'image', label: 'Image', type: 'image' },
    ],
  },
  {
    key: 'contact', label: 'Contact Us', href: '/contact',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'intro', label: 'Intro text', type: 'textarea' },
    ],
  },
  {
    key: 'privacy', label: 'Privacy Policy', href: '/privacy',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
  },
  {
    key: 'terms', label: 'Terms & Conditions', href: '/terms',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'body', label: 'Body', type: 'textarea' },
    ],
  },
];

export default function ContentPage() {
  const supabase = createClient();
  const [active, setActive] = useState(PAGES[0].key);
  const [data, setData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const page = PAGES.find((p) => p.key === active)!;

  async function load(key: string) {
    setMsg('');
    const { data: row } = await supabase.from('page_content').select('*').eq('key', key).maybeSingle();
    setData((row?.data as Record<string, any>) ?? {});
  }
  useEffect(() => { load(active); /* eslint-disable-next-line */ }, [active]);

  async function save() {
    setSaving(true);
    setMsg('');
    const { error } = await supabase.from('page_content').upsert({ key: active, data });
    setSaving(false);
    setMsg(error ? error.message : 'Published successfully.');
  }

  function set(k: string, v: any) {
    setData((d) => ({ ...d, [k]: v }));
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-maroon-900">Pages &amp; Content</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button key={p.key} onClick={() => setActive(p.key)} className={`badge ${active === p.key ? 'bg-maroon-700 text-white' : 'bg-maroon-100 text-maroon-700'}`}>{p.label}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-maroon-900">Edit: {page.label}</h2>
            <Link href={page.href} target="_blank" className="text-sm text-maroon-600 hover:underline">Open live page ↗</Link>
          </div>
          <div className="space-y-4">
            {page.fields.map((f) => (
              <div key={f.key}>
                <label className="label">{f.label}</label>
                {f.type === 'text' && <input className="input" value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />}
                {f.type === 'textarea' && <textarea className="input" rows={5} value={data[f.key] ?? ''} onChange={(e) => set(f.key, e.target.value)} />}
                {f.type === 'list' && (
                  <textarea className="input" rows={4} value={(data[f.key] ?? []).join('\n')} onChange={(e) => set(f.key, e.target.value.split('\n').filter(Boolean))} />
                )}
                {f.type === 'image' && (
                  <ImageUploader images={data[f.key] ? [data[f.key]] : []} onChange={(i) => set(f.key, i[i.length - 1] ?? '')} />
                )}
              </div>
            ))}
          </div>
          {msg && <p className={`mt-3 text-sm ${msg.includes('success') ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>}
          <button onClick={save} className="btn-primary mt-4" disabled={saving}>{saving ? 'Publishing…' : 'Publish changes'}</button>
        </div>

        {/* Live preview of text content */}
        <div className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-maroon-900">Preview</h2>
          <div className="space-y-3">
            {page.fields.map((f) => (
              <div key={f.key}>
                {f.type === 'image' && data[f.key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data[f.key]} alt="" className="max-h-40 rounded-lg object-cover" />
                ) : f.type === 'list' ? (
                  <ul className="list-inside list-disc text-sm text-maroon-700">{(data[f.key] ?? []).map((x: string, i: number) => <li key={i}>{x}</li>)}</ul>
                ) : (
                  <p className={f.key.includes('title') ? 'font-serif text-xl font-bold text-maroon-900' : 'text-maroon-700'}>{data[f.key]}</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-maroon-400">This is a live preview of your edits. Click “Publish changes” to make them visible on the website.</p>
        </div>
      </div>
    </div>
  );
}
