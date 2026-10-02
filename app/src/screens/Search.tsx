import { PRODUCT_IMAGES } from '../data/images';
import { useStore, type SortKey } from '../store';
import { BackButton, C, chip, f, mono, Ph } from '../ui';

const RECENTS = ['earbuds', 'hoodie', 'charger', 'yoga mat'];
const TRENDING: [id: number, label: string, query: string][] = [
  [1, 'Smart watch', 'smart'], [3, 'Coffee set', 'coffee'], [6, 'Running shoes', 'running'], [5, 'Serum', 'serum'], [7, 'Building blocks', 'blocks'],
];
const SORTS: SortKey[] = ['bestMatch', 'priceUp', 'priceDown', 'topRated'];

export function Search() {
  const { s, t, word, productName, cards, open, set } = useStore();
  const q = s.query.trim().toLowerCase();

  let results = cards.filter(c =>
    [c.name, c.ar, c.title, c.cat, word(c.cat)].some(x => x.toLowerCase().includes(q)));
  if (s.sort === 'priceUp') results = [...results].sort((a, b) => a.price - b.price);
  if (s.sort === 'priceDown') results = [...results].sort((a, b) => b.price - a.price);
  if (s.sort === 'topRated') results = [...results].sort((a, b) => b.rating - a.rating);

  const pill = { height: 34, padding: '0 14px', borderRadius: 999, border: `1px solid ${C.border}`, background: '#fff', font: f(500, 13) };

  return (
    <div style={{ padding: '6px 16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <BackButton />
        <input
          autoFocus
          type="search"
          value={s.query}
          onChange={e => set({ query: e.target.value })}
          placeholder={t('searchPh')}
          style={{ flex: 1, minWidth: 0, height: 44, borderRadius: 12, border: `2px solid ${C.ink}`, padding: '0 14px', font: f(500, 14), outline: 'none', background: '#fff', boxSizing: 'border-box' }}
        />
      </div>

      {!q ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ font: f(800, 14) }}>{t('recent')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {RECENTS.map(l => <button key={l} onClick={() => set({ query: l })} style={pill}>{l}</button>)}
          </div>
          <div style={{ font: f(800, 14), marginTop: 8 }}>{t('trending')}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {TRENDING.map(([id, label, query], i) => (
              <button
                key={id}
                onClick={() => set({ query })}
                style={{ border: 'none', borderBottom: `1px solid ${C.line}`, background: 'none', height: 46, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start', font: f(500, 14), color: C.ink, padding: 0 }}
              >
                <span style={{ font: mono(700, 12), color: C.accent, width: 18 }}>{i + 1}</span>
                {s.lang === 'en' ? label : productName(id)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="nos" style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
            {SORTS.map(k => (
              <button
                key={k}
                onClick={() => set({ sort: k })}
                aria-pressed={s.sort === k}
                style={{ flex: 'none', height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid', ...chip(s.sort === k), font: f(600, 12) }}
              >
                {t(k)}
              </button>
            ))}
          </div>
          <div style={{ font: f(500, 12), color: C.muted }}>
            {results.length} {t('results')} {t('resultsFor')} "{s.query}"
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px' }}>
            {results.map(p => (
              <div key={p.id} onClick={() => open(p.id)} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer' }}>
                <Ph src={PRODUCT_IMAGES[p.id]} alt={p.title} style={{ aspectRatio: '1' }} />
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ font: f(500, 13, 1.3) }}>{p.title}</div>
                  <b style={{ font: f(800, 16), color: C.accent, whiteSpace: 'nowrap' }}>{p.priceText}</b>
                  <span style={{ font: f(500, 11), color: C.muted }}>★ {p.rating} · {p.metaText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
