import { describe, expect, it } from 'vitest';
import { P } from './data/products';
import { cartTotals, EXPRESS_FEE, formatPrice, tiersOf, unitPrice } from './pricing';

const earbuds = P.find(p => p.id === 1)!; // 8.900 KWD retail

describe('unitPrice', () => {
  it('uses the retail price in retail mode, whatever the quantity', () => {
    expect(unitPrice(earbuds, 1, 'retail')).toBe(8.9);
    expect(unitPrice(earbuds, 500, 'retail')).toBe(8.9);
  });

  it('picks the wholesale tier the quantity falls in', () => {
    expect(unitPrice(earbuds, 10, 'wholesale')).toBeCloseTo(6.408);
    expect(unitPrice(earbuds, 49, 'wholesale')).toBeCloseTo(6.408);
    expect(unitPrice(earbuds, 50, 'wholesale')).toBeCloseTo(5.696);
    expect(unitPrice(earbuds, 199, 'wholesale')).toBeCloseTo(5.696);
    expect(unitPrice(earbuds, 200, 'wholesale')).toBeCloseTo(4.895);
  });

  it('falls back to the first tier below the minimum order', () => {
    expect(unitPrice(earbuds, 3, 'wholesale')).toBeCloseTo(6.408);
  });

  it('has tiers that get cheaper as quantity grows', () => {
    for (const p of P) {
      const [a, b, c] = tiersOf(p);
      expect(a.price).toBeGreaterThan(b.price);
      expect(b.price).toBeGreaterThan(c.price);
      expect(a.price).toBeLessThan(p.price);
    }
  });
});

describe('formatPrice', () => {
  it('formats KWD with three decimals', () => {
    expect(formatPrice(8.9, 'KWD', 'en')).toBe('KD 8.900');
    expect(formatPrice(8.9, 'KWD', 'ar')).toBe('8.900 د.ك');
  });

  it('converts to Egyptian pounds', () => {
    expect(formatPrice(8.9, 'EGP', 'en')).toBe('E£1,406.20');
    expect(formatPrice(8.9, 'EGP', 'ar')).toBe('1,406.20 ج.م');
  });

  it('puts single-character symbols directly before the number', () => {
    expect(formatPrice(8.9, 'USD', 'en')).toBe('$29.01');
    expect(formatPrice(10, 'EUR', 'fr')).toBe('€28.00');
  });

  it('drops decimals for currencies that have none', () => {
    expect(formatPrice(1, 'IQD', 'en')).toBe('IQD 4,270');
  });

  it('falls back to KWD for an unknown currency code', () => {
    expect(formatPrice(1, 'XXX', 'en')).toBe('KD 1.000');
  });
});

describe('cartTotals', () => {
  it('charges nothing extra by default', () => {
    expect(cartTotals(12, false, 'standard')).toEqual({ discount: 0, shipping: 0, total: 12, grand: 12 });
  });

  it('takes 10% off with the coupon', () => {
    const t = cartTotals(10, true, 'standard');
    expect(t.discount).toBeCloseTo(1);
    expect(t.grand).toBeCloseTo(9);
  });

  it('caps the coupon at 2 KWD', () => {
    expect(cartTotals(50, true, 'standard').discount).toBe(2);
  });

  it('adds the express fee after the discount', () => {
    const t = cartTotals(50, true, 'express');
    expect(t.shipping).toBe(EXPRESS_FEE);
    expect(t.total).toBe(48);
    expect(t.grand).toBe(48 + EXPRESS_FEE);
  });
});
