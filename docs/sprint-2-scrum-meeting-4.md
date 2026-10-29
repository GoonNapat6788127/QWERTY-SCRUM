# Sprint 2 – Scrum Meeting 4 Script (QWERTY)

Monday 9 November 2026. Three-question format.

## Meeting at a glance

Meeting 4 reports **Days 5–7** (Friday 6 through Sunday 8 November), **24 hours**. US9a and US9b hours are complete. They move to **Done** only if the Definition of Done in this meeting is true. US3b is in progress. US4a filters are **2 of 6**, not finished.

| Item | Detail |
|---|---|
| Date | Monday 9 November 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Reports | Days 5–7, **24 hours** (Pratanin 4, Jirathiwat 12, Sirapassorn 4, Sakkaraj 4) |
| Next | Wednesday 11 November, Meeting 5 (**Days 8–9**, 17 hours) |
| Three questions | Accomplished since Friday, focus until Wednesday, blockers |

## Before the meeting

1. Log Days 5–7 before anyone speaks.
2. Have `qa/api/test-zz-donor-edit-split.py` output ready.
3. Do not say US4a, US4b, US5b, US7, or US8 are Done.
4. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **four**, **Monday 9 November**. Friday left US9a in review and US9b half built. Days 5, 6, and 7 were **24 hours**. That finishes the two donor stories and starts the 24/12/2 alerts. The dashboard is only started.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** Day 5 and Day 6 were **0 hours** for me. Day 7 was **4 hours**, split across two cards, both **In Progress**. **US3b alerts page** is **2 of 4**: `/notifications` lists `thresholdHours`, `message`, and `createdAt`. **US4a filters** are **2 of 6**: `/dashboard` has donor text, food-bank id, and status selects, not wired to every count yet.

**Next:** Until Wednesday I finish the alerts page (**2 hours** on Day 8) and the dashboard filters (**2 hours** on Day 8 and **2 hours** on Day 9), so filters reach **6 of 6** by the end of Day 9. I will not call US4a Done. Its QA is still To-Do.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** Days 5 and 6 were **6 hours** each, **12 hours** total. **US9b Subtract quantityKg** is **6 of 6** and **In Review**. Edit releases the old kilograms, then `placeMatches` subtracts each `quantityKg`. A 190 kg split leaves SOS and Thonburi reduced by 164 and 26, not by 190 twice. **US3b notification job** is **6 of 6** and **In Review**. `refreshDonationFlags` pushes a staff notification at 24, 12, and 2 hours, once per threshold.

**Next:** Until Wednesday I have **0** on Day 7 already logged, and Days 8–9 are **US4a GET /api/dashboard**, **5 hours** (2 + 3): counts for open, matched, picked up, delivered, urgent, food banks, and unread notifications.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** **US3b driver-audience notifications** are **4 of 4 hours** (Day 5 was 2, Day 6 was 2) and **In Review**. The same threshold writes a second row with `audience: "driver"`. Day 7 was **0 hours**.

**Next:** I have **0 hours** on Days 8. Day 9 I start **US4b GET /api/drivers/activity**, **3 of 6 hours**. The payload is `accepted`, `pickedUp`, `delivered`, `lastRunAt`, `location`, and `runs`. I will not finish that card before Wednesday's end of Day 9. The last **3 hours** are Day 10, which is Meeting 6.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** **US9b QA** is **4 of 4 hours** (Day 6 was 2, Day 7 was 2). `test_one_log_can_hold_many_foods_and_split_across_banks` passed: quantity 190, two lines, at least two matches, sum of `quantityKg` is 190. US1b still matches 10 kg in range with capacity, and 4000 kg stays queued with `match` null. The full `qa/api` run is green. UI pass: donor edit, split checkbox, and the two bank lines on the result panel.

**Next:** Until Wednesday I run **US3b QA**, **3 hours** on Day 8: a donation expiring inside 24 hours creates the 24-hour staff row and the driver row, and a second refresh does not duplicate them.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 5–7 are **24 hours**. Running total **56 of 113**.

**Next:** If the Definition of Done below is true, US9a and US9b move to **Done** in this meeting. US3b stays In Review until Wednesday's QA. Meeting 5 must not say the dashboard or the activity log are finished.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

No open blocker. Watch capacity: an edit must `releaseMatches` before `placeMatches`, or the second save will see 0 kg at SOS and fail to rematch. Anyone disagree?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US9a: acceptance criteria met, PATCH reviewed, `test_donor_can_edit_a_donation_before_pickup` green, 409 after pickup, no critical bugs, hours logged. US9b: one log, many foods, many banks, sum of `quantityKg` equals `quantity`, Sprint 1 match time still under 120 seconds, hours logged. If Sakkaraj confirms both, those two stories move to **Done**. US3b does not. Its QA is still To-Do until Day 8.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Wednesday 11 November, 09:00**, Meeting 5. Thank you.

---

## Example card positions after DoD

| Card | Owner | Column |
|---|---|---|
| US9a all tasks | Pratanin, Jirathiwat, Sakkaraj | Done |
| US9b all tasks | Pratanin, Sirapassorn, Jirathiwat, Sakkaraj | Done |
| US3b job (6/6) and driver alerts (4/4) | Jirathiwat, Sirapassorn | In Review |
| US3b alerts page (2/4) | Pratanin | In Progress |
| US3b QA (0/3) | Sakkaraj | To-Do |
| US4a filters (2/6) | Pratanin | In Progress |
| US4b, US5b, US7, US8 | — | To-Do |
