import { motion } from "motion/react";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const MAP_LINK = "https://maps.app.goo.gl/ZVd7S76KTLU9xeo28";
const MAP_EMBED =
  "https://www.google.com/maps?q=Dadu+Food+Corner+DFC+Raza+Medical+Center+Shahjahan+Park+DHQ+Road+Dadu&output=embed";

export function FindUs() {
  const { t } = useLanguage();
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
            {t("find.kicker")}
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            {t("find.title")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("find.subtitle")}</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <motion.a
            href={MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="block overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
          >
            <iframe
              title="DFC — Dadu Food Corner location"
              src={MAP_EMBED}
              className="h-[420px] w-full pointer-events-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-3"
          >
            <InfoCard icon={<MapPin className="h-5 w-5" />} title={t("find.address")}>
              <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-amber-brand">
                {t("find.addressLine")}
              </a>
            </InfoCard>
            <InfoCard icon={<Phone className="h-5 w-5" />} title={t("find.call")}>
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
                  {t("find.wa")}
                </div>
                <div className="text-sm font-semibold">{t("find.waSub")}</div>
              </div>
            </a>
            <InfoCard icon={<Clock className="h-5 w-5" />} title={t("find.hours")}>
              {t("find.hoursLine")}
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
