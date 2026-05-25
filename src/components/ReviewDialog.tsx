import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { StarRatingInput } from "@/components/StarRating";
import { submitReview } from "@/lib/reviews";
import { toast } from "sonner";

export type ReviewTarget = {
  itemId: string;
  itemName: string;
  orderId: string;
};

export function ReviewDialog({
  open,
  target,
  userId,
  onClose,
  onSubmitted,
}: {
  open: boolean;
  target: ReviewTarget | null;
  userId: string;
  customerName?: string | null;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setRating(0); setComment(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;
    if (rating < 1) { toast.error("Please pick a star rating"); return; }
    setSubmitting(true);
    const { error } = await submitReview({
      userId, itemId: target.itemId, orderId: target.orderId,
      rating, comment,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You already reviewed this item" : `Could not submit: ${error.message}`);
      return;
    }
    toast.success("Thanks for your review!");
    reset();
    onSubmitted();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && target && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed left-1/2 top-1/2 z-[90] w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">Rate item</div>
                <h3 className="text-base font-bold">{target.itemName}</h3>
              </div>
              <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
              <div className="flex justify-center">
                <StarRatingInput value={rating} onChange={setRating} />
              </div>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comment (optional)</span>
                <textarea
                  value={comment} onChange={(e) => setComment(e.target.value)}
                  maxLength={1000} rows={3}
                  placeholder="Tell others what you loved (or didn't)…"
                  className="w-full rounded-xl border border-border bg-surface/60 px-3.5 py-2.5 text-sm outline-none focus:border-amber-brand focus:ring-2 focus:ring-amber-brand/30"
                />
              </label>
              <button
                type="submit" disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-amber-brand px-5 py-3 text-sm font-bold text-primary-foreground glow-amber disabled:opacity-60"
              >
                {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit review"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
