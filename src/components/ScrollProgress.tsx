import { motion, useScroll } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-amber-brand"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
