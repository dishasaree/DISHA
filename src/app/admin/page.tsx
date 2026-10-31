import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatPrice } from '@/lib/utils';
import type { Order } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const [{ count: products }, { count: orders }, { count: newOrders }, { data: recent }] =
    await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6),
    ]);

  const recentOrders = (recent ?? []) as Order[];
  const stats = [
    { label: 'Products', value: products ?? 0, href: '/admin/products' },
    { label: 'Total Orders', value: orders ?? 0, href: '/admin/orders' },
    { label: 'New Orders', value: newOrders ?? 0, href: '/admin/orders' },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-maroon-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="card p-6">
            <p className="text-sm text-maroon-500">{s.label}</p>
            <p className="mt-1 text-3xl font-bold text-maroon-800">{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-maroon-900">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-maroon-600 hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-maroon-400">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-maroon-400">
                <tr><th className="py-2">Customer</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-maroon-100">
                    <td className="py-2">{o.customer_name}</td>
                    <td>{o.product_name}</td>
                    <td>{o.quantity}</td>
                    <td>{formatPrice((o.unit_price || 0) * o.quantity)}</td>
                    <td><span className="badge bg-maroon-100 text-maroon-700">{o.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="btn-primary">+ Add product</Link>
        <Link href="/admin/offers" className="btn-outline">Manage offers</Link>
        <Link href="/admin/settings" className="btn-outline">Store settings</Link>
      </div>
    </div>
  );
}
