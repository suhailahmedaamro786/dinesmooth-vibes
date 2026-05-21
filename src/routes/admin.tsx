import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Volume2, VolumeX, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ORDER_FLOW, STATUS_LABEL, type DbOrderStatus } from "@/lib/orderStatus";
import { formatRs } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "DFC Admin · Live Orders" },
      { name: "description", content: "Real-time order dashboard for DFC — Dadu Food Corner." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type AdminOrder = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  notes: string | null;
  status: DbOrderStatus;
  total: number;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
};

function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
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
            Your account doesn't have the admin role. Open the backend dashboard to grant your user the <span className="font-mono text-amber-brand">admin</span> role in <span className="font-mono">user_roles</span>.
          </p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    );
  }

  const grouped: Record<DbOrderStatus, AdminOrder[]> = {
    received: [], confirmed: [], preparing: [], out_for_delivery: [], delivered: [], cancelled: [],
  };
  for (const o of orders) grouped[o.status].push(o);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label="Back to site">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">DFC Operations</div>
              <div className="text-base font-bold">Live Order Console</div>
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
      </header>

      <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          <Metric label="Total revenue" value={formatRs(revenue)} accent />
          <Metric label="Active orders" value={active.toString()} />
          <Metric label="Delivered" value={completed.toString()} />
          <div className="rounded-2xl border border-border bg-card p-4 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground">Tip</div>
            Click <span className="text-amber-brand">Advance</span> to move an order along the kitchen flow, or <span className="text-destructive">Cancel</span> to cancel it.
          </div>
        </aside>

        <main className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <LayoutGroup>
            {(["received","confirmed","preparing","out_for_delivery","delivered"] as DbOrderStatus[]).map((status) => (
              <Column key={status} status={status} orders={grouped[status]} setStatus={setStatus} />
            ))}
          </LayoutGroup>
        </main>
      </div>

      {orders.length === 0 && (
        <div className="mx-auto max-w-md px-6 py-12 text-center text-sm text-muted-foreground">
          No orders yet. Place one from the <Link to="/" className="text-amber-brand hover:underline">customer site</Link>.
        </div>
      )}
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
            <motion.article
              key={o.id} layout layoutId={o.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="rounded-xl border border-border bg-background p-3.5 shadow-sm hover:border-amber-brand/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-mono text-[11px] font-bold text-amber-brand">{o.id}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-right text-base font-black text-amber-brand tabular-nums">{formatRs(Number(o.total))}</div>
              </div>
              <div className="mt-3 rounded-lg border border-border bg-surface/50 p-2.5 text-xs">
                <div className="font-semibold">{o.customer_name}</div>
                <div className="text-muted-foreground">{o.phone}</div>
                <div className="mt-1 text-muted-foreground">{o.address}</div>
                {o.notes && <div className="mt-1 italic text-muted-foreground">“{o.notes}”</div>}
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
