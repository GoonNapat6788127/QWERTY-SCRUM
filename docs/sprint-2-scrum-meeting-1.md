# Sprint 2 – Scrum Meeting 1 Script (QWERTY)

Monday 2 November 2026. Kickoff. Three-question format.

## Meeting at a glance

Meeting 1 is a **10-minute stand-up on Monday 2 November**, the first day of Sprint 2. It is the planning standup. **Day 1 starts after this meeting.** No Sprint 2 build hours are logged in the room. The sprint is **two weeks: Monday 2 November through Friday 13 November 2026**. It ends on **Friday 13**. Standups are every **Monday, Wednesday, and Friday**. Meeting 6 on Friday 13 November is the close. The hour sheet still has 15 day columns. Day 15's build cell is 0 and is logged at that Friday close. There is no standup after Friday 13.

**Note:** Replace any line with live status before you speak. Do not say US9a or US9b are already Done. They are To-Do until QA and the Definition of Done.

| Item | Detail |
|---|---|
| Date | Monday 2 November 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Speakers | Pratanin (Dev 1), Jirathiwat (Dev 3), Sirapassorn (Dev 2), Sakkaraj (QA 1) |
| Reports | Kickoff. 0 build hours. |
| Next | Wednesday 4 November, Meeting 2 (**Days 1–2**, 14 hours) |
| Sprint goal | Donor can edit a log (US9a). One log can hold many foods and be sent to many food banks (US9b). Then US3b, US4a, US4b, US5b, US7, US8. Planned **113** hours. |
| Three questions | 1. What did I accomplish since the last Scrum meeting? 2. What will I focus on until the next Scrum meeting? 3. Are there any blockers or obstacles in my way? |

## Before the meeting

1. Share `docs/sprint-2-backlog.xlsx`. Every row is **To-Do**.
2. Pin the Definition of Done.
3. Leave Sprint 1 cards Done. Do not reopen US1a, US1b, US6, US2a, US2b, US5a, or US3a.
4. Demo base: http://localhost:3000

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **one** for Sprint 2, **Monday 2 November**. Sprint 1 closed on Thursday 22 October with 7 of 7 stories Done and 114 of 114 hours. Those cards stay Done.

Sprint 2 is two weeks, from today through **Friday 13 November**. That Friday is the last day. We meet every Monday, Wednesday, and Friday. That is six standups. Meeting 6 on Friday 13 is the close. The sheet still has 15 hour-days, and Day 15 logs **0** build hours. The plan is **113** hours. The sheet is `docs/sprint-2-backlog.xlsx`.

Two new stories sit at the top, because the donor asked for them. **US9a**: a donor can edit a logged donation until a driver picks it up. **US9b**: one log can hold more than one food and can be sent to more than one food bank, not only one bank. After those, we take the rest of the product backlog: **US3b** alerts, **US4a** dashboard, **US4b** driver activity, **US5b** tax export, **US7** GPS, **US8** decay.

Three questions, name the card, board on screen. Nothing moves to Done in this meeting.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** Since Sprint 1 close I have not logged Sprint 2 hours. My Sprint 1 cards stay Done.

**Next:** Until Wednesday I take **US9a Build donor edit form at /donations/[id]/edit**, **6 hours** on Days 1 and 2 (3 + 3). The donations list gets an Edit link only while `status` is `queued` or `matched`. The form loads the saved `lines` and `pickupWindow` and submits `PATCH /api/donations/:id`.

**Blockers:** None. I need Jirathiwat's PATCH contract before I bind the error fields: `foodType`, `quantity`, `expiryDateTime`, `pickupWindow`, `lines`.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat, you're next.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** No Sprint 2 hours yet. The US1a contract stays stable: `donationId`, `foodType`, `quantity`, `expiryDateTime`, `pickupWindow`, `donorId`, `timezone: "Asia/Bangkok"`.

**Next:** Until Wednesday I implement **US9a PATCH /api/donations/:id**, **8 hours** (4 + 4). Only the owning donor. If `status` is `picked_up` or `delivered`, return **409**. Otherwise release the old match capacity, write the new lines, and call matching again. A one-line body still validates through the existing rules.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** No Sprint 2 hours yet. Sprint 1 `proposeMatch` still returns one bank when `withinRange` and `hasCapacity` are both true.

**Next:** I have **0 hours** before Wednesday. On Days 3 and 4 I start **US9b Implement proposeMatches**, **8 hours**. That function splits `quantity` across in-range banks only when `splitAcrossBanks` is true. The single-bank path stays for the Sprint 1 tests.

**Blockers:** None. I wait for the `lines` shape from Jirathiwat so `quantity` is the sum of the lines.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** Sprint 1 pytest stayed green at close. I have not opened a Sprint 2 file yet.

**Next:** **0 hours** until Wednesday. Days 3 and 4 are **US9a QA**, **4 hours**, in `qa/api/test-zz-donor-edit-split.py`: PATCH changes `foodType` and `quantity` while the donation is queued, and a picked-up donation returns 409. I will not mark US9a Done on Friday. That tick is Meeting 4, after the UI pass.

**Blockers:** None. The suite still needs the app on `http://localhost:3000`.

### 9. Napat's own update (about 1 minute)

**Accomplished:** The Sprint 2 board is published. All rows are To-Do. Planned 113. Remaining 113.

**Next:** Meeting 2 on Wednesday reports Days 1–2 only: Pratanin's form **6 of 6** and Jirathiwat's PATCH **8 of 8**, both In Review. Sirapassorn and Sakkaraj stay at 0 for that window.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

Open dependency: the PATCH body must accept either the old single-food fields or `lines` plus `splitAcrossBanks`, so US1a tests do not break. US9b must not start assigning kilograms until US9a restore-capacity works, or we will double-count `remainingCapacityKg`. Does anyone want to add a blocker?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Nothing is Done today. When we do move a card, every line must be true: acceptance criteria, review on `main`, tests pass, validation, queue under 60 seconds, match under 120 seconds, no critical bugs, hours on the sheet. US9a is not Done until a donor can edit before pickup and cannot edit after pickup.

### 12. Closing (Napat, about 30 seconds)

Day 1 starts after this meeting. Next standup is **Wednesday 4 November, 09:00**, Meeting 2. Thank you.

---

## Example card positions after this meeting

| Card | Owner | Column |
|---|---|---|
| US9a edit form | Pratanin | To-Do |
| US9a PATCH | Jirathiwat | To-Do |
| US9a QA | Sakkaraj | To-Do |
| US9b lines UI, proposeMatches, capacity, QA | Pratanin, Sirapassorn, Jirathiwat, Sakkaraj | To-Do |
| US3b, US4a, US4b, US5b, US7, US8 | as on the sheet | To-Do |
