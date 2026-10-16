# Sprint 1 progress

Living file. The daily-sprint agent reads and updates this every run.

## State

| Field | Value |
|---|---|
| Sprint | 1 of 2 |
| Calendar today | Friday 16 October 2026 |
| Sprint 1 end | Friday 23 October 2026 |
| Standup cadence | Three Daily Scrums per week (Monday, Wednesday, Friday) |
| last_completed_day | Remaining Sprint 1 hour plan (Days 3–15) implemented 16 Oct for the 23 Oct close |
| next_day_to_run | 16 (Sprint 1 implementation complete; no further Sprint 1 build days) |
| Next three standups | Meeting 4 Mon 19 Oct · Meeting 5 Wed 21 Oct · Meeting 6 Fri 23 Oct (Sprint 1 close) |
| last_meeting_script | 6 (`docs/sprint-1-scrum-meeting-4.md`, `5.md`, `6.md` and matching PDFs) |
| App | `web/` → http://localhost:3000 |

## Clock

This week already used Meeting 1 (Wed 14 Oct kickoff) and Meeting 3 (script for the Friday 16 window). **Three Daily Scrums remain**, all next week:

| Meeting | When | Reports | Script |
|---|---|---|---|
| 4 | Monday 19 October 2026 | US1a close and US1b start | `docs/sprint-1-scrum-meeting-4.md` / `.pdf` |
| 5 | Wednesday 21 October 2026 | US1b, US6, US2a | `docs/sprint-1-scrum-meeting-5.md` / `.pdf` |
| 6 | Friday 23 October 2026 | US2b, US5a, US3a and Sprint 1 close | `docs/sprint-1-scrum-meeting-6.md` / `.pdf` |

Code for the remaining Sprint 1 stories landed on 16 October so the increment can be demoed by 23 October. Cards stay **In Review / QA** until that meeting's Definition of Done is ticked. Do not call a card Done in a standup unless QA has no critical bugs.

## Team

| Person | Role |
|---|---|
| Napat Tayommai | Scrum Master |
| Pratanin Kahtepmud | Dev 1 |
| Sirapassorn Pokasermsong | Dev 2 |
| Jirathiwat Suntipreedatham | Dev 3 |
| Sakkaraj Tuvajit | QA 1 |

## Board status (increment ready for the three remaining standups)

| Card | Owner | Status | Hours plan | Hours logged |
|---|---|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA | 8 | 8 |
| US1a Queue ingestion backend | Jirathiwat | In Review / QA | 8 | 8 |
| US1a QA donation creation and queue timing | Sakkaraj | In Review / QA | 4 | 4 |
| US1b Proximity scoring | Sirapassorn | In Review / QA | 12 | 12 |
| US1b Capacity check | Jirathiwat | In Review / QA | 8 | 8 |
| US1b Integrate matching with queue | Pratanin | In Review / QA | 12 | 12 |
| US1b QA matching | Sakkaraj | In Review / QA | 8 | 8 |
| US6 Pickup window UI | Pratanin | In Review / QA | 5 | 5 |
| US6 Dispatch feed window | Jirathiwat | In Review / QA | 5 | 5 |
| US6 QA | Sakkaraj | In Review / QA | 3 | 3 |
| US2a Pickup endpoint | Sirapassorn | In Review / QA | 4 | 4 |
| US2a Food bank incoming view | Pratanin | In Review / QA | 2 | 2 |
| US2a QA | Sakkaraj | In Review / QA | 2 | 2 |
| US2b Delivery confirmation API | Sirapassorn | In Review / QA | 10 | 10 |
| US2b Proof UI (dispatch + incoming) | Pratanin | In Review / QA | 6 | 6 |
| US2b QA | Sakkaraj | In Review / QA | 4 | 4 |
| US5a Digital receipt | Jirathiwat | In Review / QA | 3 | 3 |
| US5a QA | Sakkaraj | In Review / QA | 2 | 2 |
| US3a Expiry urgent flag | Jirathiwat | In Review / QA | 5 | 5 |
| US3a QA | Sakkaraj | In Review / QA | 3 | 3 |

Sprint 2 product-backlog items (US3b, US4a, US4b, US5b, US7, US8) stay out of Sprint 1 Done even if demo screens exist.

## Calendar vs 15-day hour plan

Standups are three per week, so the original Day 1–15 hour table is packed into this week plus next week. Hours below are logged against the original plan so the burndown still matches `docs/sprint-1-backlog.pdf`.

Totals: 4, 8, 10, 12, 12, 14, 8, 7, 6, 9, 9, 6, 7, 2, 0

| Day | Work | Hours logged |
|---|---|---|
| 1 | Pratanin form 4h | 4 |
| 2 | Pratanin form 4h, Jirathiwat ingestion 4h | 8 |
| 3 | Jirathiwat ingestion 4h, Sirapassorn proximity 4h, Sakkaraj QA 2h | 10 |
| 4 | Sakkaraj QA 2h, Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h | 12 |
| 5 | Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h, Sakkaraj US1b QA 2h | 12 |
| 6 | Sirapassorn proximity 2h, Jirathiwat capacity 2h, Pratanin integrate 3h + US6 UI 2h, Sakkaraj US1b QA 4h | 14 |
| 7 | Pratanin integrate 1h + US6 UI 3h, Jirathiwat US6 dispatch 3h, Sakkaraj US1b QA 2h | 8 |
| 8 | Jirathiwat US6 dispatch 2h, Sirapassorn US2a pickup 2h, Sakkaraj US6 QA 3h | 7 |
| 9 | Sirapassorn US2a 2h + US2b 2h, Pratanin US2a food-bank view 2h | 6 |
| 10 | Sakkaraj US2a QA 2h, Sirapassorn US2b 4h, Pratanin US2b proof UI 3h | 9 |
| 11 | Sirapassorn US2b 4h, Pratanin US2b 3h, Sakkaraj US2b QA 2h | 9 |
| 12 | Sakkaraj US2b QA 2h, Jirathiwat US5a receipt 2h + US3a expiry 2h | 6 |
| 13 | Jirathiwat US5a 1h + US3a 3h, Sakkaraj US5a QA 2h + US3a QA 1h | 7 |
| 14 | Sakkaraj US3a QA 2h | 2 |
| 15 | Buffer | 0 |

## What shipped (16 October close-out)

- US1a: donor form, `POST /api/donations`, queue `/queue` and `GET /api/queue`, QA inject `POST /api/test/queue`, 1-minute ingest, duplicate protection.
- US1b: auto-match on ingest by proximity and remaining capacity; `GET /api/matches?donationId=`; no match when quantity exceeds remaining capacity.
- US6: pickup window on the donor form and on the driver dispatch feed.
- US2a: driver `POST /api/pickup`; food bank `/incoming` shows driver ID and pickup timestamp.
- US2b: delivery requires photo or signature; incoming shows proof and delivery timestamp.
- US5a: receipt with weight, food type, timestamp, emailed to the donor (`emailStatus: sent`).
- US3a: queue flags **urgent** when expiry is within 24 hours.
- QA: `qa/api/test-log-donation.py` and `qa/api/test-sprint1-remaining.py`.

## Day log

### Day 1

Meeting 1. Team read US1a. Risks: message format, duplicate donations, form validation.

### Day 2 (finished 15 Oct)

Pratanin finished the donation entry form. Jirathiwat logged 4h on queue ingestion.

### Days 3–15 (compressed, finished 16 Oct)

Remaining Sprint 1 stories and QA implemented so Meeting 4–6 can report progress and close the sprint on Friday 23 October. Cards stay In Review / QA until each standup ticks Definition of Done.

## Blockers

None open. Friday 16 message-format, sample food-bank data, and `/api/test/queue` are closed.
