import { CUR, LANGS } from '../data/locale';
import { useStore } from '../store';
import { BackHeader, C, f, mono, screenPad } from '../ui';

export function Locale() {
  const { s, t, set } = useStore();
  const ar = s.lang === 'ar';

  return (
    <div style={screenPad}>
      <BackHeader title={t('langCur')} ellipsis />
      <div style={{ font: f(800, 14) }}>{t('language')}</div>
      <div role="radiogroup" aria-label={t('language')} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {LANGS.map(([code, native, en]) => {
          const on = s.lang === code;
          return (
            <button
              key={code}
              role="radio"
              aria-checked={on}
              lang={code}
              onClick={() => set({ lang: code })}
              style={{ border: 'none', borderBottom: `1px solid ${C.lineSoft}`, background: on ? C.accentSoft : '#fff', height: 54, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', textAlign: 'start', color: C.ink }}
            >
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <b style={{ font: f(700, 15) }}>{native}</b>
                <span style={{ font: f(500, 11), color: C.faint }}>{en}</span>
              </span>
              <span style={{ width: 24, height: 24, borderRadius: '50%', background: C.accent, color: '#fff', font: f(800, 13, '24px'), textAlign: 'center', opacity: on ? 1 : 0 }}>✓</span>
            </button>
          );
        })}
      </div>

      <div style={{ font: f(800, 14), marginTop: 6 }}>{t('currency')}</div>
      <div role="radiogroup" aria-label={t('currency')} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {CUR.map(c => {
          const on = s.cur === c[0];
          return (
            <button
              key={c[0]}
              role="radio"
              aria-checked={on}
              onClick={() => set({ cur: c[0] })}
              style={{ background: '#fff', border: `2px solid ${on ? C.accent : C.line}`, borderRadius: 14, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'start', color: C.ink, minWidth: 0 }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: 6, width: '100%' }}>
                <b style={{ font: mono(800, 14) }}>{c[0]}</b>
                <span style={{ font: f(700, 13), color: C.accent }}>{ar ? c[2] : c[1]}</span>
              </span>
              <span style={{ font: f(500, 11), color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>{ar ? c[6] : c[5]}</span>
            </button>
          );
        })}
      </div>
      <div style={{ font: f(500, 11, 1.5), color: C.faint }}>{t('ratesNote')}</div>
    </div>
  );
}
