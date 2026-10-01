export type Category = 'Electronics' | 'Fashion' | 'Home' | 'Beauty' | 'Sports' | 'Toys' | 'Auto' | 'Office';

export interface Product {
  id: number;
  name: string;
  ar: string;
  cat: Category;
  price: number; // base price in KWD
  was: number;
  rating: number;
  reviews: number;
  sold: string;
  pct: number; // flash-deal % claimed
  seller: string;
  img: string; // placeholder label until real imagery exists
  colors: string[];
}

export const P: Product[] = [
  { id: 1, name: 'ANC wireless earbuds, 30h battery', ar: 'سماعات لاسلكية بعزل الضوضاء، بطارية 30 ساعة', cat: 'Electronics', price: 8.9, was: 14.5, rating: 4.7, reviews: 2140, sold: '12.4k', pct: 82, seller: 'Soundline Official', img: 'earbuds', colors: ['Black', 'White', 'Sage'] },
  { id: 2, name: 'Oversized cotton hoodie', ar: 'هودي قطني واسع', cat: 'Fashion', price: 6.25, was: 11, rating: 4.6, reviews: 980, sold: '8.1k', pct: 64, seller: 'Basics Lab', img: 'hoodie', colors: ['Sand', 'Charcoal', 'Olive'] },
  { id: 3, name: 'Ceramic pour-over coffee set', ar: 'طقم تقطير قهوة سيراميك', cat: 'Home', price: 5.4, was: 8.75, rating: 4.8, reviews: 412, sold: '3.2k', pct: 47, seller: 'Kiln & Co', img: 'coffee set', colors: ['Cream', 'Terracotta'] },
  { id: 4, name: 'Smart watch, AMOLED, GPS', ar: 'ساعة ذكية بشاشة AMOLED و GPS', cat: 'Electronics', price: 15.9, was: 29, rating: 4.5, reviews: 1670, sold: '6.7k', pct: 91, seller: 'Soundline Official', img: 'smart watch', colors: ['Black', 'Silver'] },
  { id: 5, name: 'Vitamin C brightening serum, 30ml', ar: 'سيروم فيتامين سي للنضارة، 30 مل', cat: 'Beauty', price: 3.2, was: 5.5, rating: 4.7, reviews: 3020, sold: '21k', pct: 73, seller: 'Glow Kuwait', img: 'serum', colors: ['30ml', '50ml'] },
  { id: 6, name: 'Running shoes, knit upper', ar: 'حذاء جري بنسيج محبوك', cat: 'Sports', price: 12.5, was: 19.9, rating: 4.6, reviews: 760, sold: '4.4k', pct: 38, seller: 'Stride Co', img: 'shoes', colors: ['White', 'Black', 'Coral'] },
  { id: 7, name: 'Building blocks city set, 520 pcs', ar: 'مكعبات بناء مدينة، 520 قطعة', cat: 'Toys', price: 7.75, was: 12, rating: 4.9, reviews: 530, sold: '2.9k', pct: 55, seller: 'Brickyard', img: 'blocks', colors: ['City', 'Space'] },
  { id: 8, name: '65W GaN fast charger, 3 ports', ar: 'شاحن سريع GaN بقوة 65 واط، 3 منافذ', cat: 'Electronics', price: 4.6, was: 7.9, rating: 4.8, reviews: 1890, sold: '15k', pct: 88, seller: 'Volt Supply', img: 'charger', colors: ['White', 'Black'] },
  { id: 9, name: 'Linen bedsheet set, queen', ar: 'طقم شراشف كتان، مقاس كوين', cat: 'Home', price: 9.9, was: 16.5, rating: 4.6, reviews: 340, sold: '1.8k', pct: 29, seller: 'Kiln & Co', img: 'bedsheets', colors: ['Oat', 'Stone', 'Sky'] },
  { id: 10, name: 'Magnetic car phone mount', ar: 'حامل جوال مغناطيسي للسيارة', cat: 'Auto', price: 2.35, was: 4.2, rating: 4.4, reviews: 610, sold: '9.3k', pct: 69, seller: 'Volt Supply', img: 'car mount', colors: ['Black'] },
  { id: 11, name: 'Yoga mat, 6mm non-slip', ar: 'سجادة يوغا 6 مم مانعة للانزلاق', cat: 'Sports', price: 4.9, was: 8, rating: 4.7, reviews: 450, sold: '3.6k', pct: 51, seller: 'Stride Co', img: 'yoga mat', colors: ['Plum', 'Sage', 'Black'] },
  { id: 12, name: 'Bamboo desk organizer', ar: 'منظم مكتب من الخيزران', cat: 'Office', price: 3.75, was: 6.1, rating: 4.5, reviews: 220, sold: '1.1k', pct: 22, seller: 'Basics Lab', img: 'organizer', colors: ['Natural'] }
];

export const SUBS: Record<Category, string[]> = {
  Electronics: ['Phones', 'Audio', 'Chargers', 'Smart watches', 'Cameras', 'Gaming'],
  Fashion: ['Women', 'Men', 'Kids', 'Shoes', 'Bags', 'Abayas'],
  Home: ['Kitchen', 'Bedding', 'Decor', 'Storage', 'Lighting', 'Bath'],
  Beauty: ['Skincare', 'Makeup', 'Fragrance', 'Hair', 'Nails', 'Tools'],
  Sports: ['Fitness', 'Running', 'Yoga', 'Outdoor', 'Cycling', 'Swim'],
  Toys: ['Blocks', 'Dolls', 'RC toys', 'Puzzles', 'Baby', 'Outdoor'],
  Auto: ['Mounts', 'Cleaning', 'Lighting', 'Seat covers', 'Tools', 'Dash cams'],
  Office: ['Desk', 'Stationery', 'Printers', 'Chairs', 'Bags', 'Storage']
};

export const CATEGORIES = Object.keys(SUBS) as Category[];

// Arabic labels for categories, subcategories and variants.
export const AR_WORDS: Record<string, string> = { Electronics: 'إلكترونيات', Fashion: 'أزياء', Home: 'المنزل', Beauty: 'الجمال', Sports: 'رياضة', Toys: 'ألعاب', Auto: 'السيارات', Office: 'المكتب', All: 'الكل',
  Phones: 'هواتف', Audio: 'صوتيات', Chargers: 'شواحن', 'Smart watches': 'ساعات ذكية', Cameras: 'كاميرات', Gaming: 'ألعاب فيديو', Women: 'نساء', Men: 'رجال', Kids: 'أطفال', Shoes: 'أحذية', Bags: 'حقائب', Abayas: 'عبايات',
  Kitchen: 'المطبخ', Bedding: 'مفارش', Decor: 'ديكور', Storage: 'تخزين', Lighting: 'إضاءة', Bath: 'الحمام', Skincare: 'العناية بالبشرة', Makeup: 'مكياج', Fragrance: 'عطور', Hair: 'الشعر', Nails: 'الأظافر', Tools: 'أدوات',
  Fitness: 'لياقة', Running: 'جري', Yoga: 'يوغا', Outdoor: 'خارجي', Cycling: 'دراجات', Swim: 'سباحة', Blocks: 'مكعبات', Dolls: 'دمى', 'RC toys': 'ألعاب تحكم', Puzzles: 'ألغاز', Baby: 'رضع',
  Mounts: 'حوامل', Cleaning: 'تنظيف', 'Seat covers': 'أغطية مقاعد', 'Dash cams': 'كاميرات سيارة', Desk: 'مكتب', Stationery: 'قرطاسية', Printers: 'طابعات', Chairs: 'كراسي',
  Black: 'أسود', White: 'أبيض', Sage: 'أخضر فاتح', Sand: 'رملي', Charcoal: 'فحمي', Olive: 'زيتي', Cream: 'كريمي', Terracotta: 'طوبي', Silver: 'فضي', Coral: 'مرجاني', City: 'مدينة', Space: 'فضاء', Oat: 'شوفاني', Stone: 'حجري', Sky: 'سماوي', Plum: 'برقوقي', Natural: 'طبيعي', '30ml': '30 مل', '50ml': '50 مل' };
