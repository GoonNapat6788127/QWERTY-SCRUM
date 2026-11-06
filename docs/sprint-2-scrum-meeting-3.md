# Sprint 2 – Scrum Meeting 3 Script (QWERTY)

Friday 6 November 2026. Sprint Day 3. Three-question format.

## Meeting at a glance

Today is **Sprint Day 3**. This standup does **not** report Days 3–4 as finished. Days 1–2 are finished (14 hours). Day 3 starts after this meeting.

The instructor asked that, from this meeting on, **each person answers “What will I do next?” with test cases**: number, name, and expected output. Those rows live in `docs/sprint-2-tdd-report.md` and `docs/sprint-2-tdd-report.docx`. Write the test first (Red). Code comes after (Green).

| Item | Detail |
|---|---|
| Date | Friday 6 November 2026 (Sprint Day 3) |
| Length | About 15 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Reports | Days 1–2, **14 hours**. US9a form and PATCH are In Review. US9a QA and all of US9b are still To-Do. |
| Next | Days 3–4, **18 hours**, spoken as test cases. Monday 9 November is Meeting 4. |
| Three questions | 1. What did I accomplish since Wednesday? 2. What will I do next? (test cases) 3. Blockers? |

## Before the meeting

1. Open `docs/sprint-2-tdd-report.docx` on the screen.
2. Do not say the multi-food form, `proposeMatches`, or US9a QA are finished. Those hours are today and Saturday (Days 3–4).
3. Demo base only: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **three**, **Friday 6 November**, Sprint **Day 3**. Wednesday we finished Days 1 and 2: the edit form and `PATCH /api/donations/:id`, both In Review. We have not started Day 3.

From today, “What will I do next?” is not a task name. It is the **test cases** you will write or run before you code. Number, name, expected output. The sheet we hand in with the final presentation is the TDD report. Red means the test is not passing yet. Green means it passed. Yellow means it is specified and waiting for today’s run.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 2 minutes)

**Accomplished:** **US9a Build donor edit form** is **6 of 6 hours** from Days 1–2 and **In Review**. Edit shows only while the donation is queued or matched.

**Next:** I will not code the multi-food form until these cases are written. They are Days 3–4, **6 hours**.

- **TC-US9b-01** Add a second food. Expected: one `donationId`, `lines` length 2, `quantity` equals the sum of the lines.
- **TC-US9b-02** Tick “send this log to more than one food bank.” Expected: the POST body has `splitAcrossBanks: true`.
- **TC-US9a-04** Open a delivered donation. Expected: the list says Locked and there is no Edit link.

All three are **Red** this morning. I will turn TC-US9b-01 and TC-US9b-02 Green before Monday.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 2 minutes)

**Accomplished:** **US9a PATCH /api/donations/:id** is **8 of 8 hours** from Days 1–2 and **In Review**. I have **0 hours** on Day 3. I do not start capacity until Day 5.

**Next:** I write the failing tests before Day 5, so the code has something to pass.

- **TC-US9a-03** A food bank calls PATCH. Expected: **403**.
- **TC-US9b-06** A 190 kg split is saved. Expected: SOS `remainingCapacityKg` falls by **164**, not by 190.
- **TC-US9b-07** The donor edits that log. Expected: the old kilograms are restored, then the new match subtracts only the new `quantityKg`.

All three are **Red**. I will not mark the capacity card started until TC-US9b-06 fails for the right reason, then passes.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, name the card and the tests.

### 6. Sirapassorn, Dev 2 (about 2 minutes)

**Accomplished:** **0 hours** since Wednesday, as planned. `proposeMatch` is still the Sprint 1 one-bank path.

**Next:** Days 3–4 are **US9b proposeMatches**, **8 hours**. I write these tests first.

- **TC-US9b-03** `splitAcrossBanks` false, quantity 10. Expected: one match, `status` matched.
- **TC-US9b-04** Two lines, 100 kg and 90 kg, split true. Expected: at least two matches, sum of `quantityKg` is **190**.
- **TC-US9b-05** Quantity 4000. Expected: `match` is null, `status` queued.

TC-US9b-03 and TC-US9b-05 are **Yellow**: Sprint 1 already covers them inside `test-us1b-auto-match.py`, and I will re-run them today. TC-US9b-04 is **Yellow** in `test-zz-donor-edit-split.py` until I re-run it on Day 3 and mark it Green.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 2 minutes)

**Accomplished:** **0 hours** on Days 1–2. US9a is not Done. I have not ticked the QA card.

**Next:** Days 3–4 are **US9a QA**, **4 hours**. These are the cases I run.

- **TC-US9a-01** Donor PATCH, Bakery 4 kg to Dairy 6 kg. Expected: **200**, `foodType` Dairy, `quantity` 6, `lines[0].foodType` Dairy. The test is already in `qa/api/test-zz-donor-edit-split.py`. It is **Yellow** until I run it today.
- **TC-US9a-02** Same donation after pickup. Expected: **409**. This test is **Red**. I will add it before I call the card reviewed.
- **TC-S1-01** and **TC-S1-02** Sprint 1 regression. Expected: queue under 60 seconds, match under 120 seconds, quantity 4000 stays queued.

**Blockers:** None, if `POST /api/test/reset` still restores SOS to 164 kg.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 1–2 are **14 of 113**. The board is still the Wednesday board. Day 3 hours are not logged.

**Next:** I own the TDD report. Before Monday I will set today’s rows:

- **TC-RPT-01** Every new case has a number, a name, an owner, and an expected output. Expected: no blank row in the report.
- **TC-RPT-02** A card does not move to Done while its cases are Red. Expected: US9a and US9b stay In Review or To-Do on Monday if any case is still Red.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

We do not code Day 3 against a missing test. Sakkaraj’s TC-US9a-02 and Jirathiwat’s TC-US9b-06 are the two Red cases I will ask about on Monday. Does anyone want to add a case?

### 11. Definition of Done check (Napat, about 1 minute)

Nothing new is Done today. US9a stays In Review until TC-US9a-01 is Green and TC-US9a-02 exists. US9b stays To-Do.

### 12. Closing (Napat, about 30 seconds)

Day 3 starts now. Next standup is **Monday 9 November, 09:00**, Meeting 4. Bring the TDD report. Thank you.

---

## Test cases this meeting calls “next”

| Who | Cases | Cycle this morning |
|---|---|---|
| Pratanin | TC-US9b-01, TC-US9b-02, TC-US9a-04 | Red |
| Jirathiwat | TC-US9a-03, TC-US9b-06, TC-US9b-07 | Red |
| Sirapassorn | TC-US9b-03, TC-US9b-04, TC-US9b-05 | Yellow until today’s run |
| Sakkaraj | TC-US9a-01, TC-US9a-02, TC-S1-01, TC-S1-02 | 01 Yellow, 02 Red |
| Napat | TC-RPT-01, TC-RPT-02 | Red |

## Card positions after this meeting

| Card | Owner | Column |
|---|---|---|
| US9a edit form (6/6) | Pratanin | In Review |
| US9a PATCH (8/8) | Jirathiwat | In Review |
| US9a QA (0/4) | Sakkaraj | To-Do |
| US9b lines, proposeMatches, capacity, QA | team | To-Do |
| US3b and later | — | To-Do |
