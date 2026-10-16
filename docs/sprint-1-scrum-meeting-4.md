# Sprint 1 – Scrum Meeting 4 Script (QWERTY)

Monday 19 October 2026. Three-question format.

## Meeting at a glance

Meeting 4 is a **10-minute stand-up on Monday 19 October**, the first of the three remaining standups this sprint. It reports work since Friday 16 October (Meeting 3). Each week we hold three Daily Scrums: Monday, Wednesday, Friday. Sprint 1 must finish on **Friday 23 October 2026**.

**Note:** Replace any line with live status before you speak.

| Item | Detail |
|---|---|
| Date | Monday 19 October 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Reports | Friday 16 – Sunday 18 (Days 3–4 on the hour plan) |
| Next | Wednesday 21 October, Meeting 5 |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

1. Share the Scrum board.
2. US1a cards should be In Review / QA or Done only if DoD is ticked.
3. US1b cards In Progress.
4. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **four** for Sprint 1, **Monday 19 October**. Last meeting was Friday. We have **two standups left**: Wednesday and Friday. Friday 23 October is the last day of Sprint 1.

Three questions, name the card, board on screen. Nothing moves to Done unless the Definition of Done is ticked.

Friday we agreed the message format, food-bank sample data, and the test endpoint. We will confirm those landed.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** My form card **US1a Build donation entry form UI** stayed in Review. I connected it to the live queue so a valid submit appears on `/queue`. Pickup window from US6 is on the same form. The form card is **In Review / QA**.

**Next:** Until Wednesday I work **US1b Integrate matching service with queue triggers**. Matching should run when a donation is ingested, inside the 2-minute target.

**Blockers:** None. I need Sakkaraj's US1a QA tick before the form goes to Done.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** I finished **US1a Implement donation queue ingestion backend logic**. The JSON is donation ID, food type, quantity, expiry, pickup window, donor ID, timezone Asia/Bangkok. Queue time is immediate, under 1 minute. Duplicate protection is donation ID plus Idempotency-Key. QA can POST `/api/test/queue`. That card is **In Review / QA**. I also started **US1b capacity check**: remaining kilograms must cover the donation.

**Next:** Until Wednesday I finish capacity scoring and keep it on the same path as Sirapassorn's proximity score.

**Blockers:** None. Message format is agreed.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, name the card.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I started **US1b Develop matching algorithm proximity scoring**. Food banks are ranked by distance inside each delivery range. Sample data is in the app: SOS Food Bank Bangkok, Mahidol Community Kitchen, Thonburi Shelter Pantry, Min Buri Neighbourhood Bank. A test donation proposed SOS at about 3.7 km. The card is **In Progress**.

**Next:** Until Wednesday I finish proximity ranking and only propose a match when the bank is in range **and** has remaining capacity.

**Blockers:** None. Sample food-bank data is in.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I ran **US1a QA test donation creation and queue timing**. The API suite in `qa/api/test-log-donation.py` passed, including queue time under 60 seconds, validation, duplicates, and non-donor blocked. I can inject with `/api/test/queue`. The US1a QA card is **In Review / QA**. I have not ticked Done until the short UI pass on the donor form is recorded.

**Next:** Until Wednesday I finish the US1a UI pass, then start **US1b QA**: in range with capacity, over capacity, and match time under 2 minutes.

**Blockers:** None for the API. I still need five minutes with Pratanin on the form for the UI pass.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Board shows US1a in Review / QA, US1b in Progress. Friday's three blockers are closed: format, sample data, test endpoint.

**Next:** I keep the burndown current. Remaining Sprint 1 stories after matching are US6, US2a, US2b, US5a, US3a. They must be Done by Friday 23 October.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Open item: Sakkaraj's US1a UI walkthrough with Pratanin. Matching must not propose a bank that is out of range or over capacity. Does anyone want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US1a is close. Before Done: acceptance criteria, review, tests, validation, 1-minute queue, QA with no critical bugs, hours on the board. Sakkaraj confirms the QA tick. US1b is not Done until match within 2 minutes, in range, with capacity, and QA has run those cases.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Wednesday 21 October**. Focus until then: close US1a DoD and finish US1b matching. Thank you.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- The work meets every Given/When/Then acceptance criterion of its user story.
- Another team member has reviewed the code, and it is merged into `main`.
- Unit tests are written and pass.
- Input validation and error handling are in place.
- Time targets are met where the story sets one (queue within 1 minute, match within 2 minutes).
- QA has run the test cases for the card, with no open critical bugs.
- The card is updated on the board and the hours are logged in the Sprint Backlog.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- The work meets every Given/When/Then acceptance criterion of its user story.
- Another team member has reviewed the code, and it is merged into `main`.
- Unit tests are written and pass.
- Input validation and error handling are in place.
- Time targets are met where the story sets one (queue within 1 minute, match within 2 minutes).
- QA has run the test cases for the card, with no open critical bugs.
- The card is updated on the board and the hours are logged in the Sprint Backlog.

---

## Board at the start of Meeting 4

| Card | Owner | Column |
|---|---|---|
| US1a form UI | Pratanin | In Review / QA |
| US1a queue ingestion | Jirathiwat | In Review / QA |
| US1a QA | Sakkaraj | In Review / QA |
| US1b proximity | Sirapassorn | In Progress |
| US1b capacity | Jirathiwat | In Progress |
| US1b integrate matching | Pratanin | In Progress |
| US1b QA | Sakkaraj | To-Do |
| US6 / US2a / US2b / US5a / US3a | Various | To-Do |
