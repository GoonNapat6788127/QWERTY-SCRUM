# Sprint 1 – Scrum Meeting 5 Script (QWERTY)

Wednesday 21 October 2026. Three-question format.

## Meeting at a glance

Meeting 5 is the **second of three remaining standups**. It reports Monday 19 and Tuesday 20 October. Sprint 1 still ends **Friday 23 October**.

| Item | Detail |
|---|---|
| Date | Wednesday 21 October 2026 |
| Length | About 10 minutes |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Monday 19 – Tuesday 20 (Days 5–8 on the hour plan) |
| Next | Friday 23 October, Meeting 6 and Sprint 1 close |
| Three questions | Accomplished / Next / Blockers |

## Before the meeting

Share the board. US1a and US1b should be In Review / QA or Done. US6 and US2a should be In Progress or In Review.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. Scrum meeting **five**, **Wednesday 21 October**. Last meeting was Monday. One standup left: **Friday 23 October**, which is also the last day of Sprint 1.

Three questions, name the card. We do not mark Done without the Definition of Done.

Monday we were closing US1a and finishing auto-match. We will hear if those cards cleared QA.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** I finished **US1b Integrate matching service with queue triggers**. When a donor submits, the matcher runs on the same ingest path. I also finished **US6 Add pickup time window UI**. The donor picks a slot and it is stored on the donation. **US2a Update food bank view** is on `/incoming`: the food bank sees driver ID and pickup timestamp. Those cards are **In Review / QA**.

**Next:** Until Friday I build **US2b Render delivery proof and timestamp in the food bank portal**, and I will take any US1b or US6 review comments.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** I finished **US1b capacity check**. A match is proposed only if remaining capacity is enough. I also connected **US6 pickup window** onto the driver dispatch feed. US1a ingestion is ready for Done if Sakkaraj ticks QA. Capacity and dispatch cards are **In Review / QA**.

**Next:** Until Friday I implement **US5a PDF receipt and email** and **US3a expiry monitor** so donations inside 24 hours are flagged urgent.

**Blockers:** None.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** Proximity scoring is complete and combined with capacity. I built **US2a driver pickup endpoint**: the driver marks Picked Up, and we store timestamp and driver ID. The card is **In Review / QA**. I started **US2b delivery confirmation API** with photo or signature.

**Next:** Until Friday I finish delivery proof upload and make sure dispatch can mark Delivered.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** US1a UI pass is done. I ran **US1b QA**: match within 2 minutes when in range with capacity; no match when quantity is over remaining capacity; rankings expose proximity and capacity. I started **US6 QA** on the pickup window and dispatch feed. US1a can move to **Done** if the board ticks are complete. US1b QA is **In Review**.

**Next:** Until Friday I finish US6 and US2a cases, then US2b proof, US5a receipt content, and US3a urgent flag. Those are the last Sprint 1 QA cards.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** US1a is ready for Done. US1b, US6, and US2a are in Review. Burndown is down to delivery, receipts, and expiry.

**Next:** Friday we need a Done increment: pickup, delivery with proof, receipt, urgent flag. I will book a short Sprint Review slot after Meeting 6.

**Blockers:** None. Schedule risk only: two calendar days left.

### 10. Blocker and risk review (Napat, about 1 minute)

No waits. The risk is time: US2b, US5a, and US3a must be Done by Friday. If anyone is slipping, say it now. Anyone to add?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Sakkaraj, US1a QA is complete — we move US1a to Done only with every tick: criteria, review, tests, 1-minute queue, no critical bugs, hours updated. US1b needs the 2-minute match rule and QA. Do not move US2b to Done without proof attached.

### 12. Closing (Napat, about 30 seconds)

Next meeting is **Friday 23 October**. That is the last Daily Scrum of Sprint 1. Finish delivery proof, receipts, and urgent flags. Thank you.

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

| Card | Owner | Column |
|---|---|---|
| US1a all three cards | Pratanin / Jirathiwat / Sakkaraj | Done (if DoD ticked) |
| US1b proximity, capacity, integrate, QA | Team | In Review / QA |
| US6 pickup window + dispatch + QA | Pratanin / Jirathiwat / Sakkaraj | In Review / QA |
| US2a pickup endpoint + food bank view + QA | Sirapassorn / Pratanin / Sakkaraj | In Review / QA |
| US2b delivery proof | Sirapassorn / Pratanin | In Progress |
| US5a receipt | Jirathiwat | To-Do |
| US3a urgent flag | Jirathiwat | To-Do |
