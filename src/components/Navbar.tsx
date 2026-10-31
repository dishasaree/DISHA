'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { SiteSettings, Category } from '@/lib/types';

export default function Navbar({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-maroon-100 bg-cream/90 backdrop-blur">
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {settings.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo_url} alt={settings.business_name} className="h-9 w-auto" />
          ) : (
            <span className="font-serif text-xl font-bold text-maroon-800">
              {settings.business_name}
            </span>
          )}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {settings.nav_links?.map((l) =>
            l.href === '/shop' ? (
              <div
                key={l.href}
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <Link href="/shop" className="text-sm font-medium text-maroon-800 hover:text-maroon-600">
                  {l.label}
                </Link>
                {shopOpen && categories.length > 0 && (
                  <div className="absolute left-0 top-full w-56 rounded-xl border border-maroon-100 bg-white p-2 shadow-lg">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/category/${c.slug}`}
                        className="block rounded-lg px-3 py-2 text-sm text-maroon-800 hover:bg-maroon-50"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-maroon-800 hover:text-maroon-600"
              >
                {l.label}
              </Link>
            ),
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/shop" className="hidden btn-gold sm:inline-flex">
            Shop Now
          </Link>
          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-maroon-100 bg-cream md:hidden">
          <div className="container-x flex flex-col py-3">
            {settings.nav_links?.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm font-medium text-maroon-800"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 border-t border-maroon-100 pt-2">
              <p className="py-1 text-xs font-semibold uppercase text-maroon-400">Categories</p>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm text-maroon-700"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
