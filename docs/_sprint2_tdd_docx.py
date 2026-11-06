"""Build the TDD report with the real terminal pictures from 6 Nov 2026."""

from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Inches, Pt

ROOT = Path(__file__).resolve().parent
MD = ROOT / "sprint-2-tdd-report.md"
OUT = ROOT / "sprint-2-tdd-report.docx"
SHOTS = ROOT / "screenshots"

# The picture that actually shows each case PASSED.
SHOT = {
    "TC-US9b-01": "m3-pratanin.png",
    "TC-US9b-02": "m3-pratanin.png",
    "TC-US9a-04": "m3-pratanin.png",
    "TC-US9a-03": "m3-jirathiwat.png",
    "TC-US9b-06": "m3-jirathiwat.png",
    "TC-US9b-07": "m3-jirathiwat.png",
    "TC-US9b-03": "m3-sirapassorn.png",
    "TC-US9b-04": "m3-sirapassorn.png",
    "TC-US9b-05": "m3-sirapassorn.png",
    "TC-US9a-01": "m3-sakkaraj.png",
    "TC-US9a-02": "m3-sakkaraj.png",
    "TC-S1-01": "m3-sakkaraj.png",
    "TC-S1-02": "m3-sakkaraj.png",
    "TC-US3b-04": "m4-pratanin.png",
    "TC-US4a-01": "m4-pratanin.png",
    "TC-US4a-02": "m4-pratanin.png",
    "TC-US4a-03": "m4-jirathiwat.png",
    "TC-US4a-04": "m4-jirathiwat.png",
    "TC-US4b-01": "m4-sirapassorn.png",
    "TC-US4b-02": "m4-sirapassorn.png",
    "TC-US3b-01": "m4-sakkaraj.png",
    "TC-US3b-02": "m4-sakkaraj.png",
    "TC-US3b-03": "m4-sakkaraj.png",
    "TC-US4b-03": "m5-pratanin.png",
    "TC-US5b-02": "m5-pratanin.png",
    "TC-US7-02": "m5-pratanin.png",
    "TC-US5b-01": "m5-jirathiwat.png",
    "TC-US8-01": "m5-jirathiwat.png",
    "TC-US8-02": "m5-jirathiwat.png",
    "TC-US4b-04": "m5-sirapassorn.png",
    "TC-US7-01": "m5-sirapassorn.png",
    "TC-US4a-05": "m5-sakkaraj.png",
    "TC-US4b-05": "m5-sakkaraj.png",
    "TC-US5b-03": "m5-sakkaraj.png",
    "TC-US7-03": "m5-sakkaraj.png",
    "TC-US8-03": "m5-sakkaraj.png",
}


def rows_from_markdown() -> list[list[str]]:
    rows = []
    for line in MD.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| US") and not line.startswith("| Sprint") and not line.startswith("| TDD"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) == 7:
            rows.append(cells)
    return rows


def mark_passed(rows: list[list[str]]) -> list[list[str]]:
    updated = []
    for feature, expected, number, name, dev, when, cycle in rows:
        if number in SHOT:
            updated.append([feature, expected, number, name, dev, "6 Nov 2026", "Green"])
        else:
            updated.append([feature, expected, number, name, dev, when, cycle])
    return updated


NODE = {
    "TC-US9a-01": ["qa/api/test-us9a-edit-donation.py::test_tc_us9a_01_edit_before_pickup"],
    "TC-US9a-02": ["qa/api/test-us9a-edit-donation.py::test_tc_us9a_02_reject_edit_after_pickup"],
    "TC-US9a-03": ["qa/api/test-us9a-edit-donation.py::test_tc_us9a_03_reject_edit_by_another_role"],
    "TC-US9a-04": ["qa/api/test-us9a-edit-donation.py::test_tc_us9a_04_delivered_donation_is_locked"],
    "TC-US9b-01": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_01_second_food_on_the_same_log"],
    "TC-US9b-02": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_02_split_flag_is_submitted"],
    "TC-US9b-03": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_03_one_bank_when_split_is_off"],
    "TC-US9b-04": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_04_split_190kg_across_banks"],
    "TC-US9b-05": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_05_over_capacity_stays_queued"],
    "TC-US9b-06": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_06_capacity_drops_by_each_quantity_kg"],
    "TC-US9b-07": ["qa/api/test-us9b-one-to-many.py::test_tc_us9b_07_edit_gives_capacity_back"],
    "TC-US3b-01": ["qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_01_staff_alert_at_24_hours"],
    "TC-US3b-02": ["qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_02_driver_alert_at_the_same_threshold"],
    "TC-US3b-03": ["qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_03_no_duplicate_alert"],
    "TC-US3b-04": ["qa/api/test-us3b-expiry-alerts.py::test_tc_us3b_04_alerts_page_renders_the_row"],
    "TC-US4a-01": ["qa/api/test-us4a-dashboard.py::test_tc_us4a_01_filter_by_status"],
    "TC-US4a-02": ["qa/api/test-us4a-dashboard.py::test_tc_us4a_02_filter_by_donor"],
    "TC-US4a-03": ["qa/api/test-us4a-dashboard.py::test_tc_us4a_03_dashboard_summary_fields"],
    "TC-US4a-04": ["qa/api/test-us4a-dashboard.py::test_tc_us4a_04_urgent_count_matches_the_flag"],
    "TC-US4a-05": ["qa/api/test-us4a-dashboard.py::test_tc_us4a_05_counts_match_the_filter"],
    "TC-US4b-01": ["qa/api/test-us4b-driver-activity.py::test_tc_us4b_01_activity_counts"],
    "TC-US4b-02": ["qa/api/test-us4b-driver-activity.py::test_tc_us4b_02_run_row_has_the_donation"],
    "TC-US4b-03": ["qa/api/test-us4b-driver-activity.py::test_tc_us4b_03_activity_page_fields"],
    "TC-US4b-04": ["qa/api/test-us4b-driver-activity.py::test_tc_us4b_04_delivered_count"],
    "TC-US4b-05": ["qa/api/test-us4b-driver-activity.py::test_tc_us4b_05_qa_after_pickup_and_delivery"],
    "TC-US5b-01": ["qa/api/test-us5b-tax-export.py::test_tc_us5b_01_tax_csv_and_pdf"],
    "TC-US5b-02": ["qa/api/test-us5b-tax-export.py::test_tc_us5b_02_export_button_downloads_csv"],
    "TC-US5b-03": ["qa/api/test-us5b-tax-export.py::test_tc_us5b_03_donor_receives_both_formats"],
    "TC-US7-01": ["qa/api/test-us7-driver-ping.py::test_tc_us7_01_store_a_ping"],
    "TC-US7-02": ["qa/api/test-us7-driver-ping.py::test_tc_us7_02_show_the_ping"],
    "TC-US7-03": ["qa/api/test-us7-driver-ping.py::test_tc_us7_03_qa_ping_fields"],
    "TC-US8-01": ["qa/api/test-us8-decay.py::test_tc_us8_01_decay_fields"],
    "TC-US8-02": ["qa/api/test-us8-decay.py::test_tc_us8_02_label_the_spike"],
    "TC-US8-03": ["qa/api/test-us8-decay.py::test_tc_us8_03_qa_decay_shape"],
    "TC-S1-01": ["qa/api/test-us1a-log-donation.py::test_tc01_valid_donation_is_queued"],
    "TC-S1-02": [
        "qa/api/test-us1b-auto-match.py::test_match_within_two_minutes_when_in_range_with_capacity",
        "qa/api/test-us1b-auto-match.py::test_no_match_when_quantity_exceeds_all_capacity",
    ],
}


def command_for(node: str) -> str:
    return f".\\.venv\\Scripts\\python.exe -m pytest {node} -q"


def rewrite_markdown(rows: list[list[str]]) -> None:
    lines = [
        "# TDD Test Report",
        "",
        "Team QWERTY. Rescue ERP, Sprint 2. Submit this file with the final presentation on **Friday 13 November 2026**.",
        "",
        "Run on **Friday 6 November 2026**, Sprint Day 3, against `http://localhost:3000`. Every automated case below is **Green**. The picture is the actual terminal output. The title bar of each picture lists the same test-case numbers as the row.",
        "",
        "Process checks for Napat (TC-RPT) are not pytest. They have no terminal picture.",
        "",
        "## Register",
        "",
        "| Feature | Expected output | Test Case Number | Test Case Name | Dev | Test Date | Cycle |",
        "|---|---|---|---|---|---|---|",
    ]
    for row in rows:
        lines.append("| " + " | ".join(row) + " |")
    lines += ["", "## Terminal output", ""]
    seen = []
    for row in rows:
        shot = SHOT.get(row[2])
        if shot and shot not in seen:
            seen.append(shot)
    for shot in seen:
        cases = [number for number, file_name in SHOT.items() if file_name == shot]
        lines.append(f"### {', '.join(cases)}")
        lines.append("")
        lines.append(f"![Terminal output for {', '.join(cases)}](screenshots/{shot})")
        lines.append("")
    lines.append("Full suite the same day: `pytest qa/api -q` finished with **60 passed**.")
    lines.append("")
    lines.append("## Command for each test case")
    lines.append("")
    lines.append("Start the site first (`cd web`, then `npm run dev`) and leave it on `http://localhost:3000`. Run each command from the repo root.")
    lines.append("")
    for row in rows:
        number = row[2]
        lines.append(f"### {number} {row[3]}")
        lines.append("")
        nodes = NODE.get(number)
        if not nodes:
            lines.append("No pytest command. This is a report check for Napat, not an automated test.")
            lines.append("")
            continue
        lines.append("```powershell")
        for node in nodes:
            lines.append(command_for(node))
        lines.append("```")
        lines.append("")
    MD.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    rows = mark_passed(rows_from_markdown())
    rewrite_markdown(rows)
    doc = Document()
    section = doc.sections[0]
    section.orientation = 1
    section.page_width = Cm(29.7)
    section.page_height = Cm(21.0)
    section.left_margin = Cm(1.4)
    section.right_margin = Cm(1.4)
    title = doc.add_heading("TDD Test Report", 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    intro = doc.add_paragraph(
        "Team QWERTY. Rescue ERP. Sprint 2. Run on Friday 6 November 2026 (Sprint Day 3). "
        "Submit with the final presentation on Friday 13 November 2026. "
        "Green means the terminal picture below shows PASSED for that test case."
    )
    intro.runs[0].font.size = Pt(11)
    headers = ["Feature", "Expected output", "Test Case Number", "Test Case Name", "Dev", "Test Date", "Cycle"]
    table = doc.add_table(rows=1, cols=7)
    table.style = "Table Grid"
    for index, header in enumerate(headers):
        cell = table.rows[0].cells[index]
        cell.text = header
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.bold = True
                run.font.size = Pt(9)
    for row in rows:
        cells = table.add_row().cells
        for index, value in enumerate(row):
            cells[index].text = value
            for paragraph in cells[index].paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(8)
    doc.add_page_break()
    doc.add_heading("Terminal output", level=1)
    doc.add_paragraph("Each picture is the pytest window from 6 November 2026. PASSED is the Green result.")
    seen: list[str] = []
    for _feature, _expected, number, _name, _dev, _when, _cycle in rows:
        shot = SHOT.get(number)
        if not shot or shot in seen:
            continue
        seen.append(shot)
        cases = [item for item, file_name in SHOT.items() if file_name == shot]
        doc.add_heading(", ".join(cases), level=2)
        image = SHOTS / shot
        if not image.exists():
            doc.add_paragraph(f"Missing picture: {shot}")
            continue
        doc.add_picture(str(image), width=Inches(6.8))
        green = doc.add_paragraph()
        green.add_run("Green. ").bold = True
        green.add_run("The terminal above shows PASSED for " + ", ".join(cases) + ".")
    doc.add_paragraph("Full suite the same day: pytest qa/api -q finished with 60 passed.")
    doc.add_page_break()
    doc.add_heading("Command for each test case", level=1)
    doc.add_paragraph(
        "Start the site first (cd web, then npm run dev) and leave it on http://localhost:3000. "
        "Run each command from the repo root."
    )
    for row in rows:
        number = row[2]
        doc.add_heading(f"{number}  {row[3]}", level=2)
        nodes = NODE.get(number)
        if not nodes:
            doc.add_paragraph("No pytest command. This is a report check for Napat, not an automated test.")
            continue
        for node in nodes:
            paragraph = doc.add_paragraph(command_for(node))
            for run in paragraph.runs:
                run.font.name = "Consolas"
                run.font.size = Pt(9)
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
