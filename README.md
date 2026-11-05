# Restora — Furniture & Sleep Store

Premium responsive furniture and mattress storefront inspired by the supplied Duroflex homepage reference.

## Stack
- React + Vite
- Tailwind CSS + Bootstrap utilities
- Node.js + Express API (Vercel serverless entry)
- Convex database

## Local setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and set `VITE_CONVEX_URL` after running `npx convex dev`.
3. `npm run dev` (frontend) and `npm run server` (Express API).

## Deploy
Connect this repository to Vercel. Build command: `npm run build`; output: `dist`. Set `VITE_CONVEX_URL` and `CONVEX_DEPLOYMENT` in the Vercel/Convex deployment settings.
