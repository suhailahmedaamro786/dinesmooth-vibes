import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, Package, Sparkles, MapPin, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatRs } from "@/lib/format";
import { STATUS_LABEL, type DbOrderStatus } from "@/lib/orderStatus";
import { toast } from "sonner";
import { StarRating } from "@/components/StarRating";
import { ReviewDialog, type ReviewTarget } from "@/components/ReviewDialog";
import { fetchOwnReviews, type Review } from "@/lib/reviews";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({
    meta: [
      { title: "My Profile · D-Pizza Food" },
      { name: "description", content: "Manage your D-Pizza Food profile, order history, reviews and saved delivery addresses in Dadu." },
      { property: "og:title", content: "My Profile · D-Pizza Food" },
      { property: "og:description", content: "Your D-Pizza Food order history, reviews and saved addresses." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type OrderItem = { itemId?: string; id?: string; name: string; qty: number; unitPrice: number; variant?: string };
type Order = {
  id: string; total: number; status: DbOrderStatus; created_at: string; address: string;
  items: OrderItem[]; customer_name?: string;
};
type Addr = { id: string; label: string; address: string; phone: string | null; is_default: boolean };

function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Addr[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAddr, setNewAddr] = useState({ label: "Home", address: "", phone: "" });
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);

  const reviewedKey = (orderId: string, itemId: string) => `${orderId}::${itemId}`;
  const reviewedSet = new Set(reviews.map((r) => reviewedKey(r.order_id ?? "", r.item_id)));

  const loadAll = async (uid: string) => {
    const [p, o, a, r] = await Promise.all([
      supabase.from("profiles").select("loyalty_points,full_name").eq("id", uid).maybeSingle(),
      supabase.from("orders").select("id,total,status,created_at,address,items,customer_name").eq("user_id", uid).order("created_at", { ascending: false }).limit(20),
      supabase.from("saved_addresses").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      fetchOwnReviews(uid),
    ]);
    setPoints(p.data?.loyalty_points ?? 0);
    setOrders((o.data ?? []) as unknown as Order[]);
    setAddresses((a.data ?? []) as Addr[]);
    setReviews(r);
    setLoading(false);
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    loadAll(user.id);
  }, [user, authLoading, navigate]);

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAddr.address.trim()) return;
    const { data, error } = await supabase.from("saved_addresses").insert({
      user_id: user.id, label: newAddr.label, address: newAddr.address, phone: newAddr.phone || null,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => [data as Addr, ...prev]);
    setNewAddr({ label: "Home", address: "", phone: "" });
    toast.success("Address saved");
  };

  const removeAddress = async (id: string) => {
    const { error } = await supabase.from("saved_addresses").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  if (authLoading || loading) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-amber-brand" /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Link>
          <h1 className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">My Profile</h1>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-amber-brand/40 bg-gradient-to-br from-amber-brand/15 to-card p-6 shadow-xl">
          <div className="text-xs text-muted-foreground">Signed in as</div>
          <div className="mt-1 truncate text-lg font-bold">{user?.email}</div>
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-background/60 p-4">
            <Sparkles className="h-6 w-6 text-amber-brand" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Loyalty points</div>
              <div className="text-2xl font-black text-amber-brand tabular-nums">{points}</div>
            </div>
            <div className="ml-auto text-right text-[11px] text-muted-foreground">
              Earn 10 pts per Rs 100<br /> Redeem 100 pts = Rs 10
            </div>
          </div>
        </motion.div>

        {/* Orders */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Order history</h2>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {orders.map((o) => {
                const delivered = o.status === "delivered";
                const itemIds = new Set<string>();
                const uniqueItems = (o.items ?? []).filter((it) => {
                  const id = it.itemId ?? it.id ?? it.name;
                  if (itemIds.has(id)) return false;
                  itemIds.add(id);
                  return true;
                });
                return (
                  <li key={o.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Link to="/track/$orderId" params={{ orderId: o.id }} className="font-mono text-sm font-bold text-amber-brand hover:underline">{o.id}</Link>
                        <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black tabular-nums">{formatRs(Number(o.total))}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{STATUS_LABEL[o.status]}</div>
                      </div>
                    </div>
                    {delivered && uniqueItems.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uniqueItems.map((it) => {
                          const itemId = it.itemId ?? it.id ?? it.name;
                          const reviewed = reviewedSet.has(reviewedKey(o.id, itemId));
                          return (
                            <button
                              key={itemId}
                              disabled={reviewed}
                              onClick={() => setReviewTarget({ itemId, itemName: it.name, orderId: o.id })}
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                                reviewed
                                  ? "border-border text-muted-foreground"
                                  : "border-amber-brand/40 text-amber-brand hover:bg-amber-brand/10"
                              }`}
                            >
                              <Star className="h-3 w-3" /> {reviewed ? `Reviewed: ${it.name}` : `Rate: ${it.name}`}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* My reviews */}
        {reviews.length > 0 && (
          <section className="rounded-3xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-brand" />
              <h2 className="text-sm font-bold uppercase tracking-wider">My reviews</h2>
            </div>
            <ul className="space-y-3">
              {reviews.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-surface/40 p-3">
                  <div className="flex items-center justify-between">
                    <StarRating value={r.rating} />
                    <span className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-1 text-xs font-bold">{r.item_id}</div>
                  {r.comment && <p className="mt-1 text-sm text-muted-foreground">{r.comment}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Saved addresses */}
        <section className="rounded-3xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-amber-brand" />
            <h2 className="text-sm font-bold uppercase tracking-wider">Saved addresses</h2>
          </div>
          <ul className="space-y-2">
            {addresses.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-surface/40 p-3">
                <div className="flex-1">
                  <div className="text-xs font-bold text-amber-brand">{a.label}</div>
                  <div className="text-sm">{a.address}</div>
                  {a.phone && <div className="text-xs text-muted-foreground">{a.phone}</div>}
                </div>
                <button onClick={() => removeAddress(a.id)} className="text-[11px] text-muted-foreground hover:text-destructive">Remove</button>
              </li>
            ))}
          </ul>
          <form onSubmit={addAddress} className="mt-4 grid gap-2 sm:grid-cols-[100px_1fr_140px_auto]">
            <input value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} placeholder="Label" className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
            <input value={newAddr.address} onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })} placeholder="Full address" required className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
            <input value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} placeholder="Phone" className="rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
            <button className="rounded-xl bg-amber-brand px-4 py-2 text-xs font-bold text-primary-foreground">Add</button>
          </form>
        </section>
      </div>
    </div>
  );
}
