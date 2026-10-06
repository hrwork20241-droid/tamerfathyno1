import { STORE_COVER } from '../data/images';
import type { TKey } from '../data/locale';
import { useStore } from '../store';
import { BackButton, BackHeader, C, f, Ph, screenPad } from '../ui';

const field = { height: 46, borderRadius: 12, border: `1px solid ${C.field}`, padding: '0 12px', font: f(500, 14), background: '#fff', outline: 'none', minWidth: 0, boxSizing: 'border-box' } as const;
const label = { display: 'flex', flexDirection: 'column', gap: 6, font: f(700, 13) } as const;

/** B2B request-for-quote form. */
export function Rfq() {
  const { s, t, set, say, back } = useStore();
  const setField = (k: keyof typeof s.rfq) => (e: { target: { value: string } }) =>
    set(st => ({ rfq: { ...st.rfq, [k]: e.target.value }, rfqErr: '' }));
  const submit = () => {
    if (!s.rfq.item.trim()) return set({ rfqErr: 'e_item' });
    if (!(+s.rfq.qty >= 10)) return set({ rfqErr: 'e_qty' });
    set({ rfq: { item: '', qty: '', price: '' } });
    say('t_quote');
    back();
  };

  return (
    <div style={screenPad}>
      <BackHeader title={t('rfq')} />
      <p style={{ margin: 0, font: f(400, 13, 1.5), color: C.muted }}>{t('rfqIntro')}</p>
      <label style={label}>{t('product')}<input value={s.rfq.item} onChange={setField('item')} placeholder={t('rfqItemPh')} style={field} /></label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label style={label}>{t('quantity')}<input value={s.rfq.qty} onChange={setField('qty')} placeholder="500" inputMode="numeric" style={field} /></label>
        <label style={label}>{t('targetPrice')}<input value={s.rfq.price} onChange={setField('price')} placeholder="0.750" inputMode="decimal" style={field} /></label>
      </div>
      <label style={label}>{t('details')}<textarea placeholder={t('detailsPh')} style={{ ...field, height: 100, padding: 12, resize: 'none' }} /></label>
      <div role="alert" style={{ font: f(500, 12), color: C.accent, minHeight: 16 }}>{s.rfqErr ? t(s.rfqErr) : ''}</div>
      <button onClick={submit} style={{ height: 54, border: 'none', borderRadius: 16, background: C.ink, color: '#fff', font: f(800, 15) }}>{t('sendSuppliers')}</button>
    </div>
  );
}

export function Chat() {
  const { s, t, byId, set, sendMsg } = useStore();
  const p = byId(s.pid);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.line}` }}>
        <BackButton />
        <div>
          <div style={{ font: f(800, 15) }}>{p.seller}</div>
          <div style={{ font: f(500, 11), color: C.ok }}>{t('online')}</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {s.msgs.map((m, i) => (
          <div
            key={i}
            style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '78%', background: m.me ? C.ink : '#fff', color: m.me ? '#fff' : C.ink, padding: '10px 12px', borderRadius: 16, font: f(500, 13, 1.45) }}
          >
            {m.k ? t(m.k as TKey) : m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: '10px 12px 14px', display: 'flex', gap: 8, borderTop: `1px solid ${C.line}`, background: '#fff', position: 'sticky', bottom: 0 }}>
        <input
          value={s.draft}
          onChange={e => set({ draft: e.target.value })}
          onKeyDown={e => { if (e.key === 'Enter') sendMsg(); }}
          placeholder={t('msgPh')}
          style={{ flex: 1, minWidth: 0, height: 44, borderRadius: 999, border: `1px solid ${C.field}`, padding: '0 16px', font: f(500, 14), outline: 'none', boxSizing: 'border-box' }}
        />
        <button onClick={sendMsg} style={{ height: 44, padding: '0 18px', border: 'none', borderRadius: 999, background: C.accent, color: '#fff', font: f(700, 13) }}>{t('send')}</button>
      </div>
    </div>
  );
}

export function Store() {
  const { s, t, byId, cards, open, set } = useStore();
  const p = byId(s.pid);
  // This seller's products first, then others.
  const items = [...cards.filter(c => c.seller === p.seller), ...cards.filter(c => c.seller !== p.seller)].slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Ph tone="dark" step={10} src={STORE_COVER} style={{ height: 130, position: 'relative' }}>
        <BackButton style={{ position: 'absolute', top: 10, insetInlineStart: 14 }} />
      </Ph>
      <div style={{ padding: '0 16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: -28, position: 'relative' }}>
          <div style={{ width: 68, height: 68, borderRadius: 18, background: C.accent, color: '#fff', border: `4px solid ${C.paper}`, display: 'flex', alignItems: 'center', justifyContent: 'center', font: f(900, 24) }}>{p.sellerInitial}</div>
          <div style={{ flex: 1, paddingBottom: 4 }}>
            <div style={{ font: f(800, 17) }}>{p.seller}</div>
            <div style={{ font: f(500, 12), color: C.muted }}>{t('storeMeta')}</div>
          </div>
        </div>
        <button
          onClick={() => set({ follow: !s.follow })}
          aria-pressed={s.follow}
          style={{ height: 44, borderRadius: 12, border: s.follow ? `1px solid ${C.ink}` : 'none', background: s.follow ? '#fff' : C.ink, color: s.follow ? C.ink : '#fff', font: f(700, 14) }}
        >
          {s.follow ? t('following') : t('followStore')}
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 10px' }}>
          {items.map(r => (
            <div key={r.id} onClick={() => open(r.id)} style={{ cursor: 'pointer', background: '#fff', borderRadius: 16, overflow: 'hidden' }}>
              <Ph src={r.image} alt={r.title} style={{ aspectRatio: '1' }} />
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ font: f(500, 12, 1.3) }}>{r.title}</div>
                <b style={{ font: f(800, 14), color: C.accent, whiteSpace: 'nowrap' }}>{r.priceText}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
