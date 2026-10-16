# Sprint 1 – Scrum Meeting 3 Script (QWERTY)

Speaking script for **today, Friday 16 October 2026**. Same three-question format as Meeting 2.

## Meeting at a glance

Meeting 3 is a **10-minute stand-up today, Friday 16 October 2026**. It reports **Day 2, which is finished** (Thursday 15 October). **Day 3 has not started.** Each member answers the same three questions. The Scrum board stays on screen the whole time.

Sprint 1 started Wednesday 14 October (Meeting 1) and **must finish Friday 23 October** (Meeting 6). The Meeting 2 PDF is the speaking template, not a second live meeting. This script is the live standup.

**Note:** Replace any line with that person's real status before you speak. Do not say Day 3 tasks are already done. Do not call US1b, US6, US2a, US2b, US5a, or US3a Done. Those hours are Meetings 4–6. The W02 conclusion sheet is the **Friday 23** result, not today's board. Sprint 2 stories (US3b, US4a, US4b, US5b, US7, US8) stay on the product backlog.

| Item | Detail |
|---|---|
| Length | About 10 minutes (about 1.5 minutes per person) |
| When | **Today, Friday 16 October 2026**, start of Day 3 |
| Reports | Day 2 (8h). Day 1 (4h) was after Meeting 1. |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Shared on screen | Scrum board and the Definition of Done |
| Sprint ends | Friday 23 October 2026 |
| Next standup | Monday 19 October, Meeting 4 (reports Days 3–4) |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

Napat prepares these so the meeting can run without setup time.

1. Open the Scrum board and share it.
2. Day 2 cards only: Pratanin's form is In Review / QA. Jirathiwat's ingestion is In Progress (4h of 8h). Everything else stays Sprint 1 To-Do.
3. Pin the Definition of Done. US1a is not Done.
4. Log Day 2 hours before anyone speaks: Pratanin 4h, Jirathiwat 4h.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning, everyone. Today is **Friday 16 October**. This is our **third Scrum meeting** for Sprint 1. It is the **start of Day 3**. **Thursday 15 October was Day 2**, and that day's planned work is finished. The board is on screen.

Sprint 1 ends **Friday 23 October**. After today we have three standups: Monday 19, Wednesday 21, and Friday 23. We do not present the conclusion sheet today.

Same three questions: what did I accomplish since the last Scrum meeting, what will I focus on until the next one, and is anything blocking me. Name the **card**. Day 3 cards are still To-Do. We do not move a card to Done unless every item on the Definition of Done is ticked.

Meeting 1 left us three risks: message format, duplicate donations, and input validation. We will hear where those stand.

Pratanin, would you like to start?

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** My card is **US1a Build donation entry form UI**. Day 2 was my last 4 hours, so the 8-hour card is built. The form has food type, quantity in kilograms, and expiry date and time, plus validation and error messages. That covers the validation risk from Meeting 1. The card is **In Review / QA**, not Done.

**Next:** I have **0 hours on Day 3** (the rest of today). Before Monday I log **Day 4: 4 hours** on **US1b Integrate matching service with queue triggers**. Until then I take review comments on the form. I do not start US6. That is Days 6–7, reported at Meeting 5.

**Blockers:** None for the form. It cannot go to Done until Sakkaraj's QA pass.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** My card is **US1a Implement donation queue ingestion backend logic**. Day 2 was the first **4 of 8 hours**. I read the acceptance criteria and started ingestion: a donation message goes into the matching queue. I am proposing this JSON so we can close the message-format risk: donation ID, food type, quantity, expiry date and time, pickup window, donor ID, timezone Asia/Bangkok. The donation ID is also how we avoid saving the same donation twice. The card stays **In Progress**.

**Next:** Day 3 is my remaining **4 hours** on this same card. I will finish ingestion, check the 1-minute queue rule, add the duplicate check, and give Sakkaraj a way to send test messages by the end of today.

**Blockers:** I need Pratanin and Sakkaraj to agree the message format in this meeting. Until we agree, the fields stay a proposal.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, you're next. Please name the card you will work on today.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I had no hours on Day 2. No card moved. I stayed with the US1b acceptance criteria: propose a match within 2 minutes when a food bank is within delivery range and has reported capacity.

**Next:** My Day 3 card is **US1b Develop matching algorithm proximity scoring**, **4 hours**. I will rank food banks by distance inside their delivery range. The card moves to In Progress after this meeting, not before.

**Blockers:** I need sample food bank data with location and reported capacity. Sakkaraj, can you include that in today's test data?

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj, last one.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I had no test-execution hours on Day 2. The test-case document for donation ingestion and the entry form is already written, from Meeting 1. The QA card is still **To-Do**.

**Next:** Day 3 is **2 hours** on **US1a QA test donation creation and queue timing**. I will check that a donation appears in the queue within 1 minute, and I will add food bank sample data for Sirapassorn.

**Blockers:** I still cannot run the queue tests until Jirathiwat gives me the test endpoint today, and until Pratanin's form is on a test environment. That is today's work, not something I finished yesterday.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Day 2 hours are on the board: Pratanin 4, Jirathiwat 4. The form is In Review / QA. Ingestion is In Progress at 4 of 8 hours. Every other card is still To-Do.

**Next:** After this meeting I will move today's three cards to In Progress: Jirathiwat ingestion, Sirapassorn proximity, Sakkaraj QA. I will update the burndown only from hours people actually log today.

**Blockers:** None for me. I am watching the message format, the food bank sample data, and the test endpoint.

### 10. Blocker and risk review (Napat, about 1 minute)

Three items to close today, not yesterday. One: Jirathiwat, Pratanin, and Sakkaraj agree the message format before we leave. Two: Sakkaraj gives Sirapassorn food bank sample data. Three: Jirathiwat gives Sakkaraj the test endpoint by the end of Day 3. Pratanin's validation risk is already in the form. The duplicate-donation risk waits on the donation ID during today's ingestion hours. Does anyone disagree or want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US1a is **not Done**. Pratanin's form is In Review. Before it moves to Done we still need: acceptance criteria met, code reviewed and on main, tests passing, QA passed, the 1-minute queue time met, and the card and hours updated. Sakkaraj starts that QA today. Jirathiwat's ingestion is only halfway, so it cannot go to Done this morning. Same rule later for US1b: match within 2 minutes, in range, with capacity.

### 12. Closing (Napat, about 30 seconds)

Thank you. Day 3 starts now, still **Friday 16 October**: finish ingestion (4h), start proximity scoring (4h), and start US1a QA (2h). Day 4 is before Monday. The next Scrum meeting is **Monday 19 October (Meeting 4)**. It reports **Days 3–4** (22h). Sprint 1 is Done only on **Friday 23 October**, after Meeting 6, if the Definition of Done passes. Thank you.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- The work meets every Given/When/Then acceptance criterion of its user story.
- Another team member has reviewed the code, and it is merged into `main`.
- Unit tests are written and pass.
- Input validation and error handling are in place (bad quantity or expiry, duplicate donation).
- Time targets are met where the story sets one (queue within 1 minute, match within 2 minutes).
- QA has run the test cases for the card, with no open critical bugs.
- The card is updated on the board and the hours are logged in the Sprint Backlog.

---

## Scrum board

| Column | Meaning |
|---|---|
| Sprint 1 To-Do | Planned, not started |
| In Progress | Someone is working on it now |
| Blocked | Waiting on a decision, data, or another person |
| In Review / QA | Code review and QA testing |
| Done | Passed every item of the Definition of Done |

### Card positions at the start of Meeting 3 (today, Friday 16 October)

| Card | Owner | Column |
|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA |
| US1a Implement donation queue ingestion backend logic | Jirathiwat | In Progress (4h of 8h) |
| US1a QA test donation creation and queue timing | Sakkaraj | Sprint 1 To-Do (starts today, 2h) |
| US1b Develop matching algorithm proximity scoring | Sirapassorn | Sprint 1 To-Do (starts today, 4h) |
| All other Sprint 1 cards | Various | Sprint 1 To-Do |

---

## Day 2 hours to log before the meeting

| Person | Day 2 plan | Log |
|---|---|---|
| Pratanin | 4h donation form | 4h. Form card leaves To-Do. |
| Jirathiwat | 4h queue ingestion | 4h. Card stays In Progress. |
| Sirapassorn | 0 | 0 |
| Sakkaraj | 0 | 0 |
| Napat | facilitation | Board and this script only |

---

## Calendar from today to Sprint close

Three standups a week (Monday, Wednesday, Friday). The W02 Day 1–15 hours are packed into those meetings. Speak only the row for the meeting you are in.

| Calendar | Meeting | Hours reported as done | Board after the meeting | Still not Done |
|---|---|---|---|---|
| Wed 14 Oct | 1 Kickoff | 0 | All Sprint 1 To-Do | Whole sprint |
| Thu 15 Oct | No standup | Day 1 (4h) worked | Form 4 of 8h | — |
| **Fri 16 Oct (today)** | **3** | **Day 2 (8h)** | Form 8/8 In Review. Ingestion 4/8 In Progress | US1a not Done. US1b and later To-Do |
| Fri 16 after this meeting – Sun 18 | Work, no standup | Days 3–4 (22h) | — | Reported Monday |
| Mon 19 Oct | 4 | Days 3–4 | US1a In Review. US1b In Progress | US6 and later To-Do |
| Tue 20 Oct | Work, no standup | Part of Days 5–8 | — | Reported Wednesday |
| Wed 21 Oct | 5 | Days 5–8 (41h) | US1a Done. US1b and US6 In Review. US2a pickup 2/4 | Incoming view, US2b, US5a, US3a To-Do |
| Thu 22 Oct | Work, no standup | Part of Days 9–14 | — | Reported Friday |
| **Fri 23 Oct** | **6 Sprint close** | **Days 9–14 (39h). Day 15 = 0** | **7 Sprint 1 stories Done if DoD passes. 114/114. Remaining 0** | Sprint 2 stays on the product backlog |

Check: 4 + 8 + 22 + 41 + 39 + 0 = **114**.

## Product backlog in this meeting

Sprint 1 only: **US1a, US1b, US6, US2a, US2b, US5a, US3a**.

Sprint 2, do not move today: **US3b, US4a, US4b, US5b, US7, US8**.

## What to do if the room goes off the plan

- Someone asks to mark a later card Done because the website already shows it: leave the card in To-Do until the meeting that owns those hours. The Friday 23 demo can show it. Today's board cannot.
- A critical bug is open: that card stays out of Done. On Friday 23, leave it off the conclusion Done column and do not say 7 of 7.
- Friday 23 DoD passes for every Sprint 1 card: present `docs/sprint-1-backlog-conclusion.xlsx`. Remaining 0. Then Sprint Review, then Sprint 2 planning.
