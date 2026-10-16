# Sprint 1 Backlog — Conclusion

W02 sprint-backlog template for the **end of Sprint 1, Friday 23 October 2026**, after Meeting 6. Same columns as `docs/sprint-1-backlog.pdf`. Printable copies: `sprint-1-backlog-conclusion.xlsx` and `sprint-1-backlog-conclusion.pdf`.

**Do not use this Done column on Friday 16 October.** That day is Meeting 3. The live board is Day 2 only: form 8/8 In Review, ingestion 4/8 In Progress, every other Sprint 1 card To-Do. Fill or present this sheet on Friday 23, and only if Definition of Done passed with no critical bugs.

Day 1–15 cells are the hours each Daily Scrum reports. Status **Done** is the Friday 23 outcome.

Sprint 1 stories: US1a, US1b, US6, US2a, US2b, US5a, US3a. Sprint 2 stays on the product backlog: US3b, US4a, US4b, US5b, US7, US8.

| Field | Result |
|---|---|
| Team | QWERTY |
| Sprint | 1 of 2 |
| Dates | 14–23 October 2026 |
| Stories Done | 7 of 7 (US1a, US1b, US6, US2a, US2b, US5a, US3a) |
| Planned hours | 114 |
| Actual hours | 114 |
| Remaining | 0 |
| Carry-over | None. Sprint 2 stays on the product backlog. |
| Status | Every task moved from **To-Do** to **Done** at Sprint close |

## Standup windows vs Day 1–15 cells

Three Daily Scrums per week. The 15 hour-days are packed into those meetings. Speak only the cards whose hours sit in that window.

| Meeting | When | Script | Hour-days | Hours | What that meeting reports as accomplished |
|---|---|---|---|---|---|
| 1 | Wed 14 Oct | `sprint-1-scrum-meeting-1.pdf` | Kickoff. Day 1 starts after. | 0 in the meeting | Plans and risks. No build hours yet. |
| 2 | Template | `sprint-1-scrum-meeting-2.pdf` | Day 1 | 4 | Pratanin form **4 of 8h**. |
| 3 | Fri 16 Oct | `sprint-1-scrum-meeting-3.md` | Day 2 | 8 | Form **8/8** In Review. Ingestion **4/8** In Progress. Sirapassorn and Sakkaraj: 0h yesterday. |
| 4 | Mon 19 Oct | `sprint-1-scrum-meeting-4.md` | Days 3–4 | 22 | Ingestion **8/8**. US1a QA **4/4** In Review (not Done until UI pass). Proximity **7/12**. Capacity **3/8**. Integrate **4/12**. US6 still To-Do. |
| 5 | Wed 21 Oct | `sprint-1-scrum-meeting-5.md` | Days 5–8 | 41 | US1a **Done**. US1b **40/40**. US6 **13/13**. US2a pickup **2/4** In Progress. Incoming view, US2b, US5a, US3a still To-Do. |
| 6 | Fri 23 Oct | `sprint-1-scrum-meeting-6.md` | Days 9–14 (Day 15 = 0) | 39 | Finish US2a, US2b, US5a, US3a. Board **Done**. Remaining **0**. |

Window check: 4 + 8 + 22 + 41 + 39 + 0 = **114**.

## Hours logged by meeting

| Person | M2 Day 1 | M3 Day 2 | M4 Days 3–4 | M5 Days 5–8 | M6 Days 9–14 | Sprint total |
|---|---:|---:|---:|---:|---:|---:|
| Pratanin | 4 | 4 | 4 | 13 | 8 | 33 |
| Jirathiwat | 0 | 4 | 7 | 10 | 8 | 29 |
| Sirapassorn | 0 | 0 | 7 | 7 | 12 | 26 |
| Sakkaraj | 0 | 0 | 4 | 11 | 11 | 26 |
| **TOTAL** | **4** | **8** | **22** | **41** | **39** | **114** |

## SPRINT 1 BACKLOG

| ID | User Story | Tasks | Owner | Status | Estimated effort | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 | Day 6 | Day 7 | Day 8 | Day 9 | Day 10 | Day 11 | Day 12 | Day 13 | Day 14 | Day 15 |
|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| US1a | Log a donation: Given a donor, when they submit food type, quantity, and expiry date/time, then the donation appears in the matching queue within 1 minute. | Build donation entry form UI | PRATANIN KAHTEPMUD | Done | 8 | 4 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | Implement donation queue ingestion backend logic | JIRATHIWAT SUNTIPREEDATHAM | Done | 8 | 0 | 4 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | QA test donation creation and queue timing | SAKKARAJ TUVAJIT | Done | 4 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US1b | Auto-match donation to a food bank: Given an open donation, when a food bank within delivery range has reported capacity, then the system proposes a match within 2 minutes. | Develop matching algorithm proximity scoring | SIRAPASSORN POKASERMSONG | Done | 12 | 0 | 0 | 4 | 3 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | Develop matching algorithm food bank capacity check | JIRATHIWAT SUNTIPREEDATHAM | Done | 8 | 0 | 0 | 0 | 3 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | Integrate matching service with queue triggers | PRATANIN KAHTEPMUD | Done | 12 | 0 | 0 | 0 | 4 | 4 | 3 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | QA test auto-matching performance and criteria | SAKKARAJ TUVAJIT | Done | 8 | 0 | 0 | 0 | 0 | 2 | 4 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US6 | Select a pickup time window: Given a donor is logging a donation, when they choose a pickup time window from available slots, then the window is attached to the donation record and shown on driver dispatch feeds. | Add pickup time window UI component | PRATANIN KAHTEPMUD | Done | 5 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | Connect time window selection to dispatch feed | JIRATHIWAT SUNTIPREEDATHAM | Done | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | QA test time slot validation and feed updates | SAKKARAJ TUVAJIT | Done | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US2a | Track pickup status: Given a matched donation, when a driver marks it "Picked Up," then the timestamp and driver ID are recorded and visible to the receiving food bank. | Build driver pickup endpoint and status update logic | SIRAPASSORN POKASERMSONG | Done | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | Update food bank view to display pickup details | PRATANIN KAHTEPMUD | Done | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| | | QA test pickup status transition and notifications | SAKKARAJ TUVAJIT | Done | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 |
| US2b | Track delivery status with proof: Given a picked-up donation, when a driver marks it "Delivered," then a delivery timestamp and digital proof (photo or signature) are attached to the donation record. | Build delivery confirmation API with photo or signature attachment | SIRAPASSORN POKASERMSONG | Done | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 4 | 4 | 0 | 0 | 0 | 0 |
| | | Render delivery proof & timestamp in food bank portal | PRATANIN KAHTEPMUD | Done | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 |
| | | QA end-to-end delivery confirmation and proof upload | SAKKARAJ TUVAJIT | Done | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 |
| US5a | Generate automatic digital donation receipt: Given a donation marked "Delivered," when delivery is confirmed, then a digital receipt with recorded weight, food type, and timestamp is auto generated and emailed to the donor. | Implement PDF receipt generation (weight, food type, timestamp) and email service | JIRATHIWAT SUNTIPREEDATHAM | Done | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 1 | 0 | 0 |
| | | QA test receipt content (weight, food type, timestamp) and email deliverability | SAKKARAJ TUVAJIT | Done | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 |
| US3a | Check and flag expiry dates: Given a logged donation, when its expiry date is within 24 hours, then it is automatically flagged "urgent" in the matching queue. | Build expiry date monitor background job | JIRATHIWAT SUNTIPREEDATHAM | Done | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 |
| | | QA test urgent status flagging triggers | SAKKARAJ TUVAJIT | Done | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 0 |
| | | | | **TOTAL** | **114** | **4** | **8** | **10** | **12** | **12** | **13** | **9** | **7** | **6** | **9** | **9** | **6** | **7** | **2** | **0** |
