import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatPrice, discountPercent } from '@/lib/utils';

export default function ProductCard({ product }: { product: Product }) {
  const pct = discountPercent(product.price, product.discount_price);
  const img = product.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800';
  const soldOut = !product.is_available || product.stock <= 0;

  return (
    <Link href={`/product/${product.slug}`} className="card group overflow-hidden">
      <div className="relative aspect-[3/4] overflow-hidden bg-maroon-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {pct && <span className="badge bg-maroon-700 text-white">-{pct}%</span>}
          {product.is_new_arrival && <span className="badge bg-gold-500 text-maroon-950">New</span>}
          {product.is_best_seller && <span className="badge bg-maroon-900 text-gold-200">Best Seller</span>}
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="badge bg-maroon-950 text-white">Sold Out</span>
          </div>
        )}
      </div>
      <div className="p-4">
        {product.categories?.name && (
          <p className="text-xs uppercase tracking-wide text-maroon-400">{product.categories.name}</p>
        )}
        <h3 className="mt-1 line-clamp-1 font-serif text-base font-semibold text-maroon-900">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-maroon-800">
            {formatPrice(product.discount_price && product.discount_price < product.price ? product.discount_price : product.price)}
          </span>
          {pct && (
            <span className="text-sm text-maroon-400 line-through">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
