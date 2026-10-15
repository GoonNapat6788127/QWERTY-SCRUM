# QWERTY Rescue ERP

Surplus-food logistics website for Team QWERTY. It follows the product backlog and Sprint 1 plan: donors log food, the matching queue ingests it within one minute, food banks are scored by distance and remaining capacity, drivers pick up and deliver with proof, and a digital receipt is issued.

Sprint 1 Day 2 focus is **US1a**: donation entry form, queue ingestion, validation, duplicate protection, and the QA test endpoint.

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

## Sprint coverage

| Story | What the site does |
|---|---|
| US1a | Donor form + queue ingestion + validation |
| US1b | Auto-match by proximity and remaining capacity |
| US6 | Pickup window stored and shown on dispatch |
| US2a | Driver marks picked up; food bank / dispatch see driver ID and timestamp |
| US2b | Delivery confirmation with photo or signature proof |
| US5a | Digital receipt (weight, food type, timestamp) emailed to the donor |
| US3a | Urgent flag when expiry is within 24 hours |
| US3b | 24 / 12 / 2 hour alerts |
| US4a | Central operations dashboard with filters |
| US4b | Driver activity log |
| US5b | Monthly tax summary CSV / PDF |
| US7 | Driver GPS ping displayed on the activity log |
| US8 | Heuristic decay estimate (`GET /api/decay?donationId=...`) |

## QA

```bash
cd qa
pip install -r requirements.txt
pytest api/test-log-donation.py -q
```

The API server must already be running on `http://localhost:3000`, or set `BASE_URL`.
