---
name: daily-sprint
description: Runs Team QWERTY Sprint 1 day-by-day — implements that day's backlog, updates progress, and writes the Daily Scrum meeting script. Use when the user says daily sprint, run sprint, today's sprint, standup, daily scrum, meeting script, or day N.
---

# Daily sprint

Each user run = **one Sprint day**: implement the plan, update progress, write the standup script.

## Quick start

1. Read [docs/sprint-1-progress.md](../../../docs/sprint-1-progress.md).
2. For hours use `docs/sprint-1-backlog.pdf`. For stories use `docs/sprint-1-presentation.pdf`. For script voice use `docs/sprint-1-scrum-meeting-1.pdf` and `docs/sprint-1-scrum-meeting-2.pdf`.
3. `next_day_to_run` is the day to execute unless the user names a day (`day 5`, `meeting 4`).
4. Follow **Workflow** below. Do not skip the progress file or the meeting script.

## Workflow

Copy and track:

```
Daily sprint:
- [ ] Read progress + decide Day N
- [ ] Implement Day N tasks (web/ and qa/ as assigned)
- [ ] Verify acceptance criteria you touched
- [ ] Update docs/sprint-1-progress.md
- [ ] Write docs/sprint-1-scrum-meeting-{N}.md
- [ ] Show the user: what shipped, board moves, script path
- [ ] Commit/push if they asked for GitHub
```

### 1. Decide Day N

- Default: `next_day_to_run` in the progress file.
- User said `day 7`: use 7.
- User said `meeting script only`: skip implementation; still refresh the script from current progress.
- Sprint 1 has 15 planned hour-days packed into a calendar that holds **three Daily Scrums per week** (Monday, Wednesday, Friday) and ends **Friday 23 October 2026**. If `next_day_to_run` is 16, stop and say Sprint 1 implementation is finished; remaining work is the three standup scripts (Meetings 4–6) unless the user asks for Sprint 2.

### 2. Implement Day N

Work the **Day N hour cells** in the progress file (owner + story + hours).

- Code lives in `web/`. QA tests live in `qa/`.
- Stay on those cards. Do not pull later-sprint gold-plating unless Day N work is already done and the user wants more.
- Keep US1a contract stable (`GET /api/contract`).
- Check DoD before moving a card to **Done**. In Review / QA is the default after a coding day.

### 3. Update progress

Edit `docs/sprint-1-progress.md`:

- Set `last_completed_day` = N and `next_day_to_run` = N+1 only after Day N's planned hours are actually done.
- Set `last_meeting_script` = N+1. That file is the **next morning's** standup, not proof that Day N+1 is finished.
- Log only Day N hours. Leave later days at 0.
- Note blockers closed or opened.
- Add a short **Day N log** (what shipped).

### 4. Write the meeting script

Path: `docs/sprint-1-scrum-meeting-{N+1}.md` and `.pdf`.

**Meeting (N+1)** is held at the **start of Day N+1** (the morning after Day N). It reports **finished Day N**. Day N+1 cards are "Next". Do not say yesterday was Day N+1.

Use [docs/templates/daily-scrum-script.md](../../../docs/templates/daily-scrum-script.md).

Must include:

- 10 minutes, board on screen, three questions
- Opening (Napat) then **Pratanin → Jirathiwat → Sirapassorn → Sakkaraj** → Napat close
- Each speaker: Accomplished / Next / Blockers, naming the **card**
- DoD check (US1a not Done until QA ticks)
- Example card positions
- Note: replace lines with live status before speaking

### 5. GitHub

If the user asked to add/push/save to GitHub: commit the script, progress file, and code, then push `main`. Do not force-push.

## Meeting clock

Do not advance the sprint day just because code for a later card exists.

| Meeting | When | Reports | Status |
|---|---|---|---|
| 1 | Oct 14 kickoff | Plans and risks. No build yet. | Done. PDF only. |
| 2 | Draft in the Meeting 2 PDF | Planned Day 1–2 wording. Format to copy. | Template. Not "Day 3 is done". |
| 3 | Friday 16 Oct window (after Day 2) | Day 2 finished. | Script exists. |
| 4 | Monday 19 October 2026 | US1a close, US1b start | `docs/sprint-1-scrum-meeting-4.md` |
| 5 | Wednesday 21 October 2026 | US1b, US6, US2a | `docs/sprint-1-scrum-meeting-5.md` |
| 6 | Friday 23 October 2026 | US2b, US5a, US3a, Sprint 1 close | `docs/sprint-1-scrum-meeting-6.md` |

Read `last_completed_day` and `next_day_to_run` from `docs/sprint-1-progress.md`. Do not infer the day from how much code is already in `web/`.

## Do not

- Mark Done without QA + DoD
- Change demo passwords or the US1a JSON field names without updating QA tests
- Skip the speaking script because “the code is enough”
