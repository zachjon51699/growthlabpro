# Contractor opt-in landing page — local setup

This guide explains how to run the **GrowthLabPro** project on your computer and view the contractor opt-in landing page at `/contractor-optin`.

---

## What you need installed

| Tool | Minimum version | Check with |
|------|-----------------|------------|
| **Node.js** | 18+ (20 LTS recommended) | `node -v` |
| **npm** | Comes with Node | `npm -v` |

Install Node from [https://nodejs.org](https://nodejs.org) if you do not have it.

---

## 1. Get the project folder on your machine

You already have the project if you are editing it in Cursor. The folder should look like:

```
GrowthLabPro/
├── docs/
│   └── CONTRACTOR-OPTIN-SETUP.md    ← this file
├── public/
│   └── images/                      ← logo, optin-hero, etc.
├── src/
│   ├── App.tsx                      ← main marketing site (home, pricing, …)
│   ├── AppRoutes.tsx                ← routes: /contractor-optin + everything else
│   ├── main.tsx                     ← app entry
│   ├── components/
│   │   └── ContractorOptinLandingPage.tsx   ← opt-in page + modal form
│   └── services/
│       └── gohighlevel.ts           ← form → GoHighLevel API
├── index.html
├── package.json
├── vite.config.ts
├── netlify.toml                     ← deploy / SPA redirects
└── .env.local                       ← you create this (secrets, not in git)
```

**From Git (if you clone elsewhere):**

```bash
git clone <your-repo-url> GrowthLabPro
cd GrowthLabPro
```

---

## 2. Install dependencies (first time only)

Open Terminal (or Cursor’s terminal), go to the project folder, then run:

```bash
cd /path/to/GrowthLabPro
npm install
```

Wait until it finishes without errors.

---

## 3. Environment variables (GoHighLevel form)

The modal form (“Click to See How it Works”) sends leads to **GoHighLevel** when these variables are set.

1. In the **project root** (`GrowthLabPro/`), create a file named **`.env.local`** (same level as `package.json`).

2. Copy from **`.env.example`** and fill in real values:

```env
VITE_GHL_API_KEY=your_private_api_key_here
VITE_GHL_LOCATION_ID=your_location_id_here
```

Optional:

```env
VITE_GHL_API_BASE=https://services.leadconnectorhq.com
```

3. **Restart** the dev server after changing `.env.local` (Vite only reads env on startup).

**Where to find GHL values**

- **API key:** GoHighLevel → Settings → API / Integrations (private token with contact create permission).
- **Location ID:** Sub-account / location settings in GHL.

**Without `.env.local`:** the page still loads; submitting the form will show an error like `VITE_GHL_API_KEY is missing`.

---

## 4. Run the site locally

```bash
npm run dev
```

You should see something like:

```
  VITE v5.x.x  ready in … ms
  ➜  Local:   http://localhost:5173/
```

Leave this terminal **open** while you work.

**If the page does not update after edits:**

```bash
npm run dev:clean
```

**If port 5173 is busy:** stop other `npm run dev` windows, or kill the process using that port.

---

## 5. Open the landing page in the browser

| URL | What you see |
|-----|----------------|
| **http://localhost:5173/** | Main GrowthLabPro site (not the opt-in page) |
| **http://localhost:5173/contractor-optin** | **Contractor opt-in landing page** |

Bookmark the second URL for quick testing.

**Hard refresh if it looks old:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows).

---

## 6. What to test on the opt-in page

1. Logo, headline, hero image, Wistia testimonials.
2. Green **“Click to See How it Works”** (desktop and mobile sticky bar) → opens the modal.
3. Modal: name + phone → submit → success message (if GHL env is configured).
4. Hero **play** overlay still scrolls to the first testimonial video (does not open the modal).

The opt-in page is **not** linked from the main site header; use the URL above or share `/contractor-optin` in ads.

---

## 7. Production build (optional, local)

Simulate what Netlify serves:

```bash
npm run build
npm run preview
```

Then open **http://localhost:4173/contractor-optin** (preview port may differ; check terminal output).

---

## 8. Deploy to production (Netlify)

1. Push your branch to GitHub (or connect the repo in Netlify).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Add the same env vars in **Netlify → Site settings → Environment variables:**
   - `VITE_GHL_API_KEY`
   - `VITE_GHL_LOCATION_ID`
   - (optional) `VITE_GHL_API_BASE`
5. Redeploy after env changes.

Live URL (after deploy):

**https://growthlabpro.com/contractor-optin**

`netlify.toml` and `public/_redirects` already send unknown paths to `index.html` so `/contractor-optin` works as a client route.

---

## 9. Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page / 404 on `/contractor-optin` | Confirm `src/main.tsx` renders `<AppRoutes />` and `AppRoutes.tsx` has the `/contractor-optin` route. |
| Changes not showing | `npm run dev:clean`, hard refresh, only one dev server on 5173. |
| Form error about missing API key | Create `.env.local` with `VITE_GHL_*` and restart `npm run dev`. |
| Form submits but no contact in GHL | Check API key permissions, location ID, and GHL API error in browser Network tab. |
| Live site unchanged | Deploy latest commit; try Netlify “Clear cache and deploy”. |

---

## 10. Key files (for developers)

| File | Role |
|------|------|
| `src/components/ContractorOptinLandingPage.tsx` | Page layout, modal, form submit |
| `src/AppRoutes.tsx` | `Route path="/contractor-optin"` |
| `src/main.tsx` | Boots React with `AppRoutes` |
| `src/services/gohighlevel.ts` | `createContact()` → GHL API |
| `public/images/logo.png` | Header logo |
| `public/images/optin-hero.webp` | Hero image |

---

## Quick command cheat sheet

```bash
cd /path/to/GrowthLabPro
npm install              # once
npm run dev              # local dev → http://localhost:5173/contractor-optin
npm run dev:clean        # dev with cleared Vite cache
npm run build            # production build → dist/
npm run preview          # serve dist/ locally
```
