import { describe, expect, it } from 'vitest';
import { parseSaved } from './store';

describe('parseSaved', () => {
  it('ignores anything that is not an object', () => {
    expect(parseSaved(null)).toEqual({});
    expect(parseSaved('cart')).toEqual({});
    expect(parseSaved(42)).toEqual({});
  });

  it('keeps valid settings', () => {
    expect(parseSaved({ lang: 'en', cur: 'EGP', mode: 'wholesale', pay: 'apple', coupon: true, follow: false }))
      .toEqual({ lang: 'en', cur: 'EGP', mode: 'wholesale', pay: 'apple', coupon: true, follow: false });
  });

  it('drops unknown languages, currencies, modes and payment methods', () => {
    expect(parseSaved({ lang: 'xx', cur: 'ABC', mode: 'bulk', pay: 'bitcoin' })).toEqual({});
  });

  it('keeps only cart lines that match a product, its colour and a positive whole quantity', () => {
    const { cart } = parseSaved({
      cart: [
        { id: 1, qty: 2, color: 'Black' }, // valid
        { id: 999, qty: 1, color: 'Black' }, // no such product
        { id: 1, qty: 1, color: 'Purple' }, // not a colour of product 1
        { id: 5, qty: 0, color: '30ml' }, // zero quantity
        { id: 5, qty: 1.5, color: '30ml' }, // fractional quantity
        null,
      ],
    });
    expect(cart).toEqual([{ id: 1, qty: 2, color: 'Black' }]);
  });

  it('removes duplicate and unknown wishlist entries', () => {
    expect(parseSaved({ wish: [3, 3, 7, 999] }).wish).toEqual([3, 7]);
  });

  it('keeps valid addresses and falls back to the first one when the default is missing', () => {
    const home = { id: 4, label: 'addrHome', area: 'Hawally', block: '3', street: '20', house: '11', phone: '' };
    const bad = { id: 5, label: 'addrBeach', area: '', block: '', street: '', house: '', phone: '' };
    expect(parseSaved({ addresses: [home, bad], addrId: 5 })).toEqual({ addresses: [home], addrId: 4 });
    expect(parseSaved({ addresses: [home], addrId: 4 }).addrId).toBe(4);
  });

  it('ignores an empty address list so the seeded addresses stay', () => {
    expect(parseSaved({ addresses: [] })).toEqual({});
  });
});
