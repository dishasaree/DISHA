'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (next: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('product-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }
    onChange([...images, ...uploaded]);
    setUploading(false);
  }

  function removeAt(i: number) {
    onChange(images.filter((_, idx) => idx !== i));
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="relative h-28 w-24 overflow-hidden rounded-lg border border-maroon-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/50 px-1 py-0.5 text-[10px] text-white">
              <button type="button" onClick={() => move(i, -1)} aria-label="Move left">←</button>
              <button type="button" onClick={() => removeAt(i)} className="text-red-300" aria-label="Remove">✕</button>
              <button type="button" onClick={() => move(i, 1)} aria-label="Move right">→</button>
            </div>
            {i === 0 && <span className="absolute left-1 top-1 rounded bg-gold-500 px-1 text-[10px] font-semibold text-maroon-950">Main</span>}
          </div>
        ))}
        <label className="flex h-28 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-maroon-300 text-center text-xs text-maroon-500 hover:bg-maroon-50">
          {uploading ? 'Uploading…' : '+ Upload'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} disabled={uploading} />
        </label>
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <p className="mt-2 text-xs text-maroon-400">First image is the main product image. Drag order with the arrows.</p>
    </div>
  );
}
