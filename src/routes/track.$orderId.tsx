import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Loader2, Package, ChefHat, Truck, Home, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ORDER_FLOW, STATUS_LABEL, type DbOrderStatus } from "@/lib/orderStatus";
import { formatRs } from "@/lib/format";

export const Route = createFileRoute("/track/$orderId")({
  component: TrackPage,
  head: () => ({
    meta: [
      { title: "Track your order · DFC" },
      { name: "description", content: "Live status updates for your DFC order." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  status: DbOrderStatus;
  total: number;
  created_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
};

const STEP_ICONS = [Package, Check, ChefHat, Truck, Home];

function TrackPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchOrder = async () => {
      if (orderId === "latest") {
        const { data: userRes } = await supabase.auth.getUser();
        if (!userRes.user) { setLoading(false); setNotFound(true); return; }
        const { data } = await supabase
          .from("orders").select("*")
          .eq("user_id", userRes.user.id)
          .order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (cancelled) return;
        if (!data) setNotFound(true);
        else setOrder(data as Order);
      } else {
        const { data, error } = await supabase.rpc("get_order_tracking", { p_id: orderId });
        if (cancelled) return;
        const row = Array.isArray(data) ? data[0] : null;
        if (error || !row) setNotFound(true);
        else setOrder(row as unknown as Order);
      }
      setLoading(false);
    };
    fetchOrder();

    // Poll for status updates (realtime requires auth; tracking links are public)
    const interval = setInterval(fetchOrder, 8000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [orderId]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-amber-brand" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div>
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-4 text-xl font-bold">Order not found</h1>
          <p className="mt-1 text-sm text-muted-foreground">Check the order ID and try again.</p>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentIdx = isCancelled ? -1 : ORDER_FLOW.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">Order tracking</div>
            <div className="font-mono text-sm font-bold">{order.id}</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {isCancelled ? (
          <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6 text-center">
            <XCircle className="mx-auto h-10 w-10 text-destructive" />
            <h2 className="mt-3 text-lg font-bold">Order cancelled</h2>
            <p className="mt-1 text-sm text-muted-foreground">This order was cancelled. Contact us if you need help.</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card/60 p-6">
            <h2 className="text-xl font-bold">{STATUS_LABEL[order.status]}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Estimated delivery 30–45 mins from order time.</p>

            <ol className="mt-8 space-y-4">
              {ORDER_FLOW.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={step} className="flex items-start gap-4">
                    <motion.div
                      initial={false}
                      animate={{ scale: active ? [1, 1.12, 1] : 1 }}
                      transition={{ repeat: active ? Infinity : 0, duration: 1.8 }}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${done ? "border-amber-brand bg-amber-brand text-primary-foreground" : "border-border bg-surface text-muted-foreground"}`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={2.5} />
                    </motion.div>
                    <div className="flex-1 border-b border-border pb-4">
                      <div className={`text-sm font-bold ${done ? "text-foreground" : "text-muted-foreground"}`}>
                        {STATUS_LABEL[step]}
                      </div>
                      {active && (
                        <div className="mt-0.5 text-xs text-amber-brand">In progress…</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        <div className="mt-6 rounded-3xl border border-border bg-card/60 p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order summary</h3>
          <div className="mt-3 space-y-1.5 text-sm">
            {order.items?.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span className="truncate"><span className="text-amber-brand">{it.qty}×</span> {it.name}{it.variant ? ` · ${it.variant}` : ""}</span>
                <span className="tabular-nums text-muted-foreground">{formatRs(it.qty * it.unitPrice)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-3 text-sm">
            <span className="font-bold">Total</span>
            <span className="font-black text-amber-brand tabular-nums">{formatRs(Number(order.total))}</span>
          </div>
          <div className="mt-4 rounded-xl border border-border bg-surface/60 p-3 text-xs">
            <div className="font-semibold">{order.customer_name}</div>
            <div className="text-muted-foreground">{order.phone}</div>
            <div className="mt-1 text-muted-foreground">{order.address}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
