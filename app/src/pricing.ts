// Pure price logic: wholesale tiers, unit prices, currency formatting and cart totals.
// All amounts are in KWD until they are formatted.
import { CUR, type Lang } from './data/locale';
import type { Product } from './data/products';

export type Mode = 'retail' | 'wholesale';
export type ShipKey = 'standard' | 'express';

export const EXPRESS_FEE = 1.5;
export const COUPON_RATE = 0.1;
export const COUPON_CAP = 2;

/** Wholesale price tiers: 10–49, 50–199 and 200+ pieces. */
export const tiersOf = (p: Product) => [
  { min: 10, max: 49 as number | null, price: p.price * 0.72 },
  { min: 50, max: 199 as number | null, price: p.price * 0.64 },
  { min: 200, max: null as number | null, price: p.price * 0.55 },
];

/** Unit price: the retail price, or the wholesale tier the quantity falls in (below 10 uses the first tier). */
export function unitPrice(p: Product, qty: number, mode: Mode) {
  if (mode !== 'wholesale') return p.price;
  const tiers = tiersOf(p);
  let u = tiers[0].price;
  tiers.forEach(x => { if (qty >= x.min) u = x.price; });
  return u;
}

/**
 * Convert from KWD and format. Arabic puts the Arabic symbol after the number;
 * other languages put the Latin symbol first ("KD 8.900", "$29.01", "E£1,406.20").
 */
export function formatPrice(kwd: number, cur: string, lang: Lang) {
  const c = CUR.find(x => x[0] === cur) ?? CUR[0];
  const n = (kwd * c[3]).toLocaleString('en-US', { minimumFractionDigits: c[4], maximumFractionDigits: c[4] });
  if (lang === 'ar') return n + ' ' + c[2];
  return c[1].length > 1 && c[1] !== 'E£' ? c[1] + ' ' + n : c[1] + n;
}

/** Order totals in KWD. The NO1SALE coupon takes 10% off the subtotal, up to 2 KWD. */
export function cartTotals(subtotal: number, coupon: boolean, ship: ShipKey) {
  const discount = coupon ? Math.min(COUPON_CAP, subtotal * COUPON_RATE) : 0;
  const shipping = ship === 'express' ? EXPRESS_FEE : 0;
  return { discount, shipping, total: subtotal - discount, grand: subtotal - discount + shipping };
}
