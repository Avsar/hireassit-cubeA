# HireAssist by CubeA — Website

## Quick start
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Configure
- Edit texts in `src/components/Landing.tsx` (translations EN/NL).
- To make the Contact form work:
  - Copy `.env.example` to `.env.local` and set `LEAD_WEBHOOK_URL` (Make.com webhook or Formspree endpoint).
- Optional: add Crisp chat & Plausible analytics in `src/app/layout.tsx`.

## Deploy (Vercel)
- Push to GitHub, then import the repo in Vercel → Deploy.
- Add your domain `cubea.nl` in Vercel → copy DNS records to Namecheap.
