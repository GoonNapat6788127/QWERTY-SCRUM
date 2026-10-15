# Sprint 1 – Scrum Meeting {N} Script (QWERTY)

Speaking script for Daily Scrum {N}. Three-question format from instructor feedback.

## Meeting at a glance

Meeting {N} is a **10-minute stand-up at the start of Sprint Day {N+1}**. It reports **Day {N} work**. Each member answers the same three questions. The Scrum board stays on screen the whole time.

**Note:** Replace any line with that person's real status before you speak.

| Item | Detail |
|---|---|
| Length | About 10 minutes (about 1.5 minutes per person) |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Shared on screen | Scrum board and Definition of Done |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

1. Share the Scrum board.
2. Move cards to real status.
3. Pin the Definition of Done.
4. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning, everyone. This is our **{Nth} Scrum meeting** for Sprint 1. Yesterday was **Day {N}**. Board is on screen.

Three questions: what I accomplished since last meeting, what I will focus on until the next one, and blockers. Name the card. Nothing moves to Done unless Definition of Done is ticked.

Follow up yesterday's blockers: {blockers from last meeting}.

Pratanin, would you like to start?

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** {card + what was built + column}

**Next:** {Day N+1 plan card + hours}

**Blockers:** {none or named wait}

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** {card + what was built + column}

**Next:** {Day N+1 plan}

**Blockers:** {none or named wait}

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, you're next. Name the card and what you built.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** {card + what was built + column}

**Next:** {Day N+1 plan}

**Blockers:** {none or named wait}

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj, last of the builders.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** {card + cases run + pass/fail}

**Next:** {Day N+1 QA hours}

**Blockers:** {endpoint / environment / data}

### 9. Napat's own update (about 1 minute)

**Accomplished:** Board and burndown from Day {N} hours.

**Next:** Chase DoD and Day {N+1} cards.

**Blockers:** {none or named}

### 10. Blocker and risk review (Napat, about 1 minute)

Summarize open vs closed blockers. Ask if anyone disagrees.

### 11. Definition of Done check (Napat, about 1.5 minutes)

Read the list. Do not move cards to Done unless every tick is true.

### 12. Closing (Napat, about 30 seconds)

Update cards daily. Next meeting is **[date and time]**. Thank you.

---

## Definition of Done

- Acceptance criteria met
- Reviewed and on `main`
- Tests pass
- Validation and error handling in place
- Time targets met (queue 1 min, match 2 min)
- QA: no open critical bugs
- Card and hours updated

## Example card positions

| Card | Owner | Column |
|---|---|---|
| {story + task} | {name} | {To-Do / In Progress / Blocked / In Review / QA / Done} |
