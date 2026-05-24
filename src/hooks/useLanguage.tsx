import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "ur";

const DICT = {
  en: {
    "nav.menu": "Menu",
    "nav.deals": "Deals",
    "nav.admin": "Admin",
    "nav.signIn": "Sign in",
    "nav.cart": "Cart",
    "nav.profile": "My profile & orders",
    "nav.signOut": "Sign out",
    "hero.badge": "Freshly fired · Hand-tossed · Served hot",
    "hero.title1": "DADU FOOD",
    "hero.title2": "CORNER",
    "hero.sub": "THE TASTE HUB. Zingers, broasts, hand-stretched pizzas and rolls crafted with obsessive love for flavour.",
    "hero.special": "Limited Service Special",
    "hero.train": "Special Train Pizza",
    "hero.forService": "(For Service)",
    "hero.only": "Only",
    "find.kicker": "Find us",
    "find.title": "Visit DFC — Dadu Food Corner",
    "find.subtitle": "Dadu, Sindh, Pakistan · Open 7 days a week",
    "find.address": "Address",
    "find.addressLine": "Raza Medical Center, Shahjahan Park, DHQ Road, Dadu 76200, Sindh",
    "find.call": "Call us",
    "find.wa": "WhatsApp orders",
    "find.waSub": "Tap to chat with us",
    "find.hours": "Opening hours",
    "find.hoursLine": "Mon — Sun · 11:00 AM — 1:00 AM",
  },
  ur: {
    "nav.menu": "مینو",
    "nav.deals": "ڈیلز",
    "nav.admin": "ایڈمن",
    "nav.signIn": "سائن اِن",
    "nav.cart": "کارٹ",
    "nav.profile": "میرا پروفائل اور آرڈرز",
    "nav.signOut": "سائن آؤٹ",
    "hero.badge": "تازہ پکا · ہاتھ سے بنا · گرما گرم پیش",
    "hero.title1": "دادو فوڈ",
    "hero.title2": "کارنر",
    "hero.sub": "دی ٹیسٹ ہب۔ زنگرز، بروسٹ، ہاتھ سے بنے پیزے اور رولز — ذائقے سے بھرپور۔",
    "hero.special": "خصوصی پیشکش",
    "hero.train": "اسپیشل ٹرین پیزا",
    "hero.forService": "(برائے سروس)",
    "hero.only": "صرف",
    "find.kicker": "ہمیں ڈھونڈیں",
    "find.title": "DFC — دادو فوڈ کارنر تشریف لائیں",
    "find.subtitle": "دادو، سندھ، پاکستان · ہفتے کے ساتوں دن کھلا",
    "find.address": "پتہ",
    "find.addressLine": "رضا میڈیکل سینٹر، شاہجہاں پارک، ڈی ایچ کیو روڈ، دادو 76200، سندھ",
    "find.call": "ہمیں کال کریں",
    "find.wa": "واٹس ایپ آرڈرز",
    "find.waSub": "چیٹ کرنے کے لیے دبائیں",
    "find.hours": "اوقاتِ کار",
    "find.hoursLine": "پیر — اتوار · 11:00 صبح — 1:00 رات",
  },
} as const;

type Key = keyof typeof DICT["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en", setLang: () => {}, t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("dfc-lang")) as Lang | null;
    if (saved === "en" || saved === "ur") setLangState(saved);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("dfc-lang", l);
  };

  const t = (k: Key) => DICT[lang][k] ?? DICT.en[k];
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLanguage = () => useContext(Ctx);
