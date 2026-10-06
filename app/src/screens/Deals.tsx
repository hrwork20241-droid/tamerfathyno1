import { useCountdown, useStore } from '../store';
import { C, f, mono, Ph } from '../ui';

const SLOTS = [['now', 'onSale'], ['18:00', 'upcoming'], ['21:00', 'upcoming']] as const;

export function Deals() {
  const { s, t, cards, open, quickAdd, set } = useStore();
  const tm = useCountdown();
  const list = s.slot === 0 ? [...cards].sort((a, b) => b.pct - a.pct) : cards.slice(s.slot * 4, s.slot * 4 + 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.sale, padding: '10px 16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ font: f(900, 34, 0.9), letterSpacing: -1.5 }}>{t('flash1')}<br />{t('flash2')} ϟ</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ font: f(600, 11) }}>{t('roundEnds')}</span>
            <span dir="ltr" style={{ font: mono(700, 20), background: C.ink, color: C.sale, padding: '4px 8px', borderRadius: 8 }}>{tm.h}:{tm.m}:{tm.s}</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {SLOTS.map(([time, sub], i) => {
            const on = s.slot === i;
            return (
              <button
                key={time}
                onClick={() => set({ slot: i })}
                aria-pressed={on}
                style={{ height: 44, borderRadius: 10, border: 'none', background: on ? C.ink : 'rgba(23,21,15,.08)', color: on ? C.sale : C.ink, font: f(800, 14), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
              >
                {i === 0 ? t('now') : time}
                <span style={{ font: f(500, 10) }}>{t(sub)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: 10, display: 'flex', gap: 12 }}>
            <Ph src={p.image} alt={p.title} fontSize={9} onClick={() => open(p.id)} style={{ width: 96, height: 96, flex: 'none', borderRadius: 12 }} />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ font: f(500, 13, 1.3) }}>{p.title}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <b style={{ font: f(800, 17), color: C.accent, whiteSpace: 'nowrap' }}>{p.priceText}</b>
                <span style={{ font: f(400, 11), color: C.faint, textDecoration: 'line-through', whiteSpace: 'nowrap' }}>{p.wasText}</span>
                <span style={{ font: f(800, 11), color: C.accent }}>{p.offText}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.lineSoft, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: p.soldPct, background: C.accent }} />
                </div>
                <button onClick={() => quickAdd(p)} style={{ height: 32, padding: '0 14px', border: 'none', borderRadius: 999, background: C.ink, color: '#fff', font: f(700, 12) }}>{t('grab')}</button>
              </div>
              <span style={{ font: f(500, 11), color: C.muted }}>{p.soldText}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
