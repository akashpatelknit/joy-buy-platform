import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/services/api';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  toggleItem: (product: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          if (state.items.some((i) => i.id === product.id)) return state;
          return { items: [...state.items, product] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),
      isWishlisted: (productId) => get().items.some((i) => i.id === productId),
      toggleItem: (product) => {
        const { items } = get();
        if (items.some((i) => i.id === product.id)) {
          set({ items: items.filter((i) => i.id !== product.id) });
        } else {
          set({ items: [...items, product] });
        }
      },
    }),
    { name: 'wishlist-storage' }
  )
);
