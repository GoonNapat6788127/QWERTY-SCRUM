# Sprint 1 progress

Living file. The daily-sprint agent reads and updates this every run.

## State

| Field | Value |
|---|---|
| Sprint | 1 of 2 |
| Calendar today | Friday 16 October 2026 |
| Sprint 1 end | Calendar through Friday 23 October 2026. Last standup is Thursday 22 October (Meeting 6). |
| Standup cadence | Three Daily Scrums per week (Monday, Wednesday, Friday) |
| Live standup | **Meeting 3 today, Friday 16 October 2026** (reports Day 2) |
| Spoken board | Day 2 finished. Day 3 starts after Meeting 3. US1a is not Done. |
| last_completed_day | 2 on the spoken board. Days 3–15 are reported at Meetings 4–6. |
| next_day_to_run | 16 for implementation (code for the Thursday 22 demo is already in `web/`; do not rebuild or move spoken cards early) |
| Next three standups | Meeting 4 Mon 19 Oct (Days 3–4) · Meeting 5 Wed 21 Oct (Days 5–8) · Meeting 6 Thu 22 Oct (Days 9–14, close) |
| last_meeting_script | 3 today (`docs/sprint-1-scrum-meeting-3.md`). Scripts 4–6 are next week. |
| Conclusion sheet | Thursday 22 result only, after Meeting 6. Do not present it before that meeting. |
| App | `web/` → http://localhost:3000 |

## Clock

Meeting 1 was Wednesday 14 October (kickoff). **Meeting 3 is the live standup today, Friday 16 October.** It reports Day 2. Three Daily Scrums remain, and Sprint 1 closes at Meeting 6 on Thursday 22 October. Friday 23 has no standup:

| Meeting | When | Reports | Script |
|---|---|---|---|
| 4 | Monday 19 October 2026 | Days 3–4 (22h): finish US1a ingestion + QA hours; start US1b | `docs/sprint-1-scrum-meeting-4.md` / `.pdf` |
| 5 | Wednesday 21 October 2026 | Days 5–8 (41h): finish US1b + US6; start US2a pickup (2 of 4h) | `docs/sprint-1-scrum-meeting-5.md` / `.pdf` |
| 6 | Thursday 22 October 2026 | Days 9–14 (39h): finish US2a, US2b, US5a, US3a; Sprint 1 close | `docs/sprint-1-scrum-meeting-6.md` / `.pdf` |

Code for the later Sprint 1 stories is already in `web/` so the Thursday 22 demo can run. **The spoken board today does not move those cards.** A card is Done only when that meeting's Definition of Done is ticked. The W02 conclusion (7 of 7, 114/114, remaining 0) is the Thursday 22 outcome, and only if QA has no critical bugs.

## Team

| Person | Role |
|---|---|
| Napat Tayommai | Scrum Master |
| Pratanin Kahtepmud | Dev 1 |
| Sirapassorn Pokasermsong | Dev 2 |
| Jirathiwat Suntipreedatham | Dev 3 |
| Sakkaraj Tuvajit | QA 1 |

## Board today (Meeting 3, Friday 16 October)

This is the board to share in the room today.

| Card | Owner | Column | Hours logged |
|---|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA | 8 / 8 |
| US1a Queue ingestion backend | Jirathiwat | In Progress | 4 / 8 |
| US1a QA donation creation and queue timing | Sakkaraj | To-Do (starts after this meeting, 2h) | 0 / 4 |
| US1b Proximity scoring | Sirapassorn | To-Do (starts after this meeting, 4h) | 0 / 12 |
| US1b capacity, integrate, QA; US6; US2a; US2b; US5a; US3a | Various | To-Do | 0 |
| US3b, US4a, US4b, US5b, US7, US8 | — | Product backlog (Sprint 2) | not this sprint |

## Board on Thursday 22 October if every DoD tick passes

Meetings 4–6 move these cards. The conclusion sheet uses this end state. If a critical bug is still open, leave that card out of Done.

Sprint 2 product-backlog items (US3b, US4a, US4b, US5b, US7, US8) stay out of Sprint 1 Done even if a demo screen exists.

| Card | Owner | Status | Hours plan | Hours logged |
|---|---|---|---|---|
| US1a Build donation entry form UI | Pratanin | Done | 8 | 8 |
| US1a Queue ingestion backend | Jirathiwat | Done | 8 | 8 |
| US1a QA donation creation and queue timing | Sakkaraj | Done | 4 | 4 |
| US1b Proximity scoring | Sirapassorn | Done | 12 | 12 |
| US1b Capacity check | Jirathiwat | Done | 8 | 8 |
| US1b Integrate matching with queue | Pratanin | Done | 12 | 12 |
| US1b QA matching | Sakkaraj | Done | 8 | 8 |
| US6 Pickup window UI | Pratanin | Done | 5 | 5 |
| US6 Dispatch feed window | Jirathiwat | Done | 5 | 5 |
| US6 QA | Sakkaraj | Done | 3 | 3 |
| US2a Pickup endpoint | Sirapassorn | Done | 4 | 4 |
| US2a Food bank incoming view | Pratanin | Done | 2 | 2 |
| US2a QA | Sakkaraj | Done | 2 | 2 |
| US2b Delivery confirmation API | Sirapassorn | Done | 10 | 10 |
| US2b Proof UI (dispatch + incoming) | Pratanin | Done | 6 | 6 |
| US2b QA | Sakkaraj | Done | 4 | 4 |
| US5a Digital receipt | Jirathiwat | Done | 3 | 3 |
| US5a QA | Sakkaraj | Done | 2 | 2 |
| US3a Expiry urgent flag | Jirathiwat | Done | 5 | 5 |
| US3a QA | Sakkaraj | Done | 3 | 3 |

## Calendar vs 15-day hour plan

Standups are three per week, so the original Day 1–15 hour table is packed into this week plus next week. Hours below are logged against the original plan so the burndown still matches `docs/sprint-1-backlog.pdf`.

Totals (same as W02 conclusion cells): 4, 8, 10, 12, 12, 13, 9, 7, 6, 9, 9, 6, 7, 2, 0

| Day | Work | Hours logged |
|---|---|---|
| 1 | Pratanin form 4h | 4 |
| 2 | Pratanin form 4h, Jirathiwat ingestion 4h | 8 |
| 3 | Jirathiwat ingestion 4h, Sirapassorn proximity 4h, Sakkaraj QA 2h | 10 |
| 4 | Sakkaraj QA 2h, Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h | 12 |
| 5 | Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h, Sakkaraj US1b QA 2h | 12 |
| 6 | Sirapassorn proximity 2h, Jirathiwat capacity 2h, Pratanin integrate 3h + US6 UI 2h, Sakkaraj US1b QA 4h | 13 |
| 7 | Pratanin integrate 1h + US6 UI 3h, Jirathiwat US6 dispatch 3h, Sakkaraj US1b QA 2h | 9 |
| 8 | Jirathiwat US6 dispatch 2h, Sirapassorn US2a pickup 2h, Sakkaraj US6 QA 3h | 7 |
| 9 | Sirapassorn US2a 2h + US2b 2h, Pratanin US2a food-bank view 2h | 6 |
| 10 | Sakkaraj US2a QA 2h, Sirapassorn US2b 4h, Pratanin US2b proof UI 3h | 9 |
| 11 | Sirapassorn US2b 4h, Pratanin US2b 3h, Sakkaraj US2b QA 2h | 9 |
| 12 | Sakkaraj US2b QA 2h, Jirathiwat US5a receipt 2h + US3a expiry 2h | 6 |
| 13 | Jirathiwat US5a 1h + US3a 3h, Sakkaraj US5a QA 2h + US3a QA 1h | 7 |
| 14 | Sakkaraj US3a QA 2h | 2 |
| 15 | Buffer | 0 |

## Standup windows vs W02 Day 1–15 cells

Same mapping as `docs/sprint-1-backlog-conclusion.md`. Speak only the cards whose hours sit in that window.

| Meeting | When | Hour-days | Hours | Cards that window closes |
|---|---|---|---|---|
| 1 | Wed 14 Oct | Kickoff. Day 1 starts after. | 0 in the meeting | Plans and risks for US1a |
| 2 | Template | Day 1 | 4 | Form UI 4 of 8h |
| 3 | Fri 16 Oct | Day 2 | 8 | Form 8/8 In Review. Ingestion 4/8 In Progress |
| 4 | Mon 19 Oct | Days 3–4 | 22 | Ingestion 8/8. US1a QA 4/4 In Review. Proximity 7/12. Capacity 3/8. Integrate 4/12 |
| 5 | Wed 21 Oct | Days 5–8 | 41 | US1a Done. US1b 40/40. US6 13/13. US2a pickup 2/4 In Progress |
| 6 | Thu 22 Oct | Days 9–14 (Day 15 on Fri 23 = 0) | 39 | US2a, US2b, US5a, US3a Done. Actual 114 / planned 114. Remaining 0 |

## Code already in the repo (demo on Thursday 22, not Done in Meeting 3)

- US1a: donor form, `POST /api/donations`, queue `/queue` and `GET /api/queue`, QA inject `POST /api/test/queue`, 1-minute ingest, duplicate protection.
- US1b: auto-match on ingest by proximity and remaining capacity; `GET /api/matches?donationId=`; no match when quantity exceeds remaining capacity.
- US6: pickup window on the donor form and on the driver dispatch feed.
- US2a: driver `POST /api/pickup`; food bank `/incoming` shows driver ID and pickup timestamp.
- US2b: delivery requires photo or signature; incoming shows proof and delivery timestamp.
- US5a: receipt with weight, food type, timestamp, emailed to the donor (`emailStatus: sent`).
- US3a: queue flags **urgent** when expiry is within 24 hours.
- QA, one file per Sprint 1 story: `qa/api/test-us1a-log-donation.py`, `test-us1b-auto-match.py`, `test-us6-pickup-window.py`, `test-us2a-pickup-status.py`, `test-us2b-delivery-proof.py`, `test-us5a-receipt.py`, `test-us3a-urgent-flag.py`.

## Day log

### Day 1

Meeting 1. Team read US1a. Risks: message format, duplicate donations, form validation.

### Day 2 (finished 15 Oct)

Pratanin finished the donation entry form. Jirathiwat logged 4h on queue ingestion.

### Days 3–15 (reported next week, code already in the repo)

Meetings 4, 5, and 6 report these hours. Do not mark the cards Done in Meeting 3.

## Blockers at the start of Meeting 3

Close these **in today's meeting**, then Meeting 4 can report them closed:

1. Agree the US1a message format (donationId, foodType, quantity, expiryDateTime, pickupWindow, donorId, timezone Asia/Bangkok).
2. Food-bank sample data for proximity scoring.
3. QA inject endpoint `POST /api/test/queue`.

The code already contains those three. The spoken status stays open until the team agrees them today.
