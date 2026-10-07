import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Star, MessageCircle } from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=D+Pizza+Food+Dadu+reviews";

type GoogleReview = {
  name: string;
  rating: number | null;
  text: string;
  relativeTime: string;
  authorUrl: string | null;
};

type GoogleReviewsResponse = {
  rating: number | null;
  reviewCount: number | null;
  reviews: GoogleReview[];
};

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="flex gap-0.5 text-amber-brand" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < Math.round(rating) ? "fill-current" : ""}`}
        />
      ))}
    </span>
  );
}

export function Reviews() {
  const [data, setData] = useState<GoogleReviewsResponse | null>(null);

  useEffect(() => {
    let active = true;

    fetch("/api/google-reviews")
      .then((response) => {
        if (!response.ok) throw new Error("Google reviews unavailable");
        return response.json() as Promise<GoogleReviewsResponse>;
      })
      .then((reviews) => {
        if (active) setData(reviews);
      })
      .catch(() => {
        if (active) setData(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const rating = data?.rating;
  const reviewCount = data?.reviewCount;
  const reviews = data?.reviews ?? [];

  return (
    <section id="reviews" className="relative border-t border-border bg-surface/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
            Customer reviews
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            What Dadu foodies are saying
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <span className="text-2xl font-black">Google</span>
            {rating !== null && rating !== undefined ? (
              <>
                <Stars rating={rating} />
                <span className="text-sm font-bold">{rating.toFixed(1)}/5</span>
                {reviewCount !== null && reviewCount !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    ({reviewCount} reviews)
                  </span>
                )}
              </>
            ) : (
              <span className="text-sm text-muted-foreground">
                Live Google rating
              </span>
            )}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Real customer feedback from Google. Rating and review count update automatically.
          </p>
        </motion.div>

        {reviews.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.article
                key={`${review.name}-${review.relativeTime}-${index}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-lg"
              >
                {review.rating !== null && <Stars rating={review.rating} />}
                <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                  “{review.text || "Customer left a rating without written feedback."}”
                </p>
                <div className="mt-5 border-t border-border pt-4">
                  {review.authorUrl ? (
                    <a
                      href={review.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:text-amber-brand"
                    >
                      {review.name}
                    </a>
                  ) : (
                    <div className="font-semibold">{review.name}</div>
                  )}
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Google reviewer{review.relativeTime ? ` · ${review.relativeTime}` : ""}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg">
            <p className="text-sm text-muted-foreground">
              Google reviews will appear here automatically once the Google Business connection is enabled.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-amber-brand px-5 py-3 text-sm font-bold text-primary-foreground transition hover:scale-[1.02]"
          >
            Read Google Reviews
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href="https://wa.me/923131342361?text=Hi%20D-Pizza%2C%20I%20would%20like%20to%20share%20my%20feedback."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold transition hover:border-amber-brand/60"
          >
            Share Your Feedback
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
