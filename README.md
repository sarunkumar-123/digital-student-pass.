# MTC Digital Student Pass — Prototype

A proposed digital system for the Chennai Metropolitan Transport Corporation (MTC) **College Student Concession Ticket (SCT)** process.

This is a **prototype / demonstration**, not an official MTC service or an official MTC website.

The demo keeps the existing responsibilities:

- **Student** submits application and payment (simulated)
- **College** verifies student details against its own existing records
- **MTC / Authority** gives final approval and authorizes pass activation
- The digital system then displays the digital pass

## Technology / architecture (accurate status)

| Layer | Current prototype status |
|-------|--------------------------|
| Frontend | **Next.js (App Router), React, TypeScript, Tailwind CSS** |
| Running demo storage | **Browser `localStorage`** (mock data, seeded in `src/lib/store.tsx`) |
| Database | **Not connected in the demo.** A **PostgreSQL + Drizzle ORM schema is prepared** in `src/db/` for a future backend |
| Authentication | Mock sign-in. **OTP is simulated** (no real SMS/email gateway / MTC OTP API) |
| Payment | **Payment simulation only** (no real UPI, card, net banking, or payment gateway; no money is transferred) |
| MTC integration | **No live MTC API/database** is connected |
| Bus/route validation | The bus/service ID is **recorded and associated** with a journey; it is **not verified against a live MTC route/service database** |

The data/state layer is isolated in `src/lib/store.tsx`, so it can later be replaced by PostgreSQL-backed APIs **without changing the UI**.

### Configurable daily journey limit

- The prototype allows a **configured maximum of 4 journeys per day** (`DAILY_JOURNEY_LIMIT` in `src/lib/config.ts`).
- Slots are assigned **automatically** (journey 1 → Slot 1 … journey 4 → Slot 4; a 5th is blocked).
- This **is not an official MTC rule** — it is a prototype-configured value that can be changed to transport-authority policy in deployment.

## Requirements

- Node.js 18+ (Node 20 recommended), npm 9+
- **No database, OTP gateway, payment gateway, or API keys are required to run the demo.**

## Install

```bash
npm install
```

## Run locally (development)

```bash
npm run dev
```

Open http://localhost:3000

## Production / demo build

```bash
npm run build
```

This produces both:

- `.next/` — Node production server (`npm start`)
- `out/` — fully static website (upload to any static host; no server needed)

Preview the static build:

```bash
npx serve out -l 3000
```

## Demo URLs (auto-login, no real credentials)

| Role | URL |
|------|-----|
| Demo index | `/demo` |
| Student | `/demo/student` |
| College (a) | `/demo/college` |
| MTC Authority (b) | `/demo/mtc` |

Manual logins (optional): Student `STU2026001 / student123` · College `jeppiaar / college123` · MTC `mtc / mtc123`.

## Connected end-to-end workflow (one shared application record)

All three portals read/update the **same application object** (in localStorage for the demo), with a canonical stage machine:

```
Student submits (APP-0001) → COLLEGE_PENDING → college Verify → MTC_PENDING
→ MTC Approve → PAYMENT_PENDING → student mock payment → PAYMENT_CONFIRMED → PASS_ACTIVE
```

- **Student:** My Application looks up the Student ID in the college-verified **Student Master Records** (from Excel), prefills details, student confirms origin/destination/pass type and submits. A status page shows the same Application ID, a visual timeline, rejection reasons, a Pay/Activate button after MTC approval, and an audit history.
- **College:** Student Pass Applications → View / Verify (forwards the same record straight to MTC) / Reject (with reason). Bulk Excel upload populates master records — it does **not** create pass applications.
- **MTC:** College Verified Applications → View → Approve (→ payment required) / Reject (reason). A "Simulate Payment & Activate" convenience button mirrors the student-side mock payment for demos.
- Demo identity for the full flow: Student ID **JAS001** (password `student123`), pre-seeded as a master record. The one-click `/demo/student` route opens this account. The existing **STU2026001** account remains available for the already-active-pass journey/slot sample.
- Every transition appends to an application **status history** and creates in-app notifications for the relevant role.

## Core workflow preserved

Student application → College verification → MTC/Authority approval → (simulated) payment → digital pass activation → date-specific travel allocation → start journey → enter bus/service ID → automatic next-slot assignment → slot consumed → journey record → daily allocation enforced (configurable limit).

## Journey Assistance module

After the digital pass is active, **Journey Assistance** (`/dashboard/student/assistance`) connects trip planning to journey validation, using clearly-labelled demo/simulated data (no live MTC, mapping, or external transport-service API such as Chalo/Google Maps is connected):

- **Nearby Transport Services** — demo boarding points/services for the approved origin→destination, with an explicit *External Transport-Service Integration (proposed)* note.
- **Map-Based Route Assistance** — simulated route map with boarding point, bus stops and destination; explicit note that a mapping service would be a future authorized integration.
- **Journey Schedule & Time Estimation** — demo departure/boarding/duration/arrival rows marked *Demo / Simulated Schedule Data*.
- **Journey Request & Validation** — enter/select a Bus/Service ID → validates the active digital pass and approved route → checks the date-specific allocation (configurable 4/day) → atomically consumes the next slot via the same shared `lockJourney` logic → creates the Journey History record, or blocks with *Journey Blocked / Allocation Exhausted*. The existing Journey History page and calendar show the resulting records unchanged.

(Real production slot-locking should use a server-side transaction to prevent concurrent double-booking; the browser prototype enforces it in the single shared state.)

## College bulk Excel verification (new)

The College portal includes **Bulk Upload** (`/dashboard/college/bulk-upload`):

- Download an Excel template (11 required columns, 2 sample rows, no real student data).
- Upload `.xlsx`/`.xls` (drag &amp; drop) or use the one-click **demo file (125 records: 118 valid, 5 need correction, 2 duplicate)**.
- Browser-side, **rule-based** validation (missing fields, bad format, in-file duplicates, duplicates against existing applications) using SheetJS — no AI claims, no server upload.
- Review table with category filters, per-record **Edit** and **Remove**, automatic revalidation.
- Blocked from submitting while any correction/duplicate remains; college confirms verification, then submits to MTC.
- MTC portal → **Student Submissions** (`/dashboard/mtc/submissions`): stat cards, submission list, and a review page with **Approve / Reject / Request Correction (with reason)**. Approval feeds the existing pass workflow. All data stays in localStorage.

## Deploy the demo

- **Static (recommended for sharing):** upload the `out/` folder to Netlify, Cloudflare Pages, GitHub Pages, or any static host.
- **Vercel:** import the repo; framework auto-detected; no environment variables required.
- **Node server:** `npm run build && npm start`.

## Environment variables

Optional only. `.env.example` shows `DATABASE_URL`, which the demo UI never uses. Do not add real payment/OTP/MTC keys — those integrations are simulated.

This prototype is for demonstration to college faculty, judges, and evaluators (e.g., SIH). Real MTC API, payment gateway, OTP gateway, live bus/service validation, and production authentication are subject to future authorized integration.
