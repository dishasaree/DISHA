import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { getCategories, getProducts } from '@/lib/data';
import { filterAndSortProducts } from '@/lib/utils';

export const metadata = { title: 'Shop All Sarees' };
export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; availability?: string; sort?: string };
}) {
  const [categories, all] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: searchParams.category }),
  ]);
  const products = filterAndSortProducts(all, searchParams);

  return (
    <div className="container-x py-12">
      <h1 className="section-title">All Sarees</h1>
      <p className="mt-2 text-maroon-500">Browse our full collection of handcrafted sarees.</p>
      <div className="mt-8">
        <FilterBar categories={categories} />
        {products.length === 0 ? (
          <p className="py-20 text-center text-maroon-400">No sarees match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
