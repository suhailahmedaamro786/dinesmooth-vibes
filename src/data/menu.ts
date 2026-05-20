import zingerBurger from "@/assets/menu/zinger-burger.jpg";
import zingerCheese from "@/assets/menu/zinger-cheese.jpg";
import doubleChicken from "@/assets/menu/double-chicken.jpg";
import zingerTower from "@/assets/menu/zinger-tower.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import cheeseSandwich from "@/assets/menu/cheese-sandwich.jpg";
import clubSandwich from "@/assets/menu/club-sandwich.jpg";

import mayoRoll from "@/assets/menu/mayo-roll.jpg";
import zingerRoll from "@/assets/menu/zinger-roll.jpg";
import zingerCheeseRoll from "@/assets/menu/zinger-cheese-roll.jpg";

import broastFull from "@/assets/menu/broast-full.jpg";
import broastHalf from "@/assets/menu/broast-half.jpg";
import broastQtr from "@/assets/menu/broast-qtr.jpg";
import nuggets from "@/assets/menu/nuggets.jpg";
import hotWings6 from "@/assets/menu/hot-wings-6.jpg";
import hotWings9 from "@/assets/menu/hot-wings-9.jpg";
import hotShot from "@/assets/menu/hot-shot.jpg";

import pizzaDfc from "@/assets/menu/pizza-dfc.jpg";
import pizzaTikka from "@/assets/menu/pizza-tikka.jpg";
import pizzaFajita from "@/assets/menu/pizza-fajita.jpg";
import pizzaSupreme from "@/assets/menu/pizza-supreme.jpg";
import pizzaTandoori from "@/assets/menu/pizza-tandoori.jpg";
import pizzaHot from "@/assets/menu/pizza-hot.jpg";
import pizzaCheese from "@/assets/menu/pizza-cheese.jpg";
import pizzaPepperoni from "@/assets/menu/pizza-pepperoni.jpg";
import pizzaVeg from "@/assets/menu/pizza-veg.jpg";

import dealFamily from "@/assets/menu/deal-family.jpg";
import dealFriends from "@/assets/menu/deal-friends.jpg";
import dealYaari from "@/assets/menu/deal-yaari.jpg";
import dealBread from "@/assets/menu/deal-bread.jpg";

export type Category = "Burgers" | "Rolls" | "Pizzas" | "Broast" | "Deals";

export interface SimpleItem {
  id: string;
  name: string;
  price: number;
  category: Exclude<Category, "Pizzas" | "Deals">;
  description?: string;
  image: string;
}

export type PizzaSize = "S" | "M" | "L" | "XL";

export interface PizzaItem {
  id: string;
  name: string;
  category: "Pizzas";
  prices: Record<PizzaSize, number>;
  description?: string;
  image: string;
}

export interface DealItem {
  id: string;
  name: string;
  price: number;
  category: "Deals";
  description: string;
  highlight?: boolean;
  image: string;
}

export const burgers: SimpleItem[] = [
  { id: "b1", name: "Zinger Burger", price: 300, category: "Burgers", image: zingerBurger, description: "Crispy zinger fillet, fresh lettuce, signature mayo." },
  { id: "b2", name: "Zinger Cheese", price: 350, category: "Burgers", image: zingerCheese, description: "Zinger with melted cheddar layer." },
  { id: "b3", name: "Double Chicken", price: 500, category: "Burgers", image: doubleChicken, description: "Two crispy fillets, twice the crunch." },
  { id: "b4", name: "Zinger Tower", price: 600, category: "Burgers", image: zingerTower, description: "Tall stack with hash brown & cheese." },
  { id: "b5", name: "Sandwich", price: 250, category: "Burgers", image: sandwich, description: "Classic chicken sandwich." },
  { id: "b6", name: "Cheese Sandwich", price: 300, category: "Burgers", image: cheeseSandwich, description: "Loaded with melty cheese." },
  { id: "b7", name: "Club Sandwich", price: 400, category: "Burgers", image: clubSandwich, description: "Triple-decker club classic." },
];

export const rolls: SimpleItem[] = [
  { id: "r1", name: "Mayo Roll", price: 250, category: "Rolls", image: mayoRoll, description: "Soft paratha wrap, garlic mayo." },
  { id: "r2", name: "Zinger Roll", price: 300, category: "Rolls", image: zingerRoll, description: "Crunchy zinger strips, fresh slaw." },
  { id: "r3", name: "Zinger Cheese Roll", price: 350, category: "Rolls", image: zingerCheeseRoll, description: "Zinger roll with extra cheese." },
];

export const broast: SimpleItem[] = [
  { id: "br1", name: "Chicken Broast — Full", price: 2000, category: "Broast", image: broastFull, description: "Whole broasted chicken, golden crisp." },
  { id: "br2", name: "Chicken Broast — Half", price: 1100, category: "Broast", image: broastHalf, description: "Half bird, perfectly broasted." },
  { id: "br3", name: "Chicken Broast — Qtr", price: 550, category: "Broast", image: broastQtr, description: "Quarter chicken broast piece." },
  { id: "br4", name: "Chicken Nuggets", price: 550, category: "Broast", image: nuggets, description: "Tender bite-sized nuggets." },
  { id: "br5", name: "Hot Wings — 6 pcs", price: 400, category: "Broast", image: hotWings6, description: "Spicy fired wings, 6 pieces." },
  { id: "br6", name: "Hot Wings — 9 pcs", price: 600, category: "Broast", image: hotWings9, description: "Spicy fired wings, 9 pieces." },
  { id: "br7", name: "Hot Shot — 8 pcs", price: 500, category: "Broast", image: hotShot, description: "Boneless hot shot bites, 8 pieces." },
];

export const pizzas: PizzaItem[] = [
  { id: "p1", name: "DFC Special",          category: "Pizzas", image: pizzaDfc,        prices: { S: 550, M: 1000, L: 1400, XL: 1750 }, description: "Loaded house special — every topping that matters." },
  { id: "p2", name: "Chicken Tikka BBQ",    category: "Pizzas", image: pizzaTikka,      prices: { S: 500, M: 950,  L: 1350, XL: 1700 }, description: "Smoky tikka chunks, BBQ drizzle." },
  { id: "p3", name: "Chicken Fajita",       category: "Pizzas", image: pizzaFajita,     prices: { S: 500, M: 950,  L: 1350, XL: 1700 }, description: "Fajita chicken, peppers, onions." },
  { id: "p4", name: "Chicken Supreme",      category: "Pizzas", image: pizzaSupreme,    prices: { S: 500, M: 900,  L: 1300, XL: 1600 }, description: "Mushrooms, peppers, olives & chicken." },
  { id: "p5", name: "Chicken Tandoori",     category: "Pizzas", image: pizzaTandoori,   prices: { S: 500, M: 900,  L: 1300, XL: 1600 }, description: "Smoky tandoori chicken, fresh herbs." },
  { id: "p6", name: "Chicken Hot Spicy",    category: "Pizzas", image: pizzaHot,        prices: { S: 500, M: 900,  L: 1300, XL: 1600 }, description: "Bring the heat — chili oil & jalapeños." },
  { id: "p7", name: "Chicken Cheese Lover", category: "Pizzas", image: pizzaCheese,     prices: { S: 500, M: 900,  L: 1300, XL: 1600 }, description: "Four-cheese blend, extra stretchy." },
  { id: "p8", name: "Pepperoni Hut",        category: "Pizzas", image: pizzaPepperoni,  prices: { S: 500, M: 900,  L: 1300, XL: 1600 }, description: "Classic pepperoni, crispy edges." },
  { id: "p9", name: "Vegetarian Pizza",     category: "Pizzas", image: pizzaVeg,        prices: { S: 400, M: 700,  L: 900,  XL: 1300 }, description: "Garden-fresh veggie medley." },
];

export const deals: DealItem[] = [
  { id: "d1", name: "Family Deal",  price: 3150, category: "Deals", image: dealFamily,  description: "1 XL Pizza + 3 Small Pizzas + 1 Jumbo Cold Drink.", highlight: true },
  { id: "d2", name: "Friends Deal", price: 1800, category: "Deals", image: dealFriends, description: "5 Zinger Burgers + 2 Chicken Rolls." },
  { id: "d3", name: "Yaari Deal",   price: 1000, category: "Deals", image: dealYaari,   description: "1 DFC Special Small Pizza + 1 Zinger Burger + 1 Chicken Roll." },
  { id: "d4", name: "DFC Special Bread", price: 1100, category: "Deals", image: dealBread, description: "Our signature DFC special bread platter." },
];

export const SPECIAL_TRAIN_PIZZA_PRICE = 3500;
