from __future__ import annotations

import os
import uuid
from datetime import datetime, timedelta, timezone

import requests

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000").rstrip("/")
BANGKOK = timezone(timedelta(hours=7))
PROOF = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="


def future_expiry(minutes: int = 180) -> str:
    return (datetime.now(tz=BANGKOK) + timedelta(minutes=minutes)).isoformat()


def login(email: str, password: str) -> requests.Session:
    session = requests.Session()
    response = session.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": email, "password": password},
        timeout=10,
    )
    assert response.status_code == 200, response.text
    return session


def donor() -> requests.Session:
    return login("donor@qwerty.test", "donor123")


def driver() -> requests.Session:
    return login("driver@qwerty.test", "driver123")


def foodbank() -> requests.Session:
    return login("foodbank@qwerty.test", "foodbank123")


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
