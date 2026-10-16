# Sprint 1 – Scrum Meeting 4 Script (QWERTY)

Monday 19 October 2026. Three-question format.

## Meeting at a glance

Meeting 4 is a **10-minute stand-up on Monday 19 October**, the first of the three remaining standups this sprint. It reports **Days 3–4** on the W02 hour plan (work since Friday 16 October, Meeting 3). Each week we hold three Daily Scrums: Monday, Wednesday, Friday. Sprint 1 must finish on **Friday 23 October 2026**.

**Note:** Replace any line with live status before you speak. Do not report US6, US2a, or later cards as finished — those hours start on Day 6.

| Item | Detail |
|---|---|
| Date | Monday 19 October 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Reports | Friday 16 – Sunday 18 (**Days 3–4**, **22 hours**) |
| Next | Wednesday 21 October, Meeting 5 (**Days 5–8**) |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

1. Share the Scrum board.
2. Log Days 3–4 hours on the Sprint Backlog before anyone speaks (table at the end).
3. US1a cards In Review / QA. US1b In Progress. US6 and later stay To-Do.
4. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **four** for Sprint 1, **Monday 19 October**. Last meeting was **Friday 16 October (Meeting 3)**, the start of Day 3. We have **two standups left**: Wednesday 21 and Friday 23. Friday 23 October is the last day of Sprint 1. The conclusion sheet is for that day, not for this meeting. Sprint 2 stories stay on the product backlog.

Three questions, name the card, board on screen. Nothing moves to Done unless the Definition of Done is ticked.

Friday we agreed the message format, food-bank sample data, and the test endpoint. Days 3–4 on the hour plan were: finish ingestion, start proximity, start capacity, start matching integration, and run US1a QA hours. We will confirm those landed. US6 pickup-window hours have **not** started yet — that is Day 6.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** My form card **US1a Build donation entry form UI** stayed in Review. I connected it to the live queue so a valid submit appears on `/queue`. Day 3 had no hours for me. Day 4 was **4 hours** on **US1b Integrate matching service with queue triggers**. Matching now starts when a donation is ingested. That card is **In Progress** (4 of 12 hours). I did not start the US6 pickup-window UI — that is Days 6–7.

**Next:** Until Wednesday I finish the remaining **8 hours** of US1b integrate (Days 5–7), then start **US6 Add pickup time window UI**.

**Blockers:** None. I need Sakkaraj's US1a QA tick before the form goes to Done.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** Day 3 was my last **4 hours** on **US1a Implement donation queue ingestion backend logic**. The JSON is donation ID, food type, quantity, expiry, pickup window, donor ID, timezone Asia/Bangkok. Queue time is under 1 minute. Duplicate protection is donation ID plus Idempotency-Key. QA can POST `/api/test/queue`. That card is **In Review / QA**. Day 4 I started **US1b capacity check** (**3 of 8 hours**): remaining kilograms must cover the donation. Capacity stays **In Progress**.

**Next:** Until Wednesday I finish capacity (Days 5–6, 5 hours left), then **US6 Connect time window to dispatch feed** on Days 7–8.

**Blockers:** None. Message format is agreed.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, name the card.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I started **US1b Develop matching algorithm proximity scoring**. Day 3 was **4 hours**, Day 4 was **3 hours**, so **7 of 12 hours** are logged. Food banks are ranked by distance inside each delivery range. Sample data is in the app: SOS Food Bank Bangkok, Mahidol Community Kitchen, Thonburi Shelter Pantry, Min Buri Neighbourhood Bank. A test donation proposed SOS at about 3.7 km. The card is **In Progress**.

**Next:** Until Wednesday I finish the remaining **5 hours** of proximity (Days 5–6) and only propose a match when the bank is in range **and** has remaining capacity.

**Blockers:** None. Sample food-bank data is in.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I ran **US1a QA test donation creation and queue timing** — Day 3 **2 hours** and Day 4 **2 hours**, so the **4-hour** QA card is executed. The API suite in `qa/api/test-log-donation.py` passed, including queue time under 60 seconds, validation, duplicates, and non-donor blocked. I can inject with `/api/test/queue`. The US1a QA card is **In Review / QA**. I have not ticked Done until the short UI pass on the donor form is recorded.

**Next:** Until Wednesday I finish the US1a UI pass, then start **US1b QA** (Days 5–7, 8 hours): in range with capacity, over capacity, and match time under 2 minutes.

**Blockers:** None for the API. I still need five minutes with Pratanin on the form for the UI pass.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 3–4 hours are on the board: **22 hours** (10 + 12). US1a is In Review / QA. US1b is In Progress. Friday's three blockers are closed: format, sample data, test endpoint.

**Next:** I keep the burndown current. Meeting 5 will report Days 5–8: finish US1b, build US6, and start US2a pickup. Remaining Sprint 1 stories after that are US2a finish, US2b, US5a, US3a. They must be Done by Friday 23 October.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Open item: Sakkaraj's US1a UI walkthrough with Pratanin. Matching must not propose a bank that is out of range or over capacity. US6 stays To-Do until Day 6. Does anyone want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US1a is close. Before Done: acceptance criteria, review, tests, validation, 1-minute queue, QA with no critical bugs, hours on the board. Sakkaraj confirms the QA tick at Wednesday's meeting. US1b is not Done until match within 2 minutes, in range, with capacity, and QA has run those cases.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Wednesday 21 October**. It reports **Days 5–8**. Focus until then: close US1a DoD, finish US1b matching, build US6, and start the US2a pickup endpoint. Thank you.

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

| Card | Owner | Column | Hours after Days 3–4 |
|---|---|---|---|
| US1a form UI | Pratanin | In Review / QA | 8 / 8 |
| US1a queue ingestion | Jirathiwat | In Review / QA | 8 / 8 |
| US1a QA | Sakkaraj | In Review / QA | 4 / 4 |
| US1b proximity | Sirapassorn | In Progress | 7 / 12 |
| US1b capacity | Jirathiwat | In Progress | 3 / 8 |
| US1b integrate matching | Pratanin | In Progress | 4 / 12 |
| US1b QA | Sakkaraj | To-Do | 0 / 8 |
| US6 / US2a / US2b / US5a / US3a | Various | To-Do | 0 |

---

## Days 3–4 hours to log before the meeting

Day 3 total **10h**. Day 4 total **12h**. Window total **22h**.

| Person | Day 3 | Day 4 | Log |
|---|---|---|---|
| Pratanin | 0 | 4h US1b integrate | 4h |
| Jirathiwat | 4h finish US1a ingestion | 3h start US1b capacity | 7h |
| Sirapassorn | 4h start US1b proximity | 3h US1b proximity | 7h |
| Sakkaraj | 2h US1a QA | 2h US1a QA | 4h |
| Napat | facilitation | Board and this script | — |
