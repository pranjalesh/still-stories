# Still Stories

> Street photography portfolio & booking site. Built with Next.js 14 (App Router), Supabase, Cloudinary, Cal.com, and Resend.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Image storage | Cloudinary |
| Booking | Cal.com embed |
| Email | Resend (free tier) |
| Hosting | Vercel |

---

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy the example file and fill in your real values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|----------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase dashboard → Project Settings → API |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Settings → Account |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard → Settings → Access Keys |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard → Settings → Access Keys |
| `RESEND_API_KEY` | resend.com → API Keys |
| `CAL_EMBED_URL` | Already set to `https://cal.com/pg-w7nie3` |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase setup

### Create the table

1. Go to your [Supabase project](https://supabase.com)
2. Navigate to **SQL Editor**
3. Paste and run `supabase/schema.sql`

This creates the `photos` table with:
- Row Level Security enabled (anon read-only)
- Indexes on `category` and `uploaded_at`

### Seed placeholder data

After running the schema, paste and run `supabase/seed.sql` to populate 8 placeholder rows (2 per category). These use `res.cloudinary.com/demo` placeholder URLs — replace them with real Cloudinary URLs once you've uploaded photos.

---

## Cloudinary setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Note your **Cloud Name**, **API Key**, and **API Secret**
3. Set up the folder structure in your Media Library:

```
still-stories/
  candid/
  urban/
  night/
  people/
```

Images are always served with transformations `w_800,q_auto,f_auto` — full-resolution originals are never exposed.

---

## Vercel deployment

1. Push your repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add all environment variables from `.env.local` in the Vercel dashboard
4. Deploy. Vercel auto-detects Next.js.

**Custom domain**: set it in Vercel → Project → Settings → Domains.

The gallery page uses ISR (`revalidate = 60`), so new photos appear within 60 seconds of being added to Supabase without a full redeploy.

---

## Python upload script

Upload a photo and automatically record it in Supabase in one command.

### Install Python dependencies

```bash
pip install cloudinary supabase python-dotenv
```

### Usage

```bash
cd scripts
python upload_photo.py --file ./photo.jpg --category urban --title "rainy commute"
```

**Arguments:**

| Argument | Required | Description |
|----------|----------|-------------|
| `--file` | ✓ | Path to the image file |
| `--category` | ✓ | One of: `candid`, `urban`, `night`, `people` |
| `--title` | — | Optional title for the photo |

**Examples:**

```bash
# Upload a candid shot
python upload_photo.py --file ~/shoots/market.jpg --category candid --title "Market glance"

# Upload a night photo without a title
python upload_photo.py --file ~/shoots/neon.jpg --category night

# Upload a people photo
python upload_photo.py --file ~/shoots/vendor.jpg --category people --title "The vendor"
```

The script reads credentials from `.env.local` in the project root. On success it prints the Cloudinary URL and the new Supabase row ID.

---

## Project structure

```
still-stories/
├── app/
│   ├── layout.tsx          # Root layout with Nav
│   ├── page.tsx            # Home — hero + CTAs
│   ├── gallery/
│   │   └── page.tsx        # Filterable photo grid (ISR)
│   ├── about/
│   │   └── page.tsx        # Bio + profile photo
│   ├── booking/
│   │   └── page.tsx        # Cal.com iframe embed
│   ├── contact/
│   │   └── page.tsx        # Inquiry form
│   └── api/
│       ├── contact/route.ts  # Resend email handler
│       └── photos/route.ts   # Supabase photos API
├── components/
│   ├── Nav.tsx             # Fixed top nav
│   ├── GalleryGrid.tsx     # Masonry grid + category filter
│   └── ContactForm.tsx     # Client-side contact form
├── lib/
│   ├── supabase.ts         # Supabase client + typed helpers
│   └── cloudinary.ts       # Cloudinary SDK config + URL builder
├── scripts/
│   └── upload_photo.py     # Python photo upload CLI
├── supabase/
│   ├── schema.sql          # Table DDL + RLS policies
│   └── seed.sql            # 8 placeholder rows
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
└── README.md
```
