import Link from 'next/link';
import type { SiteSettings, Category } from '@/lib/types';

export default function Footer({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <footer className="mt-20 border-t border-maroon-100 bg-maroon-900 text-cream">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-gold-300">{settings.business_name}</h3>
          <p className="mt-3 text-sm text-cream/70">{settings.seo_description}</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-200">Shop</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-gold-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-200">Company</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href="/about" className="hover:text-gold-300">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-gold-300">Contact Us</Link></li>
            <li><Link href="/offers" className="hover:text-gold-300">Offers</Link></li>
            <li><Link href="/privacy" className="hover:text-gold-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">Terms &amp; Conditions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-200">Contact</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {settings.contact_phone && <li>{settings.contact_phone}</li>}
            {settings.contact_email && <li>{settings.contact_email}</li>}
            {settings.address && <li>{settings.address}</li>}
          </ul>
          <div className="mt-4 flex gap-3">
            {settings.instagram_url && (
              <a href={settings.instagram_url} className="hover:text-gold-300" target="_blank" rel="noreferrer">Instagram</a>
            )}
            {settings.facebook_url && (
              <a href={settings.facebook_url} className="hover:text-gold-300" target="_blank" rel="noreferrer">Facebook</a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-maroon-800 py-5">
        <p className="container-x text-center text-xs text-cream/60">
          {settings.footer_text || `© ${new Date().getFullYear()} ${settings.business_name}.`}
        </p>
      </div>
    </footer>
  );
}
