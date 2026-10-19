# Sprint 1 – Scrum Meeting 5 Script (QWERTY)

Wednesday 21 October 2026. Three-question format.

## Meeting at a glance

Meeting 5 is the **second of three remaining standups**. It reports **Days 5–8** on the W02 hour plan (Monday 19 and Tuesday 20 October). The last standup, Meeting 6, is **Thursday 22 October**. Friday 23 has no Daily Scrum.

| Item | Detail |
|---|---|
| Date | Wednesday 21 October 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Monday 19 – Tuesday 20 (**Days 5–8**, **41 hours**) |
| Next | Thursday 22 October, Meeting 6 (**Days 9–14**) and Sprint 1 close |
| Three questions | Accomplished / Next / Blockers |

## Before the meeting

Share the board. Log Days 5–8 hours (table at the end). US1a should be Done if DoD is ticked. US1b and US6 should be In Review / QA or Done. US2a pickup is only **2 of 4 hours** — In Progress, not Done. Food-bank incoming view, US2b, US5a, and US3a stay To-Do until Days 9–14.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. Scrum meeting **five**, **Wednesday 21 October**. Last meeting was Monday. One standup left: **Thursday 22 October**, Meeting 6, the Sprint 1 close. Friday 23 has no Daily Scrum.

Three questions, name the card. We do not mark Done without the Definition of Done.

Monday we were closing the US1a pytest suite, finishing `proposeMatch`, building the `pickupWindow` field, and starting `POST /api/pickup`. Days 5–8 were those cards. `GET /api/incoming` and `POST /api/delivery` are **next**, not yesterday.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** I finished **US1b Integrate matching service with queue triggers** — the remaining **8 hours** on Days 5–7, so the 12-hour card is built. `POST /api/donations` now calls `proposeMatch` before it returns 201, and a success sets `status: "matched"`. I also finished **US6 Add pickup time window UI** — **2 hours** on Day 6 and **3 hours** on Day 7. `/donations/new` sends `pickupWindow: { start, end }` and the API stores it on the donation. Both cards are **In Review / QA**. I did **not** build `GET /api/incoming`. That view is Day 9.

**Next:** Until Thursday I build **US2a Update food bank view** (Day 9, 2 hours) so `/incoming` renders `driverId` and `pickedUpAt`, then **US2b Render delivery proof and timestamp** (Days 10–11, 6 hours) for `proofKind` and `deliveredAt`.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** I finished **US1b capacity check** — the remaining **5 hours** on Days 5–6. `hasCapacity` is false when `quantity` exceeds `remainingCapacityKg`, and that bank is skipped. I also finished **US6 Connect time window to dispatch feed** — **3 hours** on Day 7 and **2 hours** on Day 8. `GET /api/dispatch` includes `pickupWindow` for `matched` and `picked_up` rows. Both cards are **In Review / QA**. The US1a ingest handler is ready for Done if Sakkaraj ticks QA.

**Next:** Until Thursday I implement **US5a** `GET /api/receipts/{id}` as a PDF (weight, food type, timestamp, `emailStatus: "sent"`) and **US3a** the expiry flag (Days 12–13). If hours until `expiryDateTime` are 24 or less, the queue item has `urgent: true`.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I finished **US1b proximity scoring** — the remaining **5 hours** on Days 5–6 — and combined it with capacity. `proposeMatch` now requires both `withinRange` and `hasCapacity`. Day 8 I started **US2a** `POST /api/pickup` (**2 of 4 hours**). A matched donation can move toward `picked_up`. I still have **2 hours** on Day 9 to persist `pickedUpAt` and `driverId`. The card is **In Progress**. I have not started `POST /api/delivery`. That handler begins Day 9.

**Next:** Until Thursday I finish those **2 hours**, then **US2b** `POST /api/delivery` with `proofKind` `photo` or `signature` and a required `proofDataUrl` (Days 9–11, 10 hours). A call with no proof must return 400.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** The US1a UI pass on `/donations/new` is done, so US1a can move to **Done** if every Definition of Done tick is complete. I ran **US1b QA** in `qa/api/test-us1b-auto-match.py` — Days 5–7, **8 hours**: `proposedAt` minus `createdAt` under 120 seconds when `withinRange` and `hasCapacity` are true; `match` is null and `status` stays `queued` when `quantity` is 4000. I ran **US6 QA** in `qa/api/test-us6-pickup-window.py` on Day 8, **3 hours**: the stored `pickupWindow.start` equals the row on `GET /api/dispatch`. Those QA cards are **In Review**. I have **not** run `test-us2a-pickup-status.py`. That file is Day 10.

**Next:** Until Thursday I run `test-us2a-pickup-status.py` (Day 10), then `test-us2b-delivery-proof.py`, `test-us5a-receipt.py`, and `test-us3a-urgent-flag.py`. Those are the last Sprint 1 QA modules.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 5–8 hours are on the board: **41 hours** (12 + 13 + 9 + 7). US1a is ready for Done. US1b and US6 are in Review. US2a pickup is In Progress at 2 of 4 hours. Burndown still has Days 9–14: incoming view, delivery proof, receipts, and expiry.

**Next:** Thursday we need a Done increment: finish pickup, delivery with proof, receipt, urgent flag. I will book a short Sprint Review slot after Meeting 6.

**Blockers:** None. Schedule risk only: Meeting 6 is tomorrow, Thursday 22, and **39 hours** are still on Days 9–14.

### 10. Blocker and risk review (Napat, about 1 minute)

No waits. The risk is time: US2a finish, US2b, US5a, and US3a must be Done by Thursday 22. If anyone is slipping, say it now. Anyone to add?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Sakkaraj, US1a QA is complete. We move US1a to Done only with every tick: acceptance criteria, review on `main`, `test-us1a-log-donation.py` green, queue under 60 seconds, no critical bugs, hours updated. US1b needs the 120-second match and `test-us1b-auto-match.py`. US6 needs `pickupWindow` on the donation and on `GET /api/dispatch`. Do not move US2a to Done. `POST /api/pickup` is 2 of 4 hours, and `GET /api/incoming` does not return `driverId` until Day 9.

### 12. Closing (Napat, about 30 seconds)

Next meeting is **Thursday 22 October**. That is the last Daily Scrum of Sprint 1. It reports **Days 9–14**. Finish pickup, incoming view, delivery proof, receipts, and urgent flags. Thank you.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- Acceptance criteria met
- Reviewed and on `main`
- Tests pass
- Validation and error handling in place
- Time targets met (queue 1 min, match 2 min)
- QA: no open critical bugs
- Card and hours updated

---

## Board at the start of Meeting 5

| Card | Owner | Column | Hours after Days 5–8 |
|---|---|---|---|
| US1a all three cards | Pratanin / Jirathiwat / Sakkaraj | Done (if DoD ticked) | 20 / 20 |
| US1b proximity, capacity, integrate, QA | Team | In Review / QA | 40 / 40 |
| US6 pickup window + dispatch + QA | Pratanin / Jirathiwat / Sakkaraj | In Review / QA | 13 / 13 |
| US2a pickup endpoint | Sirapassorn | In Progress | 2 / 4 |
| US2a food bank view | Pratanin | To-Do | 0 / 2 |
| US2a QA | Sakkaraj | To-Do | 0 / 2 |
| US2b delivery proof | Sirapassorn / Pratanin | To-Do | 0 / 20 |
| US5a receipt | Jirathiwat | To-Do | 0 / 5 |
| US3a urgent flag | Jirathiwat | To-Do | 0 / 8 |

---

## Days 5–8 hours to log before the meeting

Day 5 **12h**. Day 6 **13h**. Day 7 **9h**. Day 8 **7h**. Window total **41h**.

| Person | Days 5–8 plan | Log |
|---|---|---|
| Pratanin | integrate 4+3+1h, US6 UI 2+3h | 13h |
| Jirathiwat | capacity 3+2h, US6 dispatch 3+2h | 10h |
| Sirapassorn | proximity 3+2h, US2a pickup 2h | 7h |
| Sakkaraj | US1b QA 2+4+2h, US6 QA 3h | 11h |
| Napat | facilitation | Board and this script |
