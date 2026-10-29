# Sprint 2 product backlog and sprint backlog

Team QWERTY. Sprint 2 of 2. **Monday 2 November 2026 through Friday 13 November 2026**. The sprint ends on Friday 13. Daily Scrum is every **Monday, Wednesday, and Friday** in those two weeks. The W02 sheet still has **15 hour-days**. Day 15's build cell is 0 and is reported at the Friday 13 close. There is no standup after Friday 13. Planned hours **113**. Status on this sheet is **To-Do** until that card's Definition of Done passes at its meeting.

Sprint 1 stays Done (US1a, US1b, US6, US2a, US2b, US5a, US3a). This sprint adds two stories the donor asked for, then the remaining product backlog.

Printable copies: `sprint-2-backlog.xlsx` and `sprint-2-backlog.pdf`.

## Stories

| ID | User story |
|---|---|
| US9a | Edit a logged donation: Given a donor owns a donation that is still queued or matched, when they change the food lines, quantity, expiry, or pickup window, then PATCH /api/donations/:id saves the log, restores the previous food-bank capacity, and runs matching again. After picked_up or delivered, the edit is locked with 409. |
| US9b | Send one log to many food banks: Given a donor puts one or more foods on a single donation, when splitAcrossBanks is true and the total kilograms exceed one bank, then proposeMatches assigns quantityKg across every in-range bank that still has room, and the sum of quantityKg equals the donation quantity. |
| US3b | Expiry alerts at 24, 12, and 2 hours: Given a logged donation, when hours until expiry cross 24, 12, or 2, then a notification is stored for staff and for drivers and shown on /notifications. |
| US4a | Operations dashboard: Given a signed-in user opens /dashboard, when they filter by donor, food bank id, or status, then GET /api/dashboard shows open, matched, picked up, delivered, and urgent counts. |
| US4b | Driver activity log: Given a food bank or logistics user opens /drivers, when GET /api/drivers/activity runs, then each driver shows accepted, picked up, and delivered counts plus recent runs. |
| US5b | Monthly tax summary: Given a donor or logistics user on /receipts, when they export a month, then GET /api/reports/tax returns a CSV or a PDF. This stays Sprint 2 and is not Sprint 1 Done. |
| US7 | Driver GPS ping: Given a driver, when they POST /api/drivers/location with lat and lng, then the ping is stored and shown on the driver activity log within one minute. |
| US8 | Decay research spike: Given a donation id, when GET /api/decay?donationId= runs, then the response includes hoursRemaining and a heuristic riskScore. This is not a trained model. |

## Standup windows

Three Daily Scrums a week. Speak only the hours in that window. Do not call a later card Done.

| Meeting | When | Script | Hour-days | Hours | Board after the meeting |
|---|---|---|---|---:|---|
| 1 | Mon 2 Nov 2026 | `sprint-2-scrum-meeting-1.md` | Kickoff. Day 1 starts after. | 0 | Plans and risks. Every card To-Do. No build hours in the meeting. |
| 2 | Wed 4 Nov 2026 | `sprint-2-scrum-meeting-2.md` | Days 1-2 | 14 | US9a form 6/6 In Review. PATCH 8/8 In Review. QA not started. US9b still To-Do. |
| 3 | Fri 6 Nov 2026 | `sprint-2-scrum-meeting-3.md` | Days 3-4 | 18 | US9a QA 4/4 In Review. US9b form 6/6 and proposeMatches 8/8 In Review. Capacity and US9b QA still To-Do. |
| 4 | Mon 9 Nov 2026 | `sprint-2-scrum-meeting-4.md` | Days 5-7 | 24 | US9a and US9b can move to Done if DoD passes. US3b job 6/6 and driver alerts 4/4. Alerts page 2/4. Dashboard filters 2/6. |
| 5 | Wed 11 Nov 2026 | `sprint-2-scrum-meeting-5.md` | Days 8-9 | 17 | US3b QA 3/3 In Review. Dashboard API 5/5. Filters 6/6. Activity API 3/6. US5b, US7, US8 still To-Do. |
| 6 | Fri 13 Nov 2026 | `sprint-2-scrum-meeting-6.md` | Days 10-14 (Day 15 = 0) | 40 | Close. Finish US4a, US4b, US5b, US7, US8. 8 of 8 Done only if DoD passes. Planned 113. Day 15 buffer is 0. No standup after Friday 13. |

Window check: 0 + 14 + 18 + 24 + 17 + 40 = **113**. Day totals 7 + 7 + 9 + 9 + 8 + 10 + 6 + 9 + 8 + 8 + 7 + 9 + 10 + 6 + 0 = **113**.

## Hours by person and meeting

| Person | M2 Days 1-2 | M3 Days 3-4 | M4 Days 5-7 | M5 Days 8-9 | M6 Days 10-14 (close) | Sprint total |
|---|---:|---:|---:|---:|---:|---:|
| Pratanin | 6 | 6 | 4 | 6 | 10 | 32 |
| Jirathiwat | 8 | 0 | 12 | 5 | 9 | 34 |
| Sirapassorn | 0 | 8 | 4 | 3 | 9 | 24 |
| Sakkaraj | 0 | 4 | 4 | 3 | 12 | 23 |
| **TOTAL** | **14** | **18** | **24** | **17** | **40** | **113** |

## SPRINT 2 BACKLOG

| ID | User Story | Tasks | Owner | Status | Estimated effort | Day 1 | Day 2 | Day 3 | Day 4 | Day 5 | Day 6 | Day 7 | Day 8 | Day 9 | Day 10 | Day 11 | Day 12 | Day 13 | Day 14 | Day 15 |
|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| US9a | Edit a logged donation: Given a donor owns a donation that is still queued or matched, when they change the food lines, quantity, expiry, or pickup window, then PATCH /api/donations/:id saves the log, restores the previous food-bank capacity, and runs matching again. After picked_up or delivered, the edit is locked with 409. | Build donor edit form at /donations/[id]/edit | PRATANIN KAHTEPMUD | To-Do | 6 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Implement PATCH /api/donations/:id with capacity restore and rematch | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 8 | 4 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | QA edit before pickup and 409 after pickup | SAKKARAJ TUVAJIT | To-Do | 4 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US9b | Send one log to many food banks: Given a donor puts one or more foods on a single donation, when splitAcrossBanks is true and the total kilograms exceed one bank, then proposeMatches assigns quantityKg across every in-range bank that still has room, and the sum of quantityKg equals the donation quantity. | Add multi-food lines and the split checkbox on the donor form | PRATANIN KAHTEPMUD | To-Do | 6 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Implement proposeMatches so one donation splits across food banks | SIRAPASSORN POKASERMSONG | To-Do | 8 | 0 | 0 | 4 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Subtract quantityKg from each bank remainingCapacityKg | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | QA one log to many banks (sum of quantityKg, at least two matches) | SAKKARAJ TUVAJIT | To-Do | 4 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US3b | Expiry alerts at 24, 12, and 2 hours: Given a logged donation, when hours until expiry cross 24, 12, or 2, then a notification is stored for staff and for drivers and shown on /notifications. | Build 24/12/2 hour expiry notification job | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 6 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Render expiry alerts on /notifications | PRATANIN KAHTEPMUD | To-Do | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Emit driver-audience notifications for the same thresholds | SIRAPASSORN POKASERMSONG | To-Do | 4 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | QA alert thresholds and read state | SAKKARAJ TUVAJIT | To-Do | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| US4a | Operations dashboard: Given a signed-in user opens /dashboard, when they filter by donor, food bank id, or status, then GET /api/dashboard shows open, matched, picked up, delivered, and urgent counts. | Build operations board filters | PRATANIN KAHTEPMUD | To-Do | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | Implement GET /api/dashboard summary | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
|  |  | QA dashboard counts and filters | SAKKARAJ TUVAJIT | To-Do | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 |
| US4b | Driver activity log: Given a food bank or logistics user opens /drivers, when GET /api/drivers/activity runs, then each driver shows accepted, picked up, and delivered counts plus recent runs. | Implement GET /api/drivers/activity | SIRAPASSORN POKASERMSONG | To-Do | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 | 0 | 0 | 0 |
|  |  | Build the driver activity page | PRATANIN KAHTEPMUD | To-Do | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 | 0 | 0 | 0 |
|  |  | QA activity counts after pickup and delivery | SAKKARAJ TUVAJIT | To-Do | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 | 0 |
| US5b | Monthly tax summary: Given a donor or logistics user on /receipts, when they export a month, then GET /api/reports/tax returns a CSV or a PDF. This stays Sprint 2 and is not Sprint 1 Done. | Implement monthly tax CSV and PDF | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 3 | 0 | 0 | 0 |
|  |  | Add Export CSV and Export PDF on the receipts page | PRATANIN KAHTEPMUD | To-Do | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 |
|  |  | QA tax export for the selected month | SAKKARAJ TUVAJIT | To-Do | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 | 0 |
| US7 | Driver GPS ping: Given a driver, when they POST /api/drivers/location with lat and lng, then the ping is stored and shown on the driver activity log within one minute. | Implement POST /api/drivers/location | SIRAPASSORN POKASERMSONG | To-Do | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 3 | 0 | 0 |
|  |  | Show the latest ping on /drivers | PRATANIN KAHTEPMUD | To-Do | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 |
|  |  | QA ping timestamp and coordinates | SAKKARAJ TUVAJIT | To-Do | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| US8 | Decay research spike: Given a donation id, when GET /api/decay?donationId= runs, then the response includes hoursRemaining and a heuristic riskScore. This is not a trained model. | Implement GET /api/decay heuristic | JIRATHIWAT SUNTIPREEDATHAM | To-Do | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 0 |
|  |  | QA decay response shape | SAKKARAJ TUVAJIT | To-Do | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 0 |
| | | | | **TOTAL** | **113** | **7** | **7** | **9** | **9** | **8** | **10** | **6** | **9** | **8** | **8** | **7** | **9** | **10** | **6** | **0** |

## Definition of Done

A card is Done only when acceptance criteria pass, the code is reviewed and on `main`, tests pass, validation exists, the time targets still hold (queue under 1 minute, match under 2 minutes), QA has no critical bugs, and this board's hours are updated.

US1a fields stay stable: `donationId`, `foodType`, `quantity` (kg), `expiryDateTime`, `pickupWindow`, `donorId`, `timezone: Asia/Bangkok`. A multi-food log still exposes those fields. `quantity` is the sum of `lines`. `foodType` is the line list. `expiryDateTime` is the soonest expiry.
