import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not signed in: only the login route is reachable (middleware also guards this).
  if (!user) {
    return <>{children}</>;
  }

  // Verify the signed-in user is an admin.
  const { data: adminRow } = await supabase.from('admins').select('id').eq('id', user.id).maybeSingle();
  if (!adminRow) {
    await supabase.auth.signOut();
    redirect('/admin/login?error=not_admin');
  }

  return (
    <AdminShell email={user.email ?? ''}>{children}</AdminShell>
  );
}
