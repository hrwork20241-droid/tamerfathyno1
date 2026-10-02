import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { P, type Category, type Product } from './data/products';
import { CUR, CURRENCY_CODES, LANG_CODES, STRINGS, PRODUCT_NAMES, RTL, WORDS, type Lang, type TKey } from './data/locale';

export type Screen =
  | 'home' | 'cats' | 'deals' | 'search' | 'product' | 'cart' | 'checkout' | 'orders'
  | 'wish' | 'account' | 'rfq' | 'chat' | 'store' | 'notifs' | 'locale'
  | 'addresses' | 'payments' | 'help';
export type Mode = 'retail' | 'wholesale';
export type SortKey = 'bestMatch' | 'priceUp' | 'priceDown' | 'topRated';
export type PayKey = 'knet' | 'card' | 'apple' | 'cash';
export type ShipKey = 'standard' | 'express';

export const TAB_SCREENS: Screen[] = ['home', 'cats', 'deals', 'cart', 'account'];

interface CartLine { id: number; qty: number; color: string }
interface Msg { me: boolean; k?: TKey; text?: string }

export type AddrLabel = 'addrHome' | 'addrWork';
/** A saved delivery address. Seeded addresses carry a dictionary key so they translate. */
export interface Address {
  id: number;
  label: AddrLabel;
  seed?: 'address' | 'workAddress';
  area: string;
  block: string;
  street: string;
  house: string;
  phone: string;
}

const SEED_ADDRESSES: Address[] = [
  { id: 1, label: 'addrHome', seed: 'address', area: '', block: '', street: '', house: '', phone: '+965 5555 1234' },
  { id: 2, label: 'addrWork', seed: 'workAddress', area: '', block: '', street: '', house: '', phone: '+965 2222 7788' },
];
const PAY_KEYS: PayKey[] = ['knet', 'card', 'apple', 'cash'];

export interface State {
  screen: Screen;
  stack: Screen[];
  pid: number;
  mode: Mode;
  lang: Lang;
  cur: string;
  cart: CartLine[];
  wish: number[];
  cat: 'All' | Category;
  railCat: Category;
  query: string;
  sort: SortKey;
  colorIdx: number;
  qty: number;
  slot: number;
  ship: ShipKey;
  pay: PayKey;
  placed: boolean;
  coupon: boolean;
  /** A dictionary key, or literal text for ad-hoc messages. */
  toast: string;
  rfq: { item: string; qty: string; price: string };
  rfqErr: '' | 'e_item' | 'e_qty';
  follow: boolean;
  draft: string;
  msgs: Msg[];
  addresses: Address[];
  addrId: number;
}

/** A product prepared for display in the current language, currency and mode. */
export interface CardView extends Product {
  title: string;
  priceText: string;
  wasText: string;
  offText: string;
  soldPct: string;
  soldText: string;
  metaText: string;
  wished: boolean;
  sellerInitial: string;
}

const STORAGE_KEY = 'no1:v1';
type Saved = Pick<State, 'lang' | 'cur' | 'mode' | 'cart' | 'wish' | 'follow' | 'coupon' | 'addresses' | 'addrId' | 'pay'>;

/** Shopper data kept across reloads. Anything invalid or unreadable is ignored. */
function loadSaved(): Partial<Saved> {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const out: Partial<Saved> = {};
    if (LANG_CODES.includes(raw.lang)) out.lang = raw.lang;
    if (CURRENCY_CODES.includes(raw.cur)) out.cur = raw.cur;
    if (raw.mode === 'retail' || raw.mode === 'wholesale') out.mode = raw.mode;
    if (Array.isArray(raw.cart)) {
      out.cart = raw.cart.filter((c: CartLine) =>
        P.some(p => p.id === c?.id && p.colors.includes(c.color)) && Number.isInteger(c.qty) && c.qty > 0);
    }
    if (Array.isArray(raw.wish)) out.wish = [...new Set<number>(raw.wish)].filter(id => P.some(p => p.id === id));
    if (typeof raw.follow === 'boolean') out.follow = raw.follow;
    if (typeof raw.coupon === 'boolean') out.coupon = raw.coupon;
    if (PAY_KEYS.includes(raw.pay)) out.pay = raw.pay;
    if (Array.isArray(raw.addresses)) {
      const list = raw.addresses.filter((a: Address) =>
        Number.isInteger(a?.id) && (a.label === 'addrHome' || a.label === 'addrWork')
        && ['area', 'block', 'street', 'house', 'phone'].every(k => typeof a[k as keyof Address] === 'string'));
      if (list.length) {
        out.addresses = list;
        out.addrId = list.some((a: Address) => a.id === raw.addrId) ? raw.addrId : list[0].id;
      }
    }
    return out;
  } catch {
    return {};
  }
}

function save(s: State) {
  const data: Saved = {
    lang: s.lang, cur: s.cur, mode: s.mode, cart: s.cart, wish: s.wish, follow: s.follow, coupon: s.coupon,
    addresses: s.addresses, addrId: s.addrId, pay: s.pay,
  };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* storage unavailable: keep in memory only */ }
}

/**
 * Starting state: the saved session, then URL overrides
 * (?lang=en&currency=EGP&mode=wholesale), then the design defaults.
 */
function initialState(): State {
  const q = new URLSearchParams(window.location.search);
  const saved = loadSaved();
  const lang = LANG_CODES.find(l => l === q.get('lang')) ?? saved.lang ?? 'ar';
  const cur = CURRENCY_CODES.find(c => c === q.get('currency')?.toUpperCase()) ?? saved.cur ?? 'KWD';
  const qm = q.get('mode');
  const mode: Mode = qm === 'wholesale' || qm === 'retail' ? qm : saved.mode ?? 'retail';
  return {
    screen: 'home', stack: [], pid: 1, mode, lang, cur,
    cart: saved.cart ?? [{ id: 1, qty: 1, color: 'Black' }, { id: 5, qty: 2, color: '30ml' }], wish: saved.wish ?? [3, 7, 4],
    cat: 'All', railCat: 'Electronics', query: '', sort: 'bestMatch', colorIdx: 0, qty: mode === 'wholesale' ? 10 : 1, slot: 0,
    ship: 'standard', pay: saved.pay ?? 'knet', placed: false, coupon: saved.coupon ?? false, toast: '',
    rfq: { item: '', qty: '', price: '' }, rfqErr: '', follow: saved.follow ?? false, draft: '',
    msgs: [{ me: false, k: 'm_hello' }],
    addresses: saved.addresses ?? SEED_ADDRESSES, addrId: saved.addrId ?? 1,
  };
}

export const tiersOf = (p: Product) => [
  { min: 10, max: 49 as number | null, price: p.price * 0.72 },
  { min: 50, max: 199 as number | null, price: p.price * 0.64 },
  { min: 200, max: null as number | null, price: p.price * 0.55 },
];

export const productById = (id: number) => P.find(x => x.id === id)!;

function useStoreValue() {
  const [s, setS] = useState<State>(initialState);
  const scrollRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const set = useCallback((patch: Partial<State> | ((s: State) => Partial<State>)) => {
    setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }));
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    document.documentElement.lang = s.lang;
  }, [s.lang]);
  useEffect(() => save(s), [s.lang, s.cur, s.mode, s.cart, s.wish, s.follow, s.coupon, s.addresses, s.addrId, s.pay]);

  const scrollTop = () => requestAnimationFrame(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  });

  // Navigation: `go` pushes onto the back stack, `tab` resets it.
  const go = (screen: Screen, extra?: Partial<State>) => {
    set(p => ({ stack: [...p.stack, p.screen], screen, ...extra }));
    scrollTop();
  };
  const tab = (screen: Screen) => { set({ screen, stack: [], placed: false }); scrollTop(); };
  const back = () => {
    set(p => {
      const stack = [...p.stack];
      return { stack, screen: stack.pop() ?? 'home', placed: false };
    });
    scrollTop();
  };
  /** Showcase shortcut: open any screen with Home underneath it. */
  const jump = (screen: Screen) => { set({ screen, stack: ['home'], placed: false }); scrollTop(); };

  const say = (k: string) => {
    clearTimeout(toastTimer.current);
    set({ toast: k });
    toastTimer.current = setTimeout(() => set({ toast: '' }), 1700);
  };

  const w = s.mode === 'wholesale';
  const t = (k: TKey): string => STRINGS[s.lang][k] ?? STRINGS.en[k] ?? k;
  /** Localise a category, subcategory or variant word. */
  const word = (x: string) => WORDS[s.lang][x] ?? x;
  const productName = (id: number) => PRODUCT_NAMES[s.lang][id] ?? productById(id).name;
  const fmt = (kwd: number) => {
    const c = CUR.find(x => x[0] === s.cur) ?? CUR[0];
    const n = (kwd * c[3]).toLocaleString('en-US', { minimumFractionDigits: c[4], maximumFractionDigits: c[4] });
    if (s.lang === 'ar') return n + ' ' + c[2];
    return c[1].length > 1 && c[1] !== 'E£' ? c[1] + ' ' + n : c[1] + n;
  };
  /** Unit price: retail price, or the wholesale tier the quantity falls in. */
  const unit = (p: Product, qty = 10) => {
    if (!w) return p.price;
    const tiers = tiersOf(p);
    let u = tiers[0].price;
    tiers.forEach(x => { if (qty >= x.min) u = x.price; });
    return u;
  };

  const card = (p: Product): CardView => {
    const wished = s.wish.includes(p.id);
    return {
      ...p,
      title: productName(p.id),
      priceText: fmt(unit(p, 10)) + (w ? t('perPc') : ''),
      wasText: fmt(w ? p.price : p.was),
      offText: '-' + Math.round((1 - p.price / p.was) * 100) + '%',
      soldPct: p.pct + '%',
      soldText: p.pct + '% ' + t('claimed'),
      metaText: w ? t('moq') + ' · ' + p.sold + ' ' + t('sold') : p.sold + ' ' + t('sold'),
      wished,
      sellerInitial: p.seller[0],
    };
  };
  const cards = P.map(card);

  const open = (id: number) => go('product', { pid: id, colorIdx: 0, qty: w ? 10 : 1 });

  const toggleWish = (id: number) => {
    const has = s.wish.includes(id);
    set(p => ({ wish: has ? p.wish.filter(x => x !== id) : [...p.wish, id] }));
    say(has ? 't_unsaved' : 't_saved');
  };

  const add = (id: number, qty: number, color: string) => {
    set(p => {
      const cart = [...p.cart];
      const i = cart.findIndex(x => x.id === id && x.color === color);
      if (i >= 0) cart[i] = { ...cart[i], qty: cart[i].qty + qty };
      else cart.push({ id, qty, color });
      return { cart };
    });
  };
  /** Add the default variant at the minimum quantity for the current mode. */
  const quickAdd = (p: Product) => { add(p.id, w ? 10 : 1, p.colors[0]); say('t_added'); };

  const setMode = (mode: Mode) => {
    set({ mode, qty: mode === 'wholesale' ? 10 : 1 });
    say(mode === 'wholesale' ? 'wholesaleMode' : 'retailMode');
  };

  const sendMsg = () => {
    const text = s.draft.trim();
    if (!text) return;
    set(p => ({ draft: '', msgs: [...p.msgs, { me: true, text }] }));
    setTimeout(() => set(p => ({ msgs: [...p.msgs, { me: false, k: p.mode === 'wholesale' ? 'm_ws' : 'm_rt' }] })), 1100);
  };

  const addrText = (a: Address) => (a.seed ? t(a.seed)
    : t('addrFmt').replace('{b}', a.block).replace('{s}', a.street).replace('{h}', a.house).replace('{a}', a.area));
  const address = s.addresses.find(a => a.id === s.addrId) ?? s.addresses[0];

  const cartCount = s.cart.reduce((a, c) => a + c.qty, 0);
  const toastText = s.toast ? (s.toast in STRINGS.en ? t(s.toast as TKey) : s.toast) : '';

  return {
    s, set, scrollRef: scrollRef as RefObject<HTMLDivElement>,
    isWholesale: w, dir: RTL.includes(s.lang) ? 'rtl' as const : 'ltr' as const,
    t, word, productName, fmt, unit, card, cards, byId: (id: number) => cards.find(c => c.id === id)!,
    go, tab, back, jump, say, open, toggleWish, add, quickAdd, setMode, sendMsg,
    cartCount, toastText, addrText, address,
  };
}

export type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useStoreValue()}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside <StoreProvider>');
  return v;
}

const END_AT = Date.now() + (3 * 3600 + 27 * 60 + 14) * 1000;

/** Live countdown to the end of the current sale round, as zero-padded h/m/s. */
export function useCountdown() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const sec = Math.max(0, Math.floor((END_AT - now) / 1000));
  const pad = (n: number) => String(n).padStart(2, '0');
  return { h: pad(Math.floor(sec / 3600)), m: pad(Math.floor(sec / 60) % 60), s: pad(sec % 60) };
}
