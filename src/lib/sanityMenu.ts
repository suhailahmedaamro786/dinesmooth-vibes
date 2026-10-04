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
  '*[_type == "menuItem" && isAvailable != false] | order(category asc, sortOrder asc, name asc) { _id, name, "slug": slug.current, category, description, price, prices, "image": image.asset->url, highlight, sortOrder }';

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

function withImage<T extends object>(value: T, image?: string): T & { image?: string } {
  return image ? { ...value, image } : value;
}

export function toSimpleItem(doc: SanityMenuDocument): SimpleItem | null {
  if (
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

  return withImage(
    {
      id: doc.slug || doc._id,
      name: doc.name,
      price: doc.price,
      category: "Deals",
      description: doc.description || "",
      highlight: doc.highlight,
    },
    doc.image,
  );
}
