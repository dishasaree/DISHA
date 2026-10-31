import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getSettings, getCategories } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()]);
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar settings={settings} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} categories={categories} />
    </div>
  );
}
