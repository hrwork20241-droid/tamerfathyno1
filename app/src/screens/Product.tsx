import { productById, tiersOf, useStore } from '../store';
import { C, f, mono, Ph } from '../ui';

export function Product() {
  const { s, t, word, fmt, unit, byId, cards, isWholesale: w, back, go, open, say, set } = useStore();
  const base = productById(s.pid);
  const p = byId(s.pid);
  const priceText = fmt(unit(base, s.qty)) + (w ? t('perPc') : '');
  const tiers = tiersOf(base);
  const curTier = tiers.reduce((a, x, i) => (s.qty >= x.min ? i : a), 0);
  const step = w ? 10 : 1;
  const related = cards.filter(c => c.id !== s.pid).slice(0, 4);

  const pillBtn = { height: 36, padding: '0 14px', borderRadius: 999, font: f(700, 12) };
  const row = { display: 'flex', justifyContent: 'space-between', padding: '12px 0', font: f(500, 13) };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 20 }}>
      <Ph src={p.image} alt={p.title} step={10} fontSize={11} style={{ position: 'relative', height: 360 }}>
        <button onClick={back} aria-label="Back" style={{ position: 'absolute', top: 10, insetInlineStart: 14, width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#fff', font: f(700, 18) }}>{t('back')}</button>
        <button onClick={() => say('t_link')} style={{ position: 'absolute', top: 10, insetInlineEnd: 14, height: 40, padding: '0 14px', borderRadius: 999, border: 'none', background: '#fff', font: f(600, 13) }}>{t('share')}</button>
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5 }}>
          <span style={{ width: 18, height: 6, borderRadius: 3, background: C.ink }} />
          {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: '#b9b2a5' }} />)}
        </div>
      </Ph>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, background: '#fff', borderRadius: '22px 22px 0 0', marginTop: -20, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ font: f(900, 30), color: C.accent, letterSpacing: -1, whiteSpace: 'nowrap' }}>{priceText}</span>
          <span style={{ font: f(400, 14), color: C.faint, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{p.wasText}</span>
          {p.offText && <span style={{ background: C.accent, color: '#fff', font: f(800, 12), padding: '3px 7px', borderRadius: 6, whiteSpace: 'nowrap' }}>{p.offText}</span>}
        </div>
        <div style={{ font: f(600, 18, 1.3), textWrap: 'pretty' }}>{p.title}</div>
        <div style={{ font: f(500, 13), color: C.muted }}>★ {p.rating} · {p.reviews} {t('reviewsL')} · {p.sold} {t('sold')}</div>

        {w && (
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '10px 12px', font: f(800, 13), background: C.paper }}>{t('wsPricing')}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
              {tiers.map((x, i) => (
                <button
                  key={x.min}
                  onClick={() => set({ qty: x.min })}
                  aria-pressed={i === curTier}
                  style={{ border: 'none', borderTop: `2px solid ${i === curTier ? C.accent : C.line}`, background: i === curTier ? C.accentSoft : '#fff', padding: '10px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
                >
                  <b style={{ font: f(800, 15), color: C.ink, whiteSpace: 'nowrap' }}>{fmt(x.price)}</b>
                  <span style={{ font: f(500, 11), color: C.muted }}>{(x.max ? x.min + '–' + x.max : '≥ ' + x.min) + ' ' + t('pcs')}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ font: f(700, 13) }}>{t('color')}: <span style={{ fontWeight: 500, color: C.muted }}>{word(p.colors[s.colorIdx])}</span></div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {p.colors.map((c, i) => (
              <button
                key={c}
                onClick={() => set({ colorIdx: i })}
                aria-pressed={s.colorIdx === i}
                style={{ height: 38, padding: '0 16px', borderRadius: 10, border: `2px solid ${s.colorIdx === i ? C.ink : C.border}`, background: '#fff', font: f(600, 13) }}
              >
                {word(c)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ font: f(700, 13) }}>
            {t('quantity')}
            <div style={{ font: f(500, 11), color: C.muted }}>{w ? t('minOrder') : t('limit')}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <button onClick={() => set(st => ({ qty: Math.max(step, st.qty - step) }))} aria-label="−" style={{ width: 44, height: 44, border: 'none', background: C.paper, font: f(700, 18) }}>−</button>
            <span style={{ width: 52, textAlign: 'center', font: mono(700, 15) }}>{s.qty}</span>
            <button onClick={() => set(st => ({ qty: st.qty + step }))} aria-label="+" style={{ width: 44, height: 44, border: 'none', background: C.paper, font: f(700, 18) }}>+</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
          <div style={row}><span style={{ color: C.muted }}>{t('delivery')}</span><span><b style={{ color: C.ok }}>{t('free')}</b> · {t('arrives')}</span></div>
          <div style={{ ...row, borderTop: `1px solid ${C.lineSoft}` }}><span style={{ color: C.muted }}>{t('returns')}</span><span>{t('returnsSub')}</span></div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: f(900, 16) }}>{p.sellerInitial}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: f(700, 14) }}>{p.seller}</div>
            <div style={{ font: f(500, 12), color: C.muted }}>{t('sellerMeta')}</div>
          </div>
          <button onClick={() => go('chat')} style={{ ...pillBtn, border: `1px solid ${C.ink}`, background: '#fff' }}>{t('chat')}</button>
          <button onClick={() => go('store')} style={{ ...pillBtn, border: 'none', background: C.ink, color: '#fff' }}>{t('store')}</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <div style={{ font: f(800, 16) }}>{t('reviews')}</div>
          <span style={{ font: f(600, 13), color: C.accent }}>★ {p.rating}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {([['rev1n', 'rev1', '★★★★★'], ['rev2n', 'rev2', '★★★★☆']] as const).map(([n, r, stars]) => (
            <div key={n} style={{ background: C.paper, borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', font: f(600, 12) }}><span>{t(n)}</span><span style={{ color: C.accent }}>{stars}</span></div>
              <div style={{ font: f(400, 13, 1.45), color: C.body }}>{t(r)}</div>
            </div>
          ))}
        </div>

        <div style={{ font: f(800, 16), marginTop: 6 }}>{t('alsoLike')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {related.map(r => (
            <div key={r.id} onClick={() => open(r.id)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <Ph src={r.image} alt={r.title} style={{ aspectRatio: '1', borderRadius: 14 }} />
              <div style={{ font: f(500, 12, 1.3) }}>{r.title}</div>
              <b style={{ font: f(800, 14), color: C.accent, whiteSpace: 'nowrap' }}>{r.priceText}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Sticky purchase bar shown under the product screen. */
export function ProductBar() {
  const { s, t, byId, cartCount, go, add, say, toggleWish } = useStore();
  const p = byId(s.pid);
  const sq = { width: 48, height: 48, flex: 'none', borderRadius: 14, border: `1px solid ${C.border}`, background: '#fff' } as const;
  const addCurrent = () => add(s.pid, s.qty, p.colors[s.colorIdx]);

  return (
    <div style={{ flex: 'none', background: '#fff', borderTop: `1px solid ${C.line}`, display: 'flex', gap: 8, padding: '10px 14px 28px', alignItems: 'center' }}>
      <button onClick={() => toggleWish(s.pid)} aria-label={t('wishlist')} aria-pressed={p.wished} style={{ ...sq, font: f(600, 20), color: p.wished ? C.accent : C.ink }}>{p.wished ? '♥' : '♡'}</button>
      <button onClick={() => go('cart')} style={{ ...sq, position: 'relative', font: f(700, 12) }}>
        {t('cart')}
        {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9, background: C.accent, color: '#fff', font: f(700, 10, '18px') }}>{cartCount}</span>}
      </button>
      <button onClick={() => { addCurrent(); say('t_added'); }} style={{ flex: 1, height: 48, borderRadius: 14, border: `2px solid ${C.ink}`, background: '#fff', font: f(800, 14) }}>{t('addToCart')}</button>
      <button onClick={() => { addCurrent(); go('checkout', { placed: false }); }} style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', background: C.accent, color: '#fff', font: f(800, 14) }}>{t('buyNow')}</button>
    </div>
  );
}
