import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatRs } from "@/lib/format";
import { toast } from "sonner";
import { estimateDelivery, formatEstimate } from "@/lib/deliveryEstimate";
import { burgers, rolls, broast, pizzas, deals, bbq, platters, pastaItems, sandwiches } from "@/data/menu";

const menuItems = [...burgers, ...rolls, ...broast, ...pizzas, ...deals, ...bbq, ...platters, ...pastaItems, ...sandwiches];
const imageById = new Map(menuItems.map((item) => [item.id, item.image]));

const WA_NUMBER = "923131342361";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const inc = useCartStore((s) => s.increment);
  const dec = useCartStore((s) => s.decrement);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());

  const [showCheckout, setShowCheckout] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const eta = useMemo(() => estimateDelivery(form.address), [form.address]);

  const reset = () => {
    closeCart();
    window.setTimeout(() => {
      setShowCheckout(false);
      setSent(false);
      setForm({ name: "", phone: "", address: "" });
    }, 200);
  };

  const buildWhatsAppMessage = () => {
    const orderId = `DPF-${Date.now().toString(36).toUpperCase()}`;
    const items = lines
      .map((line) => {
        const variant = line.variant ? ` (${line.variant})` : "";
        return `• ${line.qty}× ${line.name}${variant} — ${formatRs(line.qty * line.unitPrice)}`;
      })
      .join("\\n");

    return [
      "*🍕 D-Pizza — NEW ORDER*",
      `*Order ID:* ${orderId}`,
      "",
      "*ORDER DETAILS*",
      items,
      "",
      `*Total:* ${formatRs(subtotal)}`,
      "",
      "*CUSTOMER DETAILS*",
      `*Full name:* ${form.name.trim()}`,
      `*Mobile:* ${form.phone.trim()}`,
      `*Delivery address:* ${form.address.trim()}`,
      "",
      "Please confirm this order on WhatsApp. Thank you! 🙌",
    ].join("\\n");
  };

  const sendOrder = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      toast.error("Please fill your full name, mobile number and delivery address.");
      return;
    }

    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    clear();
    toast.success("Order details are ready in WhatsApp.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={reset}
            className="fixed inset-0 z-[60] bg-background/70 backdrop-blur-sm"
          />
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
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">Your order</div>
                <h3 className="text-lg font-bold">{sent ? "WhatsApp order ready" : showCheckout ? "Delivery details" : "Cart"}</h3>
              </div>
              <button onClick={reset} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:border-amber-brand/60 hover:text-foreground" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto">
              {sent ? (
                <SuccessView onDone={reset} />
              ) : lines.length === 0 ? (
                <EmptyView />
              ) : (
                <>
                  <ul className="divide-y divide-border">
                    <AnimatePresence initial={false}>
                      {lines.map((line) => (
                        <motion.li
                          key={line.key}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 40, height: 0, paddingTop: 0, paddingBottom: 0 }}
                          className="flex items-start gap-3 px-5 py-4"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                            {line.itemId ? <CartItemImage itemId={line.itemId} /> : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold leading-tight">{line.name}</div>
                            {line.variant && <div className="mt-0.5 text-xs text-muted-foreground">{line.variant}</div>}
                            <div className="mt-1 text-xs text-muted-foreground">{formatRs(line.unitPrice)} each</div>
                            <div className="mt-3 flex items-center gap-2">
                              <div className="inline-flex items-center rounded-full border border-border">
                                <button onClick={() => dec(line.key)} className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground" aria-label="Decrease">
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-7 text-center text-sm font-bold tabular-nums">{line.qty}</span>
                                <button onClick={() => inc(line.key)} className="grid h-8 w-8 place-items-center text-amber-brand" aria-label="Increase">
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <button onClick={() => remove(line.key)} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:text-destructive" aria-label="Remove">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right font-black text-amber-brand tabular-nums">{formatRs(line.qty * line.unitPrice)}</div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  {showCheckout && (
                    <motion.form
                      onSubmit={(e) => { e.preventDefault(); sendOrder(); }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 border-t border-border px-5 py-5"
                    >
                      <div className="rounded-2xl border border-amber-brand/30 bg-amber-brand/5 p-4">
                        <div className="text-sm font-bold">Almost done 🍕</div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Enter only your delivery details. We will open WhatsApp with your complete order automatically.
                        </p>
                      </div>

                      <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="Your full name" />
                      <Field label="Mobile number" type="tel" inputMode="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required placeholder="03XX XXXXXXX" />
                      <Field label="Delivery address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required textarea placeholder="House #, street, area, Dadu" />

                      {eta && form.address.trim().length >= 3 && (
                        <div className="flex items-center gap-3 rounded-xl border border-amber-brand/30 bg-amber-brand/5 px-3 py-2.5 text-xs">
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-amber-brand/20 text-amber-brand">
                            <Clock className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-amber-brand">Estimated delivery</div>
                            <div className="font-semibold">{formatEstimate(eta)} · {eta.area}</div>
                          </div>
                        </div>
                      )}
                    </motion.form>
                  )}
                </>
              )}
            </div>

            {!sent && lines.length > 0 && (
              <footer className="space-y-3 border-t border-border bg-surface/60 px-5 py-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Order total</span>
                  <span className="text-xl font-black text-amber-brand tabular-nums">{formatRs(subtotal)}</span>
                </div>

                {!showCheckout ? (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCheckout(true)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-brand px-5 py-3 text-sm font-bold text-primary-foreground glow-amber"
                  >
                    Continue to delivery
                  </motion.button>
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={sendOrder}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Order on WhatsApp
                  </motion.button>
                )}
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItemImage({ itemId }: { itemId: string }) {
  return null;
}

function Field({
  label, value, onChange, type = "text", required, textarea, inputMode, placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
}) {
  const base = "w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 outline-none transition focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/30";
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} required={required} rows={3} placeholder={placeholder} className={base} />
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

function SuccessView({ onDone }: { onDone: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        className="grid h-20 w-20 place-items-center rounded-full bg-[#25D366] text-white"
      >
        <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} />
      </motion.div>
      <h3 className="mt-5 text-2xl font-black">WhatsApp opened 🎉</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Your order details are ready. Just press <b className="text-foreground">Send</b> in WhatsApp to confirm the order with the restaurant.
      </p>
      <button onClick={onDone} className="mt-6 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground">
        Keep browsing
      </button>
    </motion.div>
  );
}
