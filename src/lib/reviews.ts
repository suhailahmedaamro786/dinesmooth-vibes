import { supabase } from "@/integrations/supabase/client";

export type ReviewSummary = { item_id: string; avg_rating: number; review_count: number };
export type Review = {
  id: string;
  user_id: string;
  item_id: string;
  order_id: string | null;
  rating: number;
  comment: string | null;
  customer_name: string | null;
  created_at: string;
};

export async function fetchReviewSummaries(): Promise<Map<string, ReviewSummary>> {
  const { data, error } = await supabase.rpc("get_review_summary" as never);
  const map = new Map<string, ReviewSummary>();
  if (error || !data) return map;
  (data as unknown as ReviewSummary[]).forEach((r) =>
    map.set(r.item_id, { ...r, avg_rating: Number(r.avg_rating) })
  );
  return map;
}

export async function fetchReviewsForItem(itemId: string, limit = 20): Promise<Review[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data } = await client
    .from("reviews")
    .select("*")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as Review[];
}

export async function fetchOwnReviews(userId: string): Promise<Review[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { data } = await client
    .from("reviews")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Review[];
}

export async function submitReview(input: {
  userId: string;
  itemId: string;
  orderId: string;
  rating: number;
  comment: string;
  customerName?: string | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const client = supabase as any;
  const { error } = await client.from("reviews").insert({
    user_id: input.userId,
    item_id: input.itemId,
    order_id: input.orderId,
    rating: input.rating,
    comment: input.comment.trim() || null,
    customer_name: input.customerName ?? null,
  });
  return { error };
}
