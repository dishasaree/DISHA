import Link from 'next/link';
import { notFound } from 'next/navigation';
import Gallery from '@/components/Gallery';
import OrderButton from '@/components/OrderButton';
import ProductCard from '@/components/ProductCard';
import { getProductBySlug, getProducts, getSettings } from '@/lib/data';
import { formatPrice, discountPercent } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) return { title: 'Product' };
  return {
    title: p.name,
    description: p.description?.slice(0, 160),
    openGraph: { images: p.images?.[0] ? [p.images[0]] : undefined },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, settings] = await Promise.all([getProductBySlug(params.slug), getSettings()]);
  if (!product) notFound();

  const pct = discountPercent(product.price, product.discount_price);
  const soldOut = !product.is_available || product.stock <= 0;
  const related = (await getProducts({ categorySlug: product.categories?.slug, limit: 5 }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container-x py-10">
      <nav className="mb-6 text-sm text-maroon-400">
        <Link href="/" className="hover:text-maroon-700">Home</Link> /{' '}
        <Link href="/shop" className="hover:text-maroon-700">Shop</Link>
        {product.categories && (
          <>
            {' '}/{' '}
            <Link href={`/category/${product.categories.slug}`} className="hover:text-maroon-700">
              {product.categories.name}
            </Link>
          </>
        )}
        {' '}/ <span className="text-maroon-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <Gallery images={product.images} alt={product.name} />

        <div>
          {product.categories?.name && (
            <p className="text-sm uppercase tracking-wide text-maroon-400">{product.categories.name}</p>
          )}
          <h1 className="mt-1 font-serif text-3xl font-bold text-maroon-900">{product.name}</h1>
          <p className="mt-2 text-sm text-maroon-400">Product code: {product.product_code}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-3xl font-bold text-maroon-800">
              {formatPrice(product.discount_price && product.discount_price < product.price ? product.discount_price : product.price)}
            </span>
            {pct && (
              <>
                <span className="text-lg text-maroon-400 line-through">{formatPrice(product.price)}</span>
                <span className="badge bg-maroon-700 text-white">Save {pct}%</span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.is_new_arrival && <span className="badge bg-gold-500 text-maroon-950">New Arrival</span>}
            {product.is_best_seller && <span className="badge bg-maroon-900 text-gold-200">Best Seller</span>}
            {product.collection && <span className="badge bg-maroon-50 text-maroon-700">{product.collection}</span>}
          </div>

          <p className="mt-3 text-sm font-medium">
            {soldOut ? (
              <span className="text-red-600">Currently sold out</span>
            ) : (
              <span className="text-green-700">In stock — {product.stock} available</span>
            )}
          </p>

          <div className="mt-6">
            <OrderButton product={product} whatsappNumber={settings.whatsapp_number} businessName={settings.business_name} />
          </div>

          <div className="mt-8 border-t border-maroon-100 pt-6">
            <h2 className="font-serif text-lg font-semibold text-maroon-900">Description</h2>
            <p className="mt-2 whitespace-pre-line text-maroon-700">{product.description || 'No description available.'}</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="section-title">You may also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
