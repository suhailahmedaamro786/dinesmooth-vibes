export type Category = "Burgers" | "Rolls" | "Pizzas" | "Broast" | "Deals";

export interface SimpleItem {
  id: string;
  name: string;
  price: number;
  category: Exclude<Category, "Pizzas" | "Deals">;
  description?: string;
}

export type PizzaSize = "S" | "M" | "L" | "XL";

export interface PizzaItem {
  id: string;
  name: string;
  category: "Pizzas";
  prices: Record<PizzaSize, number>;
  description?: string;
}

export interface DealItem {
  id: string;
  name: string;
  price: number;
  category: "Deals";
  description: string;
  highlight?: boolean;
}

export const burgers: SimpleItem[] = [
  { id: "b1", name: "Zinger Burger", price: 300, category: "Burgers", description: "Crispy zinger fillet, fresh lettuce, signature mayo." },
  { id: "b2", name: "Zinger Cheese", price: 350, category: "Burgers", description: "Zinger with melted cheddar layer." },
  { id: "b3", name: "Double Chicken", price: 500, category: "Burgers", description: "Two crispy fillets, twice the crunch." },
  { id: "b4", name: "Zinger Tower", price: 600, category: "Burgers", description: "Tall stack with hash brown & cheese." },
  { id: "b5", name: "Sandwich", price: 250, category: "Burgers", description: "Classic chicken sandwich." },
  { id: "b6", name: "Cheese Sandwich", price: 300, category: "Burgers", description: "Loaded with melty cheese." },
  { id: "b7", name: "Club Sandwich", price: 400, category: "Burgers", description: "Triple-decker club classic." },
];

export const rolls: SimpleItem[] = [
  { id: "r1", name: "Mayo Roll", price: 250, category: "Rolls", description: "Soft paratha wrap, garlic mayo." },
  { id: "r2", name: "Zinger Roll", price: 300, category: "Rolls", description: "Crunchy zinger strips, fresh slaw." },
  { id: "r3", name: "Zinger Cheese Roll", price: 350, category: "Rolls", description: "Zinger roll with extra cheese." },
];

export const broast: SimpleItem[] = [
  { id: "br1", name: "Chicken Broast — Full", price: 2000, category: "Broast", description: "Whole broasted chicken, golden crisp." },
  { id: "br2", name: "Chicken Broast — Half", price: 1100, category: "Broast", description: "Half bird, perfectly broasted." },
  { id: "br3", name: "Chicken Broast — Qtr", price: 550, category: "Broast", description: "Quarter chicken broast piece." },
  { id: "br4", name: "Chicken Nuggets", price: 550, category: "Broast", description: "Tender bite-sized nuggets." },
  { id: "br5", name: "Hot Wings — 6 pcs", price: 400, category: "Broast", description: "Spicy fired wings, 6 pieces." },
  { id: "br6", name: "Hot Wings — 9 pcs", price: 600, category: "Broast", description: "Spicy fired wings, 9 pieces." },
  { id: "br7", name: "Hot Shot — 8 pcs", price: 500, category: "Broast", description: "Boneless hot shot bites, 8 pieces." },
];

export const pizzas: PizzaItem[] = [
  { id: "p1", name: "DFC Special",          category: "Pizzas", prices: { S: 550, M: 1000, L: 1400, XL: 1750 }, description: "Loaded house special — every topping that matters." },
  { id: "p2", name: "Chicken Tikka BBQ",    category: "Pizzas", prices: { S: 500, M: 950,  L: 1350, XL: 1700 }, description: "Smoky tikka chunks, BBQ drizzle." },
  { id: "p3", name: "Chicken Fajita",       category: "Pizzas", prices: { S: 500, M: 950,  L: 1350, XL: 1700 }, description: "Fajita chicken, peppers, onions." },
  { id: "p4", name: "Chicken Supreme",      category: "Pizzas", prices: { S: 500, M: 900,  L: 1300, XL: 1600 } },
  { id: "p5", name: "Chicken Tandoori",     category: "Pizzas", prices: { S: 500, M: 900,  L: 1300, XL: 1600 } },
  { id: "p6", name: "Chicken Hot Spicy",    category: "Pizzas", prices: { S: 500, M: 900,  L: 1300, XL: 1600 } },
  { id: "p7", name: "Chicken Cheese Lover", category: "Pizzas", prices: { S: 500, M: 900,  L: 1300, XL: 1600 } },
  { id: "p8", name: "Pepperoni Hut",        category: "Pizzas", prices: { S: 500, M: 900,  L: 1300, XL: 1600 } },
  { id: "p9", name: "Vegetarian Pizza",     category: "Pizzas", prices: { S: 400, M: 700,  L: 900,  XL: 1300 }, description: "Garden-fresh veggie medley." },
];

export const deals: DealItem[] = [
  { id: "d1", name: "Family Deal",  price: 3150, category: "Deals", description: "1 XL Pizza + 3 Small Pizzas + 1 Jumbo Cold Drink.", highlight: true },
  { id: "d2", name: "Friends Deal", price: 1800, category: "Deals", description: "5 Zinger Burgers + 2 Chicken Rolls." },
  { id: "d3", name: "Yaari Deal",   price: 1000, category: "Deals", description: "1 DFC Special Small Pizza + 1 Zinger Burger + 1 Chicken Roll." },
  { id: "d4", name: "DFC Special Bread", price: 1100, category: "Deals", description: "Our signature DFC special bread platter." },
];

export const SPECIAL_TRAIN_PIZZA_PRICE = 3500;
