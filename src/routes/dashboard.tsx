import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft, Loader2, Package, Sparkles, Wallet, Flame,
  Clock, ChevronRight, TrendingUp, Heart,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatRs } from "@/lib/format";
import { STATUS_LABEL, type DbOrderStatus } from "@/lib/orderStatus";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "My Dashboard · DFC" },
      { name: "description", content: "Your DFC dashboard — orders, points and favourites at a glance." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type OrderItem = { name: string; qty: number; unitPrice: number; variant?: string };
type Order = {
  id: string; total: number; status: DbOrderStatus; created_at: string; items: OrderItem[];
};

function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [points, setPoints] = useState(0);
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    (async () => {
      const [p, o] = await Promise.all([
        supabase.from("profiles").select("loyalty_points,full_name").eq("id", user.id).maybeSingle(),
        supabase.from("orders").select("id,total,status,created_at,items").eq("user_id", user.id).order("created_at", { ascending: false }).limit(30),
      ]);
      setPoints(p.data?.loyalty_points ?? 0);
      setName(p.data?.full_name ?? null);
      setOrders((o.data ?? []) as unknown as Order[]);
      setLoading(false);
    })();
  }, [user, authLoading, navigate]);

  const stats = useMemo(() => {
    const total = orders.reduce((s, o) => s + Number(o.total), 0);
    const active = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const counts = new Map<string, number>();
    orders.forEach((o) => o.items?.forEach((it) => counts.set(it.name, (counts.get(it.name) ?? 0) + it.qty)));
    const favourite = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    return { total, active, delivered, favourite };
  }, [orders]);

  const chartData = useMemo(() => {
    const buckets = new Map<string, number>();
    [...orders].reverse().forEach((o) => {
      const d = new Date(o.created_at);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      buckets.set(key, (buckets.get(key) ?? 0) + Number(o.total));
    });
    return [...buckets.entries()].map(([day, total]) => ({ day, total }));
  }, [orders]);

  if (authLoading || loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-amber-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">DFC · Customer</div>
              <div className="text-base font-bold">My Dashboard</div>
            </div>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            Profile <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
            Welcome back{name ? `, ${name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here's a quick look at your DFC activity.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Wallet className="h-4 w-4" />} label="Total spent" value={formatRs(stats.total)} accent delay={0.05} />
          <StatCard icon={<Sparkles className="h-4 w-4" />} label="Loyalty points" value={points.toString()} delay={0.1} />
          <StatCard icon={<Package className="h-4 w-4" />} label="Active orders" value={stats.active.toString()} delay={0.15} />
          <StatCard icon={<Flame className="h-4 w-4" />} label="Delivered" value={stats.delivered.toString()} delay={0.2} />
        </div>

        {/* Spending chart + favourite */}
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="rounded-2xl border border-border bg-card/60 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Spending trend</div>
                <h2 className="text-lg font-bold">Recent activity</h2>
              </div>
              <TrendingUp className="h-4 w-4 text-amber-brand" />
            </div>
            <div className="mt-4 h-56">
              {chartData.length === 0 ? (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">No orders yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--amber-brand, 38 95% 55%))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--amber-brand, 38 95% 55%))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{ background: "var(--card, #111)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                      formatter={(v: number) => formatRs(v)}
                    />
                    <Area type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="rounded-2xl border border-amber-brand/40 bg-gradient-to-br from-amber-brand/15 to-card p-5 glow-amber"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-brand">Your favourite</div>
            <Heart className="mt-3 h-7 w-7 text-amber-brand" />
            <div className="mt-2 text-xl font-black leading-tight">{stats.favourite}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              Ordered the most across your delivered orders.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-brand px-3.5 py-1.5 text-[11px] font-bold text-primary-foreground"
            >
              Reorder now <ChevronRight className="h-3 w-3" />
            </Link>
          </motion.section>
        </div>

        {/* Recent orders */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="rounded-2xl border border-border bg-card/60 p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</div>
              <h2 className="text-lg font-bold">Your last orders</h2>
            </div>
            <Link to="/profile" className="text-xs font-semibold text-amber-brand hover:underline">
              See all
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              You haven't placed any orders yet.
              <div className="mt-3">
                <Link to="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-brand px-4 py-2 text-xs font-bold text-primary-foreground">
                  Browse menu
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {orders.slice(0, 6).map((o, i) => (
                <motion.li
                  key={o.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                >
                  <Link
                    to="/track/$orderId"
                    params={{ orderId: o.id }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/40 px-4 py-3 hover:border-amber-brand/60"
                  >
                    <div className="min-w-0">
                      <div className="font-mono text-[11px] font-bold text-amber-brand">{o.id}</div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(o.created_at).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-amber-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-brand">
                        {STATUS_LABEL[o.status]}
                      </span>
                      <span className="text-sm font-black tabular-nums">{formatRs(Number(o.total))}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          )}
        </motion.section>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, accent, delay = 0,
}: { icon: React.ReactNode; label: string; value: string; accent?: boolean; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ y: -3 }}
      className={`rounded-2xl border p-4 ${accent ? "border-amber-brand/60 bg-gradient-to-br from-amber-brand/15 to-card glow-amber" : "border-border bg-card"}`}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${accent ? "bg-amber-brand/20 text-amber-brand" : "bg-surface"}`}>
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]">{label}</span>
      </div>
      <div className={`mt-2 text-2xl font-black tabular-nums ${accent ? "text-amber-brand" : ""}`}>{value}</div>
    </motion.div>
  );
}
