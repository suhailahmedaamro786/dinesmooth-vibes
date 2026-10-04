import zingerBurger from "@/assets/menu/zinger-burger.jpg";
import zingerCheese from "@/assets/menu/zinger-cheese.jpg";
import zingerTower from "@/assets/menu/zinger-tower.jpg";
import sandwich from "@/assets/menu/sandwich.jpg";
import clubSandwich from "@/assets/menu/club-sandwich.jpg";

import mayoRoll from "@/assets/menu/mayo-roll.jpg";
import zingerRoll from "@/assets/menu/zinger-roll.jpg";

import broastQtr from "@/assets/menu/broast-qtr.jpg";
import broastHalf from "@/assets/menu/broast-half.jpg";
import hotWings6 from "@/assets/menu/hot-wings-6.jpg";

import pizzaDfc from "@/assets/menu/pizza-dfc.jpg";
import pizzaTikka from "@/assets/menu/pizza-tikka.jpg";
import pizzaFajita from "@/assets/menu/pizza-fajita.jpg";
import pizzaVeg from "@/assets/menu/pizza-veg.jpg";
import lavaPizza from "@/assets/menu/lava-pizza.jpg";

import bbqTikka from "@/assets/menu/bbq-tikka.jpg";
import bbqPlatter from "@/assets/menu/bbq-platter.jpg";
import malaiBoti from "@/assets/menu/malai-boti.jpg";
import pasta from "@/assets/menu/pasta.jpg";
import fries from "@/assets/menu/fries.jpg";

import dealFamily from "@/assets/menu/deal-family.jpg";
import dealFriends from "@/assets/menu/deal-friends.jpg";
import dealYaari from "@/assets/menu/deal-yaari.jpg";
import dealBread from "@/assets/menu/deal-bread.jpg";
import pizzaSupreme from "@/assets/menu/pizza-supreme.jpg";

export type Category =
  | "Burgers"
  | "Rolls"
  | "Pizzas"
  | "BBQ"
  | "Broast"
  | "Platters"
  | "Pasta"
  | "Sandwiches"
  | "Deals";

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
  { id: "b1", name: "Zinger Burger", price: 250, category: "Burgers", image: zingerBurger, description: "Crispy zinger fillet, fresh lettuce, signature mayo." },
  { id: "b2", name: "Zinger Cheez Burger", price: 350, category: "Burgers", image: zingerCheese, description: "Zinger with a melted cheese layer." },
  { id: "b3", name: "Zinger Tower", price: 400, category: "Burgers", image: zingerTower, description: "Tall stack with hash brown & cheese." },
];

export const rolls: SimpleItem[] = [
  { id: "r1", name: "Mayo Roll", price: 150, category: "Rolls", image: mayoRoll, description: "Soft paratha wrap, garlic mayo." },
  { id: "r2", name: "Chatni Roll", price: 150, category: "Rolls", image: mayoRoll, description: "Spicy green chatni wrap." },
  { id: "r3", name: "Sharma Roll", price: 150, category: "Rolls", image: zingerRoll, description: "Classic shawarma-style roll." },
  { id: "r4", name: "Cheese Roll", price: 220, category: "Rolls", image: zingerRoll, description: "Loaded with melty cheese." },
  { id: "r5", name: "Zinger Jambo Roll", price: 250, category: "Rolls", image: zingerRoll, description: "Jumbo zinger strips, fresh slaw." },
  { id: "r6", name: "Jambo Roll", price: 250, category: "Rolls", image: mayoRoll, description: "Jumbo chicken roll, full filling." },
  { id: "r7", name: "Afghani Roll", price: 350, category: "Rolls", image: zingerRoll, description: "Creamy Afghani-style chicken wrap." },
];

export const bbq: SimpleItem[] = [
  { id: "q1", name: "Chicken Tikka", price: 400, category: "BBQ", image: bbqTikka, description: "Smoky char-grilled tikka, lemon & onion." },
  { id: "q2", name: "Chicken Malai Tikka", price: 400, category: "BBQ", image: malaiBoti, description: "Creamy malai marinade, melt-in-mouth." },
  { id: "q3", name: "Chicken Leg Tikka", price: 350, category: "BBQ", image: bbqTikka, description: "Juicy leg piece, fire-grilled." },
  { id: "q4", name: "Chicken Leg Malai Tikka", price: 350, category: "BBQ", image: malaiBoti, description: "Malai-marinated leg, smoky finish." },
  { id: "q5", name: "Chicken Malai Boti", price: 250, category: "BBQ", image: malaiBoti, description: "Soft creamy boti cubes." },
  { id: "q6", name: "Chicken Red Boti", price: 250, category: "BBQ", image: bbqTikka, description: "Spicy red masala boti." },
  { id: "q7", name: "Reshmi Kabab", price: 200, category: "BBQ", image: bbqPlatter, description: "Silky minced-chicken kabab skewers." },
  { id: "q8", name: "Chicken Hot Wings", price: 200, category: "BBQ", image: hotWings6, description: "Fiery grilled hot wings." },
];

export const platters: SimpleItem[] = [
  { id: "pl1", name: "Platter 01", price: 1000, category: "Platters", image: bbqPlatter, description: "Mixed BBQ selection for two." },
  { id: "pl2", name: "Platter 02", price: 1800, category: "Platters", image: bbqPlatter, description: "Family-size BBQ spread with dips." },
  { id: "pl3", name: "Platter 03", price: 2100, category: "Platters", image: bbqPlatter, description: "The full D-Pizza BBQ experience.", },
];

export const pastaItems: SimpleItem[] = [
  { id: "pa1", name: "Pasta — Half", price: 500, category: "Pasta", image: pasta, description: "Creamy pasta, half serving." },
  { id: "pa2", name: "Pasta — Full", price: 1000, category: "Pasta", image: pasta, description: "Creamy pasta, full serving." },
];

export const sandwiches: SimpleItem[] = [
  { id: "s1", name: "Sandwich", price: 300, category: "Sandwiches", image: sandwich, description: "Classic chicken sandwich." },
  { id: "s2", name: "Club Sandwich", price: 350, category: "Sandwiches", image: clubSandwich, description: "Triple-decker club classic." },
];

export const broast: SimpleItem[] = [
  { id: "br1", name: "Chicken Broast", price: 400, category: "Broast", image: broastQtr, description: "Golden crispy broast piece." },
  { id: "br2", name: "Strem Broast", price: 450, category: "Broast", image: broastHalf, description: "Extra-crunchy steam broast." },
  { id: "br3", name: "Cheese Broast", price: 450, category: "Broast", image: broastHalf, description: "Broast with a cheesy twist." },
  { id: "br4", name: "Fries", price: 100, category: "Broast", image: fries, description: "Crispy golden fries." },
];

export const pizzas: PizzaItem[] = [
  { id: "p1", name: "D-Pizza Special", category: "Pizzas", image: pizzaDfc, prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Loaded house special — every topping that matters." },
  { id: "p2", name: "Chicken Tikka Pizza", category: "Pizzas", image: pizzaTikka, prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Smoky tikka chunks, desi masala." },
  { id: "p3", name: "Chicken Fajita Pizza", category: "Pizzas", image: pizzaFajita, prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Fajita chicken, peppers, onions." },
  { id: "p4", name: "Vegetable Pizza", category: "Pizzas", image: pizzaVeg, prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Garden-fresh veggie medley." },
  { id: "p5", name: "Lava Pizza", category: "Pizzas", image: lavaPizza, prices: { S: 600, M: 1000, L: 1600, XL: 2000 }, description: "Molten cheese volcano — our signature overflow." },
];

export const deals: DealItem[] = [
  { id: "d1", name: "Deal 1", price: 1100, category: "Deals", image: dealFriends, description: "2 Zinger Burgers + 1 Chicken Broast + 2 Chatni Rolls." },
  { id: "d2", name: "Deal 2", price: 950, category: "Deals", image: pizzaSupreme, description: "1 Medium Pizza + 1 Chicken Broast." },
  { id: "d3", name: "Deal 3", price: 1000, category: "Deals", image: dealFriends, description: "3 Zinger Burgers + 3 Mayo Rolls." },
  { id: "d4", name: "Deal 4", price: 750, category: "Deals", image: dealYaari, description: "2 Small Pizzas + 1 Zinger Burger." },
  { id: "d5", name: "Deal 5", price: 1000, category: "Deals", image: pizzaSupreme, description: "2 Zingers + 1 Medium Pizza." },
  { id: "d6", name: "Deal 6", price: 1000, category: "Deals", image: dealYaari, description: "1 Medium Pizza + 1 Small Pizza + 1 Zinger Burger." },
  { id: "d7", name: "Deal 7", price: 950, category: "Deals", image: pizzaSupreme, description: "1 Large Pizza + 1 Small Pizza." },
  { id: "d8", name: "Deal 8", price: 1200, category: "Deals", image: dealFriends, description: "5 Zinger Burgers + 1 Chatni Roll + 1 Fries." },
  { id: "d9", name: "Deal 9", price: 1050, category: "Deals", image: bbqTikka, description: "1 Large Pizza + 1 Chicken Tikka." },
  { id: "d10", name: "Deal 10", price: 1000, category: "Deals", image: dealYaari, description: "2 Small Pizzas + 1 Zinger Burger + 2 Chatni Rolls." },
  { id: "d11", name: "Deal 11", price: 1800, category: "Deals", image: dealFamily, description: "1 Large Pizza + 4 Zinger Burgers + 2 Mayo Rolls.", highlight: true },
  { id: "d12", name: "Deal 12", price: 1200, category: "Deals", image: pizzaSupreme, description: "2 Small Pizzas + 2 Chicken Broast." },
  { id: "d13", name: "Deal 13", price: 1200, category: "Deals", image: pizzaSupreme, description: "2 Large Pizzas." },
  { id: "d14", name: "Deal 14", price: 1300, category: "Deals", image: dealFamily, description: "1 Large Pizza + 2 Zinger Burgers + 1 Mayo Roll + 1 Fries." },
  { id: "d15", name: "Deal 15", price: 800, category: "Deals", image: dealYaari, description: "2 Small Pizzas + 2 Chicken Rolls + 1 Fries." },
  { id: "d16", name: "Deal 16", price: 1000, category: "Deals", image: dealFriends, description: "5 Zinger Burgers." },
  { id: "d17", name: "Deal 17", price: 800, category: "Deals", image: dealBread, description: "2 Zinger Burgers + 1 Chicken Broast." },
  { id: "d18", name: "Deal 18", price: 1000, category: "Deals", image: bbqPlatter, description: "2 Tikka + 2 Reshmi Kabab + 3 Poori." },
  { id: "d19", name: "Deal 19", price: 800, category: "Deals", image: dealBread, description: "2 Zinger Burgers + 1 Chicken Broast." },
  { id: "d20", name: "Deal 20", price: 900, category: "Deals", image: dealFriends, description: "2 Zinger Burgers + 2 Chicken Rolls + 1 Fries." },
];

export const SPECIAL_TRAIN_PIZZA_PRICE = 3500;
