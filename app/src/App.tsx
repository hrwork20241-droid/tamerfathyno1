import type { ReactNode } from 'react';
import type { TKey } from './data/locale';
import { Account, Notifications, Orders, Wishlist } from './screens/Account';
import { Browse } from './screens/Browse';
import { Cart, Checkout } from './screens/Cart';
import { Deals } from './screens/Deals';
import { Home } from './screens/Home';
import { Locale } from './screens/Locale';
import { Product, ProductBar } from './screens/Product';
import { Search } from './screens/Search';
import { Chat, Rfq, Store } from './screens/Seller';
import { Addresses, Help, Payments } from './screens/Support';
import { TAB_SCREENS, useStore, type Screen } from './store';
import { C, f, MONO } from './ui';

const SCREENS: Record<Screen, () => ReactNode> = {
  home: Home, cats: Browse, deals: Deals, search: Search, product: Product, cart: Cart, checkout: Checkout,
  orders: Orders, wish: Wishlist, account: Account, rfq: Rfq, chat: Chat, store: Store, notifs: Notifications, locale: Locale,
  addresses: Addresses, payments: Payments, help: Help,
};

const JUMPS: [string, Screen][] = [
  ['Home', 'home'], ['Browse', 'cats'], ['Deals', 'deals'], ['Search', 'search'], ['Product', 'product'], ['Cart', 'cart'],
  ['Checkout', 'checkout'], ['Orders', 'orders'], ['Wishlist', 'wish'], ['Account', 'account'], ['Quote (B2B)', 'rfq'],
  ['Chat', 'chat'], ['Store', 'store'], ['Alerts', 'notifs'], ['Language & currency', 'locale'],
  ['Addresses', 'addresses'], ['Payment methods', 'payments'], ['Help', 'help'],
];

// [screen, label, icon corner radius]: each tab icon is a distinct shape.
const TABS: [Screen, TKey, string][] = [['home', 'home', '50%'], ['cats', 'browse', '4px'], ['deals', 'deals', '0'], ['cart', 'cart', '6px'], ['account', 'me', '50%']];

/** Left-hand showcase column, hidden on phone-sized viewports. */
function SidePanel() {
  const { jump } = useStore();
  const monoSm = `400 12px/1.5 ${MONO}`;
  return (
    <div className="side" style={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ font: f(900, 72, 0.85), letterSpacing: -3 }}>NO1<span style={{ color: C.accent }}>.</span></div>
      <p style={{ margin: 0, font: f(400, 15, 1.5), color: '#57524a', textWrap: 'pretty' }}>
        Clickable prototype of a marketplace app with a retail / wholesale switch. Tap anything.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, font: monoSm, color: C.muted }}>
        <div>Assumptions</div>
        <div>· B2C + B2B (MOQ tiers, quotes)</div>
        <div>· 8 languages, Arabic (RTL) first</div>
        <div>· 17 currencies incl. EGP</div>
        <div>· KNET, card, Apple Pay, cash</div>
        <div>· Images are placeholders</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, font: f(500, 13) }}>
        <div style={{ font: `400 12px ${MONO}`, color: C.muted }}>Jump to</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {JUMPS.map(([label, screen]) => (
            <button
              key={screen}
              className="hover-jump"
              onClick={() => jump(screen)}
              style={{ border: '1px solid #cfc9be', background: C.paper, borderRadius: 999, padding: '6px 11px', font: f(500, 12), color: C.ink }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <a href="#admin" style={{ font: f(700, 13), color: C.accent }}>Control panel (لوحة التحكم) →</a>
    </div>
  );
}

function TabBar() {
  const { s, t, tab, cartCount } = useStore();
  return (
    <nav style={{ flex: 'none', height: 84, background: '#fff', borderTop: `1px solid ${C.line}`, display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '0 6px 22px', boxSizing: 'border-box' }}>
      {TABS.map(([k, label, radius]) => {
        const on = s.screen === k;
        const fg = on ? C.ink : '#9a948a';
        const badge = k === 'cart' && cartCount > 0;
        return (
          <button
            key={k}
            onClick={() => tab(k)}
            aria-current={on ? 'page' : undefined}
            style={{ position: 'relative', border: 'none', background: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: fg, font: f(on ? 800 : 500, 11), whiteSpace: 'nowrap' }}
          >
            <span style={{ width: 22, height: 22, borderRadius: radius, background: on ? C.accent : 'transparent', border: `2px solid ${fg}`, boxSizing: 'border-box' }} />
            {t(label)}
            <span style={{ position: 'absolute', top: 6, left: '54%', minWidth: 18, height: 18, borderRadius: 9, background: C.accent, color: '#fff', font: f(700, 10, '18px'), opacity: badge ? 1 : 0 }}>
              {badge ? cartCount : ''}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export function App() {
  const { s, dir, scrollRef, toastText } = useStore();
  const Screen = SCREENS[s.screen];

  return (
    <div className="stage">
      <SidePanel />
      <div className="device">
        <div className="screen" dir={dir}>
          <div className="status-bar" style={{ height: 48, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px 0 34px', font: f(600, 15), position: 'relative', zIndex: 5, background: C.paper }}>
            <span>9:41</span>
            <div style={{ position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)', width: 120, height: 32, borderRadius: 20, background: '#000' }} />
            <span style={{ font: `600 12px ${MONO}`, whiteSpace: 'nowrap' }}>5G ▮▮▮</span>
          </div>

          <main ref={scrollRef} className="nos" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}>
            <Screen />
          </main>

          {TAB_SCREENS.includes(s.screen) && <TabBar />}
          {s.screen === 'product' && <ProductBar />}

          {toastText && (
            <div role="status" style={{ position: 'absolute', left: '50%', top: 64, transform: 'translateX(-50%)', background: C.ink, color: '#fff', padding: '10px 16px', borderRadius: 999, font: f(600, 13), whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,.2)', zIndex: 20 }}>
              {toastText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
