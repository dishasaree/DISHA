# Saree Shop — E-commerce Website + Admin Panel

A complete, modern, responsive saree boutique website with WhatsApp ordering and a
full admin panel. Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**,
backed by **Supabase** (Postgres database, authentication, image storage, and
Row Level Security).

Customers browse sarees and place orders through WhatsApp — no online payment gateway.
You confirm each order, payment and delivery personally over WhatsApp.

---

## ✨ Features

**Customer website**
- Home page with hero, categories, featured / new / best-seller sections and offer banner
- Shop / All Products page with **search, category filter, availability filter and sorting**
- Category pages (Silk, Cotton, Bridal, Party Wear, Daily Wear — fully editable)
- Product detail pages: image gallery, price + discount, description, stock, product code
- About Us, Contact Us, Offers, Privacy Policy, Terms & Conditions pages
- **WhatsApp ordering**: a validated customer form (name, phone, address, quantity, notes)
  saves the order to the database and opens WhatsApp with a pre-filled order message to
  your business number
- Mobile-first, responsive, premium Indian boutique design with smooth animations

**Admin panel** (`/admin`, protected by Supabase Auth)
- Dashboard with product / order counts and recent orders
- Products: add, edit, delete, duplicate; multi-image upload/replace/delete;
  prices, discounts, stock; featured / new arrival / best seller flags; availability
- Categories & collections management
- Offers & promotional banners
- Orders: view customer orders, update status, message customer, delete
- Pages & Content editor (home, about, contact, privacy, terms) with **live preview**
- Settings: business name, logo, favicon, WhatsApp number, contact details,
  navigation links, footer, SEO title/description and social sharing image

All admin writes are protected by **Row Level Security** — only users listed in the
`admins` table can modify data; the public can only read the catalog and create orders.

---

## 🚀 Quick start

### Prerequisites
- **Node.js 18.17+** (Node 20 LTS recommended)
- A free [Supabase](https://supabase.com) account

### 1. Install dependencies
```bash
npm install
```

### 2. Create a Supabase project
1. Go to https://supabase.com/dashboard and create a new project.
2. Open **SQL Editor** and run these files from the `supabase/` folder **in order**:
   - `schema.sql`   (tables, functions, triggers)
   - `policies.sql` (Row Level Security + the `product-images` storage bucket)
   - `seed.sql`     (optional demo categories, products, offers, content)

### 3. Create your admin user
1. In Supabase: **Authentication > Users > Add user** — set an email + password
   (enable “Auto Confirm User”).
2. In **SQL Editor**, run `supabase/create-admin.sql` after changing the email to yours.

### 4. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in from **Supabase > Project Settings > API**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret)
- `NEXT_PUBLIC_SITE_URL` (e.g. http://localhost:3000 while developing)
- `NEXT_PUBLIC_WHATSAPP_FALLBACK` (your WhatsApp number, digits only, e.g. 919876543210)

### 5. Run locally
```bash
npm run dev
```
- Website: http://localhost:3000
- Admin panel: http://localhost:3000/admin  (sign in with the admin user you created)

Set your real WhatsApp business number in **Admin > Settings** — that is the number
used for all “Order on WhatsApp” buttons.

---

## ☁️ Deploy (get a shareable URL)

The easiest way to publish and get a public link is **Vercel** (free tier):

1. Push this project to a GitHub repository.
2. Go to https://vercel.com, **Add New Project**, and import the repo.
3. In **Environment Variables**, add the same keys from your `.env.local`
   (set `NEXT_PUBLIC_SITE_URL` to your Vercel domain).
4. Click **Deploy**. Vercel gives you a shareable `https://your-app.vercel.app` URL
   that anyone can open in a browser — no app install needed.
5. (Optional) Add your own custom domain in Vercel settings.

Any platform that runs Next.js 14 (Netlify, Render, a Node server, Docker) also works.

---

## 🗄 Project structure
```
saree-shop/
├─ supabase/            # SQL: schema, RLS policies, seed data, admin bootstrap
├─ src/
│  ├─ app/
│  │  ├─ (store)/       # Customer-facing pages (home, shop, product, etc.)
│  │  └─ admin/         # Admin panel (auth-protected)
│  ├─ components/       # UI + admin components
│  └─ lib/             # Supabase clients, data fetchers, types, WhatsApp helper
├─ middleware.ts        # Session refresh + /admin route guard
└─ .env.example
```

## 🔒 Security notes
- The public (anon) role can **read** catalog/content and **insert** orders only.
- Every create/update/delete on products, categories, offers, settings, content and
  orders requires an authenticated **admin** (a row in `public.admins`), enforced by
  Postgres RLS policies — not just the UI.
- Image uploads to the `product-images` bucket are admin-only; public read is enabled
  so images display on the site.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client code; it is only for trusted servers.

## 🛠 Customising
- Colours/typography: `tailwind.config.ts` (maroon + gold palette, Playfair + Inter fonts).
- Everything else (text, images, products, number, SEO) is editable from the admin panel
  without touching code.
