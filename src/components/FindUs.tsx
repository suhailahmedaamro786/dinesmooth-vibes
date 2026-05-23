import { motion } from "motion/react";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

export function FindUs() {
  return (
    <section id="find-us" className="relative border-t border-border bg-background py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-brand">
            Find us
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Visit DFC — Dadu Food Corner
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Dadu, Sindh, Pakistan · Open 7 days a week
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
          >
            <iframe
              title="DFC — Dadu Food Corner location"
              src="https://www.google.com/maps?q=26.7319,67.7752&z=15&output=embed"
              className="h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <InfoCard icon={<MapPin className="h-5 w-5" />} title="Address">
              Main Bazaar, Dadu<br />Sindh, Pakistan
            </InfoCard>
            <InfoCard icon={<Phone className="h-5 w-5" />} title="Call us">
              <a href="tel:+923145327444" className="hover:text-amber-brand">
                +92 314 5327444
              </a>
            </InfoCard>
            <a
              href="https://wa.me/923145327444"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/5 p-4 transition hover:border-[#25D366] hover:bg-[#25D366]/10"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#25D366]">
                  WhatsApp orders
                </div>
                <div className="text-sm font-semibold">Tap to chat with us</div>
              </div>
            </a>
            <InfoCard icon={<Clock className="h-5 w-5" />} title="Opening hours">
              Mon — Sun · 11:00 AM — 1:00 AM
            </InfoCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-brand/10 text-amber-brand">
        {icon}
      </span>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
        <div className="mt-0.5 text-sm font-semibold">{children}</div>
      </div>
    </div>
  );
}
