# Test Cases: Log a Donation

**Story / Acceptance Criteria**
Given a donor, when they submit food type, quantity, and expiry date/time, then the donation appears in the matching queue within 1 minute.

**Status:** Agreed at Meeting 3 (Friday 16 October 2026). Automated in `qa/api/test-us1a-log-donation.py`.
**Author:** Sakkaraj Tuvajit (QA)
**Contract:** `GET /api/contract`. Queue `GET /api/queue` and `/queue`. Fields: donationId, foodType, quantity (kg), expiryDateTime, pickupWindow, donorId, timezone Asia/Bangkok. Only donors `POST /api/donations`. QA inject: `POST /api/test/queue`. Queue under 60 seconds.

---

## 1. Overview

| ID | Title | Preconditions | Steps | Expected result | Priority | Open question |
|---|---|---|---|---|---|---|
| TC-01 | Valid donation is queued | Logged in as donor | Submit valid food type, quantity, future expiry | Success confirmation; donation appears in matching queue within 60s | High | Queue location? |
| TC-02 | Queued item shows submitted details | TC-01 done | Open the queue entry | Food type, quantity, expiry match what was entered | High | Which fields does the queue display? |
| TC-03 | Empty food type | Logged in as donor | Leave food type blank, submit | Rejected with clear error; nothing in queue | High | Is food type free text or a dropdown? |
| TC-04 | Quantity = 0 | Logged in as donor | Enter 0, submit | Rejected; nothing in queue | High | Min/max allowed? |
| TC-05 | Negative or non-numeric quantity | Logged in as donor | Enter -5 / "abc" | Rejected; nothing in queue | Medium | Unit (kg, portions)? |
| TC-06 | Expiry in the past | Logged in as donor | Enter a past date/time | Rejected; nothing in queue | High | Timezone? |
| TC-07 | Expiry very soon (e.g. 5 min) | Logged in as donor | Submit | Accepted or rejected per the rule | Medium | Minimum shelf life? |
| TC-08 | Missing required fields | Logged in as donor | Omit each field in turn | Rejected, error names the missing field | High | Which fields are mandatory? |
| TC-09 | Double submit | Logged in as donor | Click submit twice quickly | Only one queue entry | Medium | Is duplicate prevention expected? |
| TC-10 | Non-donor access | Logged in as recipient or anonymous | Try to log a donation | Blocked | Medium | Which roles exist? |
| TC-11 | Queue timing | Logged in as donor | Submit, then watch the queue | Appears in 60s or less; record actual time | High | Is the queue updated by a background job? |

---

## 2. Detailed Test Cases

### TC-01: Valid donation is queued
- **Priority:** High
- **Preconditions:** User is logged in as a donor.
- **Steps:**
  1. Open the donation form.
  2. Enter a valid food type, a positive quantity, and an expiry date/time in the future.
  3. Submit.
  4. Open the matching queue.
- **Expected result:** A success confirmation is shown, and the donation appears in the matching queue within 60 seconds.
- **Open question:** Where is the queue viewed (page, endpoint)?

### TC-02: Queued item shows submitted details
- **Priority:** High
- **Preconditions:** TC-01 completed.
- **Steps:**
  1. Open the queue entry created in TC-01.
  2. Compare its fields with what was entered.
- **Expected result:** Food type, quantity, and expiry match the submitted values exactly.
- **Open question:** Which fields does the queue display?

### TC-03: Empty food type
- **Priority:** High
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Leave food type blank.
  2. Fill in valid quantity and expiry.
  3. Submit.
- **Expected result:** Submission is rejected with a clear error on the food type field. Nothing is added to the queue.
- **Open question:** Is food type free text or a dropdown?

### TC-04: Quantity is zero
- **Priority:** High
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Enter valid food type and expiry.
  2. Enter quantity `0`.
  3. Submit.
- **Expected result:** Rejected with a clear error. Nothing is added to the queue.
- **Open question:** What are the minimum and maximum allowed quantities?

### TC-05: Negative or non-numeric quantity
- **Priority:** Medium
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Enter valid food type and expiry.
  2. Enter quantity `-5`, submit, and note the result.
  3. Repeat with quantity `abc`.
- **Expected result:** Both are rejected with a clear error. Nothing is added to the queue.
- **Open question:** What is the quantity unit (kg, portions)?

### TC-06: Expiry in the past
- **Priority:** High
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Enter valid food type and quantity.
  2. Enter an expiry date/time earlier than now.
  3. Submit.
- **Expected result:** Rejected with a clear error. Nothing is added to the queue.
- **Open question:** Which timezone is used for expiry?

### TC-07: Expiry very soon
- **Priority:** Medium
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Enter valid food type and quantity.
  2. Enter an expiry about 5 minutes from now.
  3. Submit.
- **Expected result:** Accepted or rejected according to the agreed minimum shelf-life rule. The behavior is consistent and the message is clear.
- **Open question:** Is there a minimum time before expiry?

### TC-08: Missing required fields
- **Priority:** High
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Fill all fields validly, then omit food type. Submit.
  2. Repeat omitting quantity.
  3. Repeat omitting expiry.
- **Expected result:** Each submission is rejected, and the error identifies the missing field. Nothing is added to the queue.
- **Open question:** Which fields are mandatory?

### TC-09: Double submit
- **Priority:** Medium
- **Preconditions:** Logged in as donor.
- **Steps:**
  1. Fill the form with valid data.
  2. Click submit twice in quick succession.
  3. Check the queue.
- **Expected result:** Only one queue entry is created (or duplicates are handled as defined).
- **Open question:** Is duplicate prevention expected?

### TC-10: Non-donor access
- **Priority:** Medium
- **Preconditions:** Logged in as a recipient, or not logged in.
- **Steps:**
  1. Try to open the donation form or submit a donation.
- **Expected result:** Access is blocked (redirect to login or a forbidden message). No donation is created.
- **Open question:** Which roles exist?

### TC-11: Queue timing
- **Priority:** High
- **Preconditions:** Logged in as donor; any background job that updates the queue is running.
- **Steps:**
  1. Note the time and submit a valid donation.
  2. Refresh or poll the queue until the donation appears.
  3. Record the elapsed time.
- **Expected result:** Donation appears within 60 seconds. The actual time is recorded.
- **Open question:** Is the queue updated by a background job or immediately?

---

## 3. Answers agreed in Meeting 3 (no longer open)

1. Queue is `/queue` and `GET /api/queue`. The item includes donationId, foodType, quantity, expiryDateTime, pickupWindow, donorId, timezone.
2. Food type is a required dropdown in the UI and a required string on the API.
3. Quantity is kilograms. Minimum 0.1. Maximum 5000. Zero, negative, and non-numeric values are rejected.
4. Timezone is Asia/Bangkok. Expiry must be in the future. Five minutes ahead is accepted.
5. Required: foodType, quantity, expiryDateTime. Errors name the field.
6. Duplicate donationId and Idempotency-Key create one queue entry.
7. Roles: donor, foodbank, driver, logistics. Only a donor may `POST /api/donations`.
8. Ingestion is immediate, under 60 seconds. It is not a background job.

## 4. Cases to add once answers are known

- Very large quantity
- Special characters / very long text in food type
- Expiry exactly now
- Boundary values for min/max quantity
- UI wording and validation messages (manual first)
