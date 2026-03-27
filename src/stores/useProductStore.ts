import { create } from 'zustand';
import { productApi, categoryApi, type Product, type Category, type Review } from '@/services/api';

interface ProductStore {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  reviews: Review[];
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  getReviewsForProduct: (productId: number) => Review[];
}

const mockCategories: Category[] = [
  { id: 1, name: 'Timepieces', description: 'Luxury watches and chronographs', slug: 'timepieces', productCount: 3 },
  { id: 2, name: 'Leather Goods', description: 'Premium leather accessories', slug: 'leather-goods', productCount: 2 },
  { id: 3, name: 'Fragrances', description: 'Exclusive perfumes and colognes', slug: 'fragrances', productCount: 2 },
  { id: 4, name: 'Jewelry', description: 'Fine jewelry and precious stones', slug: 'jewelry', productCount: 2 },
  { id: 5, name: 'Eyewear', description: 'Designer sunglasses and frames', slug: 'eyewear', productCount: 2 },
  { id: 6, name: 'Audio', description: 'Premium audio equipment', slug: 'audio', productCount: 1 },
];

const mockProducts: Product[] = [
  { id: 1, name: 'Royal Oak Chronograph', price: 4299.00, description: 'A masterpiece of horological engineering. The brushed stainless steel case houses a precision automatic movement with date display and chronograph functions.', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', category: mockCategories[0], categoryId: 1, stock: 5, rating: 4.8, reviewCount: 24 },
  { id: 2, name: 'Minimalist Dress Watch', price: 1849.00, description: 'Understated elegance defined. Ultra-thin case with sapphire crystal and genuine alligator leather strap. Swiss quartz movement.', imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop', category: mockCategories[0], categoryId: 1, stock: 12, rating: 4.6, reviewCount: 18 },
  { id: 3, name: 'Heritage Diver 300M', price: 3750.00, description: 'Built for the depths. 300m water resistance, ceramic bezel, and luminous indices. A professional diver\'s companion.', imageUrl: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop', category: mockCategories[0], categoryId: 1, stock: 8, rating: 4.9, reviewCount: 31 },
  { id: 4, name: 'Artisan Leather Briefcase', price: 895.00, description: 'Hand-stitched Italian calfskin briefcase with brass hardware. Designed for the modern professional who values craftsmanship.', imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop', category: mockCategories[1], categoryId: 2, stock: 15, rating: 4.7, reviewCount: 12 },
  { id: 5, name: 'Monaco Card Holder', price: 345.00, description: 'Slim profile card holder in hand-painted Venezia leather. Six card slots with embossed logo detail.', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop', category: mockCategories[1], categoryId: 2, stock: 30, rating: 4.5, reviewCount: 42 },
  { id: 6, name: 'Noir Absolu EDP', price: 285.00, description: 'An intoxicating blend of oud, black amber, and Madagascan vanilla. A fragrance that commands presence.', imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop', category: mockCategories[2], categoryId: 3, stock: 20, rating: 4.4, reviewCount: 56 },
  { id: 7, name: 'Riviera Citrus EDT', price: 195.00, description: 'Fresh Mediterranean-inspired eau de toilette with bergamot, neroli, and white musk. Light yet distinctive.', imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea081db797f?w=600&h=600&fit=crop', category: mockCategories[2], categoryId: 3, stock: 25, rating: 4.3, reviewCount: 38 },
  { id: 8, name: 'Celestial Diamond Ring', price: 6750.00, description: 'Ethically sourced 2-carat brilliant cut diamond set in 18k white gold. GIA certified, VS1 clarity, E color.', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop', category: mockCategories[3], categoryId: 4, stock: 3, rating: 5.0, reviewCount: 8 },
  { id: 9, name: 'Gold Chain Bracelet', price: 1250.00, description: '14k solid gold Cuban link bracelet. Handcrafted with a secure lobster clasp. Weight: 28g.', imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop', category: mockCategories[3], categoryId: 4, stock: 10, rating: 4.6, reviewCount: 15 },
  { id: 10, name: 'Aviator Titanium', price: 520.00, description: 'Lightweight titanium frame aviators with polarized gradient lenses. UV400 protection with anti-reflective coating.', imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop', category: mockCategories[4], categoryId: 5, stock: 18, rating: 4.7, reviewCount: 22 },
  { id: 11, name: 'Oversized Square Frames', price: 380.00, description: 'Bold acetate frames in glossy black. Statement eyewear with CR-39 optical lenses.', imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=600&fit=crop', category: mockCategories[4], categoryId: 5, stock: 22, rating: 4.2, reviewCount: 19 },
  { id: 12, name: 'Studio Reference Headphones', price: 749.00, description: 'Planar magnetic drivers deliver audiophile-grade sound. Memory foam ear cushions, detachable cable, hand-assembled.', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', category: mockCategories[5], categoryId: 6, stock: 7, rating: 4.8, reviewCount: 45 },
];

const mockReviews: Review[] = [
  { id: 1, productId: 1, reviewer: 'Alexander M.', rating: 5, comment: 'Absolutely stunning timepiece. The finishing on the dial is breathtaking in person.', date: '2026-02-15' },
  { id: 2, productId: 1, reviewer: 'Sophia L.', rating: 5, comment: 'Purchased as a gift for my husband. He hasn\'t taken it off since. Worth every penny.', date: '2026-01-28' },
  { id: 3, productId: 1, reviewer: 'James K.', rating: 4, comment: 'Beautiful watch with impeccable build quality. Slightly heavy for everyday wear but a showpiece.', date: '2026-03-01' },
  { id: 4, productId: 2, reviewer: 'Elena R.', rating: 5, comment: 'The perfect dress watch. Thin, elegant, and pairs beautifully with formal attire.', date: '2026-02-20' },
  { id: 5, productId: 4, reviewer: 'Michael T.', rating: 5, comment: 'The leather quality is exceptional. This briefcase will last decades with proper care.', date: '2026-03-05' },
  { id: 6, productId: 6, reviewer: 'Charlotte B.', rating: 4, comment: 'Rich, complex scent that evolves beautifully throughout the day. Longevity is impressive.', date: '2026-02-10' },
  { id: 7, productId: 8, reviewer: 'David W.', rating: 5, comment: 'The diamond is absolutely flawless. My fiancée cried when she saw it. Incredible.', date: '2026-01-14' },
  { id: 8, productId: 12, reviewer: 'Ryan P.', rating: 5, comment: 'As a music producer, these headphones are a revelation. The soundstage is incredible.', date: '2026-03-10' },
  { id: 9, productId: 12, reviewer: 'Nina S.', rating: 4, comment: 'Superb audio quality. Comfortable for long sessions. Cable could be better quality.', date: '2026-02-25' },
];

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  reviews: mockReviews,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productApi.getAll();
      set({ products, loading: false });
    } catch {
      set({ products: mockProducts, loading: false });
    }
  },
  fetchCategories: async () => {
    try {
      const categories = await categoryApi.getAll();
      set({ categories });
    } catch {
      set({ categories: mockCategories });
    }
  },
  getReviewsForProduct: (productId: number) => {
    return get().reviews.filter(r => r.productId === productId);
  },
}));
