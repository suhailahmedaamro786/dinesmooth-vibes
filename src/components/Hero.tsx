import { motion } from "motion/react";
import { Train, Sparkles } from "lucide-react";
import { SPECIAL_TRAIN_PIZZA_PRICE } from "@/data/menu";
import { formatRs } from "@/lib/format";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-amber" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-60" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-32 left-1/2 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-amber-brand/15 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-amber-brand" />
            Freshly fired · Hand-tossed · Served hot
          </span>

          <h1 className="mt-6 text-balance text-5xl font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl">
            <span className="text-foreground">DADU FOOD</span>{" "}
            <span className="text-amber-brand">CORNER</span>
            <span className="block mt-3 text-2xl font-semibold tracking-[0.4em] text-muted-foreground sm:text-3xl">
              — DFC —
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            THE TASTE HUB. Zingers, broasts, hand-stretched pizzas and rolls crafted
            with obsessive love for flavour.
          </motion.p>
        </motion.div>

        {/* Special highlight banner */}
        <motion.a
          href="#menu"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.99 }}
          className="mx-auto mt-12 flex max-w-3xl items-center gap-4 rounded-2xl border border-amber-brand/60 bg-gradient-to-r from-amber-brand/10 via-amber-brand/5 to-transparent p-4 sm:p-5 glow-amber"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-brand text-primary-foreground">
            <Train className="h-6 w-6" strokeWidth={2.5} />
          </span>
          <div className="flex-1 text-left">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-brand">
              Limited Service Special
            </div>
            <div className="text-base font-semibold sm:text-lg">
              Special Train Pizza{" "}
              <span className="text-muted-foreground font-normal">(For Service)</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Only</div>
            <div className="text-2xl font-black text-amber-brand">
              {formatRs(SPECIAL_TRAIN_PIZZA_PRICE)}
            </div>
          </div>
        </motion.a>
      </div>
    </section>
  );
}
