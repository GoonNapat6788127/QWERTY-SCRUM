# Sprint 1 – Scrum Meeting 6 Script (QWERTY)

Friday 23 October 2026. Last Daily Scrum of Sprint 1.

## Meeting at a glance

Meeting 6 is the **third remaining standup** and the **close of Sprint 1**. It reports Wednesday 21 and Thursday 22 October. After this meeting the increment is ready for Sprint Review.

| Item | Detail |
|---|---|
| Date | Friday 23 October 2026 |
| Length | About 10 minutes, then Sprint Review if the PO is present |
| Facilitator | Napat Tayommai |
| Speakers | Pratanin, Jirathiwat, Sirapassorn, Sakkaraj |
| Reports | Wednesday 21 – Thursday 22 (Days 9–14 on the hour plan) |
| Next | Sprint Review today. Sprint 2 planning after that. |
| Three questions | Accomplished / Next / Blockers |

## Before the meeting

1. Share the board with every Sprint 1 card.
2. Do not mark Done unless DoD is ticked.
3. Have the demo ready: donor form, queue, incoming pickup, dispatch delivery proof, receipts, urgent flag.

---

## The script

### 1. Opening (Napat, about 1 minute)

Good morning. This is Scrum meeting **six**, **Friday 23 October**, the last Daily Scrum of Sprint 1. Last meeting was Wednesday. Today we confirm the increment against the Definition of Done, then we can demo in the Sprint Review.

Three questions, name the card. If a card is not Done, say what is still open. Do not hide it.

Pratanin, please start.

### 2. Pratanin, Dev 1 (about 1.5 minutes)

**Accomplished:** I finished **US2b Render delivery proof and timestamp in the food bank portal**. Incoming and dispatch show the delivery timestamp. Proof is a photo or signature. Combined with the form, pickup window, matching integration, and incoming pickup view, my Sprint 1 cards are ready for Done if QA has ticked.

**Next:** No Sprint 1 build left. After Review I pick up Sprint 2: notifications or the central dashboard, whichever the Product Owner orders first.

**Blockers:** None.

### 3. Napat to Jirathiwat

Thanks, Pratanin. Jirathiwat.

### 4. Jirathiwat, Dev 3 (about 1.5 minutes)

**Accomplished:** I finished **US5a digital receipt**: weight, food type, timestamp, emailed to the donor when status becomes Delivered. I finished **US3a expiry monitor**: if expiry is within 24 hours the queue flags **urgent**. Ingestion, capacity, and dispatch window cards from earlier in the sprint are in the same increment.

**Next:** Sprint 2. No Sprint 1 card remains on my list.

**Blockers:** None. Receipt email is recorded as sent in-app for the demo environment.

### 5. Napat to Sirapassorn

Thanks, Jirathiwat. Sirapassorn.

### 6. Sirapassorn, Dev 2 (about 1.5 minutes)

**Accomplished:** I finished **US2b delivery confirmation API** with photo or signature. Together with proximity scoring and the pickup endpoint, matched food can be picked up and delivered with proof. Cards are **In Review / QA** or **Done** once Sakkaraj ticks.

**Next:** Sprint 2. I can take driver GPS or the decay spike after Review.

**Blockers:** None.

### 7. Napat to Sakkaraj

Thank you, Sirapassorn. Sakkaraj.

### 8. Sakkaraj, QA 1 (about 1.5 minutes)

**Accomplished:** I ran the remaining Sprint 1 cases in `qa/api/test-sprint1-remaining.py`: auto-match under 2 minutes, no match over capacity, pickup window on the dispatch feed, pickup visible to the food bank with driver ID and timestamp, delivery rejected without proof, receipt fields, urgent flag inside 24 hours. US1a suite still passes. I have **no open critical bugs** on the Sprint 1 stories.

**Next:** I will sit the Sprint Review with the team and log any PO findings. Sprint 2 QA starts after planning.

**Blockers:** None.

### 9. Napat's own update (about 1 minute)

**Accomplished:** Sprint 1 board is at Review or Done for US1a, US1b, US6, US2a, US2b, US5a, US3a. Hours for the 15-day plan are logged. Today's date is the Sprint 1 end date we committed to.

**Next:** Sprint Review demo after this standup. Then Sprint 2 planning from the product backlog: US3b, US4a, US4b, US5b, US7, US8.

**Blockers:** None.

### 10. Blocker and risk review (Napat, about 1 minute)

No blockers. If QA found a critical bug this morning, say it now so we do not call the increment Done. Anyone?

### 11. Definition of Done check (Napat, about 1.5 minutes)

Read the list against the whole Sprint 1 increment, not one card:

- Acceptance criteria for US1a, US1b, US6, US2a, US2b, US5a, US3a.
- Code on `main`, reviewed.
- QA tests passing, no critical bugs.
- Validation and duplicate handling on donate.
- Queue within 1 minute, match within 2 minutes.
- Board and hours updated.

Sakkaraj, if that list is true, we can present this increment in the Review. If anything fails, we name the card and leave it out of Done.

### 12. Closing (Napat, about 30 seconds)

Thank you. That is the last Daily Scrum of Sprint 1. Please stay for the Sprint Review demo: log a donation, see the queue, see the match, pick up, deliver with proof, open the receipt, and show an urgent flag. See you at Sprint 2 planning.

---

## Definition of Done

A card moves to Done only when every item is ticked.

- Acceptance criteria for US1a, US1b, US6, US2a, US2b, US5a, US3a
- Reviewed and on `main`
- Tests pass
- Validation and error handling in place
- Queue within 1 minute, match within 2 minutes
- QA: no open critical bugs
- Card and hours updated

---

## Board at the start of Meeting 6

| Story | Status if DoD passed |
|---|---|
| US1a Log a donation | Done |
| US1b Auto-match to a food bank | Done |
| US6 Select a pickup time window | Done |
| US2a Track pickup status | Done |
| US2b Track delivery with proof | Done |
| US5a Digital donation receipt | Done |
| US3a Flag expiry within 24 hours | Done |
| Sprint 2 stories | Product Backlog, not this sprint |

## Sprint Review demo order (after the standup)

1. Sign in as donor. Submit food type, quantity, expiry, pickup window.
2. Open `/queue` within 1 minute. Show urgent if expiry is under 24 hours.
3. Show the proposed match and food-bank ranking.
4. Sign in as driver. Mark picked up. Sign in as food bank. Show driver ID and timestamp on `/incoming`.
5. Driver marks delivered with signature or photo.
6. Donor receipts page: weight, food type, timestamp, emailed to donor.
