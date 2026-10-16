"""US2b — Track delivery status with proof.

Product backlog: Given a picked-up donation, when a driver marks it Delivered,
then a delivery timestamp and digital proof (photo or signature) are attached.

Standup: Meeting 6 (Fri 23 Oct) reports this QA card done (Days 11–12, 4 hours).
Owners: Sirapassorn (delivery API), Pratanin (proof on incoming), Sakkaraj (QA).
"""

from __future__ import annotations

from helpers import BASE_URL, PROOF, create_donation, donor, driver, foodbank


def test_delivery_requires_proof_then_attaches_it():
    donation_id = create_donation(donor(), quantity=6)["donation"]["donationId"]
    driver_session = driver()
    assert driver_session.post(f"{BASE_URL}/api/pickup", json={"donationId": donation_id}, timeout=10).status_code == 200
    rejected = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={"donationId": donation_id, "proofKind": "signature"},
        timeout=10,
    )
    assert rejected.status_code == 400
    delivered = driver_session.post(
        f"{BASE_URL}/api/delivery",
        json={
            "donationId": donation_id,
            "proofKind": "signature",
            "proofDataUrl": PROOF,
            "weightKg": 6,
        },
        timeout=10,
    )
    assert delivered.status_code == 200, delivered.text
    donation = delivered.json()["donation"]
    assert donation["status"] == "delivered"
    assert donation["deliveredAt"]
    assert donation["proofKind"] == "signature"
    assert donation["proofDataUrl"]
    incoming = foodbank().get(f"{BASE_URL}/api/incoming", timeout=10)
    assert incoming.status_code == 200, incoming.text
    row = next(item for item in incoming.json()["incoming"] if item["donationId"] == donation_id)
    assert row["deliveredAt"] == donation["deliveredAt"]
    assert row["proofKind"] == "signature"
    assert row["proofDataUrl"]
