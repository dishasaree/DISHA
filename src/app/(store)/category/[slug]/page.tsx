import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import { getCategories, getProducts } from '@/lib/data';
import { filterAndSortProducts } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.slug);
  return { title: cat ? cat.name : 'Category' };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { q?: string; availability?: string; sort?: string };
}) {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.slug);
  if (!cat) notFound();

  const all = await getProducts({ categorySlug: params.slug });
  const products = filterAndSortProducts(all, searchParams);

  return (
    <div>
      <section className="relative">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cat.image_url || ''} alt={cat.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-maroon-950/60" />
        </div>
        <div className="container-x relative py-16 text-cream">
          <h1 className="font-serif text-4xl font-bold">{cat.name}</h1>
          {cat.description && <p className="mt-2 max-w-xl text-cream/80">{cat.description}</p>}
        </div>
      </section>

      <div className="container-x py-12">
        <FilterBar categories={categories} hideCategory />
        {products.length === 0 ? (
          <p className="py-20 text-center text-maroon-400">No sarees in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
