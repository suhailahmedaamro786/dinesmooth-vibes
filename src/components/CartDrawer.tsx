import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, CheckCircle2, ShoppingBag, Truck, Tag, Sparkles, MessageCircle, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCartStore } from "@/store/useCartStore";
import { formatRs } from "@/lib/format";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { estimateDelivery, formatEstimate } from "@/lib/deliveryEstimate";

type PaymentMethod = "cod" | "jazzcash" | "easypaisa";

const PAYMENT_NUMBER = "0314 5327444";
const WA_NUMBER = "923145327444";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  jazzcash: "JazzCash",
  easypaisa: "EasyPaisa",
};

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const inc = useCartStore((s) => s.increment);
  const dec = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());
  const { user } = useAuth();

  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ id: string; total: number; address: string; payment: PaymentMethod; etaText: string | null; waUrl: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "", txid: "" });
  const [payment, setPayment] = useState<PaymentMethod>("cod");

  // Promo
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);

  // Loyalty
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [redeemPoints, setRedeemPoints] = useState(0);

  useEffect(() => {
    if (!user) { setLoyaltyBalance(0); return; }
    supabase.from("profiles").select("loyalty_points").eq("id", user.id).maybeSingle()
      .then(({ data }) => setLoyaltyBalance(data?.loyalty_points ?? 0));
  }, [user, isOpen]);

  const close = () => {
    closeCart();
    setTimeout(() => {
      setShowCheckout(false);
      setSuccess(null);
      setPromo(null);
      setPromoInput("");
      setRedeemPoints(0);
    }, 250);
  };

  const loyaltyDiscount = Math.floor(redeemPoints / 10); // 100 pts = Rs 10 → 10pts = Rs 1
  const total = Math.max(0, subtotal - (promo?.discount ?? 0) - loyaltyDiscount);

  const applyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    setPromoChecking(true);
    const { data, error } = await supabase.rpc("validate_promo_code", { p_code: code });
    setPromoChecking(false);

    const row = Array.isArray(data) ? data[0] : null;
    if (error || !row) { toast.error("Invalid or expired promo code"); return; }
    const disc = row.discount_type === "percent"
      ? Math.round((subtotal * Number(row.discount_value)) / 100)
      : Number(row.discount_value);
    setPromo({ code: row.code, discount: Math.min(disc, subtotal) });
    toast.success(`Promo "${row.code}" applied — saved ${formatRs(disc)}`);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill name, phone and address"); return;
    }
    if (payment !== "cod" && !form.txid.trim()) {
      toast.error("Please enter the transaction ID from JazzCash/EasyPaisa"); return;
    }
    setSubmitting(true);

    const orderId = `DFC-${Date.now().toString(36).toUpperCase()}`;
    const pointsEarned = user ? Math.floor(total / 10) : 0; // Rs100 = 10 pts

    const { error } = await supabase.from("orders").insert({
      id: orderId,
      user_id: user?.id ?? null,
      customer_name: form.name,
      phone: form.phone,
      address: form.address,
      notes: form.notes || null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: lines as any,
      total,
      status: "received",
      payment_method: payment,
      transaction_id: form.txid || null,
      promo_code: promo?.code ?? null,
      discount: (promo?.discount ?? 0) + loyaltyDiscount,
      points_redeemed: redeemPoints,
      points_earned: pointsEarned,
    });

    if (error) { setSubmitting(false); toast.error(`Could not place order: ${error.message}`); return; }

    // Loyalty bookkeeping via SECURITY DEFINER RPC (validates ownership server-side)
    if (user && (redeemPoints > 0 || pointsEarned > 0)) {
      await supabase.rpc("award_loyalty_points", {
        p_order_id: orderId,
        p_earned: pointsEarned,
        p_redeemed: redeemPoints,
      });
    }

    setSubmitting(false);
    toast.success(`Order ${orderId} placed!`);
    const finalWa = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWA({ orderId }))}`;
    setSuccess({
      id: orderId, total, address: form.address,
      payment, etaText: eta ? `${formatEstimate(eta)} (${eta.area})` : null,
      waUrl: finalWa,
    });
    clear();
    setForm({ name: "", phone: "", address: "", notes: "", txid: "" });
  };

  const eta = useMemo(() => estimateDelivery(form.address), [form.address]);

  const buildWA = (opts?: { orderId?: string }) => {
    const items = lines.map((l) => `• ${l.qty}× ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${formatRs(l.qty * l.unitPrice)}`).join("\n");
    const lineBreaks: string[] = [
      "*DFC — Dadu Food Corner Order*",
      ...(opts?.orderId ? [`*Order ID:* ${opts.orderId}`] : []),
      "",
      "*Items:*",
      items,
      "",
      `*Subtotal:* ${formatRs(subtotal)}`,
      ...(promo ? [`Promo (${promo.code}): -${formatRs(promo.discount)}`] : []),
      ...(loyaltyDiscount ? [`Loyalty: -${formatRs(loyaltyDiscount)}`] : []),
      `*Total:* ${formatRs(total)}`,
      `*Payment:* ${PAYMENT_LABEL[payment]}${form.txid ? ` (TxID: ${form.txid})` : ""}`,
      "",
      `*Name:* ${form.name}`,
      `*Phone:* ${form.phone}`,
      `*Address:* ${form.address}`,
      ...(eta ? [`*Estimated delivery:* ${formatEstimate(eta)} (${eta.area})`] : []),
      ...(form.notes ? [`*Notes:* ${form.notes}`] : []),
    ];
    return lineBreaks.join("\n");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} onClick={close} className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm" />
          <motion.aside key="drawer" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }} className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">Your order</div>
                <h3 className="text-lg font-bold">{success ? "Order confirmed" : showCheckout ? "Checkout" : "Cart"}</h3>
              </div>
              <button onClick={close} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-amber-brand/60" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {success ? (
                <SuccessView order={success} onDone={close} />
              ) : lines.length === 0 ? (
                <EmptyView />
              ) : (
                <ul className="divide-y divide-border">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.key} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }} transition={{ type: "spring", stiffness: 320, damping: 28 }} className="flex items-start gap-3 px-5 py-4">
                        <div className="flex-1">
                          <div className="font-semibold leading-tight">{l.name}</div>
                          {l.variant && <div className="mt-0.5 text-xs text-muted-foreground">{l.variant}</div>}
                          <div className="mt-1 text-xs text-muted-foreground">{formatRs(l.unitPrice)} each</div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="inline-flex items-center rounded-full border border-border">
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => dec(l.key)} className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></motion.button>
                              <span className="w-7 text-center text-sm font-bold tabular-nums">{l.qty}</span>
                              <motion.button whileTap={{ scale: 0.9 }} onClick={() => inc(l.key)} className="grid h-8 w-8 place-items-center text-amber-brand" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></motion.button>
                            </div>
                            <button onClick={() => remove(l.key)} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-destructive" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                        <div className="text-right font-black text-amber-brand tabular-nums">{formatRs(l.qty * l.unitPrice)}</div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {showCheckout && lines.length > 0 && !success && (
                <motion.form onSubmit={placeOrder} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-4 border-t border-border px-5 py-5">
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Mobile number" type="tel" inputMode="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                  <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required textarea placeholder="House #, street, area (e.g. Shahjahan Park, Dadu)" />

                  {/* Delivery time estimator */}
                  {eta && form.address.trim().length >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 rounded-xl border border-amber-brand/30 bg-amber-brand/5 px-3 py-2.5 text-xs"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-brand/20 text-amber-brand">
                        <Clock className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-amber-brand">Estimated delivery</div>
                        <div className="font-semibold text-foreground">{formatEstimate(eta)} · {eta.area}</div>
                      </div>
                    </motion.div>
                  )}

                  <Field label="Cooking / delivery notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />

                  {/* Promo */}
                  <div>
                    <span className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <Tag className="h-3 w-3" /> Promo code
                    </span>
                    {promo ? (
                      <div className="flex items-center justify-between rounded-xl border border-amber-brand/40 bg-amber-brand/10 px-3 py-2 text-sm">
                        <span className="font-bold text-amber-brand">{promo.code}</span>
                        <button type="button" onClick={() => { setPromo(null); setPromoInput(""); }} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input value={promoInput} onChange={(e) => setPromoInput(e.target.value)} placeholder="e.g. DFC10" className="flex-1 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm uppercase outline-none focus:border-amber-brand" />
                        <button type="button" onClick={applyPromo} disabled={promoChecking} className="rounded-xl bg-amber-brand px-4 text-xs font-bold text-primary-foreground disabled:opacity-60">
                          {promoChecking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Apply"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Loyalty */}
                  {user && loyaltyBalance >= 100 && (
                    <div className="rounded-xl border border-border bg-surface/40 p-3">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                          <Sparkles className="h-3.5 w-3.5 text-amber-brand" /> Redeem points
                        </span>
                        <span className="text-[11px] text-muted-foreground">Balance: <b className="text-foreground">{loyaltyBalance}</b></span>
                      </div>
                      <input
                        type="range" min={0} max={Math.min(loyaltyBalance, subtotal * 10)} step={100}
                        value={redeemPoints}
                        onChange={(e) => setRedeemPoints(Number(e.target.value))}
                        className="mt-2 w-full accent-amber-brand"
                      />
                      <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                        <span>Using {redeemPoints} pts</span>
                        <span className="text-amber-brand">-{formatRs(loyaltyDiscount)}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment method */}
                  <div>
                    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payment method</span>
                    <div className="grid grid-cols-3 gap-2">
                      {(["cod","jazzcash","easypaisa"] as PaymentMethod[]).map((m) => (
                        <button key={m} type="button" onClick={() => setPayment(m)}
                          className={`rounded-xl border px-2 py-2 text-[11px] font-bold uppercase tracking-wider transition ${payment === m ? "border-amber-brand bg-amber-brand/10 text-amber-brand" : "border-border text-muted-foreground hover:text-foreground"}`}>
                          {m === "cod" ? "Cash" : m === "jazzcash" ? "JazzCash" : "EasyPaisa"}
                        </button>
                      ))}
                    </div>
                    {payment !== "cod" && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 space-y-2 rounded-xl border border-amber-brand/30 bg-amber-brand/5 p-3 text-xs">
                        <div>
                          Send <b className="text-amber-brand">{formatRs(total)}</b> to {payment === "jazzcash" ? "JazzCash" : "EasyPaisa"} account:
                          <div className="mt-1 font-mono text-base font-bold text-foreground">{PAYMENT_NUMBER}</div>
                        </div>
                        <div className="text-muted-foreground">After paying, share the screenshot on WhatsApp and enter your TxID below.</div>
                        <Field label="Transaction ID (TxID)" value={form.txid} onChange={(v) => setForm({ ...form, txid: v })} required />
                      </motion.div>
                    )}
                  </div>
                </motion.form>
              )}
            </div>

            {!success && lines.length > 0 && (
              <footer className="space-y-2 border-t border-border bg-surface/60 px-5 py-4 backdrop-blur">
                <div className="space-y-1 text-sm">
                  <Row label="Subtotal" value={formatRs(subtotal)} />
                  {promo && <Row label={`Promo (${promo.code})`} value={`-${formatRs(promo.discount)}`} accent />}
                  {loyaltyDiscount > 0 && <Row label={`Loyalty (${redeemPoints} pts)`} value={`-${formatRs(loyaltyDiscount)}`} accent />}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-muted-foreground">Total</span>
                    <span className="text-xl font-black text-amber-brand tabular-nums">{formatRs(total)}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <motion.button
                    whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.01 }} disabled={submitting}
                    onClick={(e) => { if (!showCheckout) setShowCheckout(true); else placeOrder(e as unknown as React.FormEvent); }}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-brand px-5 py-3 text-sm font-bold text-primary-foreground glow-amber disabled:opacity-70"
                  >
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing...</> : showCheckout ? <>Place order · {formatRs(total)}</> : <>Checkout</>}
                  </motion.button>
                  {showCheckout && (
                    <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildWA())}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#25D366] px-4 py-3 text-xs font-bold text-white">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  )}
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${accent ? "text-amber-brand" : ""}`}>{value}</span>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", required, textarea, inputMode, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; textarea?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  const base = "w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 outline-none transition focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/30";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={2} placeholder={placeholder} className={base} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} required={required} type={type} inputMode={inputMode} placeholder={placeholder} className={base} />
      )}
    </label>
  );
}

function EmptyView() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-border text-amber-brand">
        <ShoppingBag className="h-7 w-7" />
      </div>
      <h4 className="mt-5 text-lg font-bold">Your cart is empty</h4>
      <p className="mt-1 text-sm text-muted-foreground">Add a zinger, broast or pizza to get started.</p>
    </div>
  );
}

function SuccessView({ order, onDone }: { order: { id: string; total: number; address: string }; onDone: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 280, damping: 18 }} className="grid h-24 w-24 place-items-center rounded-full bg-amber-brand text-primary-foreground glow-amber-strong">
        <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
      </motion.div>
      <h3 className="mt-6 text-2xl font-black">Order Placed 🎉</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Your order <span className="font-mono text-foreground">{order.id}</span> is being prepared.
      </p>
      <div className="mt-6 w-full rounded-2xl border border-border bg-surface/60 p-4 text-left">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-black text-amber-brand">{formatRs(order.total)}</span>
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>Delivering to</span>
          <span className="max-w-[60%] truncate">{order.address}</span>
        </div>
      </div>
      <Link to="/track/$orderId" params={{ orderId: order.id }} onClick={onDone} className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground glow-amber">
        <Truck className="h-4 w-4" /> Track order
      </Link>
      <button onClick={onDone} className="mt-3 text-xs text-muted-foreground hover:text-foreground">Keep browsing</button>
    </motion.div>
  );
}
