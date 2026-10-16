"""Reset demo capacity before the Sprint 1 suite so matches are repeatable."""

from __future__ import annotations

import pytest

from helpers import BASE_URL, login


@pytest.fixture(scope="session", autouse=True)
def reset_demo_data():
    session = login("logistics@qwerty.test", "logistics123")
    response = session.post(f"{BASE_URL}/api/test/reset", timeout=10)
    assert response.status_code == 200, response.text
