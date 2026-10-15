# Sprint 1 – Scrum Meeting 3 Script (QWERTY)

Speaking script for the team's third Daily Scrum. Same three-question format as Meeting 2, from the instructor's feedback.

## Meeting at a glance

Meeting 3 is a **10-minute stand-up at the start of Sprint Day 4**. It reports **Day 3 work**. Each member answers the same three questions. The Scrum board stays on screen the whole time.

Meeting 2 (start of Day 3) closed three blockers: message format, food-bank sample data, and the QA test endpoint. This meeting checks that those landed, then moves US1a toward Done using the Definition of Done.

**Note:** The progress below is drafted from Day 3 of the Sprint 1 Backlog plus what is now on `main` (`d7df8e3`). Replace any line with that person's real status before you speak.

| Item | Detail |
|---|---|
| Length | About 10 minutes (about 1.5 minutes per person) |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Shared on screen | Scrum board (Sprint 1 cards) and the Definition of Done |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

Napat prepares these so the meeting can run without setup time.

1. Open the Scrum board and share it.
2. Move cards to match real status (see **Example card positions** below).
3. Pin the Definition of Done.
4. Have the demo URL ready: `http://localhost:3000` (QWERTY Rescue ERP).
5. Have the US1a contract ready: `GET /api/contract`.
6. Ask each person to update their own cards and hours **before** the meeting starts.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning, everyone. This is our **third Scrum meeting** for Sprint 1. Yesterday was **Day 3**, and the board is on screen, so please follow along there.

Same three questions as last time: what did I accomplish since the last Scrum meeting, what will I focus on until the next one, and is anything blocking me. Name the **card** you are talking about. We do not move a card to Done unless every item on the Definition of Done is ticked.

Last meeting we left with three blockers: the donation message format, food-bank sample data, and the QA test endpoint. We will confirm those first through your updates.

Pratanin, would you like to start?

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** My card is **US1a Build donation entry form UI**. The form is in the donor portal. It has food type as a dropdown, quantity in kilograms, expiry date and time, and the pickup window from US6. Input validation and error messages are in place, which was the risk I raised in Meeting 1. A blank food type is rejected. I connected the form to Jirathiwat's queue so a valid submit shows up on `/queue` immediately. The card is **In Review / QA**, not Done.

**Next:** Day 4 on the plan is **US1b Integrate matching service with queue triggers** (4 hours). I will confirm the form-to-queue path with Sakkaraj, then keep matching tied to ingestion so a queued donation can be proposed to a food bank within 2 minutes. If review comments come in on the form, I fix those first.

**Blockers:** None for the form. I need Sakkaraj's QA pass before this card can move to Done.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** My card is **US1a Implement donation queue ingestion backend logic**. I finished ingestion. The agreed JSON message is donation ID, food type, quantity, expiry date and time, pickup window, donor ID, and timezone Asia/Bangkok. A donation is written to the matching queue immediately, which meets the 1-minute acceptance criterion. Duplicate protection is the donation ID plus an `Idempotency-Key`. I also delivered the **QA test endpoint** `POST /api/test/queue`, which was my blocker last meeting. The card is **In Review / QA**. I am about done with the 8 hours I estimated.

**Next:** Day 4 on the plan is **US1b Develop matching algorithm food bank capacity check** (3 hours). I will finish capacity scoring against remaining kilograms and keep it on the same path as Sirapassorn's proximity score. After that I can help with the expiry monitor if I have time.

**Blockers:** None. Message format is agreed. Sakkaraj can hit `/api/test/queue` and `/api/queue` without waiting on me.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, you're next. Please tell us which card you're working on and what exactly you built.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** My card for Day 3 was **US1b Develop matching algorithm proximity scoring** (4 hours on the plan). I have a working version that ranks food banks by distance inside each bank's delivery range. Sample food-bank data is in the system: SOS Food Bank Bangkok, Mahidol Community Kitchen, Thonburi Shelter Pantry, and Min Buri Neighbourhood Bank, each with coordinates, reported capacity, remaining capacity, and range. On a test donation the system proposed SOS Food Bank Bangkok at about 3.7 km. The card is **In Progress / In Review**. No merge to Done yet.

**Next:** Day 4 on the plan is 3 more hours on proximity scoring. I will tighten ranking, then hook it to Jirathiwat's capacity check so we only propose a match when the bank is in range **and** has remaining capacity. That is the US1b acceptance criterion: propose a match within 2 minutes.

**Blockers:** None. I had asked Sakkaraj for sample food-bank data; that is now in the app under Food banks.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj, last of the builders.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** My card is **US1a QA test donation creation and queue timing**. Day 3 on the plan was 2 of 4 hours. I converted the high-priority text cases to API tests in `qa/api/test-log-donation.py`. Against the running app, **15 tests passed**, including valid queueing under 60 seconds, field validation, past expiry, duplicate submit, and non-donor blocked. I can inject messages with `POST /api/test/queue`. The card stays **In Progress** until I finish the remaining QA hours and the UI pass.

**Next:** Day 4 is the remaining **2 hours** on US1a QA. I will rerun the suite, do the manual form cases (TC-01 to TC-11), and record actual queue time. If US1a is clean, I start preparing US1b auto-match cases: in range with capacity, out of range, and over capacity.

**Blockers:** None for the API. I still need a short walkthrough of the donor form on a test environment from Pratanin before I sign the QA box on the Definition of Done.

### 9. Napat's own update (about 1 minute)

**Accomplished:** I updated the board from Day 3. The three blockers from Meeting 2 are closed: message format, sample food-bank data, and the test endpoint. US1a cards are in Review / QA, not Done. Burndown should show Jirathiwat's 4 hours, Sirapassorn's 4 hours, and Sakkaraj's 2 hours logged for Day 3, plus Pratanin's review and integration time.

**Next:** I will keep the burndown current, chase the Definition of Done on US1a, and make sure Day 4 cards are in To-Do or In Progress before people leave.

**Blockers:** None for me. The remaining gate for US1a is review plus Sakkaraj's QA sign-off, then Product Owner accept.

### 10. Blocker and risk review (Napat, about 1 minute)

Let me summarize. Last meeting's three blockers are **closed**. Today's open items are quality gates, not waits: Pratanin's form needs QA, Jirathiwat's ingestion needs QA, Sirapassorn's proximity needs the capacity check tomorrow, and Sakkaraj needs the UI walkthrough. Validation and duplicate-donation risks from Meeting 1 are handled in the form and the donation ID. Does anyone disagree or want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Now the Definition of Done. US1a is **not Done** yet even though the form and queue work in demo. Before those cards move to Done, we tick all of these:

- Acceptance criteria met: donor submits food type, quantity, expiry, and it appears in the matching queue within 1 minute.
- Another team member has reviewed the code, and it is on `main`.
- Unit tests and QA tests pass, including Sakkaraj's US1a cases.
- Input validation and duplicate handling are in place.
- Time target is met (queue within 1 minute).
- QA has run the cases with no open critical bugs.
- The card and hours are updated on the board.

Sakkaraj, you confirm the QA tick. Pratanin and Jirathiwat, you do not move US1a to Done until that list is complete. Everyone, same check for US1b before it goes to Done: match within 2 minutes when a food bank is in range and has capacity.

### 12. Closing (Napat, about 30 seconds)

Thank you all. Please keep cards and hours updated every day, and use the Blocked column if something stops you. Day 4 on the plan is US1b capacity, matching integration, more proximity work, and finishing US1a QA. If you need help, message me directly. The next Scrum meeting is **[date and time]**. Thank you.

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

Columns run left to right. The Definition of Done is the gate into Done.

| Column | Meaning |
|---|---|
| Sprint 1 To-Do | Planned in the Sprint Backlog, not started |
| In Progress | Someone is working on it now |
| Blocked | Waiting on a decision, data, or another person |
| In Review / QA | Code review and QA testing |
| Done | Passed every item of the Definition of Done |

### Example card positions at the start of Meeting 3

Adjust to real status before the meeting.

| Card | Owner | Column |
|---|---|---|
| US1a Build donation entry form UI | Pratanin | In Review / QA |
| US1a Implement donation queue ingestion backend logic | Jirathiwat | In Review / QA |
| US1a QA test donation creation and queue timing | Sakkaraj | In Progress (API suite passing; UI pass still open) |
| US1b Develop matching algorithm proximity scoring | Sirapassorn | In Progress |
| US1b Develop matching algorithm food bank capacity check | Jirathiwat | Sprint 1 To-Do (starts Day 4) |
| US1b Integrate matching service with queue triggers | Pratanin | Sprint 1 To-Do (starts Day 4) |
| US1b QA test auto-matching performance and criteria | Sakkaraj | Sprint 1 To-Do |
| US6 / US2a / US2b / US5a / US3a | Various | Sprint 1 To-Do |

---

## Day 3 hours vs plan (for the burndown)

From the Sprint 1 Backlog spreadsheet.

| Person | Day 3 plan | What to log if the demo matches this script |
|---|---|---|
| Jirathiwat | 4h queue ingestion | 4h, card to In Review / QA |
| Sirapassorn | 4h proximity scoring | 4h, card stays In Progress |
| Sakkaraj | 2h US1a QA | 2h, 2h left on Day 4 |
| Pratanin | 0h on the Day 3 column | Log review / form-to-queue time if you worked; do not silently skip hours |

---

## Demo talking points (only if Napat asks)

Keep this off the 10-minute clock unless someone needs proof.

- App: `web/` → `npm run dev` → http://localhost:3000
- Donor: `donor@qwerty.test` / `donor123`
- Queue page: `/queue` · API: `GET /api/queue`
- QA inject: `POST /api/test/queue`
- Tests: `python -m pytest qa/api/test-log-donation.py -q`
- Contract: `GET /api/contract`
