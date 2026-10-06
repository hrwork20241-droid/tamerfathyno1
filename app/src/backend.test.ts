import { describe, expect, it } from 'vitest';
import { rowToProduct, soldLabel, type ProductRow } from './backend';

const row: ProductRow = {
  id: 7, name: 'Embroidered abaya', name_ar: 'عباية مطرزة', category: 'Fashion', price: 12.5, old_price: 18,
  seller: 'Basics Lab', colors: ['أسود', 'كحلي'], image_url: 'https://x.supabase.co/a.jpg',
  rating: 4.6, reviews: 12, sold: 3400, stock_pct: 40, active: true,
};

describe('rowToProduct', () => {
  it('maps a database row to an app product', () => {
    expect(rowToProduct(row)).toEqual({
      id: 7, name: 'Embroidered abaya', ar: 'عباية مطرزة', cat: 'Fashion', price: 12.5, was: 18,
      rating: 4.6, reviews: 12, sold: '3.4k', pct: 40, seller: 'Basics Lab', img: '',
      colors: ['أسود', 'كحلي'], image: 'https://x.supabase.co/a.jpg', fromDb: true,
    });
  });

  it('fills sensible defaults for optional fields', () => {
    const p = rowToProduct({ ...row, name_ar: '', old_price: null, colors: null, image_url: null, rating: null, reviews: null, sold: null, stock_pct: null, seller: '' });
    expect(p.ar).toBe('Embroidered abaya');
    expect(p.was).toBe(12.5); // no discount
    expect(p.colors).toEqual(['Default']);
    expect(p.image).toBeUndefined();
    expect([p.rating, p.reviews, p.sold, p.pct, p.seller]).toEqual([5, 0, '0', 0, 'NO1']);
  });

  it('ignores an old price that is not higher than the price', () => {
    expect(rowToProduct({ ...row, old_price: 10 }).was).toBe(12.5);
  });

  it('accepts numbers sent as strings and falls back on unknown categories', () => {
    const p = rowToProduct({ ...row, price: '9.750' as unknown as number, category: 'Garden' });
    expect(p.price).toBe(9.75);
    expect(p.cat).toBe('Electronics');
  });
});

describe('soldLabel', () => {
  it('shortens thousands like the sample data', () => {
    expect([soldLabel(0), soldLabel(950), soldLabel(1000), soldLabel(3200), soldLabel(12400)]).toEqual(['0', '950', '1k', '3.2k', '12k']);
  });
});
