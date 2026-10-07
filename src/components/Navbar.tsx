import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const qty = useCartStore((s) => s.totalQty());
  const openCart = useCartStore((s) => s.openCart);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/80 shadow-lg shadow-black/5 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center justify-between gap-2 py-2.5 sm:gap-3 sm:py-3">
          <motion.div whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
            <Link to="/" className="group flex min-w-0 shrink-0 items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-brand text-primary-foreground shadow-lg shadow-amber-brand/20">
                <Flame className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="leading-none">
                <div className="truncate text-xs font-black tracking-[0.16em] text-amber-brand sm:text-sm sm:tracking-[0.18em]">
                  D-Pizza
                </div>
                <div className="hidden pt-1 text-[9px] uppercase tracking-[0.24em] text-muted-foreground sm:block">
                  D-Pizza Food
                </div>
              </div>
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {isAdmin && (
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.16 }}>
                <Link
                  to="/admin"
                  className="rounded-full px-2 py-1.5 text-sm font-medium text-amber-brand transition-opacity hover:opacity-80"
                >
                  Admin
                </Link>
              </motion.div>
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={openCart}
              className="relative inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-amber-brand px-3 py-2 text-xs font-bold text-primary-foreground shadow-lg shadow-amber-brand/20 sm:gap-2 sm:px-4 sm:text-sm"
              aria-label="Open cart"
            >
              <span>Cart</span>
              {qty > 0 && (
                <motion.span
                  key={qty}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-background px-1 text-[11px] font-bold text-amber-brand ring-2 ring-amber-brand"
                >
                  {qty}
                </motion.span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
