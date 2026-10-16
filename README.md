# QWERTY Rescue ERP

Surplus-food logistics website for Team QWERTY. It follows the product backlog and Sprint 1 plan: donors log food, the matching queue ingests it within one minute, food banks are scored by distance and remaining capacity, drivers pick up and deliver with proof, and a digital receipt is issued.

Sprint 1 runs **Wednesday 14 October through Friday 23 October 2026**. Stories in the sprint: US1a, US1b, US6, US2a, US2b, US5a, US3a. Daily Scrums are Monday, Wednesday, and Friday. **Today, Friday 16 October, is Meeting 3** (Day 2 on the board). Sprint 1 closes at Meeting 6 on Friday 23 October.

## Run the website

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Donor | `donor@qwerty.test` | `donor123` |
| Food bank | `foodbank@qwerty.test` | `foodbank123` |
| Driver | `driver@qwerty.test` | `driver123` |
| Logistics director | `logistics@qwerty.test` | `logistics123` |

## Agreed US1a contract (Day 2)

Queue message:

```json
{
  "donationId": "DON-...",
  "foodType": "Prepared meals",
  "quantity": 12.5,
  "quantityUnit": "kg",
  "expiryDateTime": "2026-10-16T18:00:00.000Z",
  "pickupWindow": { "start": "...", "end": "..." },
  "donorId": "usr-donor-1",
  "timezone": "Asia/Bangkok"
}
```

- Food type is required (dropdown in the UI).
- Quantity is kilograms, minimum `0.1`, maximum `5000`.
- Expiry must be in the future. Five minutes ahead is accepted.
- Duplicate donations are blocked by `donationId` and optional `Idempotency-Key`.
- Only donors can `POST /api/donations`. Recipients and anonymous users are blocked.
- The matching queue is `/queue` and `GET /api/queue`. Ingestion is immediate (under 60 seconds).
- QA can inject a message with `POST /api/test/queue` after signing in as donor or logistics.

Live contract: `GET /api/contract`.

## Product backlog

Sprint 1 (must be Done by Friday 23 October, only after that meeting's Definition of Done):

| Story | What the site does |
|---|---|
| US1a | Donor form + queue ingestion + validation |
| US1b | Auto-match by proximity and remaining capacity |
| US6 | Pickup window stored and shown on dispatch |
| US2a | Driver marks picked up; food bank / dispatch see driver ID and timestamp |
| US2b | Delivery confirmation with photo or signature proof |
| US5a | Digital receipt (weight, food type, timestamp) emailed to the donor |
| US3a | Urgent flag when expiry is within 24 hours |

Sprint 2 (product backlog, not Sprint 1 Done):

| Story | What a later sprint would cover |
|---|---|
| US3b | 24 / 12 / 2 hour alerts |
| US4a | Central operations dashboard with filters |
| US4b | Driver activity log |
| US5b | Monthly tax summary CSV / PDF |
| US7 | Driver GPS ping displayed on the activity log |
| US8 | Heuristic decay estimate (`GET /api/decay?donationId=...`) |

## QA

Start the site first (`cd web` then `npm run dev`). Then, from the repo root, install the QA library and run the suite with the project virtual environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r qa\requirements.txt
.\.venv\Scripts\python.exe -m pytest qa\api -q
```

A pass is `24 passed`. `qa/api/helpers.py` is the shared library (login and payloads). `qa/api/conftest.py` resets demo capacity before the suite. Do not run those two files by themselves. Full steps: [qa/README.md](qa/README.md). The site must be on `http://localhost:3000`, or set `BASE_URL`.

## Daily sprint agent

In Cursor, run:

```text
Run today's sprint
```

The agent reads `docs/sprint-1-progress.md`, implements that day’s backlog, updates hours/status, and writes `docs/sprint-1-scrum-meeting-{N}.md`.

Also: `Run sprint day 5` or `Meeting script only`.

Instructions: `AGENTS.md` and `.cursor/skills/daily-sprint/SKILL.md`. Today is Meeting 3 (`docs/sprint-1-scrum-meeting-3.md`). Next: Meeting 4 (Mon 19 Oct, Days 3–4), Meeting 5 (Wed 21 Oct, Days 5–8), Meeting 6 (Fri 23 Oct, Days 9–14, close). W02 conclusion (`docs/sprint-1-backlog-conclusion.xlsx`) is the Friday 23 result, not today's board.
