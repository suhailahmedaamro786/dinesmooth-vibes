const image = (folder: string, file: string) =>
  `/assets/menu-images/${folder}/${file}`;

export const BBQ_IMAGE_BY_NAME: Record<string, string> = {
  "Chicken Tikka": image("BBQ", "Chicken Tikka.jpg"),
  "Chicken Malai Tikka": image("BBQ", "Chicken Malai Tikka.jpg"),
  "Chicken Leg Tikka": image("BBQ", "Chicken Leg Tikka.jpg"),
  "Chicken Leg Malai Tikka": image("BBQ", "Chicken Leg Malai Tikka.jpg"),
  "Chicken Malai Boti": image("BBQ", "Chicken Malai Boti.jpg"),
  "Chicken Red Boti": image("BBQ", "Chicken Red Boti.jpg"),
  "Reshmi Kabab": image("BBQ", "Reshmi Kabab.jpg"),
  "Chicken Hot Wings": image("BBQ", "Chicken Hot Wings.jpg"),
};

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
  { id: "b1", name: "Zinger Burger", price: 250, category: "Burgers", image: image("Burgers", "Zinger Burger.jpg"), description: "Crispy zinger fillet, fresh lettuce, signature mayo." },
  { id: "b2", name: "Zinger Cheez Burger", price: 350, category: "Burgers", image: image("Burgers", "Zinger Cheez Burger.jpg"), description: "Zinger with a melted cheese layer." },
  { id: "b3", name: "Zinger Tower", price: 400, category: "Burgers", image: image("Burgers", "Zinger Tower.jpg"), description: "Tall stack with hash brown & cheese." },
];

export const rolls: SimpleItem[] = [
  { id: "r1", name: "Mayo Roll", price: 150, category: "Rolls", image: image("Rolls", "Mayo Roll.jpg"), description: "Soft paratha wrap, garlic mayo." },
  { id: "r2", name: "Chatni Roll", price: 150, category: "Rolls", image: image("Rolls", "Chatni Roll.jpg"), description: "Spicy green chatni wrap." },
  { id: "r3", name: "Sharma Roll", price: 150, category: "Rolls", image: image("Rolls", "Sharma Roll.jpg"), description: "Classic shawarma-style roll." },
  { id: "r4", name: "Cheese Roll", price: 220, category: "Rolls", image: image("Rolls", "Cheese Roll.jpg"), description: "Loaded with melty cheese." },
  { id: "r5", name: "Zinger Jambo Roll", price: 250, category: "Rolls", image: image("Rolls", "Zinger Jambo Roll.jpg"), description: "Jumbo zinger strips, fresh slaw." },
  { id: "r6", name: "Jambo Roll", price: 250, category: "Rolls", image: image("Rolls", "Jambo Roll.jpg"), description: "Jumbo chicken roll, full filling." },
  { id: "r7", name: "Afghani Roll", price: 350, category: "Rolls", image: image("Rolls", "Afghani Roll.jpg"), description: "Creamy Afghani-style chicken wrap." },
];

export const bbq: SimpleItem[] = [
  { id: "q1", name: "Chicken Tikka", price: 400, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Tikka"], description: "Smoky char-grilled tikka, lemon & onion." },
  { id: "q2", name: "Chicken Malai Tikka", price: 400, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Malai Tikka"], description: "Creamy malai marinade, melt-in-mouth." },
  { id: "q3", name: "Chicken Leg Tikka", price: 350, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Leg Tikka"], description: "Juicy leg piece, fire-grilled." },
  { id: "q4", name: "Chicken Leg Malai Tikka", price: 350, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Leg Malai Tikka"], description: "Malai-marinated leg, smoky finish." },
  { id: "q5", name: "Chicken Malai Boti", price: 250, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Malai Boti"], description: "Soft creamy boti cubes." },
  { id: "q6", name: "Chicken Red Boti", price: 250, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Red Boti"], description: "Spicy red masala boti." },
  { id: "q7", name: "Reshmi Kabab", price: 200, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Reshmi Kabab"], description: "Silky minced-chicken kabab skewers." },
  { id: "q8", name: "Chicken Hot Wings", price: 200, category: "BBQ", image: BBQ_IMAGE_BY_NAME["Chicken Hot Wings"], description: "Fiery grilled hot wings." },
];

export const platters: SimpleItem[] = [
  { id: "pl1", name: "Platter 01", price: 1000, category: "Platters", image: "/assets/menu/bbq-platter.jpg", description: "Mixed BBQ selection for two." },
  { id: "pl2", name: "Platter 02", price: 1800, category: "Platters", image: "/assets/menu/bbq-platter.jpg", description: "Family-size BBQ spread with dips." },
  { id: "pl3", name: "Platter 03", price: 2100, category: "Platters", image: "/assets/menu/bbq-platter.jpg", description: "The full D-Pizza BBQ experience." },
];

export const pastaItems: SimpleItem[] = [
  { id: "pa1", name: "Pasta — Half", price: 500, category: "Pasta", image: image("Pasta", "Pasta Half.jpg"), description: "Creamy pasta, half serving." },
  { id: "pa2", name: "Pasta — Full", price: 1000, category: "Pasta", image: image("Pasta", "Pasta Full.jpg"), description: "Creamy pasta, full serving." },
];

export const sandwiches: SimpleItem[] = [
  { id: "s1", name: "Sandwich", price: 300, category: "Sandwiches", image: image("Sandwiches", "Sandwich.jpg"), description: "Classic chicken sandwich." },
  { id: "s2", name: "Club Sandwich", price: 350, category: "Sandwiches", image: image("Sandwiches", "Club Sandwich.jpg"), description: "Triple-decker club classic." },
];

export const broast: SimpleItem[] = [
  { id: "br1", name: "Chicken Broast", price: 400, category: "Broast", image: image("Broast", "Chicken Broast.jpg"), description: "Golden crispy broast piece." },
  { id: "br2", name: "Strem Broast", price: 450, category: "Broast", image: image("Broast", "Strem Broast.jpg"), description: "Extra-crunchy steam broast." },
  { id: "br3", name: "Cheese Broast", price: 450, category: "Broast", image: image("Broast", "Cheese Broast.jpg"), description: "Broast with a cheesy twist." },
  { id: "br4", name: "Fries", price: 100, category: "Broast", image: image("Broast", "Fries.jpg"), description: "Crispy golden fries." },
];

export const pizzas: PizzaItem[] = [
  { id: "p1", name: "D-Pizza Special", category: "Pizzas", image: image("Pizzas", "D-Pizza Special.jpg"), prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Loaded house special — every topping that matters." },
  { id: "p2", name: "Chicken Tikka Pizza", category: "Pizzas", image: image("Pizzas", "Chicken Tikka Pizza.jpg"), prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Smoky tikka chunks, desi masala." },
  { id: "p3", name: "Chicken Fajita Pizza", category: "Pizzas", image: image("Pizzas", "Chicken Fajita Pizza.jpg"), prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Fajita chicken, peppers, onions." },
  { id: "p4", name: "Vegetable Pizza", category: "Pizzas", image: image("Pizzas", "Vegetable Pizza.jpg"), prices: { S: 350, M: 700, L: 1000, XL: 1300 }, description: "Garden-fresh veggie medley." },
  { id: "p5", name: "Lava Pizza", category: "Pizzas", image: image("Pizzas", "Lava Pizza.jpg"), prices: { S: 600, M: 1000, L: 1600, XL: 2000 }, description: "Molten cheese volcano — our signature overflow." },
];

export const deals: DealItem[] = [
  { id: "d1", name: "Deal 1", price: 1100, category: "Deals", image: image("Deals", "Deal 01.jpg"), description: "2 Zinger Burgers + 1 Chicken Broast + 2 Chatni Rolls." },
  { id: "d2", name: "Deal 2", price: 950, category: "Deals", image: image("Deals", "Deal 02.jpg"), description: "1 Medium Pizza + 1 Chicken Broast." },
  { id: "d3", name: "Deal 3", price: 1000, category: "Deals", image: image("Deals", "Deal 03.jpg"), description: "3 Zinger Burgers + 3 Mayo Rolls." },
  { id: "d4", name: "Deal 4", price: 750, category: "Deals", image: image("Deals", "Deal 04.jpg"), description: "2 Small Pizzas + 1 Zinger Burger." },
  { id: "d5", name: "Deal 5", price: 1000, category: "Deals", image: image("Deals", "Deal 05.jpg"), description: "2 Zingers + 1 Medium Pizza." },
  { id: "d6", name: "Deal 6", price: 1000, category: "Deals", image: image("Deals", "Deal 06.jpg"), description: "1 Medium Pizza + 1 Small Pizza + 1 Zinger Burger." },
  { id: "d7", name: "Deal 7", price: 950, category: "Deals", image: image("Deals", "Deal 07.jpg"), description: "1 Large Pizza + 1 Small Pizza." },
  { id: "d8", name: "Deal 8", price: 1200, category: "Deals", image: image("Deals", "Deal 08.jpg"), description: "5 Zinger Burgers + 1 Chatni Roll + 1 Fries." },
  { id: "d9", name: "Deal 9", price: 1050, category: "Deals", image: image("Deals", "Deal 09.jpg"), description: "1 Large Pizza + 1 Chicken Tikka." },
  { id: "d10", name: "Deal 10", price: 1000, category: "Deals", image: image("Deals", "Deal 10.jpg"), description: "2 Small Pizzas + 1 Zinger Burger + 2 Chatni Rolls." },
  { id: "d11", name: "Deal 11", price: 1800, category: "Deals", image: image("Deals", "Deal 11.jpg"), description: "1 Large Pizza + 4 Zinger Burgers + 2 Mayo Rolls.", highlight: true },
  { id: "d12", name: "Deal 12", price: 1200, category: "Deals", image: image("Deals", "Deal 12.jpg"), description: "2 Small Pizzas + 2 Chicken Broast." },
  { id: "d13", name: "Deal 13", price: 1200, category: "Deals", image: image("Deals", "Deal 13.jpg"), description: "2 Large Pizzas." },
  { id: "d14", name: "Deal 14", price: 1300, category: "Deals", image: image("Deals", "Deal 14.jpg"), description: "1 Large Pizza + 2 Zinger Burgers + 1 Mayo Roll + 1 Fries." },
  { id: "d15", name: "Deal 15", price: 800, category: "Deals", image: image("Deals", "Deal 15.jpg"), description: "2 Small Pizzas + 2 Chicken Rolls + 1 Fries." },
  { id: "d16", name: "Deal 16", price: 1000, category: "Deals", image: image("Deals", "Deal 16.jpg"), description: "5 Zinger Burgers." },
  { id: "d17", name: "Deal 17", price: 800, category: "Deals", image: image("Deals", "Deal 17.jpg"), description: "2 Zinger Burgers + 1 Chicken Broast." },
  { id: "d18", name: "Deal 18", price: 1000, category: "Deals", image: image("Deals", "Deal 18.jpg"), description: "2 Tikka + 2 Reshmi Kabab + 3 Poori." },
  { id: "d19", name: "Deal 19", price: 900, category: "Deals", image: image("Deals", "Deal 19.jpg"), description: "2 Zinger Burgers + 2 Chicken Rolls + 1 Fries." },
];
