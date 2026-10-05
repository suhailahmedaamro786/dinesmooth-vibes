import { burgers as localBurgers, rolls as localRolls, pizzas as localPizzas, broast as localBroast, bbq as localBbq, platters as localPlatters, pastaItems as localPasta, sandwiches as localSandwiches, deals as localDeals } from "@/data/menu";
import type { DealItem, PizzaItem, SimpleItem } from "@/data/menu";

export const SANITY_CATEGORIES = [
  "Burgers",
  "Rolls",
  "Pizzas",
  "BBQ",
  "Broast",
  "Platters",
  "Pasta",
  "Sandwiches",
  "Deals",
] as const;

export type SanityCategory = (typeof SANITY_CATEGORIES)[number];

export type SanityMenuDocument = {
  _id: string;
  name: string;
  slug?: string;
  category: SanityCategory;
  description?: string;
  price?: number;
  prices?: { S?: number; M?: number; L?: number; XL?: number } | null;
  image?: string;
  highlight?: boolean;
  sortOrder?: number;
};

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET || "production";
const API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || "2026-09-03";

export const sanityConfigured = Boolean(PROJECT_ID && DATASET);

// Sanity is the only source of menu images.
// No local/legacy image fallback is allowed, so old images can never
// reappear on the customer website after the CMS cleanup.
const QUERY =
  '*[_type == "menuItem" && isAvailable != false && name != "Pizza Burger"] | order(category asc, sortOrder asc, name asc) { _id, name, "slug": slug.current, category, description, price, prices, "image": image.asset->url, highlight, sortOrder }';

function endpoint() {
  return `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${encodeURIComponent(DATASET)}?query=${encodeURIComponent(QUERY)}`;
}

export async function fetchSanityMenu(): Promise<SanityMenuDocument[]> {
  if (!sanityConfigured) return [];

  const response = await fetch(endpoint(), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Sanity menu request failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    result?: SanityMenuDocument[];
  };

  return Array.isArray(payload.result) ? payload.result : [];
}

const VERIFIED_PIZZA_PRICES: Record<string, { S: number; M: number; L: number; XL: number }> = {
  "D-Pizza Special": { S: 350, M: 700, L: 1000, XL: 1300 },
  "Chicken Tikka Pizza": { S: 350, M: 700, L: 1000, XL: 1300 },
  "Chicken Fajita Pizza": { S: 350, M: 700, L: 1000, XL: 1300 },
  "Vegetable Pizza": { S: 350, M: 700, L: 1000, XL: 1300 },
  "Lava Pizza": { S: 600, M: 1000, L: 1600, XL: 2000 },
};

const GITHUB_MENU_IMAGE_BY_NAME: Record<string, string> = {
  "Zinger Burger": "/assets/menu-images/regular-items/Zinger%20Burger.jpg",
  "Zinger Cheez Burger": "/assets/menu-images/regular-items/Zinger%20Cheez%20Burger.jpg",
  "Zinger Tower": "/assets/menu-images/regular-items/Zinger%20Tower.jpg",

  "Mayo Roll": "/assets/menu-images/Rolls/Mayo%20Roll.jpg",
  "Chatni Roll": "/assets/menu-images/Rolls/Chatni%20Roll.jpg",
  "Sharma Roll": "/assets/menu-images/Rolls/Sharma%20Roll.jpg",
  "Cheese Roll": "/assets/menu-images/Rolls/Cheese%20Roll.jpg",
  "Zinger Jambo Roll": "/assets/menu-images/Rolls/Zinger%20Jambo%20Roll.jpg",
  "Jambo Roll": "/assets/menu-images/Rolls/Jambo%20Roll.jpg",
  "Afghani Roll": "/assets/menu-images/Rolls/Afghani%20Roll.jpg",

  "D-Pizza Special": "/assets/menu-images/Pizzas/D-Pizza%20Special.jpg",
  "Chicken Tikka Pizza": "/assets/menu-images/Pizzas/Chicken%20Tikka%20Pizza.jpg",
  "Chicken Fajita Pizza": "/assets/menu-images/Pizzas/Chicken%20Fajita%20Pizza.jpg",
  "Vegetable Pizza": "/assets/menu-images/Pizzas/Vegetable%20Pizza.jpg",
  "Lava Pizza": "/assets/menu-images/Pizzas/Lava%20Pizza.jpg",

  "Chicken Tikka": "/assets/menu-images/BBQ/Chicken%20Tikka.jpg",
  "Chicken Malai Tikka": "/assets/menu-images/BBQ/Chicken%20Malai%20Tikka.jpg",
  "Chicken Leg Tikka": "/assets/menu-images/BBQ/Chicken%20Leg%20Tikka.jpg",
  "Chicken Leg Malai Tikka": "/assets/menu-images/BBQ/Chicken%20Leg%20Malai%20Tikka.jpg",
  "Chicken Malai Boti": "/assets/menu-images/BBQ/Chicken%20Malai%20Boti.jpg",
  "Chicken Red Boti": "/assets/menu-images/BBQ/Chicken%20Red%20Boti.jpg",
  "Reshmi Kabab": "/assets/menu-images/BBQ/Reshmi%20Kabab.jpg",
  "Chicken Hot Wings": "/assets/menu-images/BBQ/Chicken%20Hot%20Wings.jpg",

  "Cheese Broast": "/assets/menu-images/Broast/Cheese%20Broast.jpg",
  "Chicken Broast": "/assets/menu-images/Broast/Chicken%20Broast.jpg",
  "Fries": "/assets/menu-images/Broast/Fries.jpg",
  "Strem Broast": "/assets/menu-images/Broast/Strem%20Broast.jpg",

  "Pasta — Half": "/assets/menu-images/Pasta/Pasta%20Half.jpg",
  "Pasta — Full": "/assets/menu-images/Pasta/Pasta%20Full.jpg",
  "Pasta Half": "/assets/menu-images/Pasta/Pasta%20Half.jpg",
  "Pasta Full": "/assets/menu-images/Pasta/Pasta%20Full.jpg",

  "Sandwich": "/assets/menu-images/Sandwiches/Sandwich.jpg",
  "Club Sandwich": "/assets/menu-images/Sandwiches/Club%20Sandwich.jpg",
};

const GITHUB_DEAL_IMAGES = Array.from({ length: 19 }, (_, index) =>
  `/assets/menu-images/deals/main-deals/Deal%20${String(index + 1).padStart(2, "0")}.jpg`,
);

function withImage<T extends object>(value: T, image?: string): T & { image?: string } {
  const name = String((value as { name?: string }).name || "");
  const githubImage = GITHUB_MENU_IMAGE_BY_NAME[name];
  const localImage = LOCAL_IMAGE_BY_NAME[name];
  return githubImage ? { ...value, image: githubImage } : image ? { ...value, image } : localImage ? { ...value, image: localImage } : value;
}

export function toSimpleItem(doc: SanityMenuDocument): SimpleItem | null {
  if (
    doc.name === "Pizza Burger" ||
    doc.category === "Pizzas" ||
    doc.category === "Deals" ||
    typeof doc.price !== "number"
  ) {
    return null;
  }

  return withImage(
    {
      id: doc.slug || doc._id,
      name: doc.name,
      price: doc.price,
      category: doc.category,
      description: doc.description,
    },
    doc.image,
  );
}

export function toPizzaItem(doc: SanityMenuDocument): PizzaItem | null {
  if (doc.category !== "Pizzas") return null;

  const verified = VERIFIED_PIZZA_PRICES[doc.name];
  const raw = doc.prices;
  const prices = verified ?? (raw ? {
    S: Number(raw.S ?? 0), M: Number(raw.M ?? 0), L: Number(raw.L ?? 0), XL: Number(raw.XL ?? 0),
  } : null);
  if (!prices || Object.values(prices).some((value) => !Number.isFinite(value) || value <= 0)) return null;

  return withImage(
    {
      id: doc.slug || doc._id,
      name: doc.name,
      category: "Pizzas",
      prices: {
        S: prices.S,
        M: prices.M,
        L: prices.L,
        XL: prices.XL,
      },
      description: doc.description,
    },
    doc.image,
  );
}

export function toDealItem(doc: SanityMenuDocument): DealItem | null {
  if (doc.category !== "Deals" || typeof doc.price !== "number") return null;

  const dealNumber = Number(doc.name.match(/Deal\\s*0*(\\d+)/i)?.[1] || 0);
  const githubDealImage =
    dealNumber >= 1 && dealNumber <= GITHUB_DEAL_IMAGES.length && dealNumber !== 19
      ? GITHUB_DEAL_IMAGES[dealNumber - 1]
      : undefined;

  return withImage(
    {
      id: doc.slug || doc._id,
      name: doc.name,
      price: doc.price,
      category: "Deals",
      description: doc.description || "",
      highlight: doc.highlight,
    },
    githubDealImage || doc.image,
  );
}
