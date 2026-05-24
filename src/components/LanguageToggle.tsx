import { useLanguage } from "@/hooks/useLanguage";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "ur" : "en")}
      className="grid h-9 min-w-9 place-items-center rounded-full border border-border px-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-amber-brand/60"
      aria-label="Toggle language"
      title={lang === "en" ? "اردو" : "English"}
    >
      {lang === "en" ? "اردو" : "EN"}
    </button>
  );
}
