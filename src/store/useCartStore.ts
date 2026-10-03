import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine {
  /** Unique cart line key — for pizzas includes size suffix */
  key: string;
  itemId: string;
  name: string;
  /** e.g. "Large", or undefined for non-pizza */
  variant?: string;
  unitPrice: number;
  qty: number;
  image?: string;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;

  addLine: (line: Omit<CartLine, "qty"> & { qty?: number }) => void;
  increment: (key: string) => void;
  decrement: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;

  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  totalQty: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,

      addLine: (line) =>
        set((s) => {
          const existing = s.lines.find((l) => l.key === line.key);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.key === line.key ? { ...l, qty: l.qty + (line.qty ?? 1) } : l,
              ),
            };
          }
          return { lines: [...s.lines, { ...line, qty: line.qty ?? 1 }] };
        }),

      increment: (key) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)),
        })),

      decrement: (key) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l))
            .filter((l) => l.qty > 0),
        })),

      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      totalQty: () => get().lines.reduce((n, l) => n + l.qty, 0),
      subtotal: () => get().lines.reduce((n, l) => n + l.qty * l.unitPrice, 0),
    }),
    { name: "dfc-cart-v1" },
  ),
);
