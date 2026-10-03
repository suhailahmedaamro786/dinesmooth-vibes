import type { DealItem, PizzaItem, SimpleItem } from "@/data/menu";

import bbqPlatter from "@/assets/menu/bbq-platter.jpg";
import bbqTikka from "@/assets/menu/bbq-tikka.jpg";
import broastHalf from "@/assets/menu/broast-half.jpg";
import broastQtr from "@/assets/menu/broast-qtr.jpg";
import clubSandwich from "@/assets/menu/club-sandwich.jpg";
import dealBread from "@/assets/menu/deal-bread.jpg";
import dealFamily from "@/assets/menu/deal-family.jpg";
import dealFriends from "@/assets/menu/deal-friends.jpg";
import dealYaari from "@/assets/menu/deal-yaari.jpg";
import doubleChicken from "@/assets/menu/double-chicken.jpg";
import fries from "@/assets/menu/fries.jpg";
import hotWings6 from "@/assets/menu/hot-wings-6.jpg";
import lavaPizza from "@/assets/menu/lava-pizza.jpg";
import malaiBoti from "@/assets/menu/malai-boti.jpg";
import mayoRoll from "@/assets/menu/mayo-roll.jpg";
import pasta from "@/assets/menu/pasta.jpg";
import pizzaDfc from "@/assets/menu/pizza-dfc.jpg";
import pizzaFajita from "@/assets/menu/pizza-fajita.jpg";
import pizzaSupreme from "@/assets/menu/pizza-supreme.jpg";
import pizzaTikka from "@/assets/menu/pizza-tikka.jpg";
import pizzaVeg from "@/assets/menu/pizza-veg.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import zingerBurger from "@/assets/menu/zinger-burger.jpg";
import zingerCheese from "@/assets/menu/zinger-cheese.jpg";
import zingerRoll from "@/assets/menu/zinger-roll.jpg";
import zingerTower from "@/assets/menu/zinger-tower.jpg";

const LEGACY_IMAGE_MAP: Record<string, string> = {
  "/assets/menu/bbq-platter.jpg": bbqPlatter,
  "/assets/menu/bbq-tikka.jpg": bbqTikka,
  "/assets/menu/broast-half.jpg": broastHalf,
  "/assets/menu/broast-qtr.jpg": broastQtr,
  "/assets/menu/club-sandwich.jpg": clubSandwich,
  "/assets/menu/deal-bread.jpg": dealBread,
  "/assets/menu/deal-family.jpg": dealFamily,
  "/assets/menu/deal-friends.jpg": dealFriends,
  "/assets/menu/deal-yaari.jpg": dealYaari,
  "/assets/menu/double-chicken.jpg": doubleChicken,
  "/assets/menu/fries.jpg": fries,
  "/assets/menu/hot-wings-6.jpg": hotWings6,
  "/assets/menu/lava-pizza.jpg": lavaPizza,
  "/assets/menu/malai-boti.jpg": malaiBoti,
  "/assets/menu/mayo-roll.jpg": mayoRoll,
  "/assets/menu/pasta.jpg": pasta,
  "/assets/menu/pizza-dfc.jpg": pizzaDfc,
  "/assets/menu/pizza-fajita.jpg": pizzaFajita,
  "/assets/menu/pizza-supreme.jpg": pizzaSupreme,
  "/assets/menu/pizza-tikka.jpg": pizzaTikka,
  "/assets/menu/pizza-veg.jpg": pizzaVeg,
  "/assets/menu/sandwich.jpg": sandwich,
  "/assets/menu/zinger-burger.jpg": zingerBurger,
  "/assets/menu/zinger-cheese.jpg": zingerCheese,
  "/assets/menu/zinger-roll.jpg": zingerRoll,
  "/assets/menu/zinger-tower.jpg": zingerTower,
};

function resolveMenuImage(image?: string) {
  if (!image) return "/assets/menu/placeholder.jpg";
  return image.startsWith("http") ? image : LEGACY_IMAGE_MAP[image] || "/assets/menu/placeholder.jpg";
}

export const SANITY_CATEGORIES = ["Burgers","Rolls","Pizzas","BBQ","Broast","Platters","Pasta","Sandwiches","Deals"] as const;
export type SanityCategory = (typeof SANITY_CATEGORIES)[number];

export type SanityMenuDocument = {
  _id: string; name: string; slug?: string; category: SanityCategory; description?: string;
  price?: number; prices?: { S?: number; M?: number; L?: number; XL?: number };
  image?: string; highlight?: boolean; sortOrder?: number;
};

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET = import.meta.env.VITE_SANITY_DATASET || "production";
const API_VERSION = import.meta.env.VITE_SANITY_API_VERSION || "2026-09-03";
export const sanityConfigured = Boolean(PROJECT_ID && DATASET);

const QUERY = '*[_type == "menuItem" && isAvailable != false] | order(category asc, sortOrder asc, name asc) { _id, name, "slug": slug.current, category, description, price, prices, "image": coalesce(image.asset->url, legacyImagePath), highlight, sortOrder }';

function endpoint() {
  return `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${encodeURIComponent(DATASET)}?query=${encodeURIComponent(QUERY)}`;
}

export async function fetchSanityMenu(): Promise<SanityMenuDocument[]> {
  if (!sanityConfigured) return [];
  const response = await fetch(endpoint(), { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Sanity menu request failed: ${response.status}`);
  const payload = (await response.json()) as { result?: SanityMenuDocument[] };
  return Array.isArray(payload.result) ? payload.result : [];
}

export function toSimpleItem(doc: SanityMenuDocument): SimpleItem | null {
  if (doc.category === "Pizzas" || doc.category === "Deals" || typeof doc.price !== "number") return null;
  return { id: doc.slug || doc._id, name: doc.name, price: doc.price, category: doc.category, description: doc.description, image: resolveMenuImage(doc.image) };
}

export function toPizzaItem(doc: SanityMenuDocument): PizzaItem | null {
  if (doc.category !== "Pizzas" || !doc.prices) return null;
  return { id: doc.slug || doc._id, name: doc.name, category: "Pizzas", prices: { S: doc.prices.S ?? 0, M: doc.prices.M ?? 0, L: doc.prices.L ?? 0, XL: doc.prices.XL ?? 0 }, description: doc.description, image: resolveMenuImage(doc.image) };
}

export function toDealItem(doc: SanityMenuDocument): DealItem | null {
  if (doc.category !== "Deals" || typeof doc.price !== "number") return null;
  return { id: doc.slug || doc._id, name: doc.name, price: doc.price, category: "Deals", description: doc.description || "", highlight: doc.highlight, image: resolveMenuImage(doc.image) };
}
