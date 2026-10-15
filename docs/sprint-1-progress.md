# Sprint 1 progress

Living file. The daily-sprint agent reads and updates this every run.

## State

| Field | Value |
|---|---|
| Sprint | 1 of 2 |
| Today | Day 2 is finished. Day 3 has not started. |
| last_completed_day | 2 |
| next_day_to_run | 3 |
| Next standup | Meeting 3, tomorrow morning, start of Day 3 |
| last_meeting_script | 3 (`docs/sprint-1-scrum-meeting-3.md`, `docs/sprint-1-scrum-meeting-3.pdf`) |
| What Meeting 3 reports | Finished Day 2. Day 3 is "Next", not accomplished. |
| App | `web/` → http://localhost:3000 |

## Clock (do not skip this)

- Meeting 1 (Oct 14) was the kickoff. Plans and risks only.
- Meeting 2 PDF is the speaking-format template. It is not evidence that Day 3 is done.
- Meeting 3 is tomorrow's standup. It reports Day 2.
- `Run today's sprint` implements **Day 3**, then writes **Meeting 4** for the morning after Day 3.
- Do not set `last_completed_day` to 3 until Day 3's planned hours are actually done.
- Code that exists ahead of the plan does not move later cards to Done or log later days' hours.

## How to run the agent

```text
Run today's sprint
```

That run is Day 3. Optional: `Run sprint day 5` or `Meeting script only`.

## Team

| Person | Role |
|---|---|
| Napat Tayommai | Scrum Master |
| Pratanin Kahtepmud | Dev 1 |
| Sirapassorn Pokasermsong | Dev 2 |
| Jirathiwat Suntipreedatham | Dev 3 |
| Sakkaraj Tuvajit | QA 1 |

## Board status (end of Day 2)

| Card | Owner | Status | Hours plan | Hours logged |
|---|---|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA | 8 | 8 (4 on Day 1, 4 on Day 2) |
| US1a Queue ingestion backend | Jirathiwat | In Progress | 8 | 4 (Day 2). 4h left on Day 3 |
| US1a QA donation creation and queue timing | Sakkaraj | To-Do | 4 | 0. Starts Day 3 (2h) |
| US1b Proximity scoring | Sirapassorn | To-Do | 12 | 0. Starts Day 3 (4h) |
| US1b Capacity check | Jirathiwat | To-Do | 8 | 0. Starts Day 4 |
| US1b Integrate matching with queue | Pratanin | To-Do | 12 | 0. Starts Day 4 |
| Later Sprint 1 cards | Various | To-Do | — | 0 |

Open from Meeting 1: message format, duplicate donations, validation, QA has no queue to hit yet.

## Day 3 plan (next run, after tomorrow's meeting)

| Owner | Card | Hours |
|---|---|---|
| Jirathiwat | Finish US1a queue ingestion | 4 |
| Sirapassorn | US1b proximity scoring | 4 |
| Sakkaraj | US1a QA, first slice | 2 |
| Pratanin | No planned hours. Stay on form review. | 0 |

## Sprint 1 hour plan by day

Totals: 4, 8, 10, 12, 12, 14, 8, 7, 6, 9, 9, 6, 7, 2, 0

| Day | Work |
|---|---|
| 1 | Pratanin form 4h |
| 2 | Pratanin form 4h, Jirathiwat ingestion 4h |
| 3 | Jirathiwat ingestion 4h, Sirapassorn proximity 4h, Sakkaraj QA 2h |
| 4 | Sakkaraj QA 2h, Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h |
| 5 | Sirapassorn proximity 3h, Jirathiwat capacity 3h, Pratanin integrate 4h, Sakkaraj US1b QA 2h |
| 6 | Sirapassorn proximity 2h, Jirathiwat capacity 2h, Pratanin integrate 3h + US6 UI 2h, Sakkaraj US1b QA 4h |
| 7 | Pratanin integrate 1h + US6 UI 3h, Jirathiwat US6 dispatch 3h, Sakkaraj US1b QA 2h |
| 8 | Jirathiwat US6 dispatch 2h, Sirapassorn US2a pickup 2h, Sakkaraj US6 QA 3h |
| 9 | Sirapassorn US2a 2h + US2b 2h, Pratanin US2a food-bank view 2h |
| 10 | Sakkaraj US2a QA 2h, Sirapassorn US2b 4h, Pratanin US2b proof UI 3h |
| 11 | Sirapassorn US2b 4h, Pratanin US2b 3h, Sakkaraj US2b QA 2h |
| 12 | Sakkaraj US2b QA 2h, Jirathiwat US5a receipt 2h + US3a expiry 2h |
| 13 | Jirathiwat US5a 1h + US3a 3h, Sakkaraj US5a QA 2h + US3a QA 1h |
| 14 | Sakkaraj US3a QA 2h |
| 15 | Buffer |

## Day log

### Day 1

Meeting 1. Team read US1a. Risks: message format, duplicate donations, form validation. Sakkaraj drafted test cases. No build hours beyond Pratanin's first 4h on the form.

### Day 2 (finished)

Pratanin finished the donation entry form (food type, quantity in kg, expiry, validation). Card is In Review / QA, not Done. Jirathiwat logged 4h on queue ingestion; the card stays In Progress with 4h left on Day 3. Meeting 3 script is ready for tomorrow morning.
