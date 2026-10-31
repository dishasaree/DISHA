import { getPageContent } from '@/lib/data';

export const metadata = { title: 'Privacy Policy' };
export const dynamic = 'force-dynamic';

interface Doc { title?: string; body?: string }

export default async function PrivacyPage() {
  const c = (await getPageContent<Doc>('privacy')) ?? {};
  return (
    <div className="container-x max-w-3xl py-16">
      <h1 className="section-title">{c.title || 'Privacy Policy'}</h1>
      <div className="mt-6 whitespace-pre-line leading-relaxed text-maroon-700">
        {c.body || 'We respect your privacy.'}
      </div>
    </div>
  );
}
