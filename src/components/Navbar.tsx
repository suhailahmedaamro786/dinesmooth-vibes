import { motion } from "motion/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingBag, Flame, User, LogOut, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const qty = useCartStore((s) => s.totalQty());
  const openCart = useCartStore((s) => s.openCart);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setMenuOpen(false);
    toast.success("Signed out");
    navigate({ to: "/" });
  };

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-md bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-brand text-primary-foreground font-black tracking-tight glow-amber">
            <Flame className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <div className="leading-none">
            <div className="text-sm font-black tracking-[0.18em] text-amber-brand">DFC</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              The Taste Hub
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="#menu" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Menu</a>
          <a href="#deals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Deals</a>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-amber-brand hover:opacity-80 transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-amber-brand/60"
                aria-label="Account menu"
              >
                <User className="h-4 w-4" />
              </button>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
                >
                  <div className="border-b border-border px-4 py-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Signed in</div>
                    <div className="truncate text-sm font-semibold">{user.email}</div>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate({ to: "/track/$orderId", params: { orderId: "latest" } }); }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-surface"
                  >
                    <Package className="h-4 w-4 text-amber-brand" /> Track orders
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-surface"
                  >
                    <LogOut className="h-4 w-4 text-destructive" /> Sign out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-amber-brand/60 sm:inline-flex"
            >
              <User className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-full bg-amber-brand px-4 py-2 text-sm font-semibold text-primary-foreground glow-amber"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-4 w-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Cart</span>
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
    </motion.header>
  );
}
