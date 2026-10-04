import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FindUs } from "@/components/FindUs";
import { Reviews } from "@/components/Reviews";
import { AboutDPizza } from "@/components/AboutDPizza";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "D-Pizza Food — Dadu" },
      { name: "description", content: "D-Pizza Food — order zingers, broasts, hand-tossed pizzas, rolls and bundle deals online with live order tracking." },
      { property: "og:title", content: "D-Pizza Food — Dadu" },
      { property: "og:description", content: "Zingers, broasts, pizzas & exclusive bundle deals." },
      { property: "og:url", content: "https://d-pizza-dadu.lovable.app/" },
      { property: "og:locale", content: "en_PK" },
    ],
    links: [
      { rel: "canonical", href: "https://d-pizza-dadu.lovable.app/" },
      { rel: "alternate", hrefLang: "en-PK", href: "https://d-pizza-dadu.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          "@id": "https://d-pizza-dadu.lovable.app/#restaurant",
          name: "D-Pizza Food",
          url: "https://d-pizza-dadu.lovable.app/",
          telephone: "+923131342361",
          servesCuisine: ["Pizza", "Fast Food", "BBQ", "Burgers", "Pakistani"],
          priceRange: "Rs",
          areaServed: { "@type": "City", name: "Dadu" },
          address: {
            "@type": "PostalAddress",
            streetAddress: "PQGH+54Q, Shahani Paro Rd, Shahani Paro",
            addressLocality: "Dadu",
            addressRegion: "Sindh",
            postalCode: "76100",
            addressCountry: "PK",
          },
          openingHoursSpecification: [{
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "11:00",
            closes: "01:00"
          }],
          menu: "https://d-pizza-dadu.lovable.app/#menu",
          hasMap: "https://www.google.com/maps/search/?api=1&query=PQGH%2B54Q+D-Pizza+Food+Shahani+Paro+Rd+Dadu+Pakistan"
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <AboutDPizza />
        <MenuSection />
        <Reviews />
        <FindUs />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
