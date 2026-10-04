import { CalendarDays, MapPin, Target, UtensilsCrossed } from "lucide-react";

export function AboutDPizza() {
  return (
    <section id="about" className="border-y border-border bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-md">
            <div className="rounded-[2rem] border-2 border-amber-brand/40 bg-card p-2 shadow-xl shadow-amber-brand/10 animate-pulse">
              <div className="overflow-hidden rounded-[1.65rem] border border-border bg-muted">
                <div className="aspect-[4/5] w-full">
                  <img
                    src="/1791122318601.jpg"
                    alt="Raja Shahnawaz Soomro, Founder and Owner of D-Pizza"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 rounded-[2rem] bg-amber-brand/10 blur-2xl" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-brand">
              Our Story
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              D-Pizza — Serving Dadu with taste & quality
            </h2>
            <p className="mt-5 text-base leading-7 text-muted-foreground">
              D-Pizza was founded on 5 June 2023 by Raja Shahnawaz Soomro with a
              simple vision: to serve the people of Dadu with fresh, delicious
              food and a welcoming experience for families, friends and food
              lovers.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Since the beginning, D-Pizza has focused on taste, quality,
              customer satisfaction and continuous improvement. Today, the
              business continues to serve Dadu with pizzas, burgers, rolls,
              BBQ and special value deals.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <CalendarDays className="h-5 w-5 text-amber-brand" />
                <div className="mt-2 text-sm font-bold">Founded</div>
                <div className="text-sm text-muted-foreground">5 June 2023</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <MapPin className="h-5 w-5 text-amber-brand" />
                <div className="mt-2 text-sm font-bold">Serving</div>
                <div className="text-sm text-muted-foreground">Dadu, Sindh</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <UtensilsCrossed className="h-5 w-5 text-amber-brand" />
                <div className="mt-2 text-sm font-bold">Current Branch</div>
                <div className="text-sm text-muted-foreground">1 location</div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <Target className="h-5 w-5 text-amber-brand" />
                <div className="mt-2 text-sm font-bold">Our Focus</div>
                <div className="text-sm text-muted-foreground">Taste & customer satisfaction</div>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-amber-brand/20 bg-amber-brand/5 p-5">
              <div className="text-sm font-black">Raja Shahnawaz Soomro</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Founder & Owner — D-Pizza
              </div>
            </div>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Our Mission</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  To prepare fresh and delicious food, maintain consistent
                  quality, provide friendly service and continuously improve
                  the customer experience.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider">Our Vision</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  To become a trusted and loved food brand in Dadu through
                  great taste, quality food and excellent customer service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
