import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import {
  backendConfigured, currentUserEmail, deleteProduct, fetchAllProducts, saveProduct, signIn, signOut, uploadImage,
  type ProductInput, type ProductRow,
} from '../backend';
import { AR_WORDS, CATEGORIES } from '../data/products';
import { formatPrice } from '../pricing';
import { C, f, mono } from '../ui';

// Control panel for the product catalogue, in Arabic. Opened at <app link>#admin.

const page: CSSProperties = { minHeight: '100vh', background: C.paper, color: C.ink, font: f(500, 14), boxSizing: 'border-box', paddingBlock: 24, paddingInline: 16 };
const wrap: CSSProperties = { maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 };
const card: CSSProperties = { background: '#fff', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 };
const field: CSSProperties = { height: 44, borderRadius: 12, border: `1px solid ${C.field}`, padding: '0 12px', font: f(500, 14), background: '#fff', color: C.ink, outline: 'none', width: '100%', boxSizing: 'border-box', minWidth: 0 };
const label: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 6, font: f(700, 13), minWidth: 0 };
const hint: CSSProperties = { font: f(500, 12), color: C.muted };
const btn = (kind: 'primary' | 'dark' | 'ghost' | 'danger'): CSSProperties => ({
  height: 44, padding: '0 18px', borderRadius: 12, font: f(800, 14), cursor: 'pointer', whiteSpace: 'nowrap',
  border: kind === 'ghost' ? `1px solid ${C.ink}` : 'none',
  background: kind === 'primary' ? C.accent : kind === 'dark' ? C.ink : kind === 'danger' ? '#b3261e' : '#fff',
  color: kind === 'ghost' ? C.ink : '#fff',
});

/** Turn a Supabase or network error into something the shop owner can act on. */
function explain(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/invalid login credentials/i.test(msg)) return 'البريد الإلكتروني أو كلمة السر غلط.';
  if (/email not confirmed/i.test(msg)) return 'البريد الإلكتروني لسه ما اتأكدش. أكّده من Supabase ← Authentication.';
  if (/row-level security|permission denied|not allowed/i.test(msg)) return 'الحساب ده مش مسموح له يعدّل المنتجات. سجّل دخول بحساب الأدمن.';
  if (/bucket not found/i.test(msg)) return 'مكان حفظ الصور مش موجود. شغّل ملف setup.sql في Supabase مرة واحدة.';
  if (/relation .* does not exist|could not find the table/i.test(msg)) return 'جدول المنتجات مش موجود. شغّل ملف setup.sql في Supabase مرة واحدة.';
  if (/failed to fetch|network/i.test(msg)) return 'مافيش اتصال بالإنترنت أو بقاعدة البيانات. جرّب تاني.';
  return 'حصل خطأ: ' + msg;
}

const EMPTY: ProductInput = {
  name: '', name_ar: '', category: CATEGORIES[0], price: 0, old_price: null, seller: 'NO1', colors: [],
  image_url: null, rating: 5, reviews: 0, sold: 0, stock_pct: 0, active: true,
};

export function Admin() {
  const [email, setEmail] = useState<string | null | undefined>(undefined); // undefined = checking
  useEffect(() => {
    if (!backendConfigured) return;
    currentUserEmail().then(setEmail).catch(() => setEmail(null));
  }, []);

  return (
    <div dir="rtl" lang="ar" style={page}>
      <div style={wrap}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div dir="ltr" style={{ font: f(900, 30, 1), letterSpacing: -1.5 }}>NO1<span style={{ color: C.accent }}>.</span></div>
          <div style={{ font: f(800, 18), flex: 1 }}>لوحة التحكم</div>
          <a href="./" style={{ font: f(700, 13), color: C.accent }}>فتح التطبيق ←</a>
        </header>
        {!backendConfigured ? <NotConnected />
          : email === undefined ? <div style={card}>جارٍ التحميل…</div>
          : email === null ? <Login onDone={setEmail} />
          : <Products email={email} onSignOut={() => signOut().finally(() => setEmail(null))} />}
      </div>
    </div>
  );
}

function NotConnected() {
  return (
    <div style={card}>
      <div style={{ font: f(800, 16) }}>لوحة التحكم مش متوصلة بقاعدة بيانات لسه</div>
      <p style={{ margin: 0, font: f(500, 14, 1.7), color: C.body }}>
        التطبيق شغال دلوقتي على المنتجات التجريبية. علشان تضيف منتجاتك، لازم يتوصل بقاعدة بيانات Supabase المجانية.
        الخطوات موجودة في ملف <code>supabase/README.md</code> في المستودع.
      </p>
    </div>
  );
}

function Login({ onDone }: { onDone: (email: string) => void }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      await signIn(form.email.trim(), form.password);
      onDone(form.email.trim());
    } catch (x) {
      setErr(explain(x));
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} style={{ ...card, maxWidth: 420 }}>
      <div style={{ font: f(800, 16) }}>تسجيل الدخول</div>
      <label style={label}>البريد الإلكتروني
        <input id="admin-email" type="email" dir="ltr" autoComplete="username" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={field} />
      </label>
      <label style={label}>كلمة السر
        <input id="admin-password" type="password" dir="ltr" autoComplete="current-password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={field} />
      </label>
      <div role="alert" style={{ font: f(500, 13), color: C.accent, minHeight: 18 }}>{err}</div>
      <button type="submit" disabled={busy} style={{ ...btn('dark'), opacity: busy ? 0.6 : 1 }}>{busy ? 'جارٍ الدخول…' : 'دخول'}</button>
    </form>
  );
}

function Products({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState<ProductRow | 'new' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  const load = () => fetchAllProducts().then(r => { setRows(r); setErr(''); }).catch(x => setErr(explain(x)));
  useEffect(() => { load(); }, []);
  const flash = (m: string) => { setNotice(m); setTimeout(() => setNotice(''), 2500); };

  const toggle = async (r: ProductRow) => {
    try {
      const { id, created_at: _c, ...rest } = r;
      await saveProduct({ ...rest, active: !r.active }, id);
      flash(r.active ? 'اتخفى المنتج من التطبيق' : 'المنتج ظاهر في التطبيق');
      load();
    } catch (x) { setErr(explain(x)); }
  };
  const remove = async (id: number) => {
    try {
      await deleteProduct(id);
      setConfirmDelete(null);
      flash('اتمسح المنتج');
      load();
    } catch (x) { setErr(explain(x)); }
  };

  if (editing) {
    return <ProductForm row={editing === 'new' ? null : editing} onCancel={() => setEditing(null)}
      onSaved={m => { setEditing(null); flash(m); load(); }} />;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => setEditing('new')} style={btn('primary')}>+ إضافة منتج</button>
        <div style={{ flex: 1 }} />
        <span dir="ltr" style={hint}>{email}</span>
        <button onClick={onSignOut} style={{ ...btn('ghost'), height: 36, font: f(700, 13) }}>خروج</button>
      </div>
      {notice && <div role="status" style={{ background: C.ok, color: '#fff', borderRadius: 12, padding: '10px 14px', font: f(600, 13) }}>{notice}</div>}
      {err && <div role="alert" style={{ background: C.accentSoft, color: C.accent, borderRadius: 12, padding: '10px 14px', font: f(600, 13) }}>{err}</div>}
      {rows === null && !err && <div style={card}>جارٍ تحميل المنتجات…</div>}
      {rows?.length === 0 && (
        <div style={{ ...card, alignItems: 'center', textAlign: 'center', paddingBlock: 32 }}>
          <div style={{ font: f(800, 16) }}>مافيش منتجات لسه</div>
          <div style={hint}>طول ما مافيش منتجات هنا، التطبيق بيعرض المنتجات التجريبية. أول ما تضيف منتج، هتظهر منتجاتك بس.</div>
          <button onClick={() => setEditing('new')} style={btn('primary')}>أضف أول منتج</button>
        </div>
      )}
      {!!rows?.length && (
        <div style={{ ...card, padding: 0, gap: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', font: f(800, 14), borderBottom: `1px solid ${C.line}` }}>
            المنتجات ({rows.length}) · ظاهر {rows.filter(r => r.active).length}
          </div>
          {rows.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: `1px solid ${C.lineSoft}`, flexWrap: 'wrap', opacity: r.active ? 1 : 0.6 }}>
              <div style={{ width: 56, height: 56, flex: 'none', borderRadius: 10, background: C.lineSoft, overflow: 'hidden' }}>
                {r.image_url && <img src={r.image_url} alt="" onError={e => { e.currentTarget.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: '1 1 180px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <b style={{ font: f(700, 14) }}>{r.name_ar || r.name}</b>
                <span style={hint}>{AR_WORDS[r.category] ?? r.category} · {formatPrice(r.price, 'KWD', 'ar')}{r.active ? '' : ' · مخفي'}</span>
              </div>
              {confirmDelete === r.id ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ font: f(600, 13) }}>متأكد؟</span>
                  <button onClick={() => remove(r.id)} style={{ ...btn('danger'), height: 36 }}>امسح</button>
                  <button onClick={() => setConfirmDelete(null)} style={{ ...btn('ghost'), height: 36 }}>لا</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(r)} style={{ ...btn('dark'), height: 36, font: f(700, 13) }}>تعديل</button>
                  <button onClick={() => toggle(r)} style={{ ...btn('ghost'), height: 36, font: f(700, 13) }}>{r.active ? 'إخفاء' : 'إظهار'}</button>
                  <button onClick={() => setConfirmDelete(r.id)} style={{ ...btn('ghost'), height: 36, font: f(700, 13), color: '#b3261e', borderColor: '#b3261e' }}>مسح</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ProductForm({ row, onCancel, onSaved }: { row: ProductRow | null; onCancel: () => void; onSaved: (msg: string) => void }) {
  const start = row ? (({ id: _i, created_at: _c, ...rest }) => rest)(row) : EMPTY;
  const [v, setV] = useState<ProductInput>(start);
  const [priceText, setPriceText] = useState(row ? String(row.price) : '');
  const [oldText, setOldText] = useState(row?.old_price ? String(row.old_price) : '');
  const [colorsText, setColorsText] = useState((row?.colors ?? []).join('، '));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState<'' | 'upload' | 'save'>('');

  const upload = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setErr('اختار ملف صورة (jpg أو png أو webp).'); return; }
    if (file.size > 5 * 1024 * 1024) { setErr('الصورة أكبر من 5 ميجا. صغّرها وجرّب تاني.'); return; }
    setBusy('upload');
    setErr('');
    try {
      const url = await uploadImage(file);
      setV(x => ({ ...x, image_url: url }));
    } catch (x) { setErr(explain(x)); } finally { setBusy(''); }
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const price = Number(priceText.replace(',', '.'));
    const old = oldText.trim() ? Number(oldText.replace(',', '.')) : null;
    if (!v.name_ar.trim()) return setErr('اكتب اسم المنتج بالعربي.');
    if (!(price > 0)) return setErr('اكتب سعر صحيح أكبر من صفر.');
    if (old !== null && !(old > price)) return setErr('السعر قبل الخصم لازم يكون أكبر من السعر الحالي، أو سيبه فاضي.');
    const colors = colorsText.split(/[,،\n]/).map(c => c.trim()).filter(Boolean);
    setBusy('save');
    setErr('');
    try {
      await saveProduct({ ...v, name: v.name.trim() || v.name_ar.trim(), name_ar: v.name_ar.trim(), seller: v.seller.trim() || 'NO1', price, old_price: old, colors }, row?.id);
      onSaved(row ? 'اتحفظت التعديلات' : 'اتضاف المنتج، وظاهر في التطبيق دلوقتي');
    } catch (x) { setErr(explain(x)); } finally { setBusy(''); }
  };

  return (
    <form onSubmit={submit} style={card}>
      <div style={{ font: f(800, 16) }}>{row ? 'تعديل منتج' : 'إضافة منتج'}</div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 120, height: 120, borderRadius: 14, background: C.lineSoft, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', font: mono(500, 11), color: C.faint, flex: 'none' }}>
          {v.image_url ? <img src={v.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 'بدون صورة'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          <label style={{ ...btn('dark'), display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: busy ? 'wait' : 'pointer' }}>
            {busy === 'upload' ? 'جارٍ رفع الصورة…' : v.image_url ? 'تغيير الصورة' : 'رفع صورة'}
            <input id="product-image" type="file" accept="image/*" onChange={e => upload(e.target.files?.[0])} disabled={!!busy} style={{ display: 'none' }} />
          </label>
          <span style={hint}>صورة مربعة أحسن، 800×800 أو أكبر، وأقصى حجم 5 ميجا.</span>
          {v.image_url && <button type="button" onClick={() => setV({ ...v, image_url: null })} style={{ border: 'none', background: 'none', color: C.accent, font: f(600, 13), padding: 0, textAlign: 'start', cursor: 'pointer' }}>شيل الصورة</button>}
        </div>
      </div>

      <label style={label}>اسم المنتج بالعربي *
        <input id="product-name-ar" value={v.name_ar} onChange={e => setV({ ...v, name_ar: e.target.value })} placeholder="مثال: سماعات لاسلكية" style={field} />
      </label>
      <label style={label}>اسم المنتج بالإنجليزي
        <input id="product-name-en" dir="ltr" value={v.name} onChange={e => setV({ ...v, name: e.target.value })} placeholder="Wireless earbuds" style={field} />
        <span style={hint}>بيظهر في كل اللغات غير العربي. لو سبته فاضي، هيظهر الاسم العربي.</span>
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
        <label style={label}>القسم
          <select id="product-category" value={v.category} onChange={e => setV({ ...v, category: e.target.value })} style={field}>
            {CATEGORIES.map(c => <option key={c} value={c}>{AR_WORDS[c]}</option>)}
          </select>
        </label>
        <label style={label}>السعر (دينار كويتي) *
          <input id="product-price" dir="ltr" inputMode="decimal" value={priceText} onChange={e => setPriceText(e.target.value)} placeholder="8.900" style={field} />
        </label>
        <label style={label}>السعر قبل الخصم
          <input id="product-old-price" dir="ltr" inputMode="decimal" value={oldText} onChange={e => setOldText(e.target.value)} placeholder="14.500" style={field} />
        </label>
      </div>
      <span style={hint}>الأسعار بتتحوّل لوحدها لكل العملات. أسعار الجملة بتتحسب تلقائي: خصم 28% من 10 قطع، 36% من 50، و45% من 200.</span>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        <label style={label}>البائع
          <input id="product-seller" value={v.seller} onChange={e => setV({ ...v, seller: e.target.value })} style={field} />
        </label>
        <label style={label}>الألوان أو المقاسات
          <input id="product-colors" value={colorsText} onChange={e => setColorsText(e.target.value)} placeholder="أسود، أبيض، أحمر" style={field} />
        </label>
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, font: f(600, 14), cursor: 'pointer' }}>
        <input id="product-active" type="checkbox" checked={v.active} onChange={e => setV({ ...v, active: e.target.checked })} style={{ width: 18, height: 18 }} />
        ظاهر للعملاء في التطبيق
      </label>

      <div role="alert" style={{ font: f(600, 13), color: C.accent, minHeight: 18 }}>{err}</div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={!!busy} style={{ ...btn('primary'), flex: 1, opacity: busy ? 0.6 : 1 }}>{busy === 'save' ? 'جارٍ الحفظ…' : 'حفظ'}</button>
        <button type="button" onClick={onCancel} style={btn('ghost')}>إلغاء</button>
      </div>
    </form>
  );
}
