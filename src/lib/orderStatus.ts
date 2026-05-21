export type DbOrderStatus =
  | "received"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const ORDER_FLOW: DbOrderStatus[] = [
  "received",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABEL: Record<DbOrderStatus, string> = {
  received: "Order Received",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
