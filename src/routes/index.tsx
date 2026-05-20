import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MenuSection } from "@/components/MenuSection";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "DFC · Dadu Food Corner — The Taste Hub" },
      {
        name: "description",
        content:
          "DADU FOOD CORNER (DFC) — The Taste Hub. Order zingers, broasts, hand-tossed pizzas, rolls and bundle deals online.",
      },
      { property: "og:title", content: "DFC · Dadu Food Corner — The Taste Hub" },
      { property: "og:description", content: "Zingers, broasts, pizzas & exclusive bundle deals." },
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
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
