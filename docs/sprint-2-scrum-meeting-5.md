# Sprint 2 – Scrum Meeting 5 Script (QWERTY)

Wednesday 11 November 2026. Three-question format.

## Meeting at a glance

Meeting 5 reports **Days 8–9** (Monday 9 and Tuesday 10 November), **17 hours**. US3b hours are complete and the story is **In Review** until this meeting's Definition of Done. US4a filters are **4 of 6** at the end of Day 8 and **6 of 6** at the end of Day 9, so this window closes the filter hours. The dashboard API is **5 of 5**. Dashboard QA has not started. Activity API is **3 of 6**.

| Item | Detail |
|---|---|
| Date | Wednesday 11 November 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai (Scrum Master) |
| Reports | Days 8–9, **17 hours** (Pratanin 6, Jirathiwat 5, Sirapassorn 3, Sakkaraj 3) |
| Next | Friday 13 November, Meeting 6, the close (**Days 10–14**, 40 hours, Day 15 = 0) |
| Three questions | Accomplished since Monday, focus until Friday, blockers |

## Before the meeting

1. Log Days 8–9 before anyone speaks.
2. US9a and US9b stay Done. Do not re-estimate them.
3. Demo: http://localhost:3000/dashboard and `/notifications`

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **five**, **Wednesday 11 November**. Monday we closed the two donor stories if DoD passed, and we left US3b in review. Days 8 and 9 were **17 hours**: alerts UI and QA, the dashboard summary, and the start of driver activity. Tax export, GPS, and decay are still To-Do.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** Day 8 was **4 hours** and Day 9 was **2 hours**, **6 hours** in this window. **US3b alerts page** is now **4 of 4** and **In Review**. `/notifications` shows staff and driver rows. **US4a filters** moved from **2 of 6** to **6 of 6** (2 hours Monday, 2 hours Tuesday) and are **In Review**. The board filters by donor name, `foodBankId`, and `status`.

**Next:** Until Friday I build **US4b the driver activity page**, **4 hours** (Day 10 is 2, Day 11 is 2), then **US5b Export CSV and Export PDF**, **3 hours** on Day 12, and **US7 show the latest ping**, **3 hours** on Day 13. Day 14 is **0**. Friday is the close, so those three cards must be ready that morning.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** **US4a GET /api/dashboard** is **5 of 5 hours** (Day 8 was 2, Day 9 was 3) and **In Review**. The JSON `summary` has `open`, `matched`, `pickedUp`, `delivered`, `urgent`, `foodBanks`, and `notifications`. Donors on the list are already limited to their own rows by the existing donations query.

**Next:** Until Friday I finish **US5b monthly tax CSV and PDF** (**2 hours** on Day 11 and **3 hours** on Day 12, **5 of 5**) and **US8 GET /api/decay** (**2 hours** on Day 13 and **2 hours** on Day 14). Friday is the close, so both cards must be ready for the Definition of Done that morning. Day 10 is **0** for me.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** Day 8 was **0**. Day 9 was **3 hours** on **US4b GET /api/drivers/activity**, so the card is **3 of 6** and **In Progress**. The handler returns one object per driver user: counts, `location` from the latest ping, and `runs` sorted by delivered or picked-up time.

**Next:** Until Friday I finish the last **3 hours** of the activity API on Day 10, then **US7 POST /api/drivers/location**, **6 hours** (Day 12 is 3, Day 13 is 3). Day 11 and Day 14 are **0**. Friday is the close, so the ping must be on the activity log before that standup.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** **US3b QA** is **3 of 3 hours** on Day 8 and **In Review**. A donation inside 24 hours creates one staff notification and one driver notification at threshold 24. Refresh does not insert a second pair. Day 9 was **0 hours**. I have not tested the dashboard filters yet.

**Next:** Until Friday I run **US4a QA** (Day 10, **3 hours**), **US4b QA** (Day 11, **3 hours**), **US5b QA** (Day 13, **2 hours**), and **US7** plus **US8 QA** (Day 14, **2 + 2 hours**). Day 12 is **0** while the export buttons and the GPS endpoint are still being built. Friday is the close, so those five QA cards must be ready that morning.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 8–9 are **17 hours**. Running total **73 of 113**.

**Next:** US3b can move to Done in this meeting if the list below is true. US4a cannot: QA is still To-Do. Friday 13 is the Sprint 2 close. It reports Days 10–14, **40 hours**, and Day 15 is 0. That window must finish US4a, US4b, US5b, US7, and US8. There is no standup after Friday.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

US5b must stay labeled Sprint 2 on the receipts page. It is not a Sprint 1 receipt. The US1a queue contract is unchanged. Anyone else?

### 11. Definition of Done check (Napat, about 1.5 minutes)

US3b, before Done: 24, 12, and 2 hour rows exist once, both audiences, the page renders them, no critical bugs, hours logged. If Sakkaraj confirms, move US3b to **Done**. Leave US4a In Review. Leave US4b In Progress at 3 of 6.

### 12. Closing (Napat, about 30 seconds)

Next standup is **Friday 13 November, 09:00**, Meeting 6, the Sprint 2 close. Thank you.

---

## Example card positions

| Card | Owner | Column |
|---|---|---|
| US9a, US9b | team | Done |
| US3b all tasks | team | Done, if this DoD passed |
| US4a filters (6/6) and API (5/5) | Pratanin, Jirathiwat | In Review |
| US4a QA (0/3) | Sakkaraj | To-Do |
| US4b activity API (3/6) | Sirapassorn | In Progress |
| US5b, US7, US8 | — | To-Do |
