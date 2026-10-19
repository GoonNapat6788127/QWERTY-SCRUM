"""US5a — Generate an automatic digital donation receipt.

Product backlog: Given a donation marked Delivered, when delivery is confirmed,
then a receipt with weight, food type, and timestamp is generated and emailed
to the donor.

Standup: Meeting 6 (Thu 22 Oct) reports this QA card done (Day 13, 2 hours).
Owners: Jirathiwat (receipt and email), Sakkaraj (QA).
"""

from __future__ import annotations

from helpers import BASE_URL, PROOF, create_donation, donor, driver


def test_receipt_has_weight_food_type_timestamp_and_email():
    donation_id = create_donation(donor(), foodType="Bakery", quantity=7)["donation"]["donationId"]
    driver_session = driver()
    driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10)
    delivered = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "photo", "proofDataUrl": PROOF, "weightKg": 7.2},
        timeout=10,
    )
    assert delivered.status_code == 200, delivered.text
    receipt = delivered.json()["receipt"]
    assert receipt["foodType"] == "Bakery"
    assert receipt["weightKg"] == 7.2
    assert receipt["timestamp"]
    assert receipt["emailedTo"] == "donor@qwerty.test"
    assert receipt["emailStatus"] == "sent"
    listed = donor().get(f"{BASE_URL}/api/receipts", timeout=10)
    ids = {item["id"] for item in listed.json()["receipts"]}
    assert receipt["id"] in ids
    pdf = donor().get(f"{BASE_URL}/api/receipts/{receipt['id']}", timeout=10)
    assert pdf.status_code == 200, pdf.text
    assert "pdf" in pdf.headers.get("Content-Type", "")
    assert b"Bakery" in pdf.content
    assert b"7.2" in pdf.content
