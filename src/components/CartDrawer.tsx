import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { X, Minus, Plus, Trash2, Loader2, CheckCircle2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useOrdersStore, type Order } from "@/store/useOrdersStore";
import { formatRs } from "@/lib/format";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const inc = useCartStore((s) => s.increment);
  const dec = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());

  const addOrder = useOrdersStore((s) => s.addOrder);

  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });

  const close = () => {
    closeCart();
    setTimeout(() => {
      setShowCheckout(false);
      setSuccess(null);
    }, 250);
  };

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return;
    setSubmitting(true);

    const order: Order = {
      id: `DFC-${Date.now().toString(36).toUpperCase()}`,
      createdAt: Date.now(),
      status: "Pending",
      customer: { ...form },
      items: lines,
      total: subtotal,
    };

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
    } catch {
      /* offline fallback — still record locally */
    }

    addOrder(order);
    setSubmitting(false);
    setSuccess(order);
    clear();
    setForm({ name: "", phone: "", address: "", notes: "" });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
                  Your order
                </div>
                <h3 className="text-lg font-bold">
                  {success ? "Order confirmed" : showCheckout ? "Checkout" : "Cart"}
                </h3>
              </div>
              <button
                onClick={close}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-amber-brand/60"
                aria-label="Close"
              >
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
                      <motion.li
                        key={l.key}
                        layout
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="flex items-start gap-3 px-5 py-4"
                      >
                        <div className="flex-1">
                          <div className="font-semibold leading-tight">{l.name}</div>
                          {l.variant && (
                            <div className="mt-0.5 text-xs text-muted-foreground">{l.variant}</div>
                          )}
                          <div className="mt-1 text-xs text-muted-foreground">
                            {formatRs(l.unitPrice)} each
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <div className="inline-flex items-center rounded-full border border-border">
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => dec(l.key)}
                                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </motion.button>
                              <span className="w-7 text-center text-sm font-bold tabular-nums">
                                {l.qty}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => inc(l.key)}
                                className="grid h-8 w-8 place-items-center text-amber-brand"
                                aria-label="Increase"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </motion.button>
                            </div>
                            <button
                              onClick={() => remove(l.key)}
                              className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-destructive"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-right font-black text-amber-brand tabular-nums">
                          {formatRs(l.qty * l.unitPrice)}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}

              {showCheckout && lines.length > 0 && !success && (
                <motion.form
                  onSubmit={placeOrder}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-3 border-t border-border px-5 py-5"
                >
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Mobile number" type="tel" inputMode="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                  <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required textarea />
                  <Field label="Cooking / delivery notes (optional)" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} textarea />
                </motion.form>
              )}
            </div>

            {!success && lines.length > 0 && (
              <footer className="border-t border-border bg-surface/60 px-5 py-4 backdrop-blur">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-black text-amber-brand tabular-nums">
                    {formatRs(subtotal)}
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  disabled={submitting}
                  onClick={(e) => {
                    if (!showCheckout) {
                      setShowCheckout(true);
                    } else {
                      placeOrder(e as unknown as React.FormEvent);
                    }
                  }}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-brand px-5 py-3.5 text-sm font-bold text-primary-foreground glow-amber disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Placing order...
                    </>
                  ) : showCheckout ? (
                    <>Place order · {formatRs(subtotal)}</>
                  ) : (
                    <>Checkout</>
                  )}
                </motion.button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label, value, onChange, type = "text", required, textarea, inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const base =
    "w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 outline-none transition focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/30";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          rows={2}
          className={base}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          type={type}
          inputMode={inputMode}
          className={base}
        />
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

function SuccessView({ order, onDone }: { order: Order; onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center px-6 py-16 text-center"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="grid h-24 w-24 place-items-center rounded-full bg-amber-brand text-primary-foreground glow-amber-strong"
      >
        <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
      </motion.div>
      <h3 className="mt-6 text-2xl font-black">Order Placed Successfully 🎉</h3>
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
          <span className="max-w-[60%] truncate">{order.customer.address}</span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onDone}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-amber-brand/60"
      >
        Keep browsing
      </motion.button>
    </motion.div>
  );
}
