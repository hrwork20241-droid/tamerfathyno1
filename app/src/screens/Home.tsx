import { CAMPAIGN_IMAGE, PRODUCT_IMAGES } from '../data/images';
import { CATEGORIES } from '../data/products';
import { useCountdown, useStore } from '../store';
import { C, chip, f, ModeSwitch, mono, Ph, stop } from '../ui';

export function Home() {
  const { s, t, word, cards, isWholesale: w, go, open, toggleWish, set } = useStore();
  const tm = useCountdown();
  const flash = [...cards].sort((a, b) => a.price / a.was - b.price / b.was).slice(0, 6);
  const grid = s.cat === 'All' ? cards : cards.filter(c => c.cat === s.cat);
  const gridTitle = s.cat === 'All' ? (w ? t('topWholesale') : t('pickedForYou')) : word(s.cat);
  const timeBox = { background: '#fff', color: C.ink, borderRadius: 5, padding: '3px 5px', fontWeight: 700, whiteSpace: 'nowrap' } as const;

  return (
    <div style={{ padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div dir="ltr" style={{ font: f(900, 30, 1), letterSpacing: -1.5 }}>NO1<span style={{ color: C.accent }}>.</span></div>
          <div style={{ font: f(500, 12), color: C.muted, whiteSpace: 'nowrap' }}>
            {t('deliverTo')} <b style={{ color: C.ink }}>{t('city')} ▾</b>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => go('locale')}
            style={{ height: 40, padding: '0 12px', borderRadius: 999, border: `1px solid ${C.border}`, background: '#fff', font: mono(700, 12), whiteSpace: 'nowrap' }}
          >
            {s.lang.toUpperCase() + ' · ' + s.cur}
          </button>
          <button
            onClick={() => go('notifs')}
            aria-label={t('notifs')}
            style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', border: `1px solid ${C.border}`, background: '#fff', font: f(600, 15) }}
          >
            ◔
            <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 18, height: 18, borderRadius: 9, background: C.accent, color: '#fff', font: f(700, 10, '18px') }}>3</span>
          </button>
        </div>
      </div>

      <button
        onClick={() => go('search')}
        style={{ height: 48, borderRadius: 14, border: `2px solid ${C.ink}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: 0, paddingInlineStart: 16, paddingInlineEnd: 6, font: f(500, 14), color: C.faint }}
      >
        <span style={{ flex: 1, minWidth: 0, textAlign: 'start', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t('searchPh')}</span>
        <span style={{ height: 36, padding: '0 16px', borderRadius: 10, background: C.ink, color: '#fff', font: f(700, 13, '36px') }}>{t('search')}</span>
      </button>

      <ModeSwitch />

      <div className="nos" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '0 16px' }}>
        {(['All', ...CATEGORIES] as const).map(c => (
          <button
            key={c}
            onClick={() => set({ cat: c })}
            style={{ flex: 'none', height: 34, padding: '0 14px', borderRadius: 999, border: '1px solid', ...chip(s.cat === c), font: f(600, 13) }}
          >
            {word(c)}
          </button>
        ))}
      </div>

      <button
        onClick={() => go('deals')}
        style={{ border: 'none', textAlign: 'start', borderRadius: 20, background: C.ink, color: '#fff', padding: 20, display: 'grid', gridTemplateColumns: '1fr 110px', gap: 12, alignItems: 'center' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ alignSelf: 'flex-start', background: C.sale, color: C.ink, font: f(800, 11), padding: '4px 8px', borderRadius: 6, letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{t('megaSale')}</span>
          <div style={{ font: f(900, 30, 0.95), letterSpacing: -1 }}>{t('upTo')}<br /><span style={{ color: '#ff6a4d' }}>{t('off70')}</span></div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', font: mono(500, 12) }}>
            <span style={{ opacity: 0.7, marginInlineEnd: 4, whiteSpace: 'nowrap' }}>{t('endsIn')}</span>
            <span dir="ltr" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={timeBox}>{tm.h}</span>:<span style={timeBox}>{tm.m}</span>:<span style={timeBox}>{tm.s}</span>
            </span>
          </div>
        </div>
        <Ph tone="dark" src={CAMPAIGN_IMAGE} style={{ height: 120, borderRadius: 14 }} />
      </button>

      {w && (
        <button
          onClick={() => go('rfq')}
          style={{ border: `2px dashed ${C.ink}`, background: '#fff', borderRadius: 16, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'start' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <b style={{ font: f(800, 15) }}>{t('rfq')}</b>
            <span style={{ font: f(400, 12), color: C.muted }}>{t('rfqSub')}</span>
          </div>
          <span style={{ font: f(800, 20) }}>{t('fwd')}</span>
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ font: f(900, 20), letterSpacing: -0.5 }}>{t('flashDeals')} <span style={{ color: C.accent }}>ϟ</span></div>
        <button onClick={() => go('deals')} style={{ border: 'none', background: 'none', font: f(600, 13), color: C.accent }}>{t('seeAll')}</button>
      </div>
      <div className="nos" style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '-6px -16px 0', padding: '0 16px' }}>
        {flash.map(p => (
          <button key={p.id} onClick={() => open(p.id)} style={{ flex: 'none', width: 120, border: 'none', background: 'none', padding: 0, textAlign: 'start', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Ph src={PRODUCT_IMAGES[p.id]} alt={p.title} style={{ position: 'relative', width: 120, height: 120, borderRadius: 14 }}>
              <span style={{ position: 'absolute', top: 6, insetInlineStart: 6, background: C.accent, color: '#fff', font: f(800, 11), padding: '3px 6px', borderRadius: 6, whiteSpace: 'nowrap' }}>{p.offText}</span>
            </Ph>
            <div style={{ font: f(800, 15), color: C.accent }}>{p.priceText}</div>
            <div style={{ height: 5, borderRadius: 3, background: C.line, overflow: 'hidden', width: '100%' }}>
              <div style={{ height: '100%', width: p.soldPct, background: C.accent }} />
            </div>
            <div style={{ font: f(500, 11), color: C.muted }}>{p.soldText}</div>
          </button>
        ))}
      </div>

      <div style={{ font: f(900, 20), letterSpacing: -0.5, marginTop: 4 }}>{gridTitle}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px', marginTop: -6 }}>
        {grid.map(p => (
          <div key={p.id} onClick={() => open(p.id)} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
            <Ph src={PRODUCT_IMAGES[p.id]} alt={p.title} style={{ position: 'relative', aspectRatio: '1' }}>
              <button
                onClick={e => { stop(e); toggleWish(p.id); }}
                aria-label={t('wishlist')}
                aria-pressed={p.wished}
                style={{ position: 'absolute', top: 8, insetInlineEnd: 8, width: 32, height: 32, borderRadius: '50%', border: 'none', background: '#fff', color: p.wished ? C.accent : C.ink, font: f(600, 16) }}
              >
                {p.wished ? '♥' : '♡'}
              </button>
            </Ph>
            <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ font: f(500, 13, 1.3), display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 34 }}>{p.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ font: f(800, 16), color: C.accent, whiteSpace: 'nowrap' }}>{p.priceText}</span>
                <span style={{ font: f(400, 11), color: C.faint, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{p.wasText}</span>
              </div>
              <div style={{ font: f(500, 11), color: C.muted }}>{p.metaText}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
