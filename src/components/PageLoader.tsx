import { motion } from "motion/react";
import { Flame } from "lucide-react";

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.45, duration: 0.35 }}
      onAnimationComplete={(e) => e.currentTarget.remove()}
      className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-background"
      aria-hidden="true"
    >
      <motion.div
        initial={{ scale: 0.75, opacity: 0 }}
        animate={{ scale: [0.9, 1.05, 1], opacity: [0.4, 1, 1] }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-brand text-primary-foreground glow-amber"
      >
        <Flame className="h-8 w-8" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  );
}
