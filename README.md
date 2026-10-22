# TME Analytics Hub

One central Next.js dashboard that collects visitor analytics from all TME Looker Studio
dashboards (19–20 reports) and shows the important numbers in one place, so clients do not
have to jump between dashboards.

Right now it runs on **demo data**. Once each Looker Studio report has a GA4 Measurement ID,
the team lead can switch it to **live Google Analytics 4 data** without touching any UI code.

## Pages (sidebar)

| Group | Page | What it shows |
|-------|------|---------------|
| Overview | **Command Center** `/` | Liquid-fill "TME INSIGHTS" hero, live-now card, 4 KPI cards with animated icons, traffic trend with 7-day average, portfolio health gauge, top dashboards, smart insights, channel share bar |
| Overview | **Live Pulse** `/live` | Active users now with heartbeat line, users per minute (30 min), live activity stream, busiest dashboards and countries — refreshes every 4 seconds |
| Analytics | **Dashboard Portfolio** `/dashboards` | Summary tiles, usage treemap, reach-vs-depth bubble chart, category bars + line, searchable leaderboard with health score and sparklines |
| Analytics | **Dashboard detail** `/dashboards/[id]` | The same analytics for a single Looker Studio report |
| Analytics | **Audience & Reach** `/audience` | New vs returning stacked area, countries with flags, device rings, channel donut, browsers |
| Analytics | **Engagement** `/engagement` | Weekday × hour heatmap, engagement funnel, time-per-page histogram, category radar, most-used charts (lollipop), top pages |
| Setup | **Integrations** `/integrations` | Connection status of every dashboard + step-by-step setup guide |

## Run it on your computer

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Plugging in a Measurement ID (team lead)

1. **GA4**: create a property and a Web data stream → copy the **Measurement ID** (`G-XXXXXXXXXX`)
   and the numeric **Property ID**.
2. **Looker Studio**: open the report → *File → Report settings* → paste the Measurement ID.
3. **This repo**: open `src/config/dashboards.ts` and fill in, for that dashboard:
   - `measurementId` – the `G-…` ID
   - `lookerReportId` – the part after `/reporting/` in the report URL
   - `ga4PropertyId` – only if this report uses a different GA4 property than the default
4. **Google Cloud**: create a service account, enable the *Google Analytics Data API*, download a JSON key.
   In GA4 → *Admin → Property access management*, add the service-account email as **Viewer**.
5. Copy `.env.example` to `.env.local` and fill in:
   ```
   ANALYTICS_MODE=ga4
   GA4_PROPERTY_ID=123456789
   GOOGLE_CLIENT_EMAIL=...@....iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
6. Restart `npm run dev`. The banner switches from **Demo data** to **Live Google Analytics data**.

If anything is missing, the app automatically falls back to demo data and shows a yellow notice
explaining why.

> The Measurement ID only *sends* data to GA4. Reading it back needs the Property ID and the
> service account. That is why both are required.

## Project structure

```
src/
  config/
    dashboards.ts        ← list of Looker dashboards + their Measurement IDs (edit this)
  lib/
    analytics/
      index.ts           ← picks demo or GA4 based on ANALYTICS_MODE
      demo.ts            ← sample data generator
      ga4.ts             ← live GA4 Data API reader
    types.ts             ← data shapes shared by API and UI
    format.ts, colors.ts
  app/
    api/analytics/       ← GET /api/analytics?range=28d&dashboard=all
    api/realtime/        ← GET /api/realtime
    page.tsx             ← Overview
    realtime/, dashboards/, audience/, settings/
    globals.css          ← colour theme (brand palette)
  components/
    layout/              ← sidebar, top bar, app shell
    charts/              ← all chart widgets
    ui/                  ← cards, count-up numbers, hero, liquid-fill title
    icons/               ← hand-made animated line icons
```

## Changing the look

- **Colours**: brand palette is Slate Grey `#69747C`, Sage Green `#6BAA75`, Radioactive Grass `#84DD63`,
  Chartreuse `#CBFF4D` on a white background. Edit the variables at the top of `src/app/globals.css`
  and the same values in `src/lib/colors.ts`.
- **Hero title**: `src/components/ui/LiquidTitle.tsx` (text, speed and colours of the liquid fill).
- **Icons**: `src/components/icons/AnimatedIcons.tsx`.

## Tech

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Recharts · Framer Motion ·
country-flag-icons · Google Analytics Data API
