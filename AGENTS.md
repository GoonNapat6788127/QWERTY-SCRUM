# QWERTY Scrum agent

This repo is Team QWERTY’s surplus-food Rescue ERP. Follow the Sprint 1 backlog. Do not invent extra product scope.

## When the user runs the daily sprint

Read `.cursor/skills/daily-sprint/SKILL.md` and do that workflow:

1. Read `docs/sprint-1-progress.md` to learn the current day.
2. Implement that day’s Sprint Backlog tasks in `web/` (and QA tests in `qa/` when the owner is QA).
3. Update progress: hours, card status, blockers, burndown notes.
4. Write the next morning's standup to `docs/sprint-1-scrum-meeting-{N+1}.md`. It reports the day just finished. It does not mark the next day done.
5. Commit and push when the user asked to save to GitHub.

Triggers: `daily sprint`, `run sprint`, `today’s sprint`, `standup`, `daily scrum`, `meeting script`, `day N`.

Source PDFs in `docs/`:

- `sprint-1-presentation.pdf` — product backlog and Sprint 1 plan
- `sprint-1-backlog.pdf` — task hours by day
- `sprint-1-scrum-meeting-1.pdf` — first Daily Scrum script
- `sprint-1-scrum-meeting-2.pdf` — speaking-script format to copy
- `sprint-1-scrum-meeting-3.md` / `sprint-1-scrum-meeting-3.pdf` — latest standup script

## Team

| Person | Role |
|---|---|
| Napat Tayommai | Scrum Master |
| Pratanin Kahtepmud | Dev 1 |
| Sirapassorn Pokasermsong | Dev 2 |
| Jirathiwat Suntipreedatham | Dev 3 |
| Sakkaraj Tuvajit | QA 1 |

## Definition of Done

A card is Done only when acceptance criteria pass, code is reviewed and on `main`, tests pass, validation exists, time targets are met, QA has no critical bugs, and the board/hours are updated.

## Product rules

- US1a queue message: `donationId`, `foodType`, `quantity` (kg), `expiryDateTime`, `pickupWindow`, `donorId`, `timezone: Asia/Bangkok`.
- Only donors `POST /api/donations`. Queue: `/queue` and `GET /api/queue`. QA inject: `POST /api/test/queue`.
- Timezone Asia/Bangkok. Queue within 1 minute. Match within 2 minutes when in range and capacity remains.
