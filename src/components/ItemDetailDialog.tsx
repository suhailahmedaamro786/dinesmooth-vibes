import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StarRating } from "@/components/StarRating";
import { formatRs } from "@/lib/format";
import type { PizzaItem, SimpleItem, DealItem, PizzaSize } from "@/data/menu";
import type { ReviewSummary } from "@/lib/reviews";

export type DetailItem =
  | { kind: "simple"; item: SimpleItem }
  | { kind: "pizza"; item: PizzaItem }
  | { kind: "deal"; item: DealItem };

export function ItemDetailDialog({
  detail,
  open,
  onOpenChange,
  summary,
}: {
  detail: DetailItem | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  summary?: ReviewSummary;
}) {
  if (!detail) return null;
  const it = detail.item;
  const description = it.description ?? "Made-to-order at D-Pizza Food — freshly fired, served hot.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-1rem)] max-w-lg overflow-y-auto overflow-x-hidden border-border bg-card p-0 sm:w-full">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
          <img src={it.image} alt={it.name} className="h-full w-full object-cover" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        </div>
        <div className="space-y-4 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
                {detail.kind === "deal" ? "Bundle Deal" : detail.kind === "pizza" ? "Pizza" : "Menu Item"}
              </div>
              <DialogTitle className="mt-1 text-2xl font-black tracking-tight">
                {it.name}
              </DialogTitle>
            </div>
            {detail.kind !== "pizza" && (
              <div className="shrink-0 rounded-full bg-amber-brand/15 px-3 py-1 text-base font-black text-amber-brand">
                {formatRs((it as SimpleItem | DealItem).price)}
              </div>
            )}
          </div>

          {summary && summary.review_count > 0 ? (
            <div className="flex items-center gap-2">
              <StarRating value={summary.avg_rating} size={14} />
              <span className="text-sm font-bold tabular-nums">{summary.avg_rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({summary.review_count} reviews)</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">No reviews yet — be the first after your order.</div>
          )}

          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </DialogDescription>

          {detail.kind === "pizza" && (
            <div>
              <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Sizes & Prices
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(detail.item.prices) as PizzaSize[]).map((s) => (
                  <div
                    key={s}
                    className="rounded-xl border border-border bg-surface/60 p-3 text-center"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {s === "S" ? "Small" : s === "M" ? "Medium" : s === "L" ? "Large" : "X-Large"}
                    </div>
                    <div className="mt-1 text-sm font-black text-amber-brand">
                      {formatRs(detail.item.prices[s])}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="pt-1 text-[11px] text-muted-foreground">
            Tip: close this and tap <span className="font-bold text-amber-brand">Add</span> on the card to drop it in your cart.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
