# D-Pizza Food — Dadu, Sindh

Official customer-facing website for D-Pizza Food in Dadu, Pakistan.

**Live website:** https://d-pizza.vercel.app/  
**Repository:** https://github.com/suhailahmedaamro786/dinesmooth-vibes

## About

D-Pizza serves customers in Dadu with pizzas, burgers, rolls, BBQ, broast, sandwiches, pasta, and value deals. The website helps customers explore the menu and place orders through WhatsApp.

## Features

- Responsive, mobile-first restaurant website
- Menu sections with food images and item details
- Shopping cart and order summary
- WhatsApp-based ordering flow
- Restaurant information, location, and opening hours
- Customer reviews
- About D-Pizza section featuring the founder/owner
- English/Sindhi/Urdu language support and theme controls

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- TanStack Router
- Zustand
- Supabase integrations
- Vercel deployment

## Local Development

Requirements: Node.js and npm.

```bash
git clone https://github.com/suhailahmedaamro786/dinesmooth-vibes.git
cd dinesmooth-vibes
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

Check `package.json` for the current available scripts.

## Deployment

The production site is deployed on Vercel from the GitHub repository. Changes committed to the configured production branch trigger a deployment when automatic deployments are enabled.

## Project Notes

- Keep the live customer experience and menu data aligned with information approved by D-Pizza.
- Do not commit secrets, API keys, or private environment files.
- Verify the Vercel deployment after changes to customer-facing components or public assets.
