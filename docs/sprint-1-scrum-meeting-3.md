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

**Accomplished:** My card is **US1a Build donation entry form UI**. Day 2 closed the last 4h, so the 8h card is implemented. The client route is `/donations/new`. The payload fields are `foodType` (required dropdown), `quantity` in kilograms (min 0.1, max 5000), and `expiryDateTime` (must be in the future, timezone Asia/Bangkok). Invalid input stays on the form with a field error and does not call the API. The card is **In Review / QA**, not Done.

**Next:** I have **0 hours on Day 3**. Before Monday I log **Day 4, 4 hours** on **US1b Integrate matching service with queue triggers**: after a successful ingest, `POST /api/donations` must call the matcher on the same request. I do not start the US6 `pickupWindow` control. That UI is Days 6–7, reported at Meeting 5.

**Blockers:** None on the form component. It stays out of Done until Sakkaraj's suite `qa/api/test-us1a-log-donation.py` passes.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** My card is **US1a Implement donation queue ingestion backend logic**. Day 2 was the first **4 of 8 hours**. A donor `POST /api/donations` persists the row and it is readable from `GET /api/queue` and the page `/queue`. I am proposing this JSON schema, to be published at `GET /api/contract`: `donationId`, `foodType`, `quantity`, `quantityUnit: "kg"`, `expiryDateTime` (ISO-8601), `pickupWindow.start`, `pickupWindow.end`, `donorId`, `timezone: "Asia/Bangkok"`. `donationId` is the idempotency key so the same donation is not inserted twice. The card stays **In Progress**.

**Next:** Day 3 is the remaining **4 hours** on this handler. I will enforce the acceptance criterion that the item is on the queue in under 60 seconds, return the existing row when `donationId` or the `Idempotency-Key` header repeats, and ship `POST /api/test/queue` (201, auth donor or logistics) so QA can inject a message.

**Blockers:** I need Pratanin and Sakkaraj to accept this schema in this meeting. Until we accept it, the contract is still a proposal.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, you're next. Please name the card you will work on today.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I logged **0 hours** on Day 2. No card moved. I stayed on the US1b acceptance criteria: propose a match within 120 seconds only when `distanceKm` is inside `deliveryRangeKm` and `remainingCapacityKg` is at least `quantity`.

**Next:** My Day 3 card is **US1b Develop matching algorithm proximity scoring**, **4 hours**. I will rank food banks with a haversine `distanceKm` and a `proximityScore`. The card moves to In Progress after this meeting, not before.

**Blockers:** I need seed records with `lat`, `lng`, `deliveryRangeKm`, and `remainingCapacityKg`. Sakkaraj, can you put that fixture in today's test data?

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj, last one.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I logged **0 execution hours** on Day 2. The cases are written in `qa/docs/test-cases-log-donation.md` (TC-01 through TC-11). The QA card is still **To-Do**. No pytest run yet.

**Next:** Day 3 is **2 hours** on **US1a QA test donation creation and queue timing**. I will assert that `POST /api/donations` returns 201 and the same `donationId` is on `GET /api/queue` in under 60 seconds. I will also add the food-bank seed Sirapassorn needs for proximity scoring.

**Blockers:** The suite cannot run until `POST /api/test/queue` is up and the donor form is served at `http://localhost:3000`. That is Day 3 work, not something I finished on Day 2.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Day 2 hours are on the board: Pratanin 4, Jirathiwat 4. The form is In Review / QA. Ingestion is In Progress at 4 of 8 hours. Every other card is still To-Do.

**Next:** After this meeting I will move today's three cards to In Progress: Jirathiwat ingestion, Sirapassorn proximity, Sakkaraj QA. I will update the burndown only from hours people actually log today.

**Blockers:** None for me. I am watching the message format, the food bank sample data, and the test endpoint.

### 10. Blocker and risk review (Napat, about 1 minute)

Three items to close today, not yesterday. One: accept the `GET /api/contract` schema before we leave. Two: Sakkaraj adds food-bank seed data (`lat`, `lng`, `deliveryRangeKm`, `remainingCapacityKg`) for the proximity ranker. Three: Jirathiwat ships `POST /api/test/queue` by the end of Day 3. Form validation for bad `quantity` and `expiryDateTime` is already in the client. Duplicate protection waits on the `donationId` check in today's ingest hours. Does anyone disagree or want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US1a is **not Done**. The form is In Review. Before Done we still need: the Given/When/Then met, the handler reviewed and on `main`, `qa/api/test-us1a-log-donation.py` green, 400s for bad input, queue latency under 60 seconds, and hours logged. Sakkaraj starts that suite today. Ingestion is only 4 of 8 hours, so it cannot go to Done this morning. The same rule later for US1b: `proposeMatch` under 120 seconds, `withinRange` true, and `hasCapacity` true.

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
