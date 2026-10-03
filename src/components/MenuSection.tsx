import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { burgers, rolls, broast, pizzas, deals, bbq, platters, pastaItems, sandwiches, type PizzaSize, type PizzaItem, type SimpleItem, type DealItem, type Category } from "@/data/menu";
import { useCartStore } from "@/store/useCartStore";
import { formatRs } from "@/lib/format";
import { StarRating } from "@/components/StarRating";
import { useReviewSummaries } from "@/hooks/useReviewSummaries";
import type { ReviewSummary } from "@/lib/reviews";
import { ItemDetailDialog, type DetailItem } from "@/components/ItemDetailDialog";

type Tab = Category;
const TABS: Tab[] = ["Burgers", "Rolls", "Pizzas", "BBQ", "Broast", "Platters", "Pasta", "Sandwiches", "Deals"];

type OpenDetail = (d: DetailItem) => void;

function RatingBadge({ summary }: { summary?: ReviewSummary }) {
  if (!summary || summary.review_count === 0) {
    return <span className="text-[11px] text-muted-foreground">No reviews yet</span>;
  }
  return (
    <div className="flex items-center gap-1.5">
      <StarRating value={summary.avg_rating} size={12} />
      <span className="text-[11px] font-bold text-foreground tabular-nums">
        {summary.avg_rating.toFixed(1)}
      </span>
      <span className="text-[11px] text-muted-foreground">({summary.review_count})</span>
    </div>
  );
}

export function MenuSection() {
  const [tab, setTab] = useState<Tab>("Burgers");
  const { map: summaries } = useReviewSummaries();
  const [detail, setDetail] = useState<DetailItem | null>(null);
  const openDetail: OpenDetail = (d) => setDetail(d);

  return (
    <section id="menu" className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-brand">
            The Menu
          </div>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Pick your craving.
          </h2>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Tap any item to see details. Hit <span className="font-bold text-amber-brand">Add</span> to drop it in your cart.
        </p>
      </motion.div>

      <div
        id="deals"
        aria-label="Menu categories"
        className="mt-10 rounded-2xl border border-border bg-surface/60 p-1.5 backdrop-blur"
      >
        <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-1 sm:overflow-x-auto sm:scrollbar-none">
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative min-w-0 rounded-full px-2 py-3 text-xs font-semibold transition-colors sm:shrink-0 sm:px-5 sm:py-2.5 sm:text-sm ${
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
                <span className="relative z-10">{t}</span>
              </button>
            );
          })}
        </div>
        <div className="px-3 pb-1 pt-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:hidden">
          All menu categories
        </div>
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
          {tab === "Burgers" && <SimpleGrid items={burgers} summaries={summaries} openDetail={openDetail} />}
          {tab === "Rolls" && <SimpleGrid items={rolls} summaries={summaries} openDetail={openDetail} />}
          {tab === "Broast" && <SimpleGrid items={broast} summaries={summaries} openDetail={openDetail} />}
          {tab === "BBQ" && <SimpleGrid items={bbq} summaries={summaries} openDetail={openDetail} />}
          {tab === "Platters" && <SimpleGrid items={platters} summaries={summaries} openDetail={openDetail} />}
          {tab === "Pasta" && <SimpleGrid items={pastaItems} summaries={summaries} openDetail={openDetail} />}
          {tab === "Sandwiches" && <SimpleGrid items={sandwiches} summaries={summaries} openDetail={openDetail} />}
          {tab === "Pizzas" && <PizzaGrid items={pizzas} summaries={summaries} openDetail={openDetail} />}
          {tab === "Deals" && <DealsGrid items={deals} summaries={summaries} openDetail={openDetail} />}
        </motion.div>
      </AnimatePresence>

      <ItemDetailDialog
        detail={detail}
        open={!!detail}
        onOpenChange={(o) => !o && setDetail(null)}
        summary={detail ? summaries.get(detail.item.id) : undefined}
      />
    </section>
  );
}

function SimpleGrid({ items, summaries, openDetail }: { items: SimpleItem[]; summaries: Map<string, ReviewSummary>; openDetail: OpenDetail }) {
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
          <button
            type="button"
            onClick={() => openDetail({ kind: "simple", item: it })}
            className="relative aspect-[5/4] w-full overflow-hidden bg-surface text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand"
            aria-label={`View details for ${it.name}`}
          >
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
          </button>

          <div className="flex flex-1 flex-col p-5">
            <button
              type="button"
              onClick={() => openDetail({ kind: "simple", item: it })}
              className="text-left text-lg font-bold leading-tight hover:text-amber-brand"
            >
              {it.name}
            </button>
            <div className="mt-1.5"><RatingBadge summary={summaries.get(it.id)} /></div>
            {it.description && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{it.description}</p>
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

function PizzaGrid({ items, summaries, openDetail }: { items: PizzaItem[]; summaries: Map<string, ReviewSummary>; openDetail: OpenDetail }) {
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
          <PizzaCard pizza={p} summary={summaries.get(p.id)} openDetail={openDetail} />
        </motion.div>
      ))}
    </div>
  );
}

function PizzaCard({ pizza, summary, openDetail }: { pizza: PizzaItem; summary?: ReviewSummary; openDetail: OpenDetail }) {
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
        <button
          type="button"
          onClick={() => openDetail({ kind: "pizza", item: pizza })}
          className="relative aspect-square w-full shrink-0 overflow-hidden sm:w-44 md:w-52 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand"
          aria-label={`View details for ${pizza.name}`}
        >
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
        </button>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <button
                type="button"
                onClick={() => openDetail({ kind: "pizza", item: pizza })}
                className="text-left text-lg font-bold leading-tight hover:text-amber-brand"
              >
                {pizza.name}
              </button>
              <div className="mt-1"><RatingBadge summary={summary} /></div>
              {pizza.description && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{pizza.description}</p>
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

function DealsGrid({ items, summaries, openDetail }: { items: DealItem[]; summaries: Map<string, ReviewSummary>; openDetail: OpenDetail }) {
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
          <button
            type="button"
            onClick={() => openDetail({ kind: "deal", item: d })}
            className="relative aspect-[16/9] w-full overflow-hidden bg-surface text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-brand"
            aria-label={`View details for ${d.name}`}
          >
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
          </button>

          <div className={`relative -mt-6 p-6 ${d.highlight ? "bg-gradient-to-br from-amber-brand/10 via-card to-card" : "bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
                  Bundle Deal
                </div>
                <button type="button" onClick={() => openDetail({ kind: "deal", item: d })} className="mt-1 block text-left text-2xl font-black tracking-tight hover:text-amber-brand">{d.name}</button>
                <div className="mt-1"><RatingBadge summary={summaries.get(d.id)} /></div>
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
