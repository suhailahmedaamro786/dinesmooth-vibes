# DFC Taste Hub

Act as an elite Full-Stack Web Developer and Creative UI/UX Designer. I want you to architect and write a production-grade, highly responsive, and ultra-smooth fast-food restaurant web application for "DADU FOOD CORNER - DFC (THE TASTE HUB)". 



The implementation must feature jaw-dropping micro-interactions, liquid-smooth transitions, and clean layouts optimized for both 120Hz mobile screens and desktop monitors.



### TECH STACK REQUIREMENT:

- Framework: Next.js (App Router), React 19, TypeScript

- Styling: Tailwind CSS (Mobile-first, fully fluid utility classes)

- Animations: Framer Motion (For high-performance, layout-cached transitions)

- State & Live Sync: Zustand (Global state) with full mockup real-time API integrations via Next.js API route handlers (`/api/orders`).



---



### PART 1: ULTRA-SMOOTH CUSTOMER FRONTEND



1. DESIGN AESTHETIC & ANIMATIONS (Framer Motion + Tailwind):

- Theme: Premium Dark Mode. Deep Charcoal (#0F0F11) base, Pure White body text, and High-Vibrancy Amber (#FBBF24) for headers, primary CTA buttons, and interactive states.

- Micro-interactions: Cards should scale subtly on hover (`whileHover={{ scale: 1.02 }}`), buttons must have tactile feedback on tap (`whileTap={{ scale: 0.95 }}`), and elements must smoothly fade/slide into view as the user scrolls.



2. STRUCTURE & CORE MENU DATA (MUST CONTAIN ALL ITEMS):

- Sticky Navbar: Blurs the background on scroll (`backdrop-blur-md`). Includes a real-time reactive Cart Icon with an animated badge showing the current item count.

- Dynamic Hero Section: Parallax background or smooth fade-in text introducing "DADU FOOD CORNER - DFC" and tagline "THE TASTE HUB". Feature an urgent highlight banner for the "SPECIAL TRAIN PIZZA (FOR SERVICE) — RS 3500".

- Interactive Menu Feed: Divided into clean, animated tabs (Burgers, Rolls, Pizzas, Broast, Special Deals). Switching tabs must use Framer Motion's `layoutId` layout transition for a sliding indicator effect.

  * BURGERS: Zinger Burger (Rs 300), Zinger Cheese (Rs 350), Double Chicken (Rs 500), Zinger Tower (Rs 600), Sandwich (Rs 250), Cheese Sandwich (Rs 300), Club Sandwich (Rs 400).

  * ROLLS: Mayo Roll (Rs 250), Zinger Roll (Rs 300), Zinger Cheese Roll (Rs 350).

  * CHICKEN BROAST: Full (Rs 2000), Half (Rs 1100), Qtr (Rs 550), Chicken Nuggets (Rs 550), Hot Wings 6pcs (Rs 400), Hot Wings 9pcs (Rs 600), Hot Shot 8pcs (Rs 500).

  * PIZZA SPECIAL (Must include an elegant dropdown/selector to switch sizes, immediately updating the active price tag with a smooth numbers transition):

    - DFC Special (S: 550 | M: 1000 | L: 1400 | XL: 1750)

    - Chicken Tikka BBQ (S: 500 | M: 950 | L: 1350 | XL: 1700)

    - Chicken Fajita (S: 500 | M: 950 | L: 1350 | XL: 1700)

    - Chicken Supreme, Chicken Tandoori, Chicken Hot Spicy, Chicken Cheese Lover, Pepperoni Hut (All: S: 500 | M: 900 | L: 1300 | XL: 1600)

    - Vegetarian Pizza (S: 400 | M: 700 | L: 900 | XL: 1300)

- EXCLUSIVE BUNDLE DEALS (Highlighted via custom high-contrast borders and custom glow effects):

  * Family Deal (Rs 3150): 1 Extra Large Pizza + 3 Small Pizza + 1 Jumbo Cold Drink.

  * Friends Deal (Rs 1800): 5 Zinger Burger + 2 Chicken Roll.

  * Yaari Deal (Rs 1000): 1 DFC Special Small Pizza + 1 Zinger Burger + 1 Chicken Roll.

  * DFC Special: DFC Special Bread (Rs 1100).



3. FLUID SLIDING CART DRAWER & CHECKOUT:

- Clicking the cart icon slides open a smooth Right Drawer panel (`AnimatePresence` overlay slide). 

- Items inside can be increased/decreased with instant subtotal and checkout calculations updating seamlessly.

- Checkout workflow expands an inline form capturing Customer Name, Active Mobile Number, Full Delivery Address, and Special Cooking/Delivery Notes.

- On final click, "Place Order" button transforms into a loading spinner, dispatches a payload to `/api/orders`, and fires off a beautiful "Order Placed Successfully 🎉" fullscreen checkmark animation.



---



### PART 2: REAL-TIME MANAGED ADMIN DASHBOARD



1. PERFORMANCE DASHBOARD INTERFACE:

- High-end corporate executive grid design. Modern metrics sidebar displaying: Current Shift Total Revenue, Active Incoming Orders, and Completed Dispatch stats.



2. LIVE KANBAN/ORDER FEED PANEL:

- Uses a real-time reactive polling interface or global synchronized state mechanism. When a user checks out, their order must append to the Admin panel instantaneously without page reloads.

- Order Cards must list complete contextual variables: Auto-generated Order ID, Timestamp, Customer Info, Detailed Items breakdown (with selected Pizza sizes explicitly printed), and Grand Total.

- Layout Transitions: Changing order statuses ("Pending" -> "Preparing" -> "Out for Delivery" -> "Completed") must visually shift the card across dashboard status columns using Framer Motion’s smooth layout animation (`layout`).

- Sound Synthesis: Execute an HTML5 Audio notification chink to flag the system administrator when a new payload lands.



---



### CODE CODE DELIVERY:

Deliver modular, enterprise-grade codebase snippets. Give me the Zustand State Configuration file (`store/useCartStore.ts`), the clean Next.js Dynamic Menu Page (`app/page.tsx`) mapping all explicit restaurant catalog datasets with Framer Motion features, and the live React Admin Panel Layout (`app/admin/page.tsx`) capable of routing updates dynamically.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dinesmooth-vibes.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d4dad2a2-3087-4532-ae5b-af224d194cab).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
