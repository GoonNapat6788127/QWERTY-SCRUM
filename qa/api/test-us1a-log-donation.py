"""US1a — Log a donation into the matching queue.

Product backlog: Given a donor, when they submit food type, quantity, and expiry,
then the donation appears in the matching queue within 1 minute.

Standup: Meeting 3 (Fri 16 Oct) starts this QA card (Day 3, 2 hours).
Meeting 4 (Mon 19 Oct) reports the API suite done (Day 4, 2 hours). The UI pass
is reported at Meeting 5. Owners: Pratanin (form), Jirathiwat (ingestion), Sakkaraj (QA).

Contract answers used by these tests:
- Queue: GET /api/queue and page /queue
- Food type: required string (UI is a dropdown)
- Quantity: kilograms, min 0.1, max 5000
- Timezone: Asia/Bangkok; expiry must be in the future; 5 minutes is accepted
- Duplicate protection: donationId uniqueness + Idempotency-Key
- Roles: donor, foodbank, driver, logistics — only donor may POST /api/donations
- Queue update: immediate (well under 60 seconds)
"""

from __future__ import annotations

import os
import time
import uuid
from datetime import datetime, timedelta, timezone

import pytest
import requests

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")
BANGKOK = timezone(timedelta(hours=7))


def future_expiry(minutes: int = 180) -> str:
    return (datetime.now(tz=BANGKOK) + timedelta(minutes=minutes)).isoformat()


def past_expiry() -> str:
    return (datetime.now(tz=BANGKOK) - timedelta(hours=2)).isoformat()


def login(email: str, password: str) -> requests.Session:
    session = requests.Session()
    response = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    assert response.status_code == 200, response.text
    return session


def donor_session() -> requests.Session:
    return login("donor@qwerty.test", "donor123")


def valid_payload(**overrides):
    payload = {
        "donationId": f"DON-TEST-{uuid.uuid4()}",
        "foodType": "Prepared meals",
        "quantity": 12.5,
        "expiryDateTime": future_expiry(),
        "pickupWindow": {
            "start": future_expiry(60),
            "end": future_expiry(180),
        },
    }
    payload.update(overrides)
    return payload


@pytest.fixture(scope="module")
def donor():
    return donor_session()


def test_tc01_valid_donation_is_queued(donor):
    started = time.perf_counter()
    payload = valid_payload()
    created = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert created.status_code == 201, created.text
    body = created.json()
    assert body["queueVisible"] is True
    assert body["donation"]["foodType"] == payload["foodType"]

    queue = donor.get(f"{BASE_URL}/api/queue", timeout=10)
    assert queue.status_code == 200
    items = queue.json()["items"]
    match = next(item for item in items if item["donationId"] == payload["donationId"])
    elapsed = time.perf_counter() - started
    assert elapsed < 60
    assert match["quantity"] == payload["quantity"]
    assert match["expiryDateTime"]
    assert match["donorId"] == "usr-donor-1"
    assert match["timezone"] == "Asia/Bangkok"
    assert match["pickupWindow"]["start"]


def test_tc02_queued_item_shows_submitted_details(donor):
    payload = valid_payload(foodType="Bakery", quantity=4)
    created = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert created.status_code == 201, created.text
    item = created.json()["donation"]
    assert item["foodType"] == "Bakery"
    assert item["quantity"] == 4
    assert item["expiryDateTime"]
    queue = donor.get(f"{BASE_URL}/api/queue", timeout=10).json()["items"]
    match = next(row for row in queue if row["donationId"] == payload["donationId"])
    assert match["foodType"] == "Bakery"
    assert match["quantity"] == 4


def test_tc03_empty_food_type_rejected(donor):
    payload = valid_payload(foodType="")
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 400
    assert "foodType" in response.json()["errors"]
    queue_ids = {item["donationId"] for item in donor.get(f"{BASE_URL}/api/queue").json()["items"]}
    assert payload["donationId"] not in queue_ids


def test_tc04_quantity_zero_rejected(donor):
    payload = valid_payload(quantity=0)
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 400
    assert "quantity" in response.json()["errors"]


@pytest.mark.parametrize("quantity", [-5, "abc"])
def test_tc05_negative_or_non_numeric_quantity(donor, quantity):
    payload = valid_payload(quantity=quantity)
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 400
    assert "quantity" in response.json()["errors"]


def test_tc06_expiry_in_the_past_rejected(donor):
    payload = valid_payload(expiryDateTime=past_expiry())
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 400
    assert "expiryDateTime" in response.json()["errors"]


def test_tc07_expiry_in_five_minutes_accepted(donor):
    payload = valid_payload(expiryDateTime=future_expiry(5))
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 201, response.text


@pytest.mark.parametrize("missing", ["foodType", "quantity", "expiryDateTime"])
def test_tc08_missing_required_fields(donor, missing):
    payload = valid_payload()
    payload[missing] = ""
    response = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert response.status_code == 400
    assert missing in response.json()["errors"]


def test_tc09_double_submit_creates_one_queue_entry(donor):
    payload = valid_payload()
    headers = {"Idempotency-Key": payload["donationId"]}
    first = donor.post(f"{BASE_URL}/api/donations", json=payload, headers=headers, timeout=10)
    second = donor.post(f"{BASE_URL}/api/donations", json=payload, headers=headers, timeout=10)
    assert first.status_code == 201
    assert second.status_code in (200, 201)
    assert second.json()["duplicate"] is True
    items = donor.get(f"{BASE_URL}/api/queue").json()["items"]
    assert sum(1 for item in items if item["donationId"] == payload["donationId"]) == 1


def test_tc10_non_donor_access_blocked():
    anonymous = requests.post(f"{BASE_URL}/api/donations", json=valid_payload(), timeout=10)
    assert anonymous.status_code == 401
    foodbank = login("foodbank@qwerty.test", "foodbank123")
    blocked = foodbank.post(f"{BASE_URL}/api/donations", json=valid_payload(), timeout=10)
    assert blocked.status_code == 403


def test_tc11_queue_timing(donor):
    payload = valid_payload()
    started = time.perf_counter()
    created = donor.post(f"{BASE_URL}/api/donations", json=payload, timeout=10)
    assert created.status_code == 201
    found = None
    while time.perf_counter() - started < 60:
        items = donor.get(f"{BASE_URL}/api/queue", timeout=10).json()["items"]
        found = next((item for item in items if item["donationId"] == payload["donationId"]), None)
        if found:
            break
        time.sleep(0.2)
    elapsed = time.perf_counter() - started
    assert found is not None
    assert elapsed < 60
    print(f"QUEUE_TIMING_SECONDS={elapsed:.3f}")


def test_qa_injection_endpoint():
    logistics = login("logistics@qwerty.test", "logistics123")
    payload = valid_payload(foodType="Fresh produce")
    response = logistics.post(f"{BASE_URL}/api/test/queue", json=payload, timeout=10)
    assert response.status_code == 201, response.text
    assert response.json()["queueEndpoint"] == "/api/queue"
