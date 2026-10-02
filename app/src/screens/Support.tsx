import { useState } from 'react';
import type { TKey } from '../data/locale';
import { useStore, type AddrLabel } from '../store';
import { BackHeader, C, chip, f, mono, screenPad } from '../ui';
import { PAY_DEFS } from './Cart';

const card = { background: '#fff', borderRadius: 16, padding: 14, display: 'flex', flexDirection: 'column', gap: 6 } as const;
const badge = { background: C.accentSoft, color: C.accent, font: f(800, 11), padding: '3px 8px', borderRadius: 999, whiteSpace: 'nowrap' } as const;
const field = { height: 44, borderRadius: 12, border: `1px solid ${C.field}`, padding: '0 12px', font: f(500, 14), background: '#fff', outline: 'none', minWidth: 0, width: '100%', boxSizing: 'border-box' } as const;
const label = { display: 'flex', flexDirection: 'column', gap: 6, font: f(700, 13), minWidth: 0 } as const;
const radioDot = (on: boolean) => ({ width: 18, height: 18, flex: 'none', borderRadius: '50%', border: `2px solid ${C.ink}`, boxSizing: 'border-box', background: on ? C.accent : '#fff' }) as const;

const EMPTY = { label: 'addrHome' as AddrLabel, area: '', block: '', street: '', house: '', phone: '' };

export function Addresses() {
  const { s, t, set, say, back, addrText } = useStore();
  const [form, setForm] = useState<typeof EMPTY | null>(null);
  const [err, setErr] = useState(false);
  // Opened from checkout's "Change": picking an address returns there.
  const fromCheckout = s.stack[s.stack.length - 1] === 'checkout';

  const choose = (id: number) => {
    set({ addrId: id });
    say('t_defaultSet');
    if (fromCheckout) back();
  };
  const saveForm = () => {
    if (!form) return;
    if (!form.area.trim() || !form.block.trim() || !form.street.trim() || !form.house.trim()) { setErr(true); return; }
    const id = Math.max(0, ...s.addresses.map(a => a.id)) + 1;
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v.trim()])) as typeof EMPTY;
    set(st => ({ addresses: [...st.addresses, { ...clean, id }], addrId: id }));
    setForm(null);
    setErr(false);
    say('t_addrSaved');
  };
  const input = (k: 'area' | 'block' | 'street' | 'house' | 'phone', extra?: object) => (
    <label style={label}>
      {t(k)}
      <input
        id={`addr-${k}`}
        value={form![k]}
        onChange={e => { setForm(fm => fm && { ...fm, [k]: e.target.value }); setErr(false); }}
        style={field}
        {...extra}
      />
    </label>
  );

  return (
    <div style={screenPad}>
      <BackHeader title={t('addresses')} />
      {s.addresses.map(a => {
        const on = a.id === s.addrId;
        return (
          <button
            key={a.id}
            onClick={() => choose(a.id)}
            aria-pressed={on}
            style={{ ...card, border: `2px solid ${on ? C.ink : 'transparent'}`, textAlign: 'start', color: C.ink }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <span style={radioDot(on)} />
              <b style={{ font: f(800, 14), flex: 1 }}>{t(a.label)}</b>
              {on && <span style={badge}>{t('isDefault')}</span>}
            </span>
            <span style={{ font: f(500, 13, 1.45), color: C.body }}>{addrText(a)}</span>
            {a.phone && <span dir="ltr" style={{ font: f(500, 12), color: C.muted, alignSelf: 'flex-start' }}>{a.phone}</span>}
          </button>
        );
      })}

      {form ? (
        <div style={{ ...card, gap: 12 }}>
          <div style={{ font: f(800, 15) }}>{t('addAddress')}</div>
          <div style={label}>
            {t('addrLabel')}
            <div style={{ display: 'flex', gap: 8 }}>
              {(['addrHome', 'addrWork'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => setForm(fm => fm && { ...fm, label: l })}
                  aria-pressed={form.label === l}
                  style={{ height: 34, padding: '0 14px', borderRadius: 999, border: '1px solid', ...chip(form.label === l), font: f(600, 13) }}
                >
                  {t(l)}
                </button>
              ))}
            </div>
          </div>
          {input('area')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {input('block', { inputMode: 'numeric' })}
            {input('street')}
            {input('house')}
          </div>
          {input('phone', { inputMode: 'tel', dir: 'ltr', placeholder: '+965' })}
          <div role="alert" style={{ font: f(500, 12), color: C.accent, minHeight: 16 }}>{err ? t('e_addr') : ''}</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setForm(null); setErr(false); }} style={{ flex: 1, height: 48, borderRadius: 14, border: `1px solid ${C.ink}`, background: '#fff', font: f(700, 14) }}>{t('cancel')}</button>
            <button onClick={saveForm} style={{ flex: 1, height: 48, borderRadius: 14, border: 'none', background: C.ink, color: '#fff', font: f(800, 14) }}>{t('save')}</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setForm(EMPTY)}
          style={{ height: 52, border: '1px dashed #b9b2a5', borderRadius: 14, background: '#fff', font: f(700, 14), color: C.ink }}
        >
          + {t('addAddress')}
        </button>
      )}
    </div>
  );
}

export function Payments() {
  const { s, t, set, say } = useStore();
  return (
    <div style={screenPad}>
      <BackHeader title={t('payMethods')} />
      {PAY_DEFS.map(([k, l, sub]) => {
        const on = s.pay === k;
        return (
          <button
            key={k}
            onClick={() => { set({ pay: k }); say('t_defaultSet'); }}
            aria-pressed={on}
            style={{ background: '#fff', border: `2px solid ${on ? C.accent : C.line}`, borderRadius: 14, padding: '14px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start', color: C.ink }}
          >
            <span style={radioDot(on)} />
            <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <b style={{ font: f(700, 14) }}>{t(l)}</b>
              <span style={{ font: f(500, 12), color: C.muted }}>{sub ? t(sub) : 'Visa · Mastercard'}</span>
            </span>
            {on && <span style={badge}>{t('isDefault')}</span>}
          </button>
        );
      })}
      <p style={{ margin: 0, font: f(500, 12, 1.5), color: C.faint }}>{t('payNote')}</p>
    </div>
  );
}

const FAQ: [TKey, TKey][] = [['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4'], ['q5', 'a5']];

export function Help() {
  const { t, go, say } = useStore();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div style={screenPad}>
      <BackHeader title={t('help')} />
      <div style={{ font: f(800, 14) }}>{t('faq')}</div>
      <div style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {FAQ.map(([q, a], i) => {
          const on = open === i;
          return (
            <div key={q} style={{ borderBottom: i < FAQ.length - 1 ? `1px solid ${C.lineSoft}` : 'none' }}>
              <button
                onClick={() => setOpen(on ? null : i)}
                aria-expanded={on}
                aria-controls={`faq-${i}`}
                style={{ width: '100%', border: 'none', background: 'none', minHeight: 54, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'start', font: f(700, 14, 1.35), color: C.ink }}
              >
                <span style={{ flex: 1 }}>{t(q)}</span>
                <span aria-hidden style={{ font: f(700, 18), color: C.accent }}>{on ? '−' : '+'}</span>
              </button>
              {on && <p id={`faq-${i}`} style={{ margin: 0, padding: '0 16px 14px', font: f(400, 13, 1.5), color: C.body }}>{t(a)}</p>}
            </div>
          );
        })}
      </div>

      <div style={{ font: f(800, 14), marginTop: 6 }}>{t('contactUs')}</div>
      <div style={{ background: C.ink, color: '#fff', borderRadius: 20, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <span style={{ font: f(600, 13), opacity: 0.75 }}>{t('callUs')}</span>
          <span dir="ltr" style={{ font: mono(700, 16), userSelect: 'all' }}>+965 1800 001</span>
        </div>
        <div style={{ font: f(500, 12), opacity: 0.6 }}>{t('helpHours')}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => say('t_support')} style={{ flex: 1, height: 46, border: 'none', borderRadius: 14, background: C.accent, color: '#fff', font: f(800, 14) }}>{t('chatSupport')}</button>
          <button onClick={() => go('rfq')} style={{ flex: 1, height: 46, border: '1px solid #5a564d', borderRadius: 14, background: 'none', color: '#fff', font: f(700, 13) }}>{t('rfq')}</button>
        </div>
      </div>
    </div>
  );
}
