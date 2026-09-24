# Feedants — Competition Details Screen (Full Stack Assignment)

A functional, dynamic implementation of the Competition Details screen:
React Native frontend + Node.js/Express backend + MongoDB, with all
competition/registration/submission state served from the database and
computed live against the current time — nothing is hardcoded.

## Live demo

- **Web app:** https://feedants-web.vercel.app
- **API:** https://feedants-competition-app.vercel.app (try `/health` and `/api/competitions`)

The web app is the same React Native (Expo) codebase exported for web and
deployed on Vercel; the API is the Express backend deployed on Vercel as a
serverless function, backed by MongoDB Atlas.

## Structure

```
backend/   Node.js + Express + MongoDB API
mobile/    React Native (Expo) app with the Competition Details screen
```

## Running it

### 1. Backend

```bash
cd backend
cp .env.example .env      # then set MONGO_URI and JWT_SECRET
npm install
npm run seed               # creates a demo user + the seeded competition, prints its id
npm run dev                 # starts the API on http://localhost:4000
```

Demo login: `demo@feedants.test` / `password123` (already registered & paid
for the seeded competition, so you can see the "Registered" / "Upload
Submission" states immediately; register a second user to see the
"Register Now" flow).

### 2. Mobile app

```bash
cd mobile
npm install
```

In `App.js`, set `DEMO_COMPETITION_ID` to the id printed by `npm run seed`.
In `src/api/client.js`, set `API_BASE_URL` to your machine's LAN IP if
you're running on a physical device (`localhost` doesn't resolve there),
or `http://10.0.2.2:4000/api` for the Android emulator.

```bash
npm start   # opens Expo dev tools; press i / a to launch a simulator, or scan the QR code
```

The screen currently calls the API without a login screen wired up for
brevity — see "Assumptions" below.

## Deployment

Both projects are deployed from this repo as separate Vercel projects.

**Backend** (Root Directory: `backend`, preset: Other)
- `backend/api/index.js` is the serverless entry. It reuses the Mongo
  connection across warm invocations and hands requests to the Express app
  from `src/app.js`. `src/server.js` is still used for local development.
- `backend/vercel.json` rewrites every path to that function.
- Environment variables set in Vercel: `MONGO_URI`, `JWT_SECRET`,
  `JWT_EXPIRES_IN`, `CLIENT_ORIGIN`.
- MongoDB Atlas allows `0.0.0.0/0`, since Vercel functions use rotating IPs.
- `app.set('trust proxy', 1)` is enabled so rate limiting sees real client IPs.

**Web app** (Root Directory: `mobile`)
- Build Command: `npx expo export -p web`, Output Directory: `dist`.
- `API_BASE_URL` in `mobile/src/api/client.js` points at the live API.

## API overview

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` / `/login` | Basic auth, returns a JWT |
| GET | `/api/competitions` | List competitions with derived summary state |
| GET | `/api/competitions/:id` | Full details + derived state + viewer's participation state |
| POST | `/api/competitions/:id/register` | Reserve a spot (atomic, concurrency-safe) |
| POST | `/api/competitions/:id/registration/confirm-payment` | Mark a pending registration as paid |
| DELETE | `/api/competitions/:id/register` | Cancel a registration, frees the spot |
| POST | `/api/competitions/:id/submissions` | Submit an entry (only while window is open & registration is confirmed) |

## Key design decisions

- **Nothing is hardcoded client-side.** Every state shown on screen —
  spots left, whether registration/submission is open, whether the
  viewer is registered, whether they've already submitted — is computed
  server-side against the current time on every request and returned as
  a `state` + `viewer` object. The client only renders what it's told.
- **Concurrency-safe spot booking.** The classic race (two users grabbing
  the last spot at once) is handled with a single atomic
  `findOneAndUpdate` whose filter re-checks `spotsBooked < maxSpots` and
  the registration window at the database level, incrementing in the
  same operation. Only one concurrent request can win the last spot; the
  other gets a clean `409 COMPETITION_FULL`.
- **Double-registration is prevented at two layers**: an application-level
  pre-check (fast, friendly error message) and a unique compound index on
  `(competition, user)` in MongoDB (the actual safety net). If the unique
  index rejects an insert after a spot was already reserved, the spot is
  released via a compensating decrement.
- **Derived state lives in one place** (`Competition.getDerivedState()`),
  a pure function reused by the details endpoint and every
  validation-heavy controller, so "what counts as open" can never drift
  between read and write paths.
- **Server-synced countdown.** The details response includes `serverTime`;
  the client computes an offset from it so the on-screen countdown isn't
  thrown off by a wrong device clock, and polls every 20s to reconcile
  with real registrations happening elsewhere.

## Assumptions

- Authentication is a minimal email/password + JWT scheme, sufficient to
  demonstrate per-user registration/submission state. A real app would
  likely reuse Feedants' existing auth service.
- Payments are mocked: registering with a non-zero entry fee creates a
  `pending` registration with a generated `orderId`; the client then
  calls a `confirm-payment` endpoint with a fake `paymentId` to simulate
  a successful Razorpay checkout completing. Wiring the real Razorpay
  Checkout SDK + server-side signature verification was out of scope for
  the time available but the seam (`payment.provider`, `payment.orderId`,
  `payment.paymentId`) is where it would plug in.
- File upload for submissions is a pasted media URL rather than an actual
  upload pipeline (S3/Cloudinary presigned upload). This keeps the
  assignment's scope on the competition/registration business logic
  rather than a media pipeline.
- "Registration opens" is modelled explicitly (`registrationOpensAt`)
  even though the reference design only shows a close date, since a real
  system needs both ends of the window.
- Refund policy, "how prize money is received," and "hear from our
  users" are static/informational sections in the design with no stated
  backend behavior, so they're rendered from static competition fields
  rather than given their own endpoints.

## Trade-offs

- **No real-time push.** Spots-left and countdown state update via
  20-second polling rather than websockets/SSE. For "thousands of
  concurrent users," a production version would likely publish
  `spotsBooked` changes over a lightweight pub/sub (e.g. Redis +
  websockets) so the UI updates instantly without polling load on the
  API.
- **Compensating decrement instead of a multi-document transaction** for
  the register flow. A MongoDB transaction across `Competition` and
  `Registration` would be strictly more correct, but requires a replica
  set; the compensating-decrement approach is safe for this assignment's
  scope and is called out explicitly here rather than silently assumed.
- **No caching layer.** At real scale, `GET /competitions/:id` is a very
  hot read; it's a natural candidate for a short-TTL cache (a few
  seconds) in front of Mongo, invalidated on registration/cancellation.
  Skipped here to keep the data path easy to reason about/demo.

## What I'd change for production

- Replace the compensating-decrement registration flow with a proper
  MongoDB session/transaction (or a queue-based reservation system) once
  a replica set is available.
- Real payment integration (Razorpay Checkout + webhook-verified
  signature) instead of the mock confirm-payment endpoint.
- Real file/video upload with a presigned-URL flow instead of pasting a
  link.
- Push-based updates for spots-left / countdown instead of polling.
- Pagination and indexes tuned for the competitions list as the catalog
  grows; the current list endpoint is only reasonable for a small number
  of active competitions.
- A proper design token/theme file shared with the design team's Figma,
  rather than the hand-matched color values used here.
