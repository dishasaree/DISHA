'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import type { Order, OrderStatus } from '@/lib/types';

const STATUSES: OrderStatus[] = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled'];

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [selected, setSelected] = useState<Order | null>(null);

  async function load() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  async function setStatus(o: Order, status: OrderStatus) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', o.id);
    if (error) return alert(error.message);
    load();
    setSelected((s) => (s && s.id === o.id ? { ...s, status } : s));
  }

  async function remove(o: Order) {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', o.id);
    setSelected(null);
    load();
  }

  const list = filter ? orders.filter((o) => o.status === filter) : orders;

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-maroon-900">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setFilter('')} className={`badge ${!filter ? 'bg-maroon-700 text-white' : 'bg-maroon-100 text-maroon-700'}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`badge capitalize ${filter === s ? 'bg-maroon-700 text-white' : 'bg-maroon-100 text-maroon-700'}`}>{s}</button>
        ))}
      </div>

      <div className="mt-5 card overflow-x-auto">
        {list.length === 0 ? (
          <p className="p-6 text-maroon-400">No orders.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-maroon-50 text-maroon-500">
              <tr><th className="p-3">Date</th><th>Customer</th><th>Phone</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((o) => (
                <tr key={o.id} className="border-t border-maroon-100">
                  <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.phone}</td>
                  <td>{o.product_name}</td>
                  <td>{o.quantity}</td>
                  <td>{formatPrice((o.unit_price || 0) * o.quantity)}</td>
                  <td><span className="badge bg-maroon-100 capitalize text-maroon-700">{o.status}</span></td>
                  <td><button className="text-maroon-700 hover:underline" onClick={() => setSelected(o)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="font-serif text-xl font-bold text-maroon-900">Order details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div><dt className="text-maroon-400">Customer</dt><dd className="font-medium">{selected.customer_name}</dd></div>
              <div><dt className="text-maroon-400">Phone</dt><dd>{selected.phone}</dd></div>
              <div><dt className="text-maroon-400">Address</dt><dd className="whitespace-pre-line">{selected.address}</dd></div>
              <div><dt className="text-maroon-400">Product</dt><dd>{selected.product_name} ({selected.product_code})</dd></div>
              <div><dt className="text-maroon-400">Quantity</dt><dd>{selected.quantity}</dd></div>
              <div><dt className="text-maroon-400">Total</dt><dd>{formatPrice((selected.unit_price || 0) * selected.quantity)}</dd></div>
              {selected.notes && <div><dt className="text-maroon-400">Notes</dt><dd className="whitespace-pre-line">{selected.notes}</dd></div>}
            </dl>
            <div className="mt-4">
              <label className="label">Status</label>
              <select className="input" value={selected.status} onChange={(e) => setStatus(selected, e.target.value as OrderStatus)}>
                {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div className="mt-5 flex justify-between">
              <a className="btn-whatsapp" target="_blank" rel="noreferrer" href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}`}>Message customer</a>
              <button className="text-red-600 hover:underline" onClick={() => remove(selected)}>Delete order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
