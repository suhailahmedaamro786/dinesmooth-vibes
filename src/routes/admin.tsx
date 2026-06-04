import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ChevronRight, Volume2, VolumeX, Loader2, XCircle,
  LayoutGrid, UtensilsCrossed, Tag, Users, BarChart3, Plus, Trash2,
  Download, Search, X,
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ORDER_FLOW, STATUS_LABEL, type DbOrderStatus } from "@/lib/orderStatus";
import { formatRs } from "@/lib/format";
import { burgers, rolls, broast, pizzas, deals } from "@/data/menu";
import { downloadCSV } from "@/lib/csv";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "DFC Admin · Control Center" },
      { name: "description", content: "Real-time order dashboard for DFC — Dadu Food Corner." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type AdminOrder = {
  id: string; customer_name: string; phone: string; address: string;
  notes: string | null; status: DbOrderStatus; total: number;
  created_at: string; payment_method?: string | null; transaction_id?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
};

type Tab = "orders" | "menu" | "promo" | "customers" | "analytics";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "orders", label: "Live Orders", icon: <LayoutGrid className="h-4 w-4" /> },
  { id: "menu", label: "Menu", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { id: "promo", label: "Promo Codes", icon: <Tag className="h-4 w-4" /> },
  { id: "customers", label: "Customers", icon: <Users className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
];

function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevTopIdRef = useRef<string | null>(null);

  const playChime = () => {
    if (!soundOn) return;
    try {
      const Ctor = typeof window !== "undefined"
        ? (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)
        : null;
      if (!Ctor) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctor();
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.type = "sine"; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.32);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.34);
      });
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    if (!isAdmin) return;

    const load = async () => {
      const { data, error } = await supabase
        .from("orders").select("*").order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      else setOrders((data ?? []) as AdminOrder[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          const o = payload.new as AdminOrder;
          setOrders((prev) => [o, ...prev]);
          if (prevTopIdRef.current !== o.id) { playChime(); prevTopIdRef.current = o.id; toast.success(`New order ${o.id}`); }
        } else if (payload.eventType === "UPDATE") {
          setOrders((prev) => prev.map((o) => o.id === (payload.new as AdminOrder).id ? (payload.new as AdminOrder) : o));
        } else if (payload.eventType === "DELETE") {
          setOrders((prev) => prev.filter((o) => o.id !== (payload.old as AdminOrder).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, authLoading]);

  const setStatus = async (id: string, status: DbOrderStatus) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success(`Order ${id} → ${STATUS_LABEL[status]}`);
  };

  const { revenue, active, completed } = useMemo(() => {
    let revenue = 0, active = 0, completed = 0;
    for (const o of orders) {
      revenue += Number(o.total);
      if (o.status === "delivered") completed += 1;
      else if (o.status !== "cancelled") active += 1;
    }
    return { revenue, active, completed };
  }, [orders]);

  if (authLoading || (user && isAdmin && loading)) {
    return <div className="grid min-h-screen place-items-center bg-background"><Loader2 className="h-6 w-6 animate-spin text-amber-brand" /></div>;
  }

  if (user && !isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-bold">Admin access required</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in as <span className="font-mono text-amber-brand">suhailahmedaamro786@gmail.com</span> to access the admin console.
          </p>
          <Link to="/auth" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground">
            Go to sign in
          </Link>
          <Link to="/" className="mt-3 block text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 inline h-3 w-3" /> Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">DFC Operations</div>
              <div className="text-base font-bold">Control Center</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground sm:inline-flex">
              <span className="relative grid h-2 w-2 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-amber-brand/70" />
                <span className="relative h-2 w-2 rounded-full bg-amber-brand" />
              </span>
              Live · realtime
            </span>
            <button onClick={() => setSoundOn((s) => !s)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground">
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {soundOn ? "Alerts on" : "Muted"}
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto flex max-w-[1600px] gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition ${tab === t.id ? "bg-amber-brand text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {tab === "orders" && (
          <OrdersTab orders={orders} setStatus={setStatus} revenue={revenue} active={active} completed={completed} />
        )}
        {tab === "menu" && <MenuTab />}
        {tab === "promo" && <PromoTab />}
        {tab === "customers" && <CustomersTab orders={orders} />}
        {tab === "analytics" && <AnalyticsTab orders={orders} />}
      </div>
    </div>
  );
}

/* ────────────── Orders ────────────── */
function OrdersTab({
  orders, setStatus, revenue, active, completed,
}: { orders: AdminOrder[]; setStatus: (id: string, s: DbOrderStatus) => void; revenue: number; active: number; completed: number }) {
  const grouped: Record<DbOrderStatus, AdminOrder[]> = {
    received: [], confirmed: [], preparing: [], out_for_delivery: [], delivered: [], cancelled: [],
  };
  for (const o of orders) grouped[o.status].push(o);

  const exportOrders = () => {
    const rows = orders.map((o) => ({
      id: o.id,
      created_at: o.created_at,
      status: o.status,
      customer_name: o.customer_name,
      phone: o.phone,
      address: o.address,
      payment_method: o.payment_method ?? "",
      transaction_id: o.transaction_id ?? "",
      total: o.total,
      items: (o.items ?? []).map((it) => `${it.qty}x ${it.name}${it.variant ? ` (${it.variant})` : ""}`).join(" | "),
      notes: o.notes ?? "",
    }));
    downloadCSV(`dfc-orders-${new Date().toISOString().slice(0,10)}.csv`, rows);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="space-y-3">
        <Metric label="Total revenue" value={formatRs(revenue)} accent />
        <Metric label="Active orders" value={active.toString()} />
        <Metric label="Delivered" value={completed.toString()} />
        <button onClick={exportOrders} disabled={orders.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-xs font-bold uppercase tracking-wider hover:border-amber-brand hover:text-amber-brand disabled:opacity-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </aside>
      <main className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <LayoutGroup>
          {(["received","confirmed","preparing","out_for_delivery","delivered"] as DbOrderStatus[]).map((status) => (
            <Column key={status} status={status} orders={grouped[status]} setStatus={setStatus} />
          ))}
        </LayoutGroup>
      </main>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-amber-brand/60 bg-gradient-to-br from-amber-brand/15 to-card glow-amber" : "border-border bg-card"}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className={`mt-1.5 text-2xl font-black tabular-nums ${accent ? "text-amber-brand" : ""}`}>{value}</div>
    </div>
  );
}

function Column({
  status, orders, setStatus,
}: { status: DbOrderStatus; orders: AdminOrder[]; setStatus: (id: string, s: DbOrderStatus) => void }) {
  const idx = ORDER_FLOW.indexOf(status);
  const next: DbOrderStatus | null = idx >= 0 && idx < ORDER_FLOW.length - 1 ? ORDER_FLOW[idx + 1] : null;
  return (
    <section className="flex min-h-[200px] flex-col rounded-2xl border border-border bg-card/40 p-3">
      <header className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{STATUS_LABEL[status]}</h3>
        <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-bold tabular-nums">{orders.length}</span>
      </header>
      <div className="flex flex-1 flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {orders.map((o) => (
            <motion.article key={o.id} layout layoutId={o.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="rounded-xl border border-border bg-background p-3.5 shadow-sm hover:border-amber-brand/50">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] font-bold text-amber-brand">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
                <div className="text-right text-base font-black text-amber-brand tabular-nums">{formatRs(Number(o.total))}</div>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-surface/50 p-2.5 text-xs">
                <div className="font-semibold">{o.customer_name}</div>
                <div className="text-muted-foreground">{o.phone}</div>
                <div className="mt-1 text-muted-foreground">{o.address}</div>
                {o.notes && <div className="mt-1 italic text-muted-foreground">"{o.notes}"</div>}
                {o.payment_method && o.payment_method !== "cod" && (
                  <div className="mt-1.5 rounded bg-amber-brand/10 px-1.5 py-1 text-[10px] font-bold uppercase text-amber-brand">
                    {o.payment_method} · TxID: {o.transaction_id || "—"}
                  </div>
                )}
              </div>
              <ul className="mt-3 space-y-1 text-xs">
                {o.items?.map((it, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate"><span className="text-amber-brand">{it.qty}×</span> {it.name}{it.variant && <span className="text-muted-foreground"> · {it.variant}</span>}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{formatRs(it.qty * it.unitPrice)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                {next && (
                  <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={() => setStatus(o.id, next)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-amber-brand px-3 py-2 text-[11px] font-bold text-primary-foreground">
                    {STATUS_LABEL[next]} <ChevronRight className="h-3 w-3" />
                  </motion.button>
                )}
                {status !== "delivered" && (
                  <button onClick={() => setStatus(o.id, "cancelled")} className="rounded-full border border-border px-3 py-2 text-[11px] font-bold text-muted-foreground hover:border-destructive hover:text-destructive">
                    Cancel
                  </button>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ────────────── Menu management ────────────── */
function MenuTab() {
  const allItems = [
    ...burgers.map((i) => ({ id: i.id, name: i.name, category: "Burgers" })),
    ...rolls.map((i) => ({ id: i.id, name: i.name, category: "Rolls" })),
    ...broast.map((i) => ({ id: i.id, name: i.name, category: "Broast" })),
    ...pizzas.map((i) => ({ id: i.id, name: i.name, category: "Pizzas" })),
    ...deals.map((i) => ({ id: i.id, name: i.name, category: "Deals" })),
  ];
  const [overrides, setOverrides] = useState<Record<string, { available: boolean }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("menu_overrides").select("item_id, available").then(({ data }) => {
      const m: Record<string, { available: boolean }> = {};
      (data ?? []).forEach((r) => { m[r.item_id] = { available: r.available }; });
      setOverrides(m);
      setLoading(false);
    });
  }, []);

  const toggle = async (id: string) => {
    const current = overrides[id]?.available ?? true;
    const newVal = !current;
    setOverrides((m) => ({ ...m, [id]: { available: newVal } }));
    const { error } = await supabase.from("menu_overrides").upsert({ item_id: id, available: newVal });
    if (error) { toast.error(error.message); setOverrides((m) => ({ ...m, [id]: { available: current } })); }
    else toast.success(`${id} → ${newVal ? "Available" : "Out of stock"}`);
  };

  if (loading) return <Loader2 className="mx-auto h-5 w-5 animate-spin text-amber-brand" />;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-1 text-lg font-bold">Menu management</h2>
      <p className="mb-4 text-sm text-muted-foreground">Toggle availability of any menu item. Pricing managed in code for now.</p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {allItems.map((it) => {
          const available = overrides[it.id]?.available ?? true;
          return (
            <div key={it.id} className="flex items-center justify-between rounded-xl border border-border bg-surface/40 px-3 py-2.5">
              <div>
                <div className="text-sm font-semibold">{it.name}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{it.category}</div>
              </div>
              <button onClick={() => toggle(it.id)}
                className={`relative h-6 w-11 rounded-full transition ${available ? "bg-amber-brand" : "bg-muted"}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${available ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────── Promo codes ────────────── */
type Promo = {
  id: string; code: string; discount_type: "percent" | "flat";
  discount_value: number; expires_at: string | null; usage_limit: number | null;
  used_count: number; active: boolean;
};

function PromoTab() {
  const [items, setItems] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", discount_type: "percent" as "percent" | "flat", discount_value: 10, expires_at: "", usage_limit: "" });

  const load = async () => {
    const { data } = await supabase.from("promo_codes").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as Promo[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("promo_codes").insert({
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: form.discount_value,
      expires_at: form.expires_at || null,
      usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Promo created");
    setForm({ code: "", discount_type: "percent", discount_value: 10, expires_at: "", usage_limit: "" });
    load();
  };

  const toggle = async (id: string, active: boolean) => {
    await supabase.from("promo_codes").update({ active: !active }).eq("id", id);
    load();
  };
  const remove = async (id: string) => {
    await supabase.from("promo_codes").delete().eq("id", id);
    load();
  };

  if (loading) return <Loader2 className="mx-auto h-5 w-5 animate-spin text-amber-brand" />;

  const exportPromos = () => {
    downloadCSV(`dfc-promo-codes-${new Date().toISOString().slice(0,10)}.csv`,
      items.map((p) => ({
        code: p.code, discount_type: p.discount_type, discount_value: p.discount_value,
        active: p.active, used_count: p.used_count, usage_limit: p.usage_limit ?? "",
        expires_at: p.expires_at ?? "",
      })));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Active promo codes</h2>
          <button onClick={exportPromos} disabled={items.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:border-amber-brand hover:text-amber-brand disabled:opacity-50">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No codes yet.</p>
        ) : (
          <div className="space-y-2">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/40 p-3">
                <div>
                  <div className="font-mono text-sm font-black text-amber-brand">{p.code}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.discount_type === "percent" ? `${p.discount_value}% off` : `Rs ${p.discount_value} off`} ·
                    used {p.used_count}{p.usage_limit ? `/${p.usage_limit}` : ""}
                    {p.expires_at ? ` · exp ${new Date(p.expires_at).toLocaleDateString()}` : ""}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(p.id, p.active)}
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${p.active ? "bg-amber-brand/15 text-amber-brand" : "bg-muted text-muted-foreground"}`}>
                    {p.active ? "Active" : "Off"}
                  </button>
                  <button onClick={() => remove(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={create} className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-bold uppercase tracking-wider">New code</h3>
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CODE" className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm uppercase outline-none focus:border-amber-brand" />
        <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as "percent" | "flat" })} className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand">
          <option value="percent">Percent off</option>
          <option value="flat">Flat amount off</option>
        </select>
        <input type="number" min={1} value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
        <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
        <input type="number" placeholder="Usage limit (optional)" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} className="w-full rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm outline-none focus:border-amber-brand" />
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-brand py-2.5 text-sm font-bold text-primary-foreground">
          <Plus className="h-4 w-4" /> Create code
        </button>
      </form>
    </div>
  );
}

/* ────────────── Customers ────────────── */
type Customer = { id: string; full_name: string | null; phone: string | null; loyalty_points: number; created_at: string };

function CustomersTab({ orders }: { orders: AdminOrder[] }) {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("profiles").select("id, full_name, phone, loyalty_points, created_at").order("created_at", { ascending: false }).then(({ data }) => {
      setItems((data ?? []) as Customer[]);
      setLoading(false);
    });
  }, []);

  // Aggregate order stats per profile (by user_id) and per phone (for guest matching)
  const statsByUser = useMemo(() => {
    const m = new Map<string, { count: number; total: number; last: string | null }>();
    for (const o of orders) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uid = (o as any).user_id as string | null;
      if (!uid) continue;
      const cur = m.get(uid) ?? { count: 0, total: 0, last: null };
      cur.count += 1; cur.total += Number(o.total);
      if (!cur.last || o.created_at > cur.last) cur.last = o.created_at;
      m.set(uid, cur);
    }
    return m;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      (c.full_name ?? "").toLowerCase().includes(q) ||
      (c.phone ?? "").toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q),
    );
  }, [items, query]);

  const selected = useMemo(() => items.find((c) => c.id === selectedId) ?? null, [items, selectedId]);
  const selectedHistory = useMemo(() => {
    if (!selected) return [];
    return orders
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((o) => (o as any).user_id === selected.id || (selected.phone && o.phone === selected.phone))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  }, [orders, selected]);

  const exportCustomers = () => {
    downloadCSV(`dfc-customers-${new Date().toISOString().slice(0,10)}.csv`,
      items.map((c) => {
        const s = statsByUser.get(c.id);
        return {
          id: c.id, full_name: c.full_name ?? "", phone: c.phone ?? "",
          loyalty_points: c.loyalty_points,
          orders_count: s?.count ?? 0,
          lifetime_spend: s?.total ?? 0,
          last_order_at: s?.last ?? "",
          joined_at: c.created_at,
        };
      }));
  };

  if (loading) return <Loader2 className="mx-auto h-5 w-5 animate-spin text-amber-brand" />;
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Customers ({items.length})</h2>
          <button onClick={exportCustomers} disabled={items.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:border-amber-brand hover:text-amber-brand disabled:opacity-50">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, phone, or ID…"
            className="w-full rounded-full border border-border bg-surface/60 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-amber-brand"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 text-left">Name</th><th className="text-left">Phone</th>
                <th className="text-right">Orders</th><th className="text-right">Spend</th>
                <th className="text-right">Points</th><th className="text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const s = statsByUser.get(c.id);
                const active = c.id === selectedId;
                return (
                  <tr key={c.id} onClick={() => setSelectedId(c.id)}
                    className={`cursor-pointer border-b border-border/40 transition hover:bg-surface/40 ${active ? "bg-amber-brand/10" : ""}`}>
                    <td className="py-2 font-semibold">{c.full_name || "—"}</td>
                    <td className="text-muted-foreground">{c.phone || "—"}</td>
                    <td className="text-right tabular-nums">{s?.count ?? 0}</td>
                    <td className="text-right tabular-nums text-muted-foreground">{formatRs(s?.total ?? 0)}</td>
                    <td className="text-right font-bold text-amber-brand tabular-nums">{c.loyalty_points}</td>
                    <td className="text-right text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">No customers match "{query}".</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="rounded-2xl border border-border bg-card p-5">
        {!selected ? (
          <div className="grid h-full min-h-[200px] place-items-center text-center text-sm text-muted-foreground">
            <div>
              <Users className="mx-auto mb-2 h-8 w-8 opacity-40" />
              Select a customer to view order history.
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">Customer</div>
                <h3 className="text-base font-bold">{selected.full_name || "—"}</h3>
                <p className="text-xs text-muted-foreground">{selected.phone || "No phone"}</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">{selected.id}</p>
              </div>
              <button onClick={() => setSelectedId(null)} className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl border border-border bg-surface/40 p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Orders</div>
                <div className="text-lg font-black tabular-nums">{selectedHistory.length}</div>
              </div>
              <div className="rounded-xl border border-border bg-surface/40 p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Spend</div>
                <div className="text-sm font-black tabular-nums text-amber-brand">
                  {formatRs(selectedHistory.reduce((n, o) => n + Number(o.total), 0))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface/40 p-2">
                <div className="text-[10px] uppercase text-muted-foreground">Points</div>
                <div className="text-lg font-black tabular-nums text-amber-brand">{selected.loyalty_points}</div>
              </div>
            </div>
            <h4 className="mt-5 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Order history</h4>
            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {selectedHistory.length === 0 ? (
                <p className="text-xs text-muted-foreground">No orders yet.</p>
              ) : selectedHistory.map((o) => (
                <div key={o.id} className="rounded-xl border border-border bg-surface/40 p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-brand">{o.id}</span>
                    <span className="tabular-nums font-bold">{formatRs(Number(o.total))}</span>
                  </div>
                  <div className="mt-0.5 flex items-center justify-between text-muted-foreground">
                    <span>{new Date(o.created_at).toLocaleString()}</span>
                    <span className="rounded-full bg-amber-brand/10 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-brand">{STATUS_LABEL[o.status]}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ────────────── Analytics ────────────── */
function AnalyticsTab({ orders }: { orders: AdminOrder[] }) {
  const data = useMemo(() => {
    // last 7 days revenue
    const days: { day: string; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString([], { weekday: "short" });
      const revenue = orders.filter((o) => o.created_at.startsWith(key) && o.status !== "cancelled").reduce((n, o) => n + Number(o.total), 0);
      days.push({ day: label, revenue });
    }

    // top items
    const counts: Record<string, number> = {};
    orders.forEach((o) => o.items?.forEach((it: { name: string; qty: number }) => {
      counts[it.name] = (counts[it.name] ?? 0) + it.qty;
    }));
    const top = Object.entries(counts).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5);

    // hours
    const hourMap = new Map<number, number>();
    for (let h = 0; h < 24; h++) hourMap.set(h, 0);
    orders.forEach((o) => { const h = new Date(o.created_at).getHours(); hourMap.set(h, (hourMap.get(h) ?? 0) + 1); });
    const hours = Array.from(hourMap.entries()).map(([h, c]) => ({ hour: `${h}h`, orders: c }));

    return { days, top, hours, total: orders.length };
  }, [orders]);

  const COLORS = ["#f59e0b", "#fb923c", "#f97316", "#ef4444", "#a855f7"];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Revenue · last 7 days</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.days}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Top 5 items</h3>
        {data.top.length === 0 ? <p className="text-sm text-muted-foreground">No data yet.</p> : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={data.top} dataKey="qty" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {data.top.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 lg:col-span-2">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Orders by hour</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data.hours}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="orders" fill="#fb923c" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
