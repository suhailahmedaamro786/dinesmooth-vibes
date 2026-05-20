import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { burgers, rolls, broast, pizzas, deals, type PizzaSize, type PizzaItem, type SimpleItem, type DealItem } from "@/data/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatRs } from "@/lib/format";

type Tab = "Burgers" | "Rolls" | "Pizzas" | "Broast" | "Deals";
const TABS: Tab[] = ["Burgers", "Rolls", "Pizzas", "Broast", "Deals"];

export function MenuSection() {
  const [tab, setTab] = useState<Tab>("Burgers");

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-brand">
            The Menu
          </div>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Pick your craving.
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Every item is made-to-order. Tap to add — your cart updates in real time.
        </p>
      </div>

      <div id="deals" className="mt-10 flex gap-1 overflow-x-auto rounded-full border border-border bg-surface/60 p-1 backdrop-blur scrollbar-none">
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="menu-tab-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-amber-brand"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              {t}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          {tab === "Burgers" && <SimpleGrid items={burgers} />}
          {tab === "Rolls" && <SimpleGrid items={rolls} />}
          {tab === "Broast" && <SimpleGrid items={broast} />}
          {tab === "Pizzas" && <PizzaGrid items={pizzas} />}
          {tab === "Deals" && <DealsGrid items={deals} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function SimpleGrid({ items }: { items: SimpleItem[] }) {
  const addLine = useCartStore((s) => s.addLine);
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, idx) => (
        <motion.article
          key={it.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: idx * 0.04 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-amber-brand/50"
        >
          <div className="relative aspect-[5/4] overflow-hidden bg-surface">
            <motion.img
              src={it.image}
              alt={it.name}
              loading="lazy"
              width={768}
              height={768}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <span className="absolute right-3 top-3 rounded-full bg-background/85 px-2.5 py-1 text-xs font-black text-amber-brand backdrop-blur">
              {formatRs(it.price)}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="text-lg font-bold leading-tight">{it.name}</h3>
            {it.description && (
              <p className="mt-1.5 text-sm text-muted-foreground">{it.description}</p>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                addLine({ key: it.id, itemId: it.id, name: it.name, unitPrice: it.price })
              }
              className="mt-4 inline-flex items-center justify-center gap-1.5 self-start rounded-full bg-amber-brand px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} /> Add to cart
            </motion.button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function PizzaGrid({ items }: { items: PizzaItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((p, idx) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: idx * 0.04 }}
        >
          <PizzaCard pizza={p} />
        </motion.div>
      ))}
    </div>
  );
}

function PizzaCard({ pizza }: { pizza: PizzaItem }) {
  const [size, setSize] = useState<PizzaSize>("M");
  const addLine = useCartStore((s) => s.addLine);
  const price = pizza.prices[size];
  const sizes = useMemo(() => Object.keys(pizza.prices) as PizzaSize[], [pizza.prices]);

  return (
    <motion.article
      whileHover={{ scale: 1.015, y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-amber-brand/50"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden sm:w-44 md:w-52">
          <motion.img
            src={pizza.image}
            alt={pizza.name}
            loading="lazy"
            width={768}
            height={768}
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.08, rotate: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent sm:bg-gradient-to-r" />
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold leading-tight">{pizza.name}</h3>
              {pizza.description && (
                <p className="mt-1 text-sm text-muted-foreground">{pizza.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{sizeLabel(size)}</div>
              <AnimatedPrice value={price} />
            </div>
          </div>

          <div className="mt-auto pt-4 flex flex-wrap items-center gap-2">
            <div className="relative flex rounded-full border border-border bg-surface/60 p-1">
              {sizes.map((s) => {
                const active = s === size;
                return (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`relative rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                      active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId={`pizza-size-${pizza.id}`}
                        className="absolute inset-0 -z-10 rounded-full bg-amber-brand"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    {s}
                  </button>
                );
              })}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              onClick={() =>
                addLine({
                  key: `${pizza.id}-${size}`,
                  itemId: pizza.id,
                  name: pizza.name,
                  variant: sizeLabel(size),
                  unitPrice: price,
                })
              }
              className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-amber-brand px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={3} /> Add
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function sizeLabel(s: PizzaSize) {
  return s === "S" ? "Small" : s === "M" ? "Medium" : s === "L" ? "Large" : "X-Large";
}

function AnimatedPrice({ value }: { value: number }) {
  return (
    <div className="relative h-8 overflow-hidden text-right">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={value}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="text-xl font-black text-amber-brand"
        >
          {formatRs(value)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function DealsGrid({ items }: { items: DealItem[] }) {
  const addLine = useCartStore((s) => s.addLine);
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((d, idx) => (
        <motion.article
          key={d.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
          whileHover={{ scale: 1.015, y: -3 }}
          className={`group relative overflow-hidden rounded-2xl border-2 ${
            d.highlight
              ? "border-amber-brand glow-amber-strong"
              : "border-amber-brand/40 hover:border-amber-brand"
          }`}
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-surface">
            <motion.img
              src={d.image}
              alt={d.name}
              loading="lazy"
              width={1024}
              height={768}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            {d.highlight && (
              <span className="absolute left-3 top-3 rounded-full bg-amber-brand px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary-foreground">
                Best value
              </span>
            )}
          </div>

          <div className={`relative -mt-6 p-6 ${d.highlight ? "bg-gradient-to-br from-amber-brand/10 via-card to-card" : "bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
                  Bundle Deal
                </div>
                <h3 className="mt-1 text-2xl font-black tracking-tight">{d.name}</h3>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Only</div>
                <div className="text-3xl font-black text-amber-brand">{formatRs(d.price)}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.description}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={() =>
                addLine({
                  key: d.id,
                  itemId: d.id,
                  name: `${d.name} (Deal)`,
                  unitPrice: d.price,
                })
              }
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-amber-brand px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              <Plus className="h-4 w-4" strokeWidth={3} /> Add deal
            </motion.button>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
