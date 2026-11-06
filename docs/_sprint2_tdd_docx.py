"""Fill the instructor TDD template shape: summary table plus Red / Green / Yellow notes."""

from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Cm, Pt

ROOT = Path(__file__).resolve().parent
MD = ROOT / "sprint-2-tdd-report.md"
OUT = ROOT / "sprint-2-tdd-report.docx"


def rows_from_markdown() -> list[list[str]]:
    rows = []
    for line in MD.read_text(encoding="utf-8").splitlines():
        if not line.startswith("| US") and not line.startswith("| Sprint") and not line.startswith("| TDD"):
            continue
        cells = [cell.strip() for cell in line.strip("|").split("|")]
        if len(cells) != 7:
            continue
        rows.append(cells)
    return rows


def main() -> None:
    data = rows_from_markdown()
    if not data:
        raise SystemExit("No test rows found in sprint-2-tdd-report.md")
    doc = Document()
    section = doc.sections[0]
    section.orientation = 1
    section.page_width = Cm(29.7)
    section.page_height = Cm(21.0)
    section.left_margin = Cm(1.2)
    section.right_margin = Cm(1.2)
    title = doc.add_heading("TDD Test Report", 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    intro = doc.add_paragraph(
        "Team QWERTY  |  Rescue ERP  |  Sprint 2  |  Friday 6 November 2026 is Sprint Day 3. "
        "Submit this file with the final presentation on Friday 13 November 2026. "
        "Red = test not passing yet. Green = test passed. Yellow = already in qa/api, re-run before calling it Green."
    )
    intro.runs[0].font.size = Pt(10)
    headers = [
        "Feature",
        "Expected output",
        "Test Case Number",
        "Test Case Name",
        "Dev",
        "Test Date",
        "Cycle",
    ]
    table = doc.add_table(rows=1, cols=7)
    table.style = "Table Grid"
    for index, header in enumerate(headers):
        cell = table.rows[0].cells[index]
        cell.text = header
        for paragraph in cell.paragraphs:
            for run in paragraph.runs:
                run.bold = True
                run.font.size = Pt(9)
    for row in data:
        cells = table.add_row().cells
        for index, value in enumerate(row):
            cells[index].text = value
            for paragraph in cells[index].paragraphs:
                for run in paragraph.runs:
                    run.font.size = Pt(8)
    doc.add_paragraph()
    doc.add_heading("Red, Green, Yellow", level=1)
    note = doc.add_paragraph(
        "Day 3 cases are written out below. Later cases stay in the table until that meeting."
    )
    note.runs[0].font.size = Pt(10)
    day3 = [row for row in data if row[5] in ("6 Nov 2026", "Re-run on Day 3")]
    for feature, expected, number, name, dev, _when, cycle in day3:
        doc.add_heading(f"{number}  {name}", level=2)
        doc.add_paragraph(f"Feature: {feature}")
        doc.add_paragraph(f"Expected output: {expected}")
        doc.add_paragraph(f"Dev: {dev}")
        red = doc.add_paragraph()
        red.add_run("Red. ").bold = True
        if cycle == "Red":
            red.add_run("Not written yet. This is what the owner does next. Do not code past a missing test.")
        else:
            red.add_run("Not re-run on the morning of 6 November. Treat the old pass as unfinished until today.")
        green = doc.add_paragraph()
        green.add_run("Green. ").bold = True
        green.add_run("Empty until a Day 3 run prints a pass for this case.")
        yellow = doc.add_paragraph()
        yellow.add_run("Yellow. ").bold = True
        if cycle == "Yellow":
            yellow.add_run("The test already exists in qa/api. Run it today, then change this row to Green.")
        else:
            yellow.add_run("Do not mark Yellow to skip writing the test.")
    doc.save(OUT)
    print(OUT)
    print(f"{len(data)} cases")


if __name__ == "__main__":
    main()
