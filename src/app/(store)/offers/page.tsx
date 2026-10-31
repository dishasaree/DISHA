import Link from 'next/link';
import { getOffers } from '@/lib/data';

export const metadata = { title: 'Offers & Discounts' };
export const dynamic = 'force-dynamic';

export default async function OffersPage() {
  const offers = await getOffers();
  return (
    <div className="container-x py-16">
      <h1 className="section-title">Offers &amp; Discounts</h1>
      <p className="mt-2 text-maroon-500">Current promotions on our saree collection.</p>

      {offers.length === 0 ? (
        <p className="py-20 text-center text-maroon-400">No active offers right now. Check back soon!</p>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {offers.map((o) => (
            <div key={o.id} className="card overflow-hidden">
              {o.image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-maroon-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.image_url} alt={o.title} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-6">
                {o.discount_text && <span className="badge bg-maroon-700 text-white">{o.discount_text}</span>}
                <h3 className="mt-3 font-serif text-xl font-bold text-maroon-900">{o.title}</h3>
                {o.subtitle && <p className="mt-1 text-maroon-600">{o.subtitle}</p>}
                {o.description && <p className="mt-2 text-sm text-maroon-500">{o.description}</p>}
                <Link href={o.cta_link || '/shop'} className="btn-primary mt-4">{o.cta_label || 'Shop Now'}</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
