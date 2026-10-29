# Sprint 2 – Scrum Meeting 2 Script (QWERTY)

Wednesday 4 November 2026. Three-question format.

## Meeting at a glance

Meeting 2 reports **Days 1–2** (Monday 2 and Tuesday 3 November), **14 hours**. It does not report Wednesday's work. US9b has not started. US9a is In Review, not Done.

| Item | Detail |
|---|---|
| Date | Wednesday 4 November 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Reports | Days 1–2, **14 hours** (Pratanin 6, Jirathiwat 8, Sirapassorn 0, Sakkaraj 0) |
| Next | Friday 6 November, Meeting 3 (**Days 3–4**, 18 hours) |
| Three questions | Accomplished since Monday, focus until Friday, blockers |

## Before the meeting

1. Log Days 1–2 on the Sprint 2 sheet before anyone speaks.
2. US9a form and PATCH are **In Review**. US9a QA and every US9b card stay **To-Do**.
3. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **two**, **Wednesday 4 November**. Monday's kickoff logged 0 hours. Since then we finished Days 1 and 2, **14 hours**, all on **US9a**. US9b, the one-log-to-many split, is still To-Do. It starts today after this meeting.

Three questions. Name the card. Nothing is Done until Sakkaraj's pytest and the Definition of Done.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** **US9a Build donor edit form** is **6 of 6 hours** (Day 1 was 3, Day 2 was 3) and **In Review**. `/donations` shows Edit while the row is `queued` or `matched`. `/donations/[id]/edit` loads `lines`, converts `expiryDateTime` into the datetime field, and sends `PATCH` with `lines`, `pickupWindow`, and `splitAcrossBanks`. After pickup the list says Locked.

**Next:** Until Friday I start **US9b Add multi-food lines and the split checkbox**, **6 hours** on Days 3 and 4 (3 + 3). The donor can add another food on the same log and tick "send this log to more than one food bank".

**Blockers:** None. The form stays out of Done until Sakkaraj's UI pass.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** **US9a PATCH /api/donations/:id** is **8 of 8 hours** (4 + 4) and **In Review**. `validateDonationLog` still accepts the Sprint 1 body with `foodType` and `quantity`. A `lines` array sums `quantity` and keeps the soonest `expiryDateTime`. The handler checks the donor id, returns **409** when status is `picked_up` or `delivered`, calls `releaseMatches`, then `placeMatches`. A single-bank match still sets `matchId` and `foodBankId` so US1b does not break.

**Next:** I have **0 hours** on Days 3 and 4. On Days 5 and 6 I take **US9b Subtract quantityKg from each bank**, **6 hours**, after Sirapassorn's `proposeMatches` returns more than one row.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** **0 hours** since Monday, as planned. `proposeMatch` is unchanged: one eligible bank, or null when quantity is 4000.

**Next:** Until Friday I build **US9b proposeMatches**, **8 hours** (Day 3 is 4, Day 4 is 4). When `splitAcrossBanks` is false, I still return the one Sprint 1 match with `quantityKg` equal to `quantity`. When it is true, I walk `rankFoodBanks` and assign `min(remainingCapacityKg, leftover)` until the leftover is 0. If the banks in range cannot hold the full weight, I return no matches and the donation stays `queued`.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** **0 hours** on Days 1 and 2. I did not run the new file yet, so US9a is not Done.

**Next:** Until Friday I run **US9a QA**, **4 hours** (2 + 2), in `qa/api/test-zz-donor-edit-split.py`. The PATCH must change Bakery 4 kg into Dairy 6 kg and return 200. I also keep `qa/api` green, including `test-us1a-log-donation.py` and `test-us1b-auto-match.py`.

**Blockers:** None, as long as `POST /api/test/reset` still restores SOS remaining capacity to 164 kg before the suite.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 1–2 are **14 hours**. Burndown: 14 of 113. US9a form and PATCH are In Review. QA is To-Do.

**Next:** Friday's meeting reports Days 3–4: Pratanin's lines UI, Sirapassorn's `proposeMatches`, and Sakkaraj's US9a QA. Jirathiwat's capacity split is not in that window.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Risk: if `proposeMatches` subtracts the full donation quantity from every bank, capacity will be wrong. Each match must subtract only its `quantityKg`. US1b `test_no_match_when_quantity_exceeds_all_capacity` must still see `match: null` and `status: queued` for quantity 4000. Anyone else?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US9a is not Done today. Still open: Sakkaraj's pytest, the UI pass on Edit, and review on `main`. Queue under 60 seconds and match under 120 seconds still apply.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Friday 6 November, 09:00**, Meeting 3. Thank you.

---

## Example card positions

| Card | Owner | Column |
|---|---|---|
| US9a edit form (6/6) | Pratanin | In Review |
| US9a PATCH (8/8) | Jirathiwat | In Review |
| US9a QA (0/4) | Sakkaraj | To-Do |
| US9b and later | — | To-Do |
