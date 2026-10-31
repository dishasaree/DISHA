'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { cx } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/offers', label: 'Offers & Banners' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/content', label: 'Pages & Content' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-maroon-50 text-maroon-950">
      <header className="flex h-14 items-center justify-between border-b border-maroon-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" /></svg>
          </button>
          <span className="font-serif text-lg font-bold text-maroon-800">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Link href="/" target="_blank" className="text-maroon-600 hover:underline">View site ↗</Link>
          <span className="hidden text-maroon-400 sm:inline">{email}</span>
          <button onClick={signOut} className="rounded-lg bg-maroon-100 px-3 py-1.5 font-medium text-maroon-800 hover:bg-maroon-200">Sign out</button>
        </div>
      </header>

      <div className="flex">
        <aside className={cx('fixed inset-y-14 left-0 z-30 w-60 border-r border-maroon-200 bg-white p-3 transition-transform lg:static lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')}>
          <nav className="space-y-1">
            {NAV.map((n) => {
              const active = n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={cx('block rounded-lg px-3 py-2 text-sm font-medium', active ? 'bg-maroon-700 text-white' : 'text-maroon-700 hover:bg-maroon-100')}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
