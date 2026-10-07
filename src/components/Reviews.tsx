import { motion } from "motion/react";
import { ExternalLink, MessageCircle, Star } from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=D+Pizza+Food+Dadu+reviews";

const reviewHighlights = [
  { name: "Doctor Asma Aslam", text: "Fresh, delicious and warm pizza. Overall a good experience.", rating: 5 },
  { name: "Dr Murk Soomro", text: "Friendly and quick staff, clean and cozy setup, fresh hot pizza and tasty reshmi kabab.", rating: 5 },
  { name: "Asma Aadil", text: "Quality food with excellent service in a calm ambiance. Highly recommended.", rating: 5 },
];

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <span className="flex gap-0.5 text-amber-brand" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className={`h-4 w-4 ${index < rating ? "fill-current" : ""}`} />
      ))}
    </span>
  );
}

export function Reviews() {
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
          <p className="mt-3 text-sm text-muted-foreground">
            Real customer feedback about D-Pizza Food.
          </p>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-brand hover:underline"
          >
            See the latest Google Reviews
            <ExternalLink className="h-4 w-4" />
          </a>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviewHighlights.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-lg"
            >
              <Stars rating={review.rating} />
              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                “{review.text}”
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <div className="font-semibold">{review.name}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Google customer review
                </div>
              </div>
            </motion.article>
          ))}
        </div>

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
