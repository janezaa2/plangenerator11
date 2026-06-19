import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { id: product.id, name: product.name, price: product.price, image: product.images?.[0], quantity: 1 }] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);

export default useCartStore;
