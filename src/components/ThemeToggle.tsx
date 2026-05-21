import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <motion.button
      whileTap={{ scale: 0.92, rotate: 180 }}
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-amber-brand/60"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </motion.button>
  );
}
