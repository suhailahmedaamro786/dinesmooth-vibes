import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatRs } from "@/lib/format";

const WA_NUMBER = "923145327444"; // +92 314 5327444

export function WhatsAppButton() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());

  const buildMessage = () => {
    const header = `*D-Pizza Food Order*\n`;
    if (lines.length === 0) {
      return `${header}\nHi! I'd like to place an order.`;
    }
    const items = lines
      .map(
        (l) =>
          `• ${l.qty}× ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${formatRs(l.qty * l.unitPrice)}`,
      )
      .join("\n");
    return `${header}\n${items}\n\n*Total:* ${formatRs(subtotal)}\n\nName: \nAddress: `;
  };

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(buildMessage())}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 280, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      aria-label="Order on WhatsApp"
      className="fixed bottom-5 right-5 z-[55] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_40px_-8px_rgba(37,211,102,0.6)] hover:shadow-[0_15px_50px_-8px_rgba(37,211,102,0.8)]"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
      <MessageCircle className="h-6 w-6" strokeWidth={2.5} fill="currentColor" fillOpacity={0.15} />
    </motion.a>
  );
}
