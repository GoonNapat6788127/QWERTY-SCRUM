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

Friday we accepted the `GET /api/contract` schema, the food-bank seed, and `POST /api/test/queue`. Days 3–4 were: finish the ingest handler, start haversine proximity scoring, start the capacity check, wire the matcher into `POST /api/donations`, and run the US1a pytest hours. US6 `pickupWindow` hours have **not** started. That field is Day 6.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** **US1a Build donation entry form UI** stayed In Review. A valid submit on `/donations/new` now `POST`s `/api/donations` and the row is on `/queue`. Day 3 was 0h for me. Day 4 was **4 hours** on **US1b Integrate matching service with queue triggers**: `proposeMatch` runs inside the ingest handler before the 201 response. That card is **In Progress** (4 of 12 hours). I did not add the US6 `pickupWindow` select. That component is Days 6–7.

**Next:** Until Wednesday I finish the remaining **8 hours** of the ingest-to-match integration (Days 5–7), then start **US6 Add pickup time window UI** so the form sends `pickupWindow.start` and `pickupWindow.end`.

**Blockers:** None. The form stays out of Done until `qa/api/test-us1a-log-donation.py` is green, including the UI pass.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** Day 3 was my last **4 hours** on **US1a Implement donation queue ingestion backend logic**. The accepted body is `donationId`, `foodType`, `quantity`, `expiryDateTime`, `pickupWindow`, `donorId`, `timezone: "Asia/Bangkok"`. `GET /api/queue` returns that item in under 60 seconds. A repeated `donationId` or `Idempotency-Key` returns the same row with `duplicate: true`. QA injects with `POST /api/test/queue`. That card is **In Review / QA**. Day 4 I started **US1b capacity check** (**3 of 8 hours**): `hasCapacity` is true only when `remainingCapacityKg >= quantity`. Capacity stays **In Progress**.

**Next:** Until Wednesday I finish the capacity predicate (Days 5–6, 5 hours left), then **US6 Connect time window to dispatch feed**: `GET /api/dispatch` must echo `pickupWindow` on Days 7–8.

**Blockers:** None. The contract schema is accepted.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, name the card.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I started **US1b Develop matching algorithm proximity scoring**. Day 3 was **4 hours**, Day 4 was **3 hours**, so **7 of 12 hours** are logged. `rankFoodBanks` sorts by haversine `distanceKm` inside each `deliveryRangeKm` and sets `proximityScore`. Seed rows: SOS Food Bank Bangkok, Mahidol Community Kitchen, Thonburi Shelter Pantry, Min Buri Neighbourhood Bank. A test donation from the donor coordinates proposed SOS at about 3.7 km with `withinRange: true`. The card is **In Progress**.

**Next:** Until Wednesday I finish the remaining **5 hours** (Days 5–6). `proposeMatch` returns a match only when `withinRange` and `hasCapacity` are both true. Otherwise the donation stays `status: "queued"`.

**Blockers:** None. The seed data is in `web/lib/seed.ts`.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I executed **US1a QA test donation creation and queue timing** — Day 3 **2 hours** and Day 4 **2 hours**, so the **4-hour** card is run. `qa/api/test-us1a-log-donation.py` passed: queue under 60 seconds, 400 on empty `foodType`, `quantity` 0 or non-numeric, past `expiryDateTime`, one row on double submit, 401 anonymous and 403 food-bank on `POST /api/donations`. Inject works at `POST /api/test/queue`. The card is **In Review / QA**. I have not marked Done until the UI pass on `/donations/new` is recorded.

**Next:** Until Wednesday I finish that UI pass, then start **US1b QA** in `qa/api/test-us1b-auto-match.py` (Days 5–7, 8 hours): match under 120 seconds when `withinRange` and `hasCapacity`, no match when `quantity` is 4000, and `GET /api/matches` returns `proximityScore`, `capacityScore`, and `distanceKm`.

**Blockers:** None on the API. I still need five minutes with Pratanin on the form for the UI pass.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 3–4 hours are on the board: **22 hours** (10 + 12). US1a is In Review / QA. US1b is In Progress. Friday's three blockers are closed: format, sample data, test endpoint.

**Next:** I keep the burndown current. Meeting 5 will report Days 5–8: finish US1b, build US6, and start US2a pickup. Remaining Sprint 1 stories after that are US2a finish, US2b, US5a, US3a. They must be Done by Friday 23 October.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Open item: Sakkaraj's UI pass on `/donations/new` with Pratanin. `proposeMatch` must not return a bank with `withinRange: false` or `hasCapacity: false`. The US6 `pickupWindow` select stays To-Do until Day 6. Does anyone want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US1a is close. Before Done: acceptance criteria, review on `main`, `test-us1a-log-donation.py` green, 400 validation, queue under 60 seconds, no critical bugs, hours on the board. Sakkaraj confirms that tick on Wednesday. US1b is not Done until `proposedAt - createdAt` is under 120 seconds, `withinRange` and `hasCapacity` are true, and `test-us1b-auto-match.py` has run.

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
