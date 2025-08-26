# QuantNova Server (Express + MongoDB)

## Setup
1. `cp .env.example .env` and fill `MONGODB_URI`.
2. `npm install`
3. `npm run dev`

## Endpoints
- `GET /api/health` – server status
- `GET /api/stats` – static site content (tagline, quick stats, etc.)
- `POST /api/leads` – save contact form lead ({ name, email, investorType, message })
- `GET /api/pitch-deck` – serves `server/public/pitch-deck.pdf` if present
- `GET /public/*` – static files
