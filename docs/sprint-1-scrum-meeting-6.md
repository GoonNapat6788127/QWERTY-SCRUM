# Sprint 1 – Scrum Meeting 6 Script (QWERTY)

Thursday 22 October 2026. Last Daily Scrum of Sprint 1.

## Meeting at a glance

Meeting 6 is the **third remaining standup** and the **close of Sprint 1**. It is on **Thursday 22 October 2026**, moved from Friday 23. It reports work since Meeting 5 (Wednesday 21 October): **Days 9–14** on the W02 hour plan. Day 15 is the 0-hour buffer on Friday 23, and Friday has no Daily Scrum. After this meeting the increment is ready for Sprint Review.

| Item | Detail |
|---|---|
| Date | Thursday 22 October 2026 |
| Length | About 10 minutes, then Sprint Review if the PO is present |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Since Wednesday 21 October, Meeting 5 (**Days 9–14**, **39 hours**). Friday 23 is Day 15 buffer **0**, no standup. |
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

Good morning. This is Scrum meeting **six**, **Thursday 22 October**, the last Daily Scrum of Sprint 1. It was moved from Friday 23. Last meeting was Wednesday. Days 9–14 were: finish `POST /api/pickup` and `GET /api/incoming`, build `POST /api/delivery` with proof, generate the US5a PDF receipt, and set the US3a `urgent` flag. Today we check that increment against the Definition of Done, then demo it in the Sprint Review. Friday 23 has no standup.

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

**Accomplished:** Days 9–14 hours are on the board: **39 hours**. Day 15 buffer on Friday 23 is **0**. Actual **114** / planned **114**. Remaining **0**. Sprint 1 board is Done for US1a, US1b, US6, US2a, US2b, US5a, US3a if every Definition of Done tick is true. This Thursday meeting is the Sprint 1 close. Friday 23 is the last calendar day and has no Daily Scrum.

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

## Who presents which part

One pass, about 8 minutes. Use an expiry inside 24 hours so the queue shows **urgent**. Each person clicks their own screen, then hands the laptop to the next speaker.

| Order | Presenter | Screen | Story they own | What to say and do |
|---|---|---|---|---|
| 1 | Napat Tayommai, Scrum Master | Board, then login | Sprint goal | Open: seven Sprint 1 stories, queue under 1 minute, match under 2 minutes. Sprint 2 stays off this demo. Hand the laptop to Pratanin. |
| 2 | Pratanin Kahtepmud, Dev 1 | Sign in `donor@qwerty.test` / `donor123`. `/donations/new` | US1a form, US6 pickup window, US1b integrate | Choose food type, quantity in kg, expiry, and `pickupWindow`. Submit. Point at "queued in N ms" and the proposed match. |
| 3 | Jirathiwat Suntipreedatham, Dev 3 | `/queue` | US1a ingestion, US1b capacity, US3a urgent | Show the row within 1 minute: `donationId`, `foodType`, `quantity`, `expiryDateTime`, `pickupWindow`, `timezone: Asia/Bangkok`. If expiry is inside 24 hours, the badge is **urgent**. A match exists only when `hasCapacity` is true. |
| 4 | Sirapassorn Pokasermsong, Dev 2 | Match line, then sign in `driver@qwerty.test` / `driver123`. `/dispatch` | US1b proximity, US2a pickup API, US2b delivery API | Say why SOS Food Bank Bangkok won: haversine `distanceKm` inside `deliveryRangeKm`. **Mark picked up.** Then **Confirm delivery with proof** and attach a signature. Missing proof must not deliver. |
| 5 | Pratanin Kahtepmud, Dev 1 | Sign in `foodbank@qwerty.test` / `foodbank123`. `/incoming` | US2a food-bank view, US2b proof UI | Show `driverId` `usr-driver-1`, `pickedUpAt`, `deliveredAt`, and the signature proof. |
| 6 | Jirathiwat Suntipreedatham, Dev 3 | Sign in as the donor again. `/receipts` | US5a receipt | Open the row: `weightKg`, `foodType`, timestamp, `emailStatus: sent`. Open the PDF. |
| 7 | Sakkaraj Tuvajit, QA 1 | Terminal or the test file list | All Sprint 1 QA cards | Say `pytest qa/api` is 24 passed, no critical bugs. Name the file for the step just shown if the Product Owner asks: `test-us1a-log-donation.py`, `test-us1b-auto-match.py`, `test-us6-pickup-window.py`, `test-us2a-pickup-status.py`, `test-us2b-delivery-proof.py`, `test-us5a-receipt.py`, `test-us3a-urgent-flag.py`. |
| 8 | Napat Tayommai, Scrum Master | Board and conclusion | Definition of Done | Close: 7 of 7 Done only if that list is true. Remaining 0. US3b, US4a, US4b, US5b, US7, and US8 stay on the Sprint 2 backlog. |
