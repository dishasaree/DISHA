import { getPageContent } from '@/lib/data';

export const metadata = { title: 'Terms & Conditions' };
export const dynamic = 'force-dynamic';

interface Doc { title?: string; body?: string }

export default async function TermsPage() {
  const c = (await getPageContent<Doc>('terms')) ?? {};
  return (
    <div className="container-x max-w-3xl py-16">
      <h1 className="section-title">{c.title || 'Terms & Conditions'}</h1>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-maroon-700">
        {c.body || 'By placing an order you agree to our terms.'}
      </div>
    </div>
  );
}
