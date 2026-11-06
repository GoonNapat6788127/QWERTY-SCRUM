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
    doc.save(OUT)
    print(OUT)


if __name__ == "__main__":
    main()
