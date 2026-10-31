import { getPageContent } from '@/lib/data';

export const metadata = { title: 'About Us' };
export const dynamic = 'force-dynamic';

interface AboutContent { title?: string; body?: string; image?: string }

export default async function AboutPage() {
  const c = (await getPageContent<AboutContent>('about')) ?? {};
  return (
    <div className="container-x py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <h1 className="section-title">{c.title || 'About Us'}</h1>
          <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-maroon-700">
            {c.body || 'We are a saree boutique dedicated to authentic, handcrafted weaves.'}
          </p>
        </div>
        {c.image && (
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.image} alt="About" className="h-full w-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
