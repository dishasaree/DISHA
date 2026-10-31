import { getPageContent, getSettings } from '@/lib/data';
import { buildWhatsappUrl } from '@/lib/whatsapp';

export const metadata = { title: 'Contact Us' };
export const dynamic = 'force-dynamic';

interface ContactContent { title?: string; intro?: string }

export default async function ContactPage() {
  const [c, settings] = await Promise.all([
    getPageContent<ContactContent>('contact'),
    getSettings(),
  ]);
  const content = c ?? {};
  const waUrl = buildWhatsappUrl(settings.whatsapp_number, 'Hello! I have a question about your sarees.');

  return (
    <div className="container-x py-16">
      <h1 className="section-title">{content.title || 'Contact Us'}</h1>
      <p className="mt-4 max-w-xl text-lg text-maroon-700">
        {content.intro || 'Have a question about a saree or your order? We would love to help.'}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settings.contact_phone && (
          <div className="card p-6">
            <h3 className="font-serif text-lg font-semibold text-maroon-900">Phone</h3>
            <p className="mt-2 text-maroon-700">{settings.contact_phone}</p>
          </div>
        )}
        {settings.contact_email && (
          <div className="card p-6">
            <h3 className="font-serif text-lg font-semibold text-maroon-900">Email</h3>
            <p className="mt-2 text-maroon-700">{settings.contact_email}</p>
          </div>
        )}
        {settings.address && (
          <div className="card p-6">
            <h3 className="font-serif text-lg font-semibold text-maroon-900">Address</h3>
            <p className="mt-2 text-maroon-700">{settings.address}</p>
          </div>
        )}
      </div>

      <div className="mt-10">
        <a href={waUrl} target="_blank" rel="noreferrer" className="btn-whatsapp">Chat with us on WhatsApp</a>
      </div>
    </div>
  );
}
