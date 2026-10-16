# Sprint 1 – Scrum Meeting 6 Script (QWERTY)

Friday 23 October 2026. Last Daily Scrum of Sprint 1.

## Meeting at a glance

Meeting 6 is the **third remaining standup** and the **close of Sprint 1**. It reports **Days 9–14** on the W02 hour plan (Wednesday 21 and Thursday 22 October). Day 15 is the 0-hour buffer. After this meeting the increment is ready for Sprint Review.

| Item | Detail |
|---|---|
| Date | Friday 23 October 2026 |
| Length | About 10 minutes, then Sprint Review if the PO is present |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Wednesday 21 – Thursday 22 (**Days 9–14**, **39 hours**). Day 15 buffer **0**. |
| Next | Sprint Review today. Sprint 2 planning after that. |
| Three questions | Accomplished / Next / Blockers |

## Before the meeting

1. Share the board with every Sprint 1 card.
2. Log Days 9–14 hours (table at the end). Remaining effort on the W02 sheet becomes **0**.
3. Do not mark Done unless DoD is ticked.
4. Have the demo ready: donor form, queue, incoming pickup, dispatch delivery proof, receipts, urgent flag.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **six**, **Friday 23 October**, the last Daily Scrum of Sprint 1. Last meeting was Wednesday. Days 9–14 were: finish `POST /api/pickup` and `GET /api/incoming`, build `POST /api/delivery` with proof, generate the US5a PDF receipt, and set the US3a `urgent` flag. Today we check that increment against the Definition of Done, then demo it in the Sprint Review.

Three questions, name the card. If a card is not Done, say what is still open. Do not hide it.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** Day 9 I finished **US2a Update food bank view** (**2 hours**). `GET /api/incoming` and the page `/incoming` return `driverId` and `pickedUpAt`. Days 10–11 I finished **US2b Render delivery proof and timestamp** (**3 + 3 hours**). Incoming and `GET /api/dispatch` show `deliveredAt`, `proofKind` (`photo` or `signature`), and `proofDataUrl`. Together with `/donations/new`, the ingest matcher, and the US6 `pickupWindow` field, my Sprint 1 cards are ready for Done if QA has ticked.

**Next:** No Sprint 1 build left. After Review I take the first Sprint 2 story the Product Owner orders: US3b expiry notifications or US4a the operations dashboard.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** Days 12–13 I finished **US5a** (**2 + 1 hours**). On `status: "delivered"`, the handler writes a receipt with `weightKg`, `foodType`, and `timestamp`, sets `emailStatus: "sent"` and `emailedTo` to the donor, and `GET /api/receipts/{id}` returns `application/pdf`. Same days I finished **US3a** (**2 + 3 hours**): if hours until `expiryDateTime` are 24 or less, `GET /api/queue` sets `urgent: true`. The earlier ingest, capacity, and dispatch-window code is in the same increment.

**Next:** Sprint 2. No Sprint 1 card remains on my list.

**Blockers:** None. The demo environment records `emailStatus: "sent"` in the API response. It does not send a live SMTP message.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** Day 9 I finished the remaining **2 hours** of **US2a** `POST /api/pickup`. A `matched` donation becomes `picked_up` and stores `pickedUpAt` and `driverId`. Any other status returns 409. Days 9–11 I finished **US2b** `POST /api/delivery` (**2 + 4 + 4 hours**). The body requires `proofKind` of `photo` or `signature` plus `proofDataUrl`; missing proof returns 400, and success sets `status: "delivered"` and `deliveredAt`. With the haversine ranker, a matched donation can now be picked up and delivered with proof. Cards are **In Review / QA** or **Done** once Sakkaraj ticks.

**Next:** Sprint 2. After Review I can take US7 `POST /api/drivers/location` or the US8 `GET /api/decay` spike.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** Day 10 I ran **US2a QA** in `qa/api/test-us2a-pickup-status.py` (**2 hours**): `POST /api/pickup` returns 200, `driverId` is `usr-driver-1`, and `GET /api/incoming` shows the same `pickedUpAt` with `status: "picked_up"`. Days 11–12 I ran **US2b QA** in `qa/api/test-us2b-delivery-proof.py` (**2 + 2 hours**): delivery without `proofDataUrl` returns 400; with a signature it returns 200 and the proof is on `/incoming`. Day 13 I ran **US5a QA** in `qa/api/test-us5a-receipt.py` (**2 hours**): `weightKg`, `foodType`, `timestamp`, `emailStatus: "sent"`, and the PDF body. Days 13–14 I ran **US3a QA** in `qa/api/test-us3a-urgent-flag.py` (**1 + 2 hours**): expiry in 12 hours sets `urgent: true`; expiry in 48 hours sets `urgent: false`. `qa/api/test-us1a-log-donation.py` still passes. I have **no open critical bugs** on the Sprint 1 stories.

**Next:** I will sit the Sprint Review with the team and log any PO findings. Sprint 2 QA starts after planning.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 9–14 hours are on the board: **39 hours**. Day 15 buffer is **0**. Actual **114** / planned **114**. Remaining **0**. Sprint 1 board is Done for US1a, US1b, US6, US2a, US2b, US5a, US3a if every Definition of Done tick is true. Today's date is the Sprint 1 end date we committed to.

**Next:** Sprint Review demo after this standup. Then Sprint 2 planning from the product backlog: US3b, US4a, US4b, US5b, US7, US8.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

No blockers. If QA found a critical bug this morning, say it now so we do not call the increment Done. Anyone?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Read the list against the whole Sprint 1 increment, not one card:

- Acceptance criteria for US1a, US1b, US6, US2a, US2b, US5a, US3a.
- Code on `main`, reviewed.
- `pytest qa/api` green, no critical bugs.
- `POST /api/donations` returns 400 on bad input and `duplicate: true` on a repeated `donationId`.
- Queue under 60 seconds, `proposeMatch` under 120 seconds.
- Board and hours updated. W02 conclusion sheet: Status Done, remaining 0.

Sakkaraj, if that list is true, we can present this increment in the Review. If anything fails, we name the card and leave it out of Done.

### 12. Closing (Napat, about 30 seconds)

Thank you. That is the last Daily Scrum of Sprint 1. Please stay for the Sprint Review demo: log a donation, see the queue, see the match, pick up, deliver with proof, open the receipt, and show an urgent flag. See you at Sprint 2 planning.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- Acceptance criteria for US1a, US1b, US6, US2a, US2b, US5a, US3a
- Reviewed and on `main`
- Tests pass
- Validation and error handling in place
- Queue within 1 minute, match within 2 minutes
- QA: no open critical bugs
- Card and hours updated

---

## Board at the start of Meeting 6

| Story | Status if DoD passed | Hours |
|---|---|---|
| US1a Log a donation | Done (ticked at Meeting 5) | 20 / 20 |
| US1b Auto-match to a food bank | Done (QA closed Meeting 5) | 40 / 40 |
| US6 Select a pickup time window | Done (QA closed Meeting 5) | 13 / 13 |
| US2a Track pickup status | Done | 8 / 8 |
| US2b Track delivery with proof | Done | 20 / 20 |
| US5a Digital donation receipt | Done | 5 / 5 |
| US3a Flag expiry within 24 hours | Done | 8 / 8 |
| Sprint 2 stories | Product Backlog, not this sprint | — |

## Days 9–14 hours to log before the meeting

Day 9 **6h**. Day 10 **9h**. Day 11 **9h**. Day 12 **6h**. Day 13 **7h**. Day 14 **2h**. Day 15 **0h**. Window total **39h**. Sprint total **114h**.

| Person | Days 9–14 plan | Log |
|---|---|---|
| Pratanin | US2a food-bank view 2h, US2b proof 3+3h | 8h |
| Jirathiwat | US5a receipt 2+1h, US3a expiry 2+3h | 8h |
| Sirapassorn | US2a pickup 2h, US2b API 2+4+4h | 12h |
| Sakkaraj | US2a QA 2h, US2b QA 2+2h, US5a QA 2h, US3a QA 1+2h | 11h |
| Napat | facilitation | Board, hours, W02 conclusion |

## Sprint Review demo order (after the standup)

1. Sign in as `donor@qwerty.test`. `POST /api/donations` with `foodType`, `quantity`, `expiryDateTime`, and `pickupWindow`.
2. Open `GET /api/queue` within 60 seconds. If expiry is inside 24 hours, the row has `urgent: true`.
3. Show the `match` object and `GET /api/matches?donationId=` rankings (`distanceKm`, `proximityScore`, `capacityScore`).
4. Sign in as the driver. `POST /api/pickup`. Sign in as the food bank. `/incoming` shows `driverId` and `pickedUpAt`.
5. Driver `POST /api/delivery` with `proofKind` `signature` or `photo` and `proofDataUrl`.
6. Donor opens `/receipts`: `weightKg`, `foodType`, `timestamp`, `emailStatus: "sent"`. PDF from `GET /api/receipts/{id}`.
