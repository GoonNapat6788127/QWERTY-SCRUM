---
name: daily-sprint
description: Runs Team QWERTY Sprint 1 day-by-day — implements that day's backlog, updates progress, and writes the Daily Scrum meeting script. Use when the user says daily sprint, run sprint, today's sprint, standup, daily scrum, meeting script, or day N.
---

# Daily sprint

Each user run = **one Sprint day**: implement the plan, update progress, write the standup script.

## Quick start

1. Read [docs/sprint-1-progress.md](../../../docs/sprint-1-progress.md).
2. `next_day_to_run` is the day to execute unless the user names a day (`day 5`, `meeting 4`).
3. Follow **Workflow** below. Do not skip the progress file or the meeting script.

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
- Sprint 1 has 15 days. If `next_day_to_run` is 16, stop and say Sprint 1 is finished; offer Sprint 2 from the product backlog.

### 2. Implement Day N

Work the **Day N hour cells** in the progress file (owner + story + hours).

- Code lives in `web/`. QA tests live in `qa/`.
- Stay on those cards. Do not pull later-sprint gold-plating unless Day N work is already done and the user wants more.
- Keep US1a contract stable (`GET /api/contract`).
- Check DoD before moving a card to **Done**. In Review / QA is the default after a coding day.

### 3. Update progress

Edit `docs/sprint-1-progress.md`:

- Set `last_completed_day` = N, `next_day_to_run` = N+1, `last_meeting_script` = N (for N ≥ 3).
- Log hours and status per card.
- Note blockers closed or opened.
- Add a short **Day N log** (what shipped).

### 4. Write the meeting script

Path: `docs/sprint-1-scrum-meeting-{N}.md`

For N ≥ 3: **Meeting N**, held at the **start of Day N+1**, reports **Day N**.

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

## Meeting numbering

| Meeting | When | Reports |
|---|---|---|
| 1 | After Day 1 / start Day 2 | Plans and early risks |
| 2 | Start of Day 3 | Day 1–2 |
| 3+ | Start of Day N+1 | Day N |

## Do not

- Mark Done without QA + DoD
- Change demo passwords or the US1a JSON field names without updating QA tests
- Skip the speaking script because “the code is enough”
