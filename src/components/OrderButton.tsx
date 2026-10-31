'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { buildOrderMessage, buildWhatsappUrl, type OrderFormData } from '@/lib/whatsapp';
import { effectivePrice, formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';

export default function OrderButton({
  product,
  whatsappNumber,
  businessName,
}: {
  product: Product;
  whatsappNumber: string;
  businessName: string;
}) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<OrderFormData>({
    customer_name: '',
    phone: '',
    address: '',
    quantity: 1,
    notes: '',
  });

  const soldOut = !product.is_available || product.stock <= 0;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.customer_name.trim()) e.customer_name = 'Please enter your full name.';
    if (!/^[0-9+\-\s()]{7,}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone / WhatsApp number.';
    if (!form.address.trim()) e.address = 'Please enter your delivery address.';
    if (!form.quantity || form.quantity < 1) e.quantity = 'Quantity must be at least 1.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const unit = effectivePrice(product);

    // 1) Save the order (anon insert is allowed by RLS). Non-blocking on failure.
    try {
      const supabase = createClient();
      await supabase.from('orders').insert({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        product_id: product.id,
        product_code: product.product_code,
        product_name: product.name,
        quantity: form.quantity,
        unit_price: unit,
        notes: form.notes.trim(),
      });
    } catch {
      // ignore — still proceed to WhatsApp so the customer is never blocked
    }

    // 2) Open WhatsApp with the pre-filled message.
    const msg = buildOrderMessage(businessName, product, form);
    const url = buildWhatsappUrl(whatsappNumber, msg);
    setSubmitting(false);
    setOpen(false);
    window.open(url, '_blank');
  }

  function update<K extends keyof OrderFormData>(k: K, v: OrderFormData[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <>
      <button
        className="btn-whatsapp w-full sm:w-auto"
        disabled={soldOut}
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.516 5.26l-.999 3.648 3.972-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
        {soldOut ? 'Sold Out' : 'Order on WhatsApp'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => setOpen(false)}>
          <div
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-maroon-900">Place your order</h3>
                <p className="text-sm text-maroon-500">{product.name} · {product.product_code}</p>
              </div>
              <button onClick={() => setOpen(false)} className="text-maroon-400 hover:text-maroon-700" aria-label="Close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="label">Full name *</label>
                <input className="input" value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} placeholder="Your name" />
                {errors.customer_name && <p className="mt-1 text-xs text-red-600">{errors.customer_name}</p>}
              </div>
              <div>
                <label className="label">WhatsApp / phone number *</label>
                <input className="input" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" inputMode="tel" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label className="label">Delivery address *</label>
                <textarea className="input" rows={3} value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="House no, street, city, state, PIN" />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Quantity *</label>
                  <input type="number" min={1} className="input" value={form.quantity} onChange={(e) => update('quantity', parseInt(e.target.value || '1', 10))} />
                  {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
                </div>
                <div>
                  <label className="label">Price</label>
                  <div className="input bg-maroon-50 font-semibold">{formatPrice(effectivePrice(product))}</div>
                </div>
              </div>
              <div>
                <label className="label">Additional notes</label>
                <textarea className="input" rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Blouse size, colour preference, etc. (optional)" />
              </div>
              <button type="submit" className="btn-whatsapp w-full" disabled={submitting}>
                {submitting ? 'Opening WhatsApp…' : 'Send order on WhatsApp'}
              </button>
              <p className="text-center text-xs text-maroon-400">
                We will confirm availability, payment and delivery personally on WhatsApp.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
