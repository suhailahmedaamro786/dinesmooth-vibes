import { Flame, Instagram, Phone, MapPin, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-brand text-primary-foreground">
              <Flame className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <div className="leading-none">
              <div className="text-sm font-black tracking-[0.18em] text-amber-brand">D-Pizza</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                D-Pizza Food
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Crafted with obsessive love for flavour — served hot, served fast.
          </p>
        </div>
        <div className="text-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Hours</div>
          <ul className="mt-3 space-y-1.5">
            <li>Mon — Sun · 6:00 PM – 1:00 AM</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Visit</div>
          <ul className="mt-3 space-y-2">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-amber-brand" /> Shahani Paro, Dādu</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-amber-brand" /> Order: +92 313 1342361</li>
            <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-amber-brand" /> @dpizzafood</li>
            <li><a href="https://www.facebook.com/dpizzafood/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-amber-brand"><Facebook className="h-4 w-4 text-amber-brand" /> Facebook: D-Pizza Food</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} D-PIZZA FOOD. All rights reserved.
      </div>
    </footer>
  );
}
