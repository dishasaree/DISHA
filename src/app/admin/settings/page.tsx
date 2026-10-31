'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ImageUploader from '@/components/admin/ImageUploader';
import type { SiteSettings } from '@/lib/types';

export default function SettingsPage() {
  const supabase = createClient();
  const [s, setS] = useState<Partial<SiteSettings> | null>(null);
  const [navText, setNavText] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
      const row = (data as SiteSettings) ?? { id: 'global' };
      setS(row);
      setNavText(JSON.stringify(row.nav_links ?? [], null, 2));
    })();
    // eslint-disable-next-line
  }, []);

  function set<K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) {
    setS((prev) => ({ ...prev, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!s) return;
    setMsg('');
    let nav_links;
    try {
      nav_links = JSON.parse(navText || '[]');
    } catch {
      setMsg('Navigation JSON is invalid.');
      return;
    }
    setSaving(true);
    const { error } = await supabase.from('site_settings').upsert({ ...s, id: 'global', nav_links });
    setSaving(false);
    setMsg(error ? error.message : 'Saved successfully.');
  }

  if (!s) return <p className="text-maroon-400">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-2xl font-bold text-maroon-900">Store Settings</h1>
      <form onSubmit={save} className="mt-6 space-y-6">
        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-maroon-900">Business</h2>
          <div className="space-y-4">
            <div><label className="label">Business name</label><input className="input" value={s.business_name ?? ''} onChange={(e) => set('business_name', e.target.value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="label">Logo</label><ImageUploader images={s.logo_url ? [s.logo_url] : []} onChange={(i) => set('logo_url', i[i.length - 1] ?? null)} /></div>
              <div><label className="label">Favicon</label><ImageUploader images={s.favicon_url ? [s.favicon_url] : []} onChange={(i) => set('favicon_url', i[i.length - 1] ?? null)} /></div>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-maroon-900">Contact &amp; WhatsApp</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="label">WhatsApp number (digits, with country code)</label><input className="input" value={s.whatsapp_number ?? ''} onChange={(e) => set('whatsapp_number', e.target.value)} placeholder="919876543210" /></div>
            <div><label className="label">Contact phone</label><input className="input" value={s.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)} /></div>
            <div><label className="label">Contact email</label><input className="input" value={s.contact_email ?? ''} onChange={(e) => set('contact_email', e.target.value)} /></div>
            <div><label className="label">Address</label><input className="input" value={s.address ?? ''} onChange={(e) => set('address', e.target.value)} /></div>
            <div><label className="label">Instagram URL</label><input className="input" value={s.instagram_url ?? ''} onChange={(e) => set('instagram_url', e.target.value)} /></div>
            <div><label className="label">Facebook URL</label><input className="input" value={s.facebook_url ?? ''} onChange={(e) => set('facebook_url', e.target.value)} /></div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-maroon-900">SEO &amp; Social sharing</h2>
          <div className="space-y-4">
            <div><label className="label">SEO title</label><input className="input" value={s.seo_title ?? ''} onChange={(e) => set('seo_title', e.target.value)} /></div>
            <div><label className="label">SEO description</label><textarea className="input" rows={2} value={s.seo_description ?? ''} onChange={(e) => set('seo_description', e.target.value)} /></div>
            <div><label className="label">Social sharing image (OG image)</label><ImageUploader images={s.seo_og_image ? [s.seo_og_image] : []} onChange={(i) => set('seo_og_image', i[i.length - 1] ?? null)} /></div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold text-maroon-900">Navigation &amp; Footer</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Navigation links (JSON array of {'{'} label, href {'}'})</label>
              <textarea className="input font-mono text-xs" rows={6} value={navText} onChange={(e) => setNavText(e.target.value)} />
            </div>
            <div><label className="label">Footer text</label><input className="input" value={s.footer_text ?? ''} onChange={(e) => set('footer_text', e.target.value)} /></div>
          </div>
        </section>

        {msg && <p className={`text-sm ${msg.includes('success') ? 'text-green-700' : 'text-red-600'}`}>{msg}</p>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
      </form>
    </div>
  );
}
