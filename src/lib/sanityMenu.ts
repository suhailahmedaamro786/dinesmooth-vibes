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
  prices?: { S?: number; M?: number; L?: number; XL?: number };
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
  if (doc.category !== "Pizzas" || !doc.prices) return null;

  return withImage(
    {
      id: doc.slug || doc._id,
      name: doc.name,
      category: "Pizzas",
      prices: {
        S: doc.prices.S ?? 0,
        M: doc.prices.M ?? 0,
        L: doc.prices.L ?? 0,
        XL: doc.prices.XL ?? 0,
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
