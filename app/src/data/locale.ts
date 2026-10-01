export type Lang = 'en' | 'ar' | 'fr' | 'es' | 'tr' | 'ur' | 'hi' | 'zh';
export const LANG_CODES: Lang[] = ['ar', 'en', 'fr', 'es', 'tr', 'ur', 'hi', 'zh'];

export const LANGS: [code: Lang, native: string, english: string][] = [['en', 'English', 'English'], ['ar', 'العربية', 'Arabic'], ['fr', 'Français', 'French'], ['es', 'Español', 'Spanish'], ['tr', 'Türkçe', 'Turkish'], ['ur', 'اردو', 'Urdu'], ['hi', 'हिन्दी', 'Hindi'], ['zh', '中文', 'Chinese']];
export const RTL: Lang[] = ['ar', 'ur'];

// [code, latin symbol, arabic symbol, rate from KWD, decimals, english name, arabic name]
export type Currency = [code: string, sym: string, arSym: string, rate: number, decimals: number, en: string, ar: string];

export const CUR: Currency[] = [
  ['KWD', 'KD', 'د.ك', 1, 3, 'Kuwaiti dinar', 'دينار كويتي'],
  ['EGP', 'E£', 'ج.م', 158, 2, 'Egyptian pound', 'جنيه مصري'],
  ['SAR', 'SAR', 'ر.س', 12.22, 2, 'Saudi riyal', 'ريال سعودي'],
  ['AED', 'AED', 'د.إ', 11.97, 2, 'UAE dirham', 'درهم إماراتي'],
  ['QAR', 'QAR', 'ر.ق', 11.87, 2, 'Qatari riyal', 'ريال قطري'],
  ['BHD', 'BD', 'د.ب', 1.229, 3, 'Bahraini dinar', 'دينار بحريني'],
  ['OMR', 'OMR', 'ر.ع', 1.254, 3, 'Omani rial', 'ريال عماني'],
  ['JOD', 'JD', 'د.أ', 2.31, 3, 'Jordanian dinar', 'دينار أردني'],
  ['IQD', 'IQD', 'د.ع', 4270, 0, 'Iraqi dinar', 'دينار عراقي'],
  ['MAD', 'MAD', 'د.م', 29.5, 2, 'Moroccan dirham', 'درهم مغربي'],
  ['USD', '$', '$', 3.26, 2, 'US dollar', 'دولار أمريكي'],
  ['EUR', '€', '€', 2.8, 2, 'Euro', 'يورو'],
  ['GBP', '£', '£', 2.43, 2, 'British pound', 'جنيه إسترليني'],
  ['TRY', '₺', '₺', 135, 2, 'Turkish lira', 'ليرة تركية'],
  ['INR', '₹', '₹', 287, 0, 'Indian rupee', 'روبية هندية'],
  ['PKR', 'Rs', 'روبية', 915, 0, 'Pakistani rupee', 'روبية باكستانية'],
  ['CNY', '¥', '¥', 23.2, 2, 'Chinese yuan', 'يوان صيني']
];

export const CURRENCY_CODES = CUR.map(c => c[0]);

const EN = { deliverTo: 'Deliver to', city: 'Salmiya', searchPh: 'Search products, brands', search: 'Search', megaSale: 'MEGA SALE', upTo: 'Up to', off70: '70% off', endsIn: 'Ends in',
  rfq: 'Request a quote', rfqSub: 'Tell suppliers what you need. Get offers in 24h.', fwd: '→', back: '←', flashDeals: 'Flash deals', seeAll: 'See all →', categories: 'Categories',
  shopByType: 'Shop by type', topSellers: 'Top sellers', flash1: 'Flash', flash2: 'deals', roundEnds: 'Round ends in', grab: 'Grab', recent: 'Recent', trending: 'Trending', share: 'Share',
  wsPricing: 'Wholesale pricing', color: 'Color', quantity: 'Quantity', delivery: 'Delivery', free: 'Free', arrives: 'Arrives Oct 4–6', returns: 'Returns', returnsSub: 'Free returns within 30 days',
  sellerMeta: '98% positive · Ships from Kuwait', chat: 'Chat', store: 'Store', reviews: 'Reviews', reviewsL: 'reviews', sold: 'sold',
  rev1: 'Arrived two days early and matches the photos. Packaging was solid.', rev2: 'Good quality for the price. Ordered 50 for our shop, the seller answered quickly.', rev1n: 'Noura K.', rev2n: 'Yousef M.',
  alsoLike: 'You may also like', cart: 'Cart', cartEmpty: 'Your cart is empty', startShopping: 'Start shopping', freeUnlocked: 'Free delivery unlocked on this order', subtotal: 'Subtotal',
  discount: 'Discount', total: 'Total', checkout: 'Checkout', change: 'Change', name: 'Fatima Al-Sabah', address: 'Block 4, Street 12, House 7, Salmiya', payment: 'Payment', pay: 'Pay',
  orderPlaced: 'Order placed', trackOrder: 'Track order', continueShopping: 'Continue shopping', myOrders: 'My orders', shipped: 'Shipped', pastOrders: 'Past orders', items: 'items', item: 'item',
  deliveredOn: 'Delivered', buyAgain: 'Buy again', wishlist: 'Wishlist', wishEmpty: 'Tap ♡ on any product to save it here.', add: 'Add', gold: 'NO1 Gold member', orders: 'Orders', points: 'Points',
  rfqIntro: 'Verified suppliers reply with offers, usually within 24 hours.', product: 'Product', rfqItemPh: 'e.g. Branded cotton tote bags', targetPrice: 'Target price / pc', details: 'Details',
  detailsPh: 'Material, size, printing, delivery date…', sendSuppliers: 'Send to suppliers', online: 'Online · replies in ~5 min', msgPh: 'Message seller', send: 'Send',
  storeMeta: '★ 4.8 · 98% positive · Verified', notifs: 'Notifications', n1: 'Your order has shipped', n1s: '#NO1-48213 arrives Oct 4–6 · 2h ago', n2: 'Mega Sale is live', n2s: 'Up to 70% off. Ends tonight · 5h ago',
  n3: '3 new quotes received', n3s: 'For "Branded tote bags" · Yesterday', addToCart: 'Add to cart', buyNow: 'Buy now', langCur: 'Language & currency', language: 'Language', currency: 'Currency',
  ratesNote: 'Prices convert from KWD at indicative rates. Final amount is charged in the currency shown at checkout.',
  retail: 'Retail', wholesale: 'Wholesale', retailSub: 'Single items', wholesaleSub: 'Bulk · MOQ pricing', retailMode: 'Retail mode', wholesaleMode: 'Wholesale mode',
  bestMatch: 'Best match', priceUp: 'Price ↑', priceDown: 'Price ↓', topRated: 'Top rated', now: 'Now', onSale: 'On sale', upcoming: 'Upcoming',
  standard: 'Standard', express: 'Express', expressSub: 'Tomorrow before 9 pm', knet: 'KNET', debit: 'Debit', card: 'Card', applePay: 'Apple Pay', faceId: 'Face ID', cash: 'Cash', onDelivery: 'On delivery',
  s1: 'Ordered', s2: 'Packed', s3: 'Shipped', s4: 'Out for delivery', s5: 'Delivered', messages: 'Messages', addresses: 'Addresses', payMethods: 'Payment methods', help: 'Help center', soon: 'coming soon',
  home: 'Home', browse: 'Browse', deals: 'Deals', me: 'Me', moq: 'MOQ 10 pcs', pcs: 'pcs', perPc: '/pc', claimed: 'claimed', results: 'results', resultsFor: 'for', pickedForYou: 'Picked for you',
  topWholesale: 'Top wholesale picks', minOrder: 'Minimum order 10 pcs', limit: 'Limit 5 per customer', couponApplied: 'NO1SALE applied · 10% off', addCoupon: 'Add a coupon code', remove: 'Remove',
  apply: 'Apply NO1SALE', following: 'Following', followStore: 'Follow store', t_added: 'Added to cart', t_removed: 'Removed', t_saved: 'Saved to wishlist', t_unsaved: 'Removed from wishlist',
  t_link: 'Link copied', t_couponOn: 'Coupon applied', t_couponOff: 'Coupon removed', t_empty: 'Your cart is empty', t_quote: 'Quote request sent', t_points: '2,450 points ready to redeem',
  e_item: 'Add the product you need.', e_qty: 'Quantity must be at least 10.', m_hello: 'Hi! Thanks for visiting. Ask me anything about sizes, bulk pricing or shipping.',
  m_ws: 'For 50+ pcs I can do the tier-2 price and ship in 3 days.', m_rt: 'Yes, it is in stock and ships today from Kuwait.' };

export type Dict = typeof EN;
export type TKey = keyof Dict;

export const D: Record<Lang, Partial<Dict>> = {
  en: EN,
  ar: { deliverTo: 'التوصيل إلى', city: 'السالمية', searchPh: 'ابحث عن منتجات وماركات', search: 'بحث', megaSale: 'تخفيضات كبرى', upTo: 'خصم حتى', off70: '70%', endsIn: 'ينتهي خلال',
    rfq: 'طلب عرض سعر', rfqSub: 'أخبر الموردين بما تحتاجه واستلم العروض خلال 24 ساعة.', fwd: '←', back: '→', flashDeals: 'عروض سريعة', seeAll: 'عرض الكل ←', categories: 'الأقسام',
    shopByType: 'تسوق حسب النوع', topSellers: 'الأكثر مبيعاً', flash1: 'عروض', flash2: 'سريعة', roundEnds: 'تنتهي الجولة خلال', grab: 'اطلب', recent: 'عمليات البحث الأخيرة', trending: 'الأكثر بحثاً', share: 'مشاركة',
    wsPricing: 'أسعار الجملة', color: 'اللون', quantity: 'الكمية', delivery: 'التوصيل', free: 'مجاني', arrives: 'يصل 4–6 أكتوبر', returns: 'الإرجاع', returnsSub: 'إرجاع مجاني خلال 30 يوماً',
    sellerMeta: '98% تقييم إيجابي · يشحن من الكويت', chat: 'محادثة', store: 'المتجر', reviews: 'التقييمات', reviewsL: 'تقييم', sold: 'مُباع',
    rev1: 'وصل قبل الموعد بيومين ومطابق للصور. التغليف ممتاز.', rev2: 'جودة ممتازة مقابل السعر. طلبت 50 قطعة لمحلنا والبائع رد بسرعة.', rev1n: 'نورة ك.', rev2n: 'يوسف م.',
    alsoLike: 'قد يعجبك أيضاً', cart: 'السلة', cartEmpty: 'سلتك فارغة', startShopping: 'ابدأ التسوق', freeUnlocked: 'حصلت على توصيل مجاني لهذا الطلب', subtotal: 'المجموع الفرعي',
    discount: 'الخصم', total: 'الإجمالي', checkout: 'إتمام الشراء', change: 'تغيير', name: 'فاطمة الصباح', address: 'قطعة 4، شارع 12، منزل 7، السالمية', payment: 'الدفع', pay: 'ادفع',
    orderPlaced: 'تم تأكيد الطلب', trackOrder: 'تتبع الطلب', continueShopping: 'متابعة التسوق', myOrders: 'طلباتي', shipped: 'تم الشحن', pastOrders: 'الطلبات السابقة', items: 'منتجات', item: 'منتج',
    deliveredOn: 'تم التوصيل', buyAgain: 'اطلب مرة أخرى', wishlist: 'المفضلة', wishEmpty: 'اضغط ♡ على أي منتج لحفظه هنا.', add: 'أضف', gold: 'عضو NO1 الذهبي', orders: 'الطلبات', points: 'النقاط',
    rfqIntro: 'يرد الموردون المعتمدون بعروضهم عادةً خلال 24 ساعة.', product: 'المنتج', rfqItemPh: 'مثال: حقائب قماش مطبوعة بالشعار', targetPrice: 'السعر المستهدف / قطعة', details: 'التفاصيل',
    detailsPh: 'الخامة، المقاس، الطباعة، موعد التسليم…', sendSuppliers: 'أرسل للموردين', online: 'متصل · يرد خلال 5 دقائق تقريباً', msgPh: 'راسل البائع', send: 'إرسال',
    storeMeta: '★ 4.8 · 98% إيجابي · موثّق', notifs: 'الإشعارات', n1: 'تم شحن طلبك', n1s: '#NO1-48213 يصل 4–6 أكتوبر · قبل ساعتين', n2: 'التخفيضات الكبرى بدأت', n2s: 'خصم حتى 70%. تنتهي الليلة · قبل 5 ساعات',
    n3: 'وصلتك 3 عروض أسعار جديدة', n3s: 'لطلب "حقائب قماش مطبوعة" · أمس', addToCart: 'أضف للسلة', buyNow: 'اشترِ الآن', langCur: 'اللغة والعملة', language: 'اللغة', currency: 'العملة',
    ratesNote: 'تُحوّل الأسعار من الدينار الكويتي بأسعار صرف تقريبية. يُخصم المبلغ النهائي بالعملة المعروضة عند الدفع.',
    retail: 'تجزئة', wholesale: 'جملة', retailSub: 'قطع فردية', wholesaleSub: 'كميات · أسعار الحد الأدنى', retailMode: 'وضع التجزئة', wholesaleMode: 'وضع الجملة',
    bestMatch: 'الأكثر صلة', priceUp: 'السعر ↑', priceDown: 'السعر ↓', topRated: 'الأعلى تقييماً', now: 'الآن', onSale: 'متاح', upcoming: 'قادم',
    standard: 'عادي', express: 'سريع', expressSub: 'غداً قبل 9 مساءً', knet: 'كي نت', debit: 'بطاقة سحب', card: 'بطاقة', applePay: 'Apple Pay', faceId: 'Face ID', cash: 'نقداً', onDelivery: 'عند الاستلام',
    s1: 'تم الطلب', s2: 'تم التجهيز', s3: 'تم الشحن', s4: 'خرج للتوصيل', s5: 'تم التوصيل', messages: 'الرسائل', addresses: 'العناوين', payMethods: 'طرق الدفع', help: 'مركز المساعدة', soon: 'قريباً',
    home: 'الرئيسية', browse: 'الأقسام', deals: 'العروض', me: 'حسابي', moq: 'الحد الأدنى 10 قطع', pcs: 'قطعة', perPc: '/قطعة', claimed: 'تم بيعه', results: 'نتيجة', resultsFor: 'لـ', pickedForYou: 'مختارات لك',
    topWholesale: 'أفضل عروض الجملة', minOrder: 'الحد الأدنى للطلب 10 قطع', limit: 'الحد 5 لكل عميل', couponApplied: 'تم تطبيق NO1SALE · خصم 10%', addCoupon: 'أضف كود خصم', remove: 'إزالة',
    apply: 'طبّق NO1SALE', following: 'متابَع', followStore: 'تابع المتجر', t_added: 'تمت الإضافة للسلة', t_removed: 'تمت الإزالة', t_saved: 'تم الحفظ في المفضلة', t_unsaved: 'تمت الإزالة من المفضلة',
    t_link: 'تم نسخ الرابط', t_couponOn: 'تم تطبيق الكوبون', t_couponOff: 'تمت إزالة الكوبون', t_empty: 'سلتك فارغة', t_quote: 'تم إرسال طلب عرض السعر', t_points: '2,450 نقطة جاهزة للاستبدال',
    e_item: 'أضف المنتج الذي تحتاجه.', e_qty: 'يجب ألا تقل الكمية عن 10.', m_hello: 'أهلاً! شكراً لزيارتك. اسألني عن المقاسات أو أسعار الجملة أو الشحن.',
    m_ws: 'لطلب 50 قطعة أو أكثر أقدر أعطيك سعر الشريحة الثانية والشحن خلال 3 أيام.', m_rt: 'نعم، المنتج متوفر ويُشحن اليوم من الكويت.' },
  fr: { home: 'Accueil', browse: 'Rayons', deals: 'Promos', cart: 'Panier', me: 'Moi', search: 'Rechercher', searchPh: 'Produits, marques', deliverTo: 'Livrer à', flashDeals: 'Ventes flash', seeAll: 'Tout voir →',
    categories: 'Catégories', addToCart: 'Ajouter au panier', buyNow: 'Acheter', checkout: 'Paiement', total: 'Total', subtotal: 'Sous-total', delivery: 'Livraison', free: 'Gratuit', wishlist: 'Favoris',
    myOrders: 'Mes commandes', language: 'Langue', currency: 'Devise', langCur: 'Langue et devise', retail: 'Détail', wholesale: 'Gros', retailMode: 'Mode détail', wholesaleMode: 'Mode gros', pickedForYou: 'Pour vous',
    quantity: 'Quantité', color: 'Couleur', reviews: 'Avis', payment: 'Paiement', pay: 'Payer', orderPlaced: 'Commande passée', megaSale: 'MÉGA SOLDES', upTo: "Jusqu'à", off70: '-70%', endsIn: 'Fin dans',
    t_added: 'Ajouté au panier', discount: 'Remise', orders: 'Commandes', points: 'Points' },
  es: { home: 'Inicio', browse: 'Explorar', deals: 'Ofertas', cart: 'Carrito', me: 'Yo', search: 'Buscar', searchPh: 'Productos, marcas', deliverTo: 'Enviar a', flashDeals: 'Ofertas flash', seeAll: 'Ver todo →',
    categories: 'Categorías', addToCart: 'Añadir al carrito', buyNow: 'Comprar', checkout: 'Pagar', total: 'Total', subtotal: 'Subtotal', delivery: 'Envío', free: 'Gratis', wishlist: 'Favoritos',
    myOrders: 'Mis pedidos', language: 'Idioma', currency: 'Moneda', langCur: 'Idioma y moneda', retail: 'Minorista', wholesale: 'Mayorista', retailMode: 'Modo minorista', wholesaleMode: 'Modo mayorista', pickedForYou: 'Para ti',
    quantity: 'Cantidad', color: 'Color', reviews: 'Reseñas', payment: 'Pago', pay: 'Pagar', orderPlaced: 'Pedido realizado', megaSale: 'MEGA REBAJAS', upTo: 'Hasta', off70: '-70%', endsIn: 'Termina en',
    t_added: 'Añadido al carrito', discount: 'Descuento', orders: 'Pedidos', points: 'Puntos' },
  tr: { home: 'Ana sayfa', browse: 'Kategoriler', deals: 'Fırsatlar', cart: 'Sepet', me: 'Hesabım', search: 'Ara', searchPh: 'Ürün, marka ara', deliverTo: 'Teslimat', flashDeals: 'Flaş fırsatlar', seeAll: 'Tümü →',
    categories: 'Kategoriler', addToCart: 'Sepete ekle', buyNow: 'Hemen al', checkout: 'Ödeme', total: 'Toplam', subtotal: 'Ara toplam', delivery: 'Teslimat', free: 'Ücretsiz', wishlist: 'Favoriler',
    myOrders: 'Siparişlerim', language: 'Dil', currency: 'Para birimi', langCur: 'Dil ve para birimi', retail: 'Perakende', wholesale: 'Toptan', retailMode: 'Perakende modu', wholesaleMode: 'Toptan modu', pickedForYou: 'Sana özel',
    quantity: 'Adet', color: 'Renk', reviews: 'Yorumlar', payment: 'Ödeme', pay: 'Öde', orderPlaced: 'Sipariş alındı', megaSale: 'MEGA İNDİRİM', upTo: "%70'e", off70: 'varan indirim', endsIn: 'Bitişe',
    t_added: 'Sepete eklendi', discount: 'İndirim', orders: 'Siparişler', points: 'Puan' },
  ur: { home: 'ہوم', browse: 'زمرے', deals: 'آفرز', cart: 'ٹوکری', me: 'میں', search: 'تلاش', searchPh: 'مصنوعات، برانڈز تلاش کریں', deliverTo: 'ڈیلیوری', flashDeals: 'فلیش ڈیلز', seeAll: 'سب دیکھیں ←',
    categories: 'زمرے', addToCart: 'ٹوکری میں ڈالیں', buyNow: 'ابھی خریدیں', checkout: 'چیک آؤٹ', total: 'کل', subtotal: 'ذیلی کل', delivery: 'ڈیلیوری', free: 'مفت', wishlist: 'پسندیدہ',
    myOrders: 'میرے آرڈرز', language: 'زبان', currency: 'کرنسی', langCur: 'زبان اور کرنسی', retail: 'پرچون', wholesale: 'تھوک', retailMode: 'پرچون موڈ', wholesaleMode: 'تھوک موڈ', pickedForYou: 'آپ کے لیے',
    quantity: 'مقدار', color: 'رنگ', reviews: 'جائزے', payment: 'ادائیگی', pay: 'ادا کریں', orderPlaced: 'آرڈر ہو گیا', megaSale: 'میگا سیل', upTo: 'تک', off70: '70% رعایت', endsIn: 'ختم ہونے میں',
    t_added: 'ٹوکری میں شامل', discount: 'رعایت', orders: 'آرڈرز', points: 'پوائنٹس', back: '→', fwd: '←' },
  hi: { home: 'होम', browse: 'श्रेणियाँ', deals: 'डील्स', cart: 'कार्ट', me: 'मैं', search: 'खोजें', searchPh: 'उत्पाद, ब्रांड खोजें', deliverTo: 'डिलीवरी', flashDeals: 'फ्लैश डील्स', seeAll: 'सभी देखें →',
    categories: 'श्रेणियाँ', addToCart: 'कार्ट में डालें', buyNow: 'अभी खरीदें', checkout: 'चेकआउट', total: 'कुल', subtotal: 'उप-योग', delivery: 'डिलीवरी', free: 'मुफ़्त', wishlist: 'पसंदीदा',
    myOrders: 'मेरे ऑर्डर', language: 'भाषा', currency: 'मुद्रा', langCur: 'भाषा और मुद्रा', retail: 'खुदरा', wholesale: 'थोक', retailMode: 'खुदरा मोड', wholesaleMode: 'थोक मोड', pickedForYou: 'आपके लिए',
    quantity: 'मात्रा', color: 'रंग', reviews: 'समीक्षाएँ', payment: 'भुगतान', pay: 'भुगतान करें', orderPlaced: 'ऑर्डर हो गया', megaSale: 'मेगा सेल', upTo: '70% तक', off70: 'छूट', endsIn: 'समाप्त होने में',
    t_added: 'कार्ट में जोड़ा गया', discount: 'छूट', orders: 'ऑर्डर', points: 'पॉइंट्स' },
  zh: { home: '首页', browse: '分类', deals: '特惠', cart: '购物车', me: '我的', search: '搜索', searchPh: '搜索商品、品牌', deliverTo: '配送至', flashDeals: '限时秒杀', seeAll: '查看全部 →',
    categories: '分类', addToCart: '加入购物车', buyNow: '立即购买', checkout: '结算', total: '合计', subtotal: '小计', delivery: '配送', free: '免费', wishlist: '收藏',
    myOrders: '我的订单', language: '语言', currency: '货币', langCur: '语言和货币', retail: '零售', wholesale: '批发', retailMode: '零售模式', wholesaleMode: '批发模式', pickedForYou: '为你推荐',
    quantity: '数量', color: '颜色', reviews: '评价', payment: '支付', pay: '支付', orderPlaced: '下单成功', megaSale: '超级大促', upTo: '低至', off70: '3折', endsIn: '距结束',
    t_added: '已加入购物车', discount: '优惠', orders: '订单', points: '积分' }
};
