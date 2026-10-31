import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getCategories, getProducts, getOffers, getPageContent } from '@/lib/data';

interface HomeContent {
  hero_title?: string;
  hero_subtitle?: string;
  hero_image?: string;
  hero_cta?: string;
  feature_strip?: string[];
}

export default async function HomePage() {
  const [categories, featured, newArrivals, bestSellers, offers, content] = await Promise.all([
    getCategories(),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ newArrival: true, limit: 8 }),
    getProducts({ bestSeller: true, limit: 4 }),
    getOffers(),
    getPageContent<HomeContent>('home'),
  ]);

  const hero = content ?? {};
  const heroImage = hero.hero_image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600';

  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImage} alt="Sarees" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-maroon-950/80 via-maroon-900/50 to-transparent" />
        </div>
        <div className="container-x relative flex min-h-[70vh] flex-col justify-center py-20">
          <div className="max-w-xl animate-fade-up">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">Handcrafted in India</p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl lg:text-6xl">
              {hero.hero_title || 'Timeless Sarees, Woven for You'}
            </h1>
            <p className="mt-5 text-lg text-cream/85">
              {hero.hero_subtitle || 'Discover handcrafted silk, cotton and bridal sarees. Order easily on WhatsApp.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-gold">{hero.hero_cta || 'Shop the Collection'}</Link>
              <Link href="/offers" className="btn-outline border-cream/40 text-cream hover:bg-cream/10">View Offers</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      {hero.feature_strip && hero.feature_strip.length > 0 && (
        <section className="border-b border-maroon-100 bg-white">
          <div className="container-x grid grid-cols-2 gap-4 py-6 text-center md:grid-cols-4">
            {hero.feature_strip.map((f, i) => (
              <div key={i} className="text-sm font-medium text-maroon-700">{f}</div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="container-x py-16">
        <h2 className="section-title text-center">Shop by Category</h2>
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="card group overflow-hidden">
              <div className="aspect-square overflow-hidden bg-maroon-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image_url || heroImage} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <p className="p-3 text-center font-serif text-sm font-semibold text-maroon-900">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Offer banner */}
      {offers[0] && (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={offers[0].image_url || heroImage} alt={offers[0].title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-maroon-950/70" />
          </div>
          <div className="container-x relative py-20 text-center text-cream">
            {offers[0].discount_text && <p className="mb-2 font-semibold uppercase tracking-widest text-gold-300">{offers[0].discount_text}</p>}
            <h2 className="font-serif text-3xl font-bold sm:text-4xl">{offers[0].title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-cream/80">{offers[0].subtitle}</p>
            <Link href={offers[0].cta_link || '/shop'} className="btn-gold mt-6">{offers[0].cta_label || 'Shop Now'}</Link>
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between">
            <h2 className="section-title">Featured Sarees</h2>
            <Link href="/shop" className="text-sm font-semibold text-maroon-600 hover:text-maroon-800">View all →</Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="bg-white py-16">
          <div className="container-x">
            <h2 className="section-title">New Arrivals</h2>
            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {newArrivals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="container-x py-16">
          <h2 className="section-title">Best Sellers</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {bestSellers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
