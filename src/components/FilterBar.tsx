'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Category } from '@/lib/types';

export default function FilterBar({
  categories,
  hideCategory = false,
}: {
  categories: Category[];
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') ?? '');

  useEffect(() => {
    setQ(params.get('q') ?? '');
  }, [params]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`);
  }

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('q', q.trim());
  }

  return (
    <div className="mb-8 space-y-4">
      <form onSubmit={onSearch} className="relative">
        <input
          className="input pr-12"
          placeholder="Search sarees by name, code or collection…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-maroon-500" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" strokeLinecap="round" /></svg>
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {!hideCategory && (
          <select className="input max-w-[200px]" value={params.get('category') ?? ''} onChange={(e) => setParam('category', e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        )}
        <select className="input max-w-[200px]" value={params.get('availability') ?? ''} onChange={(e) => setParam('availability', e.target.value)}>
          <option value="">All availability</option>
          <option value="in">In stock</option>
          <option value="out">Sold out</option>
        </select>
        <select className="input max-w-[220px]" value={params.get('sort') ?? ''} onChange={(e) => setParam('sort', e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
