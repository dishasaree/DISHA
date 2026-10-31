// Build a WhatsApp deep link with a pre-filled order message.
import type { Product } from './types';
import { formatPrice, effectivePrice } from './utils';

export interface OrderFormData {
  customer_name: string;
  phone: string;
  address: string;
  quantity: number;
  notes: string;
}

export function sanitizeNumber(num: string): string {
  return (num || '').replace(/[^0-9]/g, '');
}

export function buildOrderMessage(
  businessName: string,
  product: Pick<Product, 'name' | 'product_code' | 'price' | 'discount_price'>,
  form: OrderFormData,
): string {
  const unit = effectivePrice(product);
  const total = unit * (form.quantity || 1);
  const lines = [
    `*New Order — ${businessName}*`,
    '',
    '*Product Details*',
    `• Saree: ${product.name}`,
    `• Product Code: ${product.product_code}`,
    `• Price: ${formatPrice(unit)}`,
    `• Quantity: ${form.quantity}`,
    `• Estimated Total: ${formatPrice(total)}`,
    '',
    '*Customer Details*',
    `• Name: ${form.customer_name}`,
    `• WhatsApp / Phone: ${form.phone}`,
    `• Delivery Address: ${form.address}`,
  ];
  if (form.notes?.trim()) {
    lines.push('', '*Additional Notes*', form.notes.trim());
  }
  lines.push('', 'Please confirm availability, payment and delivery. Thank you!');
  return lines.join('\n');
}

export function buildWhatsappUrl(businessNumber: string, message: string): string {
  const num = sanitizeNumber(businessNumber);
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}
