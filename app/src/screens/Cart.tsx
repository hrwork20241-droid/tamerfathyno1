import type { TKey } from '../data/locale';
import { productById, useStore, type PayKey, type ShipKey } from '../store';
import { BackHeader, C, f, mono, Ph, screenPad } from '../ui';

const EXPRESS_FEE = 1.5; // KWD

export const PAY_DEFS: [PayKey, TKey, TKey | null][] = [
  ['knet', 'knet', 'debit'], ['card', 'card', null], ['apple', 'applePay', 'faceId'], ['cash', 'cash', 'onDelivery'],
];

/** Cart lines and totals in the current mode and currency. */
function useCart() {
  const { s, t, word, fmt, unit, byId, isWholesale: w, cartCount } = useStore();
  const lines = s.cart.map((c, i) => {
    const u = unit(productById(c.id), c.qty);
    return {
      ...byId(c.id), i, qty: c.qty,
      variant: word(c.color) + (w ? ' · ' + fmt(u) + t('perPc') : ''),
      lineText: fmt(u * c.qty),
      sub: u * c.qty,
    };
  });
  const sub = lines.reduce((a, c) => a + c.sub, 0);
  const disc = s.coupon ? Math.min(2, sub * 0.1) : 0;
  const ship = s.ship === 'express' ? EXPRESS_FEE : 0;
  return {
    lines,
    countText: cartCount + ' ' + (cartCount === 1 ? t('item') : t('items')),
    sum: {
      sub: fmt(sub),
      disc: disc ? '−' + fmt(disc) : fmt(0),
      total: fmt(sub - disc),
      ship: ship ? fmt(ship) : t('free'),
      grand: fmt(sub - disc + ship),
    },
  };
}

const sumRow = { display: 'flex', justifyContent: 'space-between' } as const;
const totalRow = { ...sumRow, borderTop: `1px solid ${C.line}`, paddingTop: 10, font: f(900, 18) } as const;
const sumCard = { background: '#fff', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 10, font: f(500, 13) } as const;
const ctaStyle = { height: 54, border: 'none', borderRadius: 16, background: C.accent, color: '#fff', font: f(800, 16) } as const;

export function Cart() {
  const { s, t, tab, go, open, say, set } = useStore();
  const { lines, countText, sum } = useCart();

  const updateQty = (i: number, d: number) =>
    set(st => ({ cart: st.cart.map((x, j) => (j === i ? { ...x, qty: Math.max(1, x.qty + d) } : x)) }));
  const remove = (i: number) => { set(st => ({ cart: st.cart.filter((_, j) => j !== i) })); say('t_removed'); };
  const qtyBtn = { width: 30, height: 30, border: 'none', background: 'none', font: f(700, 15) };

  return (
    <div style={screenPad}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ font: f(900, 26), letterSpacing: -1 }}>{t('cart')}</div>
        <span style={{ font: f(500, 13), color: C.muted }}>{countText}</span>
      </div>

      {!lines.length ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', font: f(900, 22) }}>0</div>
          <div style={{ font: f(800, 17) }}>{t('cartEmpty')}</div>
          <button onClick={() => tab('home')} style={{ height: 44, padding: '0 22px', border: 'none', borderRadius: 999, background: C.ink, color: '#fff', font: f(700, 14) }}>{t('startShopping')}</button>
        </div>
      ) : (
        <>
          <div style={{ background: C.ok, color: '#fff', borderRadius: 12, padding: '10px 14px', font: f(600, 12) }}>{t('freeUnlocked')}</div>
          {lines.map(c => (
            <div key={c.i + '-' + c.id + '-' + c.variant} style={{ background: '#fff', borderRadius: 16, padding: 12, display: 'flex', gap: 12 }}>
              <Ph label={c.img} fontSize={9} onClick={() => open(c.id)} style={{ width: 84, height: 84, flex: 'none', borderRadius: 12 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, font: f(500, 13, 1.3) }}>{c.title}</div>
                  <button onClick={() => remove(c.i)} aria-label={t('remove')} style={{ border: 'none', background: 'none', font: f(500, 18, 1), color: C.faint, padding: 0 }}>×</button>
                </div>
                <span style={{ font: f(500, 11), color: C.muted }}>{c.variant}</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <b style={{ font: f(800, 15), whiteSpace: 'nowrap' }}>{c.lineText}</b>
                  <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, borderRadius: 999 }}>
                    <button onClick={() => updateQty(c.i, -1)} aria-label="−" style={qtyBtn}>−</button>
                    <span style={{ minWidth: 28, textAlign: 'center', font: mono(700, 13) }}>{c.qty}</span>
                    <button onClick={() => updateQty(c.i, 1)} aria-label="+" style={qtyBtn}>+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => { set({ coupon: !s.coupon }); say(s.coupon ? 't_couponOff' : 't_couponOn'); }}
            style={{ border: '1px dashed #b9b2a5', background: '#fff', borderRadius: 14, height: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 14px', font: f(600, 13), color: C.ink }}
          >
            <span>{s.coupon ? t('couponApplied') : t('addCoupon')}</span>
            <span style={{ color: C.accent }}>{s.coupon ? t('remove') : t('apply')}</span>
          </button>
          <div style={sumCard}>
            <div style={sumRow}><span style={{ color: C.muted }}>{t('subtotal')}</span><span>{sum.sub}</span></div>
            <div style={sumRow}><span style={{ color: C.muted }}>{t('discount')}</span><span style={{ color: C.accent }}>{sum.disc}</span></div>
            <div style={sumRow}><span style={{ color: C.muted }}>{t('delivery')}</span><span style={{ color: C.ok }}>{t('free')}</span></div>
            <div style={totalRow}><span>{t('total')}</span><span>{sum.total}</span></div>
          </div>
          <button className="hover-cta" onClick={() => go('checkout', { placed: false })} style={ctaStyle}>{t('checkout')} · {sum.total}</button>
        </>
      )}
    </div>
  );
}

export function Checkout() {
  const { s, t, fmt, go, tab, say, set, scrollRef, address, addrText } = useStore();
  const { countText, sum } = useCart();
  const payLabel = t(PAY_DEFS.find(x => x[0] === s.pay)![1]);

  const placeOrder = () => {
    if (!s.cart.length) { say('t_empty'); return; }
    set({ placed: true, cart: [], coupon: false });
    requestAnimationFrame(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; });
  };

  if (s.placed) {
    return (
      <div style={screenPad}>
        <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: '50%', background: C.ok, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: f(900, 44) }}>✓</div>
          <div style={{ font: f(900, 28), letterSpacing: -1 }}>{t('orderPlaced')}</div>
          <div style={{ font: f(500, 14, 1.5), color: C.muted }}>#NO1-48213 · {payLabel}<br />{t('arrives')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginTop: 12 }}>
            <button onClick={() => go('orders')} style={{ height: 52, border: 'none', borderRadius: 16, background: C.ink, color: '#fff', font: f(800, 15) }}>{t('trackOrder')}</button>
            <button onClick={() => tab('home')} style={{ height: 52, border: `1px solid ${C.ink}`, borderRadius: 16, background: 'none', font: f(700, 15) }}>{t('continueShopping')}</button>
          </div>
        </div>
      </div>
    );
  }

  const shipOpts: [ShipKey, TKey, TKey, string][] = [
    ['standard', 'standard', 'arrives', t('free')],
    ['express', 'express', 'expressSub', fmt(EXPRESS_FEE)],
  ];

  return (
    <div style={screenPad}>
      <BackHeader title={t('checkout')} />
      <div style={{ background: '#fff', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', font: f(800, 14) }}>
          <span>{t('deliverTo')}</span>
          <button onClick={() => go('addresses')} style={{ border: 'none', background: 'none', padding: 0, color: C.accent, font: f(600, 13) }}>{t('change')}</button>
        </div>
        <div style={{ font: f(500, 13, 1.45), color: C.body }}>{t('name')} · <span dir="ltr">{address.phone}</span><br />{addrText(address)}</div>
      </div>

      <div style={{ font: f(800, 14) }}>{t('delivery')}</div>
      {shipOpts.map(([k, label, sub, price]) => {
        const on = s.ship === k;
        return (
          <button
            key={k}
            onClick={() => set({ ship: k })}
            aria-pressed={on}
            style={{ background: '#fff', border: `2px solid ${on ? C.ink : C.line}`, borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start' }}
          >
            <span style={{ width: 18, height: 18, flex: 'none', borderRadius: '50%', border: `2px solid ${C.ink}`, boxSizing: 'border-box', background: on ? C.accent : '#fff' }} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <b style={{ font: f(700, 14) }}>{t(label)}</b>
              <span style={{ font: f(500, 12), color: C.muted }}>{t(sub)}</span>
            </span>
            <b style={{ font: f(700, 13) }}>{price}</b>
          </button>
        );
      })}

      <div style={{ font: f(800, 14) }}>{t('payment')}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {PAY_DEFS.map(([k, label, sub]) => (
          <button
            key={k}
            onClick={() => set({ pay: k })}
            aria-pressed={s.pay === k}
            style={{ height: 56, background: '#fff', border: `2px solid ${s.pay === k ? C.accent : C.line}`, borderRadius: 14, font: f(700, 13), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}
          >
            {t(label)}
            <span style={{ font: f(500, 10), color: C.muted }}>{sub ? t(sub) : 'Visa · Mastercard'}</span>
          </button>
        ))}
      </div>

      <div style={sumCard}>
        <div style={sumRow}><span style={{ color: C.muted }}>{countText}</span><span>{sum.sub}</span></div>
        <div style={sumRow}><span style={{ color: C.muted }}>{t('discount')}</span><span style={{ color: C.accent }}>{sum.disc}</span></div>
        <div style={sumRow}><span style={{ color: C.muted }}>{t('delivery')}</span><span>{sum.ship}</span></div>
        <div style={totalRow}><span>{t('total')}</span><span>{sum.grand}</span></div>
      </div>
      <button className="hover-cta" onClick={placeOrder} style={ctaStyle}>{t('pay')} {sum.grand} · {payLabel}</button>
    </div>
  );
}
