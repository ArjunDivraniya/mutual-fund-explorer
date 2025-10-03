  # Mutual Fund Explorer (Next.js + MUI)

Discover, analyze, and simulate investments in Indian mutual funds using MFAPI.in. This app wraps public endpoints, provides a modern Material UI interface with charts, and includes an in-app SIP calculator based on historical NAV data.

## Features

- Modern UI built with Material UI (MUI), icons, and subtle animations
- Funds listing with search, fund-house filter chips, and pagination
- Scheme detail page with:
  - Metadata (fund house, type, category)
  - NAV history line chart with period selector (1M/3M/6M/1Y)
  - Returns table (1m, 3m, 6m, 1y)
  - SIP calculator (monthly) with growth chart and key metrics
- API layer that wraps `mfapi.in` with in-memory caching

## Tech Stack

- Next.js App Router
- Material UI (MUI) + MUI X Charts
- Node fetch (built-in) for server routes
- In-memory cache (12h TTL)

## Getting Started

1) Install dependencies

```bash
npm install
```

2) Run the dev server (Turbopack)

```bash
npm run dev
```

The dev server will start at `http://localhost:3000` (or another available port, e.g. 3002). Check your terminal output for the exact URL.

3) Build and run production

```bash
npm run build
npm start
```

## Project Scripts

- `npm run dev` – Start Next.js dev server (Turbopack)
- `npm run build` – Build the app
- `npm start` – Start the production server
- `npm run lint` – Run ESLint

## Routes

### Frontend Pages

- `/` – Landing page with CTAs and feature cards
- `/funds` – Funds listing with search, filter chips, pagination
- `/funds/scheme/[code]` – Scheme details, NAV chart, returns table, SIP calculator

### API Endpoints (Wrapped)

- `GET /api/mf` – List all schemes (cached)
- `GET /api/scheme/:code` – Scheme metadata + NAV history (cached)
- `GET /api/scheme/:code/returns?period=1m|3m|6m|1y` – Precomputed returns
- `GET /api/scheme/:code/returns?from=YYYY-MM-DD&to=YYYY-MM-DD` – Custom range returns
- `POST /api/scheme/:code/sip` – SIP calculator

Example SIP request body:

```json
{
  "amount": 5000,
  "frequency": "monthly",
  "from": "2020-01-01",
  "to": "2023-12-31"
}
```

## Data Source

From `https://www.mfapi.in/`:

- All schemes: `https://api.mfapi.in/mf`
- Scheme NAV history: `https://api.mfapi.in/mf/{SCHEME_CODE}`

## SIP Calculation Rules

- Frequency: monthly
- For each SIP date:
  - Find the NAV on that date or the nearest earlier available date
  - `units = amount / nav`
  - Accumulate units and invested amount
- At the end date (or latest available NAV):
  - `currentValue = totalUnits * endNAV`
  - `absoluteReturn% = ((currentValue - totalInvested) / totalInvested) * 100`
  - `annualizedReturn% = ( (currentValue / totalInvested)^(1/years) - 1 ) * 100` (if duration ≥ 1 year)
- Edge cases:
  - Skip invalid `nav <= 0`
  - If date range is outside available NAV window, the API clamps to the available range or returns `needs_review`

## Caching

- In-memory cache with TTL (12 hours) for:
  - `/api/mf`
  - `/api/scheme/:code`

Redis or external cache is optional and can be added for persistence.

## UI Notes

- MUI X Charts are used for NAV and SIP charts
- Icons: `@mui/icons-material`
- Scheme page includes breadcrumbs, tabs (Overview/Performance), and a period toggle for the chart

## Troubleshooting

- Port in use: The dev server will choose the next available port and log it (e.g. 3002)
- Turbopack workspace warning:
  - If you see a warning about multiple lockfiles, set `turbopack.root` in `next.config.mjs` or remove extra lockfiles in parent directories
- Grid migration notices:
  - MUI v7 uses Grid v2. Warnings may suggest removing `item`/`xs` props; the UI remains functional
- SIP errors:
  - Use a date range that matches the scheme’s NAV availability (the API clamps or returns `needs_review`)

## Contributing

1) Fork the repository
2) Create a feature branch
3) Commit and open a PR

## License

MIT