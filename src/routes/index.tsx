import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { FindUs } from "@/components/FindUs";
import { Reviews } from "@/components/Reviews";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "D-Pizza Food — Dadu" },
      { name: "description", content: "D-Pizza Food — order zingers, broasts, hand-tossed pizzas, rolls and bundle deals online with live order tracking." },
      { property: "og:title", content: "D-Pizza Food — Dadu" },
      { property: "og:description", content: "Zingers, broasts, pizzas & exclusive bundle deals." },
      { property: "og:url", content: "https://d-pizza-dadu.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://d-pizza-dadu.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Restaurant",
          name: "D-Pizza Food",
          url: "https://d-pizza-dadu.lovable.app/",
          telephone: "+923131342361",
          servesCuisine: ["Pizza", "Fast Food", "BBQ"],
          priceRange: "Rs",
          address: {
            "@type": "PostalAddress",
            streetAddress: "PQGH+54Q, Shahani Paro Rd, Shahani Paro",
            addressLocality: "Dadu",
            addressCountry: "PK",
          },
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
