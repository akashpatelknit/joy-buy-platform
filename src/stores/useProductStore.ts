import { create } from 'zustand';
import { productApi, categoryApi, type Product, type Category } from '@/services/api';

interface ProductStore {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
}

// Mock data for when backend is unavailable
const mockCategories: Category[] = [
  { id: 1, name: 'Electronics', description: 'Gadgets and devices' },
  { id: 2, name: 'Clothing', description: 'Apparel and fashion' },
  { id: 3, name: 'Home & Living', description: 'Furniture and decor' },
  { id: 4, name: 'Books', description: 'Books and literature' },
];

const mockProducts: Product[] = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, description: 'Premium noise-cancelling wireless headphones with 30h battery life.', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: mockCategories[0], categoryId: 1 },
  { id: 2, name: 'Minimalist Watch', price: 149.99, description: 'Elegant minimalist watch with leather strap.', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop', category: mockCategories[0], categoryId: 1 },
  { id: 3, name: 'Organic Cotton Tee', price: 34.99, description: 'Soft organic cotton t-shirt in classic fit.', imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', category: mockCategories[1], categoryId: 2 },
  { id: 4, name: 'Denim Jacket', price: 89.99, description: 'Classic denim jacket with modern cut.', imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=400&fit=crop', category: mockCategories[1], categoryId: 2 },
  { id: 5, name: 'Ceramic Vase', price: 45.00, description: 'Handcrafted ceramic vase with organic shape.', imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&h=400&fit=crop', category: mockCategories[2], categoryId: 3 },
  { id: 6, name: 'Throw Blanket', price: 59.99, description: 'Cozy knitted throw blanket in neutral tones.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop', category: mockCategories[2], categoryId: 3 },
  { id: 7, name: 'Design Patterns', price: 42.00, description: 'Essential reading for software engineers.', imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop', category: mockCategories[3], categoryId: 4 },
  { id: 8, name: 'Smart Speaker', price: 129.99, description: 'Voice-controlled smart speaker with premium sound.', imageUrl: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=400&fit=crop', category: mockCategories[0], categoryId: 1 },
];

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productApi.getAll();
      set({ products, loading: false });
    } catch {
      // Fallback to mock data
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
}));
