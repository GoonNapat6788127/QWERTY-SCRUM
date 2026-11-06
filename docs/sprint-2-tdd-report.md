# TDD Test Report

Team QWERTY. Rescue ERP, Sprint 2. Submit this report with the final presentation on **Friday 13 November 2026**.

Today is **Friday 6 November 2026, Sprint Day 3**. From this standup on, “What will I do next?” is a test case: number, name, and expected output.

**Red** means the test is not written, or it fails. Write it before the code. **Green** means the test passed on a run dated in this report. **Yellow** means the test is already in `qa/api` from earlier work and must be run again on Day 3 before anyone calls it Green.

The printable copy of the instructor template is `docs/sprint-2-tdd-report.docx`.

## How a case moves

1. The owner names the case in the standup (Red).
2. Sakkaraj or the owner adds it under `qa/api` and runs it. A failure is still Red. That is the point of TDD.
3. The smallest code change makes it pass (Green).
4. If the screen exists but there is no pytest yet, the row stays Yellow.
5. Napat does not move the story to Done while any of its rows are Red.

Run, with the app on `http://localhost:3000`:

```powershell
.\.venv\Scripts\python.exe -m pytest qa\api -q
```

## Register

| Feature | Expected output | Test Case Number | Test Case Name | Dev | Test Date | Cycle on 6 Nov |
|---|---|---|---|---|---|---|
| US9a Edit a log | 200. foodType Dairy. quantity 6. lines[0] is Dairy. | TC-US9a-01 | Edit before pickup | Sakkaraj | Re-run on Day 3 | Yellow |
| US9a Edit a log | 409 after the driver has picked the food up. | TC-US9a-02 | Reject edit after pickup | Sakkaraj | 6 Nov 2026 | Red |
| US9a Edit a log | 403 when a food bank calls PATCH. | TC-US9a-03 | Reject edit by another role | Jirathiwat | 6 Nov 2026 | Red |
| US9a Edit a log | The donations list says Locked. No Edit link. | TC-US9a-04 | Hide edit after delivery | Pratanin | 6 Nov 2026 | Red |
| US9b One log, many banks | One donationId. lines length 2. quantity is the sum. | TC-US9b-01 | Second food on the same log | Pratanin | 6 Nov 2026 | Red |
| US9b One log, many banks | POST body has splitAcrossBanks true. | TC-US9b-02 | Split flag is submitted | Pratanin | 6 Nov 2026 | Red |
| US9b One log, many banks | Quantity 10, split false: one match, status matched. | TC-US9b-03 | One bank when split is off | Sirapassorn | Re-run on Day 3 | Yellow |
| US9b One log, many banks | 100 kg + 90 kg, split true: at least two matches, sum of quantityKg is 190. | TC-US9b-04 | Split 190 kg across banks | Sirapassorn | Re-run on Day 3 | Yellow |
| US9b One log, many banks | Quantity 4000: match is null, status queued. | TC-US9b-05 | Over capacity stays queued | Sirapassorn | Re-run on Day 3 | Yellow |
| US9b One log, many banks | SOS remainingCapacityKg falls by 164, not by 190. | TC-US9b-06 | Capacity drops by each quantityKg | Jirathiwat | 6 Nov 2026 | Red |
| US9b One log, many banks | Edit restores the old kilograms, then subtracts the new quantityKg. | TC-US9b-07 | Edit gives capacity back | Jirathiwat | 6 Nov 2026 | Red |
| US3b 24/12/2 alerts | One staff notification at threshold 24. | TC-US3b-01 | Staff alert at 24 hours | Sakkaraj | Meeting 4 | Red |
| US3b 24/12/2 alerts | One driver notification at the same threshold. | TC-US3b-02 | Driver alert at the same threshold | Sakkaraj | Meeting 4 | Red |
| US3b 24/12/2 alerts | A second refresh does not insert another pair. | TC-US3b-03 | No duplicate alert | Sakkaraj | Meeting 4 | Red |
| US3b 24/12/2 alerts | /notifications shows thresholdHours and the message. | TC-US3b-04 | Alerts page renders the row | Pratanin | Meeting 4 | Red |
| US4a Dashboard | summary has open, matched, pickedUp, delivered, urgent, foodBanks, notifications. | TC-US4a-03 | Dashboard summary fields | Jirathiwat | Meeting 4 | Red |
| US4a Dashboard | urgent count includes a donation inside 24 hours and excludes a delivered one. | TC-US4a-04 | Urgent count matches the flag | Jirathiwat | Meeting 4 | Red |
| US4a Dashboard | Status filter delivered hides queued rows. | TC-US4a-01 | Filter by status | Pratanin | Meeting 4 | Red |
| US4a Dashboard | Donor name filter keeps only that donor. | TC-US4a-02 | Filter by donor | Pratanin | Meeting 4 | Red |
| US4a Dashboard | Delivered count equals the delivered rows on screen. | TC-US4a-05 | Counts match the filter | Sakkaraj | Meeting 5 | Red |
| US4b Driver activity | Each driver has accepted, pickedUp, delivered. | TC-US4b-01 | Activity counts | Sirapassorn | Meeting 4 | Red |
| US4b Driver activity | After pickup, runs include that donationId. | TC-US4b-02 | Run row has the donation | Sirapassorn | Meeting 4 | Red |
| US4b Driver activity | /drivers shows the name and the three counts. | TC-US4b-03 | Activity page | Pratanin | Meeting 5 | Red |
| US4b Driver activity | After delivery, delivered for usr-driver-1 is at least 1. | TC-US4b-04 | Delivered count | Sirapassorn | Meeting 5 | Red |
| US4b Driver activity | The activity row shows that donationId. | TC-US4b-05 | QA after pickup and delivery | Sakkaraj | Meeting 5 | Red |
| US5b Tax export | GET /api/reports/tax csv and pdf return 200. Not the US5a receipt. | TC-US5b-01 | Tax CSV and PDF | Jirathiwat | Meeting 5 | Red |
| US5b Tax export | Export CSV on /receipts downloads a month file. | TC-US5b-02 | Export button | Pratanin | Meeting 5 | Red |
| US5b Tax export | Donor receives 200 for both formats. | TC-US5b-03 | QA tax export | Sakkaraj | Meeting 5 | Red |
| US7 GPS ping | POST /api/drivers/location stores one ping and recordedAt. | TC-US7-01 | Store a ping | Sirapassorn | Meeting 5 | Red |
| US7 GPS ping | /drivers shows lat, lng, and recordedAt in Asia/Bangkok. | TC-US7-02 | Show the ping | Pratanin | Meeting 5 | Red |
| US7 GPS ping | The activity log returns lat, lng, and recordedAt. | TC-US7-03 | QA ping fields | Sakkaraj | Meeting 5 | Red |
| US8 Decay spike | hoursRemaining and riskScore are present. | TC-US8-01 | Decay fields | Jirathiwat | Meeting 5 | Red |
| US8 Decay spike | method is heuristic-spike. | TC-US8-02 | Label the spike | Jirathiwat | Meeting 5 | Red |
| US8 Decay spike | The three fields return together. | TC-US8-03 | QA decay shape | Sakkaraj | Meeting 5 | Red |
| Sprint 1 regression | Queue visible in under 60 seconds. | TC-S1-01 | Queue under one minute | Sakkaraj | Day 3 | Yellow |
| Sprint 1 regression | Match under 120 seconds in range with capacity. 4000 kg stays queued. | TC-S1-02 | Match under two minutes | Sakkaraj | Day 3 | Yellow |
| TDD report | No blank row. Every case has number, name, owner, expected output. | TC-RPT-01 | Report is complete | Napat | 6 Nov 2026 | Red |
| TDD report | US9a and US9b stay open while any of their cases are Red. | TC-RPT-02 | Done waits for Green | Napat | 6 Nov 2026 | Red |
| TDD report | US9a Done only if TC-US9a-01 and TC-US9a-02 are Green. | TC-RPT-03 | US9a gate | Napat | Meeting 4 | Red |
| TDD report | US9b Done only if TC-US9b-04 and TC-US9b-06 are Green. | TC-RPT-04 | US9b gate | Napat | Meeting 4 | Red |
| TDD report | Final presentation includes this file. Every Sprint 2 case is Green or the story stays In Review. | TC-RPT-05 | Submit with the presentation | Napat | 13 Nov 2026 | Red |
| TDD report | The Review demonstrates Green cases only. | TC-RPT-06 | Review follows the report | Napat | 13 Nov 2026 | Red |

## Cases spoken on Friday 6 November (Day 3)

### TC-US9a-01 Edit before pickup

Dev: Sakkaraj. File: `qa/api/test-zz-donor-edit-split.py`.

Red: not re-run this morning.

Green: last full `qa/api` run passed this function. Re-run on Day 3 before calling it Green.

Yellow: the test is already in the file. Today’s job is to run it.

### TC-US9a-02 Reject edit after pickup

Dev: Sakkaraj.

Red: there is no test yet. Expected result is HTTP 409. This is what Sakkaraj does next.

Green: empty until the new test passes.

Yellow: do not use Yellow to skip writing the test.

### TC-US9a-03 Reject edit by another role

Dev: Jirathiwat.

Red: no test yet. Expected result is HTTP 403.

Green: empty.

Yellow: empty.

### TC-US9a-04 Hide edit after delivery

Dev: Pratanin.

Red: manual check not done today. Expected: the list says Locked.

Green: empty.

Yellow: empty.

### TC-US9b-01 Second food on the same log

Dev: Pratanin.

Red: Day 3 UI test not written. Expected: one donationId, two lines, quantity is the sum.

Green: empty.

Yellow: empty.

### TC-US9b-02 Split flag is submitted

Dev: Pratanin.

Red: expected POST field `splitAcrossBanks: true`. Not evidenced today.

Green: empty.

Yellow: empty.

### TC-US9b-03 One bank when split is off

Dev: Sirapassorn. Covered by `qa/api/test-us1b-auto-match.py`.

Red: not re-run this morning.

Green: last full run passed the 10 kg match.

Yellow: re-run on Day 3, then mark Green.

### TC-US9b-04 Split 190 kg across banks

Dev: Sirapassorn. File: `qa/api/test-zz-donor-edit-split.py`.

Red: not re-run this morning.

Green: last full run passed sum of quantityKg equals 190.

Yellow: re-run on Day 3, then mark Green.

### TC-US9b-05 Over capacity stays queued

Dev: Sirapassorn. Covered by `test-us1b-auto-match.py`.

Red: not re-run this morning.

Green: last full run passed quantity 4000 with match null.

Yellow: re-run on Day 3, then mark Green.

### TC-US9b-06 Capacity drops by each quantityKg

Dev: Jirathiwat.

Red: no test yet. Expected: SOS falls by 164 kg on a 190 kg split, not by 190. He writes this before Day 5.

Green: empty.

Yellow: empty.

### TC-US9b-07 Edit gives capacity back

Dev: Jirathiwat.

Red: no test yet. Expected: edit restores the old kilograms, then subtracts the new quantityKg.

Green: empty.

Yellow: empty.

## Who speaks which cases later

| Meeting | Date | What “next” must cite |
|---|---|---|
| 3 (today) | Fri 6 Nov, Day 3 | TC-US9a-01 to 04, TC-US9b-01 to 07, TC-S1-01, TC-S1-02, TC-RPT-01, TC-RPT-02 |
| 4 | Mon 9 Nov | TC-US3b-01 to 04, TC-US4a-01 to 04, TC-US4b-01, TC-US4b-02, TC-RPT-03, TC-RPT-04 |
| 5 | Wed 11 Nov | TC-US4a-05, TC-US4b-03 to 05, TC-US5b-01 to 03, TC-US7-01 to 03, TC-US8-01 to 03 |
| 6 close | Fri 13 Nov | The same cases, run in the Review. Hand in this report. TC-RPT-05, TC-RPT-06 |

Sprint 1 cases stay in their own files. This report does not reopen US1a, US1b, US6, US2a, US2b, US5a, or US3a.
