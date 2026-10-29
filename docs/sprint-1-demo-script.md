# Sprint 1 Demo Script (QWERTY)

Spoken script for the Sprint Review. About 8 minutes. One story at a time, in the order the food actually moves.

Site: http://localhost:3000

Before you start: the app is running, and the queue is empty. Set the expiry inside the next 24 hours so US3a shows **urgent**. Each person uses the laptop for their own part, then passes it on.

| Role | Sign in |
|---|---|
| Donor | `donor@qwerty.test` / `donor123` |
| Driver | `driver@qwerty.test` / `driver123` |
| Food bank | `foodbank@qwerty.test` / `foodbank123` |

Sprint 1 stories in this demo: US1a, US1b, US6, US2a, US2b, US5a, US3a. Do not open the operations board, tax export, GPS, or decay. Those are Sprint 2.

---

## 1. Napat Tayommai, Scrum Master (about 45 seconds)

Good morning. This is the Sprint 1 review for Team QWERTY. The product is a rescue flow for surplus food. A donor logs food, the queue takes it, a food bank in range with capacity is proposed, a driver picks it up and delivers it with proof, and the donor receives a receipt.

We will show seven stories only: US1a, US1b, US6, US2a, US2b, US5a, and US3a. The acceptance rule for the queue is under one minute. The acceptance rule for a match is under two minutes. Pratanin will start as the donor.

---

## 2. Pratanin Kahtepmud, Dev 1 — US1a and US6 (about 90 seconds)

Sign in as the donor. Open **Log a donation**.

**US1a.** Given a donor, when they submit food type, quantity, and expiry date and time, then the donation appears in the matching queue within one minute. I enter food type, quantity in kilograms, and an expiry inside 24 hours.

**US6.** Given a donor is logging a donation, when they choose a pickup time window, then that window is stored on the donation and shown later on the driver dispatch feed. I select a pickup window, then submit.

Point at the result: queued time in milliseconds, and the proposed food bank. That submit calls `POST /api/donations`. The same request also runs the matcher, which is the US1b integration. I hand this to Jirathiwat for the queue.

---

## 3. Jirathiwat Suntipreedatham, Dev 3 — US1a queue and US3a (about 75 seconds)

Open **Matching queue**.

**US1a, continued.** The row is already here, well under 60 seconds. The queue message is `donationId`, `foodType`, `quantity` in kg, `expiryDateTime`, `pickupWindow`, `donorId`, and `timezone: Asia/Bangkok`.

**US3a.** Given a logged donation, when its expiry is within 24 hours, then the queue flags it **urgent**. This expiry is inside 24 hours, so the urgent badge is on. If the expiry were later than 24 hours, that badge would stay off.

A match is kept only when the food bank still has capacity. That capacity check is my part of US1b. Sirapassorn will show why this bank was chosen, then pick the food up.

---

## 4. Sirapassorn Pokasermsong, Dev 2 — US1b, US2a, US2b (about 2 minutes)

**US1b.** Given an open donation, when a food bank within delivery range has reported capacity, then the system proposes a match within two minutes. The ranker uses distance. SOS Food Bank Bangkok is inside its delivery range and has remaining kilograms, so it is the proposed match. The score is on the screen from the submit a moment ago.

Sign out. Sign in as the driver. Open **Driver dispatch**.

**US6, on the driver side.** The same pickup window from the form is on this feed.

**US2a.** Given a matched donation, when the driver marks it Picked Up, then the timestamp and driver ID are recorded. I click **Mark picked up**. That is `POST /api/pickup`. Status becomes picked up.

**US2b.** Given a picked-up donation, when the driver marks it Delivered, then a delivery timestamp and a digital proof, photo or signature, are attached. I open **Confirm delivery with proof**, draw a signature, and click **Attach proof and mark delivered**. Without that proof the API returns an error and does not deliver. Pratanin will show this to the food bank.

---

## 5. Pratanin Kahtepmud, Dev 1 — US2a and US2b on the food bank screen (about 60 seconds)

Sign out. Sign in as the food bank. Open **Incoming pickups**.

**US2a.** The receiving food bank can see the driver ID and the pickup timestamp. Here the driver is `usr-driver-1`, and the picked-up time is on the card.

**US2b.** The same card shows the delivery timestamp and the signature proof. The food bank does not have to ask the driver what happened. The record is on the donation. Jirathiwat will open the donor receipt.

---

## 6. Jirathiwat Suntipreedatham, Dev 3 — US5a (about 45 seconds)

Sign out. Sign in as the donor again. Open **Receipts**.

**US5a.** Given a donation marked Delivered, when delivery is confirmed, then a digital receipt with the recorded weight, food type, and timestamp is generated and emailed to the donor. This row shows the kilograms, the food type, the delivery timestamp, and email status **sent**. I open the PDF. In this demo environment the email is recorded as sent. It is not a live mailbox. Sakkaraj will confirm the tests.

---

## 7. Sakkaraj Tuvajit, QA 1 (about 45 seconds)

I tested each Sprint 1 story against its acceptance criteria. The suite is `pytest qa/api`: 24 passed, no open critical bugs.

| Story | Test file | What passed |
|---|---|---|
| US1a | `test-us1a-log-donation.py` | Queue under 60 seconds, validation, duplicates, only a donor can post |
| US1b | `test-us1b-auto-match.py` | Match under 2 minutes in range with capacity; no match when quantity is over capacity |
| US6 | `test-us6-pickup-window.py` | Pickup window stored and shown on the dispatch feed |
| US2a | `test-us2a-pickup-status.py` | Driver ID and pickup time visible to the food bank |
| US2b | `test-us2b-delivery-proof.py` | Delivery without proof is rejected; with a signature it is stored |
| US5a | `test-us5a-receipt.py` | Weight, food type, timestamp, email sent, PDF |
| US3a | `test-us3a-urgent-flag.py` | Urgent inside 24 hours; not urgent after 24 hours |

---

## 8. Napat Tayommai, close (about 30 seconds)

That is the Sprint 1 increment: log, queue, urgent flag, match, pickup window, pickup, delivery with proof, and receipt. Seven stories. If the Definition of Done holds, remaining effort is zero.

We did not demo Sprint 2: US3b alerts, US4a dashboard, US4b driver activity, US5b tax export, US7 GPS, and US8 decay. Those stay on the product backlog. Thank you.
