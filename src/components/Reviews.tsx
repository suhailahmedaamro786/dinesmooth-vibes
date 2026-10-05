import { motion } from "motion/react";
import { ExternalLink, Star, MessageCircle } from "lucide-react";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=D+Pizza+Food+Dadu+reviews";

const reviews = [
  {
    name: "Doctor Asma Aslam",
    summary: "Praised the pizza for being fresh, delicious and served warm, and rated the overall experience positively.",
  },
  {
    name: "Dr Murk Soomro",
    summary: "Highlighted friendly service, a comfortable setup, fresh hot pizza and flavorful reshmi kebab.",
  },
  {
    name: "Asma Aadil",
    summary: "Described the food quality and service positively and mentioned the calm atmosphere.",
  },
];

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
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-2xl font-black">Google</span>
            <span className="flex gap-0.5 text-amber-brand" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </span>
            <span className="text-sm text-muted-foreground">See the latest reviews</span>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Review highlights from customer feedback. See Google for the current rating and latest reviews.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-lg"
            >
              <div className="flex gap-0.5 text-amber-brand" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">
                “{review.summary}”
              </p>
              <div className="mt-5 border-t border-border pt-4">
                <div className="font-semibold">{review.name}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Google reviewer
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
