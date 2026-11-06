"""US7 — TC-US7-01, TC-US7-02, TC-US7-03."""

from __future__ import annotations

from helpers import BASE_URL, driver, foodbank


def test_tc_us7_01_store_a_ping():
    response = driver().post(f"{BASE_URL}/api/drivers/location", json={"lat": 13.75, "lng": 100.51}, timeout=10)
    assert response.status_code == 200, response.text
    ping = response.json()["location"]
    assert ping["driverId"] == "usr-driver-1"
    assert ping["lat"] == 13.75
    assert ping["lng"] == 100.51
    assert ping["recordedAt"]


def test_tc_us7_02_show_the_ping():
    assert driver().post(f"{BASE_URL}/api/drivers/location", json={"lat": 13.76, "lng": 100.52}, timeout=10).status_code == 200
    row = next(item for item in foodbank().get(f"{BASE_URL}/api/drivers/activity", timeout=10).json()["drivers"] if item["driverId"] == "usr-driver-1")
    assert row["location"]["lat"] == 13.76
    assert row["location"]["lng"] == 100.52
    assert row["location"]["recordedAt"]


def test_tc_us7_03_qa_ping_fields():
    assert driver().post(f"{BASE_URL}/api/drivers/location", json={"lat": 13.77, "lng": 100.53}, timeout=10).status_code == 200
    locations = foodbank().get(f"{BASE_URL}/api/drivers/location", timeout=10).json()["locations"]
    ping = next(item for item in locations if item["driverId"] == "usr-driver-1")
    assert {"lat", "lng", "recordedAt"} <= set(ping)
