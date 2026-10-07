import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import heroSpread from "@/assets/hero-spread.jpg";

const WA_NUMBER = "923131342361";

export function Hero() {
  const whatsappHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    "Hi! I'd like to order from D-Pizza Food.",
  )}`;

  return (
    <section className="relative isolate overflow-hidden pb-12 pt-20 sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
      <motion.img
        src={heroSpread}
        alt=""
        aria-hidden
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-background/55 via-background/85 to-background" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-radial-amber opacity-80" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <motion.div
        aria-hidden
        animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute right-[8%] top-32 -z-10 h-32 w-32 rounded-full bg-amber-brand/10 blur-2xl sm:h-44 sm:w-44"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute -top-20 left-1/2 -z-10 h-[360px] w-[92vw] max-w-[820px] sm:-top-32 sm:h-[480px] sm:w-[820px] -translate-x-1/2 rounded-full bg-amber-brand/15 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.55 }}
            whileHover={{ y: -1, scale: 1.02 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur sm:text-[11px]">
            <Sparkles className="h-3.5 w-3.5 text-amber-brand" />
            Freshly fired · Charcoal BBQ · Served hot
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-balance text-[clamp(3rem,15vw,5rem)] font-black leading-[0.9] tracking-[-0.04em] sm:text-7xl md:text-8xl lg:text-8xl"
          >
            <motion.span
              className="block text-foreground"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              D-PIZZA
            </motion.span>
            <motion.span
              className="block text-amber-brand"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              CORNER
            </motion.span>
            <motion.span
              className="mt-4 block text-xl font-semibold tracking-[0.45em] text-muted-foreground sm:text-2xl md:text-3xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
            >
              DADU
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
          >
            Pizza, zingers, broast, charcoal BBQ, rolls, pasta and loaded deals —
            made fresh and ready for Dadu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <motion.a
              href="#menu"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-brand px-6 py-3 text-sm font-black text-primary-foreground shadow-xl shadow-amber-brand/20 transition-shadow hover:shadow-2xl hover:shadow-amber-brand/25"
            >
              Explore Menu
              <ArrowRight className="h-4 w-4" />
            </motion.a>
            <motion.a
              href="#deals"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background/50 px-6 py-3 text-sm font-bold text-foreground backdrop-blur transition-colors hover:border-amber-brand/50 hover:text-amber-brand"
            >
              View Deals
            </motion.a>
            <motion.a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden min-h-12 items-center justify-center rounded-full border border-border/70 px-6 py-3 text-sm font-bold text-muted-foreground transition-colors hover:border-amber-brand/50 hover:text-amber-brand sm:inline-flex"
            >
              Order on WhatsApp
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.58, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80 sm:text-xs"
          >
            <span>Dadu</span>
            <span aria-hidden>•</span>
            <span>Freshly prepared</span>
            <span aria-hidden>•</span>
            <span>Easy ordering</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
