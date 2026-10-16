# Sprint 1 – Scrum Meeting 5 Script (QWERTY)

Wednesday 21 October 2026. Three-question format.

## Meeting at a glance

Meeting 5 is the **second of three remaining standups**. It reports **Days 5–8** on the W02 hour plan (Monday 19 and Tuesday 20 October). Sprint 1 still ends **Friday 23 October**.

| Item | Detail |
|---|---|
| Date | Wednesday 21 October 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Monday 19 – Tuesday 20 (**Days 5–8**, **41 hours**) |
| Next | Friday 23 October, Meeting 6 (**Days 9–14**) and Sprint 1 close |
| Three questions | Accomplished / Next / Blockers |

## Before the meeting

Share the board. Log Days 5–8 hours (table at the end). US1a should be Done if DoD is ticked. US1b and US6 should be In Review / QA or Done. US2a pickup is only **2 of 4 hours** — In Progress, not Done. Food-bank incoming view, US2b, US5a, and US3a stay To-Do until Days 9–14.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. Scrum meeting **five**, **Wednesday 21 October**. Last meeting was Monday. One standup left: **Friday 23 October**, which is also the last day of Sprint 1.

Three questions, name the card. We do not mark Done without the Definition of Done.

Monday we were closing US1a QA, finishing auto-match, building US6, and starting the pickup endpoint. Days 5–8 on the hour plan were those cards. US2a food-bank view and delivery proof are **next**, not yesterday.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** I finished **US1b Integrate matching service with queue triggers** — remaining **8 hours** on Days 5–7, so the 12-hour card is built. When a donor submits, the matcher runs on the same ingest path. I also finished **US6 Add pickup time window UI** — **2 hours** on Day 6 and **3 hours** on Day 7. The donor picks a slot and it is stored on the donation. Those cards are **In Review / QA**. I did **not** start the food-bank incoming view — that is Day 9.

**Next:** Until Friday I build **US2a Update food bank view** (Day 9, 2 hours), then **US2b Render delivery proof and timestamp** (Days 10–11, 6 hours).

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** I finished **US1b capacity check** — remaining **5 hours** on Days 5–6. A match is proposed only if remaining capacity is enough. I also finished **US6 Connect time window to dispatch feed** — **3 hours** on Day 7 and **2 hours** on Day 8. Capacity and dispatch cards are **In Review / QA**. US1a ingestion is ready for Done if Sakkaraj ticks QA.

**Next:** Until Friday I implement **US5a PDF receipt and email** and **US3a expiry monitor** (Days 12–13). Donations inside 24 hours are flagged urgent.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I finished **US1b proximity scoring** — remaining **5 hours** on Days 5–6 — combined with capacity. Day 8 I started **US2a driver pickup endpoint** (**2 of 4 hours**). The driver can mark Picked Up; I still have **2 hours** on Day 9 to finish timestamp and driver ID. Pickup is **In Progress**, not Review yet. I have not started US2b — that begins Day 9.

**Next:** Until Friday I finish the remaining **2 hours** of US2a pickup, then **US2b delivery confirmation API** with photo or signature (Days 9–11, 10 hours).

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** US1a UI pass is done, so US1a can move to **Done** if every Definition of Done tick is complete. I ran **US1b QA** — Days 5–7, **8 hours**: match within 2 minutes when in range with capacity; no match when quantity is over remaining capacity. I ran **US6 QA** on Day 8, **3 hours**, on the pickup window and dispatch feed. US1b and US6 QA cards are **In Review**. I have **not** run US2a QA — that is Day 10.

**Next:** Until Friday I run US2a cases (Day 10), then US2b proof, US5a receipt content, and US3a urgent flag. Those are the last Sprint 1 QA cards.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Days 5–8 hours are on the board: **41 hours** (12 + 13 + 9 + 7). US1a is ready for Done. US1b and US6 are in Review. US2a pickup is In Progress at 2 of 4 hours. Burndown still has Days 9–14: incoming view, delivery proof, receipts, and expiry.

**Next:** Friday we need a Done increment: finish pickup, delivery with proof, receipt, urgent flag. I will book a short Sprint Review slot after Meeting 6.

**Blockers:** None. Schedule risk only: two calendar days left, **39 hours** still on Days 9–14.

### 10. Blocker and risk review (Napat, about 1 minute)

No waits. The risk is time: US2a finish, US2b, US5a, and US3a must be Done by Friday. If anyone is slipping, say it now. Anyone to add?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Sakkaraj, US1a QA is complete — we move US1a to Done only with every tick: criteria, review, tests, 1-minute queue, no critical bugs, hours updated. US1b needs the 2-minute match rule and QA. US6 needs the window on the donation and on the dispatch feed. Do not move US2a to Done — pickup is only halfway, and the food bank cannot see driver ID until Day 9.

### 12. Closing (Napat, about 30 seconds)

Next meeting is **Friday 23 October**. That is the last Daily Scrum of Sprint 1. It reports **Days 9–14**. Finish pickup, incoming view, delivery proof, receipts, and urgent flags. Thank you.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- Acceptance criteria met
- Reviewed and on `main`
- Tests pass
- Validation and error handling in place
- Time targets met (queue 1 min, match 2 min)
- QA: no open critical bugs
- Card and hours updated

---

## Board at the start of Meeting 5

| Card | Owner | Column | Hours after Days 5–8 |
|---|---|---|---|
| US1a all three cards | Pratanin / Jirathiwat / Sakkaraj | Done (if DoD ticked) | 20 / 20 |
| US1b proximity, capacity, integrate, QA | Team | In Review / QA | 40 / 40 |
| US6 pickup window + dispatch + QA | Pratanin / Jirathiwat / Sakkaraj | In Review / QA | 13 / 13 |
| US2a pickup endpoint | Sirapassorn | In Progress | 2 / 4 |
| US2a food bank view | Pratanin | To-Do | 0 / 2 |
| US2a QA | Sakkaraj | To-Do | 0 / 2 |
| US2b delivery proof | Sirapassorn / Pratanin | To-Do | 0 / 20 |
| US5a receipt | Jirathiwat | To-Do | 0 / 5 |
| US3a urgent flag | Jirathiwat | To-Do | 0 / 8 |

---

## Days 5–8 hours to log before the meeting

Day 5 **12h**. Day 6 **13h**. Day 7 **9h**. Day 8 **7h**. Window total **41h**.

| Person | Days 5–8 plan | Log |
|---|---|---|
| Pratanin | integrate 4+3+1h, US6 UI 2+3h | 13h |
| Jirathiwat | capacity 3+2h, US6 dispatch 3+2h | 10h |
| Sirapassorn | proximity 3+2h, US2a pickup 2h | 7h |
| Sakkaraj | US1b QA 2+4+2h, US6 QA 3h | 11h |
| Napat | facilitation | Board and this script |
