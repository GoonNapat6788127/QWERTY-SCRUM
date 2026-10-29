# Sprint 2 – Scrum Meeting 3 Script (QWERTY)

Friday 6 November 2026. Three-question format.

## Meeting at a glance

Meeting 3 reports **Days 3–4** (Wednesday 4 and Thursday 5 November), **18 hours**. US9a QA hours are finished and the card is **In Review**, not Done. US9b capacity and US9b QA have not started.

| Item | Detail |
|---|---|
| Date | Friday 6 November 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Reports | Days 3–4, **18 hours** (Pratanin 6, Jirathiwat 0, Sirapassorn 8, Sakkaraj 4) |
| Next | Monday 9 November, Meeting 4 (**Days 5–7**, 24 hours) |
| Three questions | Accomplished since Wednesday, focus until Monday, blockers |

## Before the meeting

1. Log Days 3–4 before anyone speaks.
2. Do not say US9b is Done. `quantityKg` is not subtracted from each bank yet.
3. Demo: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **three**, **Friday 6 November**. Wednesday we had US9a in review and US9b still To-Do. Days 3 and 4 were **18 hours**: the multi-food form, `proposeMatches`, and the US9a QA file. Jirathiwat logged **0** in this window, which matches the sheet. Capacity subtraction is Days 5 and 6.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** **US9b Add multi-food lines and the split checkbox** is **6 of 6 hours** (3 + 3) and **In Review**. The donor form has "Add another food", a quantity and expiry on each line, and the checkbox "Send this log to more than one food bank when one bank cannot take the full weight." Submit posts `lines` and `splitAcrossBanks`. The result list prints each `foodBankName` and `quantityKg`.

**Next:** Until Monday I have **0 hours** on Days 5 and 6. Day 7 I start **US3b Render expiry alerts on /notifications** (**2 of 4 hours**) and **US4a Build operations board filters** (**2 of 6 hours**).

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** **0 hours** since Wednesday. The PATCH from Days 1–2 is still In Review. I did not start capacity split.

**Next:** Until Monday I finish two cards. **US9b Subtract quantityKg**, **6 hours** (Day 5 is 3, Day 6 is 3): `placeMatches` reduces `remainingCapacityKg` by `match.quantityKg`, and `releaseMatches` adds it back before an edit. **US3b Build the 24/12/2 hour notification job**, **6 hours** on the same days (3 + 3). Thresholds are 24, 12, and 2. A row is written once per donation per threshold.

**Blockers:** None. I need Sirapassorn's `proposeMatches` array, which she says is In Review.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn, name the card.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** **US9b Implement proposeMatches** is **8 of 8 hours** (4 + 4) and **In Review**. `web/lib/matching.ts` ranks by `totalScore`. With the split flag, SOS at about 3.66 km takes up to its remaining kilograms, then Thonburi at about 5.13 km takes the rest. A 190 kg log becomes 164 kg plus 26 kg. `withinRange` and `hasCapacity` on each row are true. The old `proposeMatch` path still serves US1b when the flag is false.

**Next:** Until Monday I emit the **driver audience** on the same 24/12/2 thresholds, **4 hours** (Day 5 is 2, Day 6 is 2), card **US3b Emit driver-audience notifications**.

**Blockers:** None. Mahidol is about 23 km and outside its 22 km range, so I do not expect a third bank on the donor seed.

### 7. Napat to Sakkaraj

Thank you. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** **US9a QA** is **4 of 4 hours** (2 + 2) and **In Review**. `test_donor_can_edit_a_donation_before_pickup` passed: PATCH body with one Dairy line of 6 kg returns `foodType` Dairy, `quantity` 6, and `lines[0].foodType` Dairy. The Sprint 1 files still pass. I have not ticked Done. I still want the Edit screen clicked once with Pratanin.

**Next:** Until Monday I run **US9b QA**, **4 hours** (Day 6 is 2, Day 7 is 2). `test_one_log_can_hold_many_foods_and_split_across_banks` posts two lines, 100 kg and 90 kg, `splitAcrossBanks: true`, and expects `quantity` 190, two lines, at least two matches, and the sum of `quantityKg` equal to 190.

**Blockers:** None, if the module fixture keeps calling `POST /api/test/reset` so SOS starts at 164 kg.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 3–4 are **18 hours**. Running total **32 of 113**. US9a is fully hour-logged and In Review. US9b UI and matcher are In Review. Capacity is To-Do.

**Next:** Monday reports Days 5–7, **24 hours**. That window can move US9a and US9b to Done only if this Definition of Done list is true. US3b starts. US4a filters start on Day 7 only, **2 of 6**, not finished.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Sakkaraj's five-minute UI pass with Pratanin is the only open item on US9a. US9b must not be called Done while `placeMatches` still subtracts the full quantity from one bank. Anyone else?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US9a, before Done on Monday: PATCH 200 for the owner, 403 for another donor, 409 after pickup, pytest green, Edit link hidden after pickup, hours on the sheet. US9b, before Done: `matches.length >= 2` for 190 kg, sum of `quantityKg` is 190, and US1b still matches a 10 kg donation to one bank in under 120 seconds.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Monday 9 November, 09:00**, Meeting 4. Thank you.

---

## Example card positions

| Card | Owner | Column |
|---|---|---|
| US9a form, PATCH, QA | Pratanin, Jirathiwat, Sakkaraj | In Review |
| US9b lines UI (6/6) | Pratanin | In Review |
| US9b proposeMatches (8/8) | Sirapassorn | In Review |
| US9b capacity (0/6) | Jirathiwat | To-Do |
| US9b QA (0/4) | Sakkaraj | To-Do |
| US3b and later | — | To-Do |
