# Peptide Advisor

A frontend rebuild of [The Peptide Formula](https://peptidehub-2ejbvynz.manus.space/) — a peptide/longevity
e-commerce and telehealth site — extended with a custom **AI Peptide Advisor** on every product page: an
auto-generated overview/benefits/risks/dosing summary plus an interactive chat widget for follow-up questions.

## Screenshots

**Home**

![Home page](docs/screenshots/home.png)

**Catalog**

![Catalog page](docs/screenshots/catalog.png)

**Product detail with AI Peptide Advisor**

![Product detail page](docs/screenshots/product-detail.png)

## Project structure

```
peptide-advisor/
├── client/                 React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/     Header, Layout, and shared icon set
│   │   ├── data/           Mock product/category data (products.ts)
│   │   ├── pages/          Home, Catalog, ProductDetail, ComingSoon
│   │   ├── App.tsx         Route definitions
│   │   ├── main.tsx        App entry point (BrowserRouter)
│   │   └── index.css       Tailwind v4 theme tokens (colors, fonts)
│   └── vite.config.ts
├── server/                 Node API (scaffolded, not yet implemented)
│   └── src/
│       ├── routes/         API route handlers
│       ├── providers/      External service integrations
│       └── data/           Server-side data access
└── docs/screenshots/       README screenshots
```

The client currently runs entirely on mock data in `client/src/data/products.ts`; the `server/` directory
is scaffolded for a future API but has no implementation yet.

## Pages

| Route | Description |
|---|---|
| `/` | Hero, trust indicators, and health category navigation |
| `/catalog` | Searchable/filterable product grid (category, Rx-only) |
| `/product/:id` | Product details + AI Peptide Advisor (summary + chat) |
| `/practitioners`, `/health-assessment`, `/wholesale`, `/join-network` | Placeholder pages, not yet built |

## Running locally

```bash
cd client
npm install
npm run dev
```

Then open http://localhost:5173.

## Tech stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router 7
