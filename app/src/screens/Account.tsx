import { AVATAR_IMAGE, PRODUCT_IMAGES } from '../data/images';
import { CUR, LANGS, type TKey } from '../data/locale';
import { useStore, type Screen } from '../store';
import { PAY_DEFS } from './Cart';
import { BackHeader, C, f, ModeSwitch, mono, Ph, screenPad } from '../ui';

const TRACK: [TKey, string][] = [['s1', '01/10 · 09:12'], ['s2', '01/10 · 14:40'], ['s3', '02/10 · 08:05'], ['s4', '04/10'], ['s5', '04–06/10']];
const DONE_STEPS = 3; // ordered, packed, shipped

export function Orders() {
  const { t, add, say } = useStore();
  const reorder = () => { add(8, 1, 'White'); say('t_added'); };
  // [order, item count, unit, delivered, product shown as thumbnail]
  const past: [string, number, TKey, string, number][] = [['#NO1-47102', 3, 'items', '22/09', 8], ['#NO1-45877', 1, 'item', '03/09', 3]];

  return (
    <div style={screenPad}>
      <BackHeader title={t('myOrders')} />
      <div style={{ background: C.ink, color: '#fff', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', font: mono(500, 12), opacity: 0.75 }}>
          <span>#NO1-48213</span><span>{t('arrives')}</span>
        </div>
        <div style={{ font: f(900, 22) }}>{t('shipped')}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {TRACK.map(([k, when], i) => {
            const done = i < DONE_STEPS;
            const line = i < DONE_STEPS - 1 ? C.accent : i === TRACK.length - 1 ? 'transparent' : '#3a372f';
            return (
              <div key={k} style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16 }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: done ? C.accent : 'transparent', border: `2px solid ${done ? C.accent : '#5a564d'}`, boxSizing: 'border-box', flex: 'none' }} />
                  <span style={{ flex: 1, width: 2, background: line, minHeight: 22 }} />
                </div>
                <div style={{ paddingBottom: 12, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <b style={{ font: f(700, 14), opacity: done ? 1 : 0.5 }}>{t(k)}</b>
                  <span style={{ font: f(500, 11), opacity: 0.6 }}>{when}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ font: f(800, 14) }}>{t('pastOrders')}</div>
      {past.map(([id, n, unit, date, thumb]) => (
        <div key={id} style={{ background: '#fff', borderRadius: 16, padding: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
          <Ph src={PRODUCT_IMAGES[thumb]} step={6} style={{ width: 56, height: 56, flex: 'none', borderRadius: 10 }} />
          <div style={{ flex: 1 }}>
            <div style={{ font: f(700, 13) }}>{id} · {n} {t(unit)}</div>
            <div style={{ font: f(500, 12), color: C.ok }}>{t('deliveredOn')} {date}</div>
          </div>
          <button onClick={reorder} style={{ height: 34, padding: '0 12px', borderRadius: 999, border: `1px solid ${C.ink}`, background: 'none', font: f(700, 12) }}>{t('buyAgain')}</button>
        </div>
      ))}
    </div>
  );
}

export function Wishlist() {
  const { s, t, byId, open, quickAdd, toggleWish } = useStore();
  const items = s.wish.map(byId);

  return (
    <div style={screenPad}>
      <BackHeader title={t('wishlist')} />
      {!items.length && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 32, textAlign: 'center', font: f(500, 14), color: C.muted }}>{t('wishEmpty')}</div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px' }}>
        {items.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
            <Ph src={PRODUCT_IMAGES[p.id]} alt={p.title} onClick={() => open(p.id)} style={{ position: 'relative', aspectRatio: '1' }} />
            <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ font: f(500, 13, 1.3) }}>{p.title}</div>
              <b style={{ font: f(800, 15), color: C.accent, whiteSpace: 'nowrap' }}>{p.priceText}</b>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => quickAdd(p)} style={{ flex: 1, height: 32, border: 'none', borderRadius: 999, background: C.ink, color: '#fff', font: f(700, 12) }}>{t('add')}</button>
                <button onClick={() => toggleWish(p.id)} aria-label={t('remove')} style={{ width: 32, height: 32, border: `1px solid ${C.border}`, borderRadius: '50%', background: 'none', font: f(500, 14) }}>×</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** User-perceived characters, so letters with combining marks (e.g. Hindi फ़) stay whole. */
const graphemes = (s: string) => (typeof Intl.Segmenter === 'function'
  ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), x => x.segment)
  : Array.from(s));

/**
 * Initials for the avatar fallback: "Tamer Fathy" → "TF", "塔梅尔·法特希" → "塔法".
 * A zero-width non-joiner keeps Arabic-script letters from joining into what reads as a word.
 */
const initials = (name: string) => {
  const words = name.trim().split(/[\s·・]+/).filter(Boolean);
  const letters = words.slice(0, 2).map(w => graphemes(w)[0]);
  return letters.join('\u200c');
};

export function Account() {
  const { s, t, go, say, address } = useStore();
  const lang = LANGS.find(x => x[0] === s.lang) ?? LANGS[0];
  const cur = CUR.find(x => x[0] === s.cur) ?? CUR[0];
  const menu: [TKey, string | number, Screen | null][] = [
    ['myOrders', '', 'orders'], ['wishlist', s.wish.length, 'wish'], ['rfq', 'B2B', 'rfq'], ['messages', '1', 'chat'],
    ['langCur', lang[1] + ' · ' + cur[0], 'locale'], ['addresses', t(address.label), 'addresses'], ['payMethods', t(PAY_DEFS.find(x => x[0] === s.pay)![1]), 'payments'], ['help', '', 'help'],
  ];
  const stat = { border: 'none', background: 'none', color: '#fff', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' } as const;
  const statNum = { font: f(900, 20) };
  const statLabel = { font: f(500, 11), opacity: 0.7 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '0 16px 24px' }}>
      <div style={{ background: C.ink, color: '#fff', borderRadius: 22, padding: 18, display: 'flex', flexDirection: 'column', gap: 16, marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Ph src={AVATAR_IMAGE} alt="" label={initials(t('name'))} style={{ background: C.accent, color: '#fff', font: f(900, 20),  width: 56, height: 56, flex: 'none', borderRadius: '50%', border: `2px solid ${C.accent}`, boxSizing: 'border-box' }} />
          <div style={{ flex: 1 }}>
            <div style={{ font: f(800, 18) }}>{t('name')}</div>
            <div style={{ font: f(600, 12), color: C.sale }}>{t('gold')}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid #34312a', paddingTop: 14, textAlign: 'center' }}>
          <button onClick={() => go('orders')} style={stat}><b style={statNum}>12</b><span style={statLabel}>{t('orders')}</span></button>
          <button onClick={() => go('wish')} style={stat}><b style={statNum}>{s.wish.length}</b><span style={statLabel}>{t('wishlist')}</span></button>
          <button onClick={() => say('t_points')} style={stat}><b style={statNum}>2,450</b><span style={statLabel}>{t('points')}</span></button>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 18, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {menu.map(([k, value, screen]) => (
          <button
            key={k}
            className="hover-row"
            onClick={() => (screen ? go(screen) : say(t(k) + ' · ' + t('soon')))}
            style={{ border: 'none', borderBottom: `1px solid ${C.lineSoft}`, background: 'none', height: 54, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', font: f(600, 14), color: C.ink }}
          >
            <span>{t(k)}</span>
            <span style={{ font: f(500, 13), color: C.faint }}>{value} ›</span>
          </button>
        ))}
      </div>
      <ModeSwitch compact />
    </div>
  );
}

export function Notifications() {
  const { t, go } = useStore();
  const items: [TKey, TKey, Screen, string, string][] = [
    ['n1', 'n1s', 'orders', '#fff', C.muted],
    ['n2', 'n2s', 'deals', C.sale, C.body],
    ['n3', 'n3s', 'rfq', '#fff', C.muted],
  ];
  return (
    <div style={{ ...screenPad, gap: 12 }}>
      <BackHeader title={t('notifs')} />
      {items.map(([title, sub, screen, bg, fg]) => (
        <button key={title} onClick={() => go(screen)} style={{ textAlign: 'start', border: 'none', background: bg, borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <b style={{ font: f(700, 14) }}>{t(title)}</b>
          <span style={{ font: f(500, 12), color: fg }}>{t(sub)}</span>
        </button>
      ))}
    </div>
  );
}
