// Delivery time estimator based on locality keywords (Dadu, Sindh region)
export type DeliveryEstimate = {
  area: string;
  minMinutes: number;
  maxMinutes: number;
  zone: "near" | "city" | "regional" | "far";
};

type Rule = { match: RegExp; area: string; min: number; max: number; zone: DeliveryEstimate["zone"] };

const RULES: Rule[] = [
  { match: /shahani\s*paro|shahani|d\s*pizza|pqgh/i, area: "Shahani Paro / D Pizza Food", min: 15, max: 25, zone: "near" },
  { match: /shahjahan|shah jahan|raza\s*medical|dhq/i, area: "Shahjahan Park / DHQ Rd", min: 20, max: 30, zone: "near" },
  { match: /main\s*bazaar|sadar|station\s*road/i, area: "Main Bazaar / Sadar", min: 20, max: 30, zone: "city" },
  { match: /dadu/i, area: "Dadu City", min: 25, max: 40, zone: "city" },
  { match: /khairpur\s*nathan|k\.?\s*n\.?\s*shah/i, area: "Khairpur Nathan Shah", min: 50, max: 70, zone: "regional" },
  { match: /mehar/i, area: "Mehar", min: 45, max: 65, zone: "regional" },
  { match: /johi/i, area: "Johi", min: 55, max: 75, zone: "regional" },
  { match: /sehwan|bhan\s*saeedabad/i, area: "Sehwan / Bhan", min: 75, max: 100, zone: "far" },
];

export function estimateDelivery(input: string): DeliveryEstimate | null {
  const text = input.trim();
  if (text.length < 2) return null;
  for (const r of RULES) {
    if (r.match.test(text)) {
      return { area: r.area, minMinutes: r.min, maxMinutes: r.max, zone: r.zone };
    }
  }
  // Default fallback — unknown locality
  return { area: "Other locality", minMinutes: 45, maxMinutes: 75, zone: "regional" };
}

export function formatEstimate(e: DeliveryEstimate): string {
  return `${e.minMinutes}–${e.maxMinutes} min`;
}
