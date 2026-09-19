import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string; // productId + variant, unique per line item
  productId: string;
  name: string;
  image: string | null;
  price: number; // unit price including variant modifier
  variant: string | null;
  quantity: number;
  specialInstructions: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addItem: (item: Omit<CartItem, "key" | "quantity">, quantity: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  updateInstructions: (key: string, instructions: string) => void;
  clear: () => void;
};

function lineKey(productId: string, variant: string | null) {
  return `${productId}::${variant ?? "default"}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addItem: (item, quantity) => {
        const key = lineKey(item.productId, item.variant);
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [...get().items, { ...item, key, quantity }],
            isOpen: true,
          });
        }
      },
      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.key !== key) });
          return;
        }
        set({
          items: get().items.map((i) => (i.key === key ? { ...i, quantity } : i)),
        });
      },
      removeItem: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      updateInstructions: (key, instructions) =>
        set({
          items: get().items.map((i) =>
            i.key === key ? { ...i, specialInstructions: instructions } : i
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "cakoo-cart" }
  )
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
