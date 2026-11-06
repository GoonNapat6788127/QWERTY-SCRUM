"""US5b — TC-US5b-01, TC-US5b-02, TC-US5b-03."""

from __future__ import annotations

from datetime import datetime, timezone

from helpers import BASE_URL, donor


def test_tc_us5b_01_tax_csv_and_pdf():
    session = donor()
    month = datetime.now(timezone.utc).strftime("%Y-%m")
    csv_file = session.get(f"{BASE_URL}/api/reports/tax?format=csv&month={month}", timeout=10)
    pdf_file = session.get(f"{BASE_URL}/api/reports/tax?format=pdf&month={month}", timeout=10)
    assert csv_file.status_code == 200, csv_file.text
    assert pdf_file.status_code == 200
    assert "text/csv" in csv_file.headers["content-type"]
    assert "application/pdf" in pdf_file.headers["content-type"]


def test_tc_us5b_02_export_button_downloads_csv():
    month = datetime.now(timezone.utc).strftime("%Y-%m")
    response = donor().get(f"{BASE_URL}/api/reports/tax?format=csv&month={month}", timeout=10)
    assert response.status_code == 200
    assert "attachment" in response.headers.get("content-disposition", "")
    assert response.text.splitlines()[0].startswith("receiptId,donationId,foodType")


def test_tc_us5b_03_donor_receives_both_formats():
    session = donor()
    month = datetime.now(timezone.utc).strftime("%Y-%m")
    assert session.get(f"{BASE_URL}/api/reports/tax?format=csv&month={month}", timeout=10).status_code == 200
    assert session.get(f"{BASE_URL}/api/reports/tax?format=pdf&month={month}", timeout=10).status_code == 200
