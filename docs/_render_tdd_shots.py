"""Re-run the exact cases named in each standup and draw a matching terminal picture."""

from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SHOTS = ROOT / "docs" / "screenshots"
PY = ROOT / ".venv" / "Scripts" / "python.exe"

JOBS = {
    "m3-pratanin": (
        "Pratanin  |  TC-US9b-01, TC-US9b-02, TC-US9a-04",
        [
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_01_second_food_on_the_same_log",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_02_split_flag_is_submitted",
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_04_delivered_donation_is_locked",
        ],
    ),
    "m3-jirathiwat": (
        "Jirathiwat  |  TC-US9a-03, TC-US9b-06, TC-US9b-07",
        [
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_03_reject_edit_by_another_role",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_06_capacity_drops_by_each_quantity_kg",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_07_edit_gives_capacity_back",
        ],
    ),
    "m3-sirapassorn": (
        "Sirapassorn  |  TC-US9b-03, TC-US9b-04, TC-US9b-05",
        [
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_03_one_bank_when_split_is_off",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_04_split_190kg_across_banks",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_05_over_capacity_stays_queued",
        ],
    ),
    "m3-sakkaraj": (
        "Sakkaraj  |  TC-US9a-01, TC-US9a-02, TC-S1-01, TC-S1-02",
        [
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_01_edit_before_pickup",
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_02_reject_edit_after_pickup",
            "qa/api/test-us1a-log-donation.py::test_tc01_valid_donation_is_queued",
            "qa/api/test-us1b-auto-match.py::test_match_within_two_minutes_when_in_range_with_capacity",
            "qa/api/test-us1b-auto-match.py::test_no_match_when_quantity_exceeds_all_capacity",
        ],
    ),
    "m4-pratanin": (
        "Pratanin  |  TC-US3b-04, TC-US4a-01, TC-US4a-02",
        [
            "qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_04_alerts_page_renders_the_row",
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_01_filter_by_status",
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_02_filter_by_donor",
        ],
    ),
    "m4-jirathiwat": (
        "Jirathiwat  |  TC-US4a-03, TC-US4a-04",
        [
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_03_dashboard_summary_fields",
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_04_urgent_count_matches_the_flag",
        ],
    ),
    "m4-sirapassorn": (
        "Sirapassorn  |  TC-US4b-01, TC-US4b-02",
        [
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_01_activity_counts",
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_02_run_row_has_the_donation",
        ],
    ),
    "m4-sakkaraj": (
        "Sakkaraj  |  TC-US3b-01, TC-US3b-02, TC-US3b-03",
        [
            "qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_01_staff_alert_at_24_hours",
            "qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_02_driver_alert_at_the_same_threshold",
            "qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_03_no_duplicate_alert",
        ],
    ),
    "m5-pratanin": (
        "Pratanin  |  TC-US4b-03, TC-US5b-02, TC-US7-02",
        [
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_03_activity_page_fields",
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_02_export_button_downloads_csv",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_02_show_the_ping",
        ],
    ),
    "m5-jirathiwat": (
        "Jirathiwat  |  TC-US5b-01, TC-US8-01, TC-US8-02",
        [
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_01_tax_csv_and_pdf",
            "qa/api/test-us8-decay.py::test_tc_us8_01_decay_fields",
            "qa/api/test-us8-decay.py::test_tc_us8_02_label_the_spike",
        ],
    ),
    "m5-sirapassorn": (
        "Sirapassorn  |  TC-US4b-04, TC-US7-01",
        [
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_04_delivered_count",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_01_store_a_ping",
        ],
    ),
    "m5-sakkaraj": (
        "Sakkaraj  |  TC-US4a-05, TC-US4b-05, TC-US5b-03, TC-US7-03, TC-US8-03",
        [
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_05_counts_match_the_filter",
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_05_qa_after_pickup_and_delivery",
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_03_donor_receives_both_formats",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_03_qa_ping_fields",
            "qa/api/test-us8-decay.py::test_tc_us8_03_qa_decay_shape",
        ],
    ),
    "m6-pratanin": (
        "Pratanin  |  TC-US9b-01, TC-US9b-02, TC-US9a-04, TC-US4b-03, TC-US5b-02, TC-US7-02",
        [
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_01_second_food_on_the_same_log",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_02_split_flag_is_submitted",
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_04_delivered_donation_is_locked",
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_03_activity_page_fields",
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_02_export_button_downloads_csv",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_02_show_the_ping",
        ],
    ),
    "m6-jirathiwat": (
        "Jirathiwat  |  TC-US9a-03, TC-US9b-06, TC-US4a-03, TC-US5b-01, TC-US8-01, TC-US8-02",
        [
            "qa/api/test-us9a-edit-donation.py::test_tc_us9a_03_reject_edit_by_another_role",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_06_capacity_drops_by_each_quantity_kg",
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_03_dashboard_summary_fields",
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_01_tax_csv_and_pdf",
            "qa/api/test-us8-decay.py::test_tc_us8_01_decay_fields",
            "qa/api/test-us8-decay.py::test_tc_us8_02_label_the_spike",
        ],
    ),
    "m6-sirapassorn": (
        "Sirapassorn  |  TC-US9b-03, TC-US9b-04, TC-US9b-05, TC-US4b-04, TC-US7-01",
        [
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_03_one_bank_when_split_is_off",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_04_split_190kg_across_banks",
            "qa/api/test-us9b-one-to-many.py::test_tc_us9b_05_over_capacity_stays_queued",
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_04_delivered_count",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_01_store_a_ping",
        ],
    ),
    "m6-sakkaraj": (
        "Sakkaraj  |  TC-US4a-05, TC-US4b-05, TC-US5b-03, TC-US7-03, TC-US8-03, TC-S1-01, TC-S1-02",
        [
            "qa/api/test-us4a-dashboard.py::test_tc_us4a_05_counts_match_the_filter",
            "qa/api/test-us4b-driver-activity.py::test_tc_us4b_05_qa_after_pickup_and_delivery",
            "qa/api/test-us5b-tax-export.py::test_tc_us5b_03_donor_receives_both_formats",
            "qa/api/test-us7-driver-ping.py::test_tc_us7_03_qa_ping_fields",
            "qa/api/test-us8-decay.py::test_tc_us8_03_qa_decay_shape",
            "qa/api/test-us1a-log-donation.py::test_tc01_valid_donation_is_queued",
            "qa/api/test-us1b-auto-match.py::test_match_within_two_minutes_when_in_range_with_capacity",
            "qa/api/test-us1b-auto-match.py::test_no_match_when_quantity_exceeds_all_capacity",
        ],
    ),
}


def draw(name: str, caption: str, body: str) -> None:
    font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
    bold = ImageFont.truetype(r"C:\Windows\Fonts\consolab.ttf", 15)
    lines = []
    for raw in body.splitlines():
        while len(raw) > 118:
            cut = raw.rfind(" ", 0, 118)
            if cut < 40:
                cut = 118
            lines.append(raw[:cut])
            raw = raw[cut:].lstrip()
        lines.append(raw)
    width = 1500
    bar = 56
    height = bar + 16 + 20 * len(lines) + 16
    image = Image.new("RGB", (width, height), "#0c0c0c")
    draw_ctx = ImageDraw.Draw(image)
    draw_ctx.rectangle((0, 0, width, bar), fill="#012456")
    draw_ctx.text((16, 6), "Windows PowerShell", font=bold, fill="white")
    draw_ctx.text((16, 28), caption, font=font, fill="#d0e4ff")
    y = bar + 10
    for line in lines:
        color = "#f9e2af" if line.startswith("PS ") else "#4ec94e" if "PASSED" in line or "passed" in line else "#f2f2f2"
        draw_ctx.text((16, y), line, font=font, fill=color)
        y += 20
    image.save(SHOTS / f"{name}.png")


def main() -> None:
    SHOTS.mkdir(exist_ok=True)
    for name, (caption, nodes) in JOBS.items():
        cmd = [str(PY), "-m", "pytest", "-p", "no:cacheprovider", "-v", "--tb=line", *nodes]
        proc = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
        shown = ".\\.venv\\Scripts\\python.exe -m pytest -v --tb=line " + " ".join(nodes)
        header = "PS C:\\Users\\jirat\\Downloads\\QWERTY-SCRUM> " + shown
        text = header + "\n" + proc.stdout + proc.stderr
        (SHOTS / f"{name}.txt").write_text(text, encoding="utf-8")
        draw(name, caption, text)
        last = (proc.stdout + proc.stderr).strip().splitlines()[-1]
        print(name, proc.returncode, last)


if __name__ == "__main__":
    main()
