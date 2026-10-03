# D-Pizza Sanity Studio

This Studio controls the website menu: add, edit, publish, hide, or delete menu items.

## Setup
1. Create/sign in to a Sanity project with the production dataset.
2. Copy .env.example to .env and set the project ID.
3. Run npm install, then npm run dev.
4. Create and publish Menu Item documents.
5. Deploy with npm run deploy.

The frontend only reads published content through Sanity's CDN; no write token is placed in the website.
Add the website origin to Sanity CORS settings.
