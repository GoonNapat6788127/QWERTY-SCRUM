# Sprint 1 progress

Living file. The daily-sprint agent reads and updates this every run.

## State

| Field | Value |
|---|---|
| Sprint | 1 of 2 |
| last_completed_day | 3 |
| next_day_to_run | 4 |
| last_meeting_script | 3 (`docs/sprint-1-scrum-meeting-3.md`, `docs/sprint-1-scrum-meeting-3.pdf`) |
| Branch / commit at last log | `main` / `d7df8e3` |
| App | `web/` → http://localhost:3000 |

## How to run the agent

In Cursor chat:

```text
Run today's sprint
```

Optional: `Run sprint day 5` or `Meeting script only`.

The agent implements `next_day_to_run`, updates this file, and writes `docs/sprint-1-scrum-meeting-{N}.md`.

Source PDFs: `docs/sprint-1-presentation.pdf`, `docs/sprint-1-backlog.pdf`, `docs/sprint-1-scrum-meeting-2.pdf`.

## Team

| Person | Role |
|---|---|
| Napat Tayommai | Scrum Master |
| Pratanin Kahtepmud | Dev 1 |
| Sirapassorn Pokasermsong | Dev 2 |
| Jirathiwat Suntipreedatham | Dev 3 |
| Sakkaraj Tuvajit | QA 1 |

## Board status (after Day 3)

| Card | Owner | Status | Hours plan | Hours logged |
|---|---|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA | 8 | 8 |
| US1a Queue ingestion backend | Jirathiwat | In Review / QA | 8 | 8 |
| US1a QA donation creation and queue timing | Sakkaraj | In Progress | 4 | 2 (2 left Day 4) |
| US1b Proximity scoring | Sirapassorn | In Progress | 12 | 4 (8 left) |
| US1b Capacity check | Jirathiwat | To-Do | 8 | 0 (starts Day 4) |
| US1b Integrate matching with queue | Pratanin | To-Do | 12 | 0 (starts Day 4) |
| US1b QA auto-matching | Sakkaraj | To-Do | 8 | 0 |
| US6 / US2a / US2b / US5a / US3a | Various | To-Do | — | 0 |

Closed blockers: message format, food-bank sample data, `POST /api/test/queue`.

Open gates: US1a DoD (QA UI pass + PO accept).

## Day 4 plan (next run)

| Owner | Card | Hours |
|---|---|---|
| Sakkaraj | US1a QA remaining | 2 |
| Sirapassorn | US1b proximity scoring | 3 |
| Jirathiwat | US1b capacity check | 3 |
| Pratanin | US1b integrate matching with queue | 4 |

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

### Day 1–2

Form UI started; ingestion started; Meeting 1 risks: message format, duplicates, validation.

### Day 3

Rescue ERP on `main` (`d7df8e3`). Queue ingestion immediate; US1a API tests 15 passed; proximity + sample food banks; test endpoint live. Meeting script: `docs/sprint-1-scrum-meeting-3.md`.
