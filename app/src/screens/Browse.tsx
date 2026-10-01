import { CATEGORIES, SUBS } from '../data/products';
import { useStore } from '../store';
import { C, f, Ph } from '../ui';

export function Browse() {
  const { s, t, word, cards, go, open, set } = useStore();
  const inCat = cards.filter(c => c.cat === s.railCat);
  // Category best-sellers, padded with overall picks when the category is small.
  const top = [...inCat, ...cards.filter(c => c.cat !== s.railCat)].slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ font: f(900, 26), letterSpacing: -1, flex: 1 }}>{t('categories')}</div>
        <button onClick={() => go('search')} style={{ height: 38, padding: '0 14px', borderRadius: 999, border: `1px solid ${C.border}`, background: '#fff', font: f(600, 13) }}>{t('search')}</button>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '104px 1fr', minHeight: 0, borderTop: `1px solid ${C.line}` }}>
        <div style={{ background: C.lineSoft, display: 'flex', flexDirection: 'column' }}>
          {CATEGORIES.map(c => {
            const on = s.railCat === c;
            return (
              <button
                key={c}
                onClick={() => set({ railCat: c })}
                aria-pressed={on}
                style={{ border: 'none', borderInlineStart: `3px solid ${on ? C.accent : 'transparent'}`, background: on ? '#fff' : 'transparent', height: 52, textAlign: 'start', padding: '0 12px', font: f(on ? 800 : 500, 13), color: C.ink }}
              >
                {word(c)}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 16, background: '#fff' }}>
          <Ph label={`${word(s.railCat)} banner`} style={{ height: 90, borderRadius: 12 }} />
          <div style={{ font: f(800, 14) }}>{t('shopByType')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px 8px' }}>
            {SUBS[s.railCat].map(l => (
              <button key={l} onClick={() => go('search', { query: s.railCat })} style={{ border: 'none', background: 'none', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Ph step={6} style={{ width: 60, height: 60, borderRadius: '50%' }} />
                <span style={{ font: f(500, 11, 1.2), textAlign: 'center', color: C.ink }}>{word(l)}</span>
              </button>
            ))}
          </div>
          <div style={{ font: f(800, 14) }}>{t('topSellers')}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {top.map(p => (
              <div key={p.id} onClick={() => open(p.id)} style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                <Ph step={6} style={{ width: 64, height: 64, flex: 'none', borderRadius: 10 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                  <span style={{ font: f(500, 12, 1.3) }}>{p.title}</span>
                  <b style={{ font: f(800, 14), color: C.accent, whiteSpace: 'nowrap' }}>{p.priceText}</b>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
