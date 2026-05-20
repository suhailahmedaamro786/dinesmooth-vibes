import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./useCartStore";

export type OrderStatus = "Pending" | "Preparing" | "Out for Delivery" | "Completed";

export const ORDER_STATUSES: OrderStatus[] = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Completed",
];

export interface Order {
  id: string;
  createdAt: number;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: CartLine[];
  total: number;
}

interface OrdersState {
  orders: Order[];
  lastSeenAt: number;
  addOrder: (order: Order) => void;
  setStatus: (id: string, status: OrderStatus) => void;
  markSeen: () => void;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      lastSeenAt: Date.now(),
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      setStatus: (id, status) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
      markSeen: () => set({ lastSeenAt: Date.now() }),
    }),
    { name: "dfc-orders-v1" },
  ),
);
