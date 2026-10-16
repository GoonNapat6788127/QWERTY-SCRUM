"""Write standup script PDFs from markdown using fpdf2."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF

ROOT = Path(__file__).resolve().parent
FILES = [
    "sprint-1-scrum-meeting-3.md",
    "sprint-1-scrum-meeting-4.md",
    "sprint-1-scrum-meeting-5.md",
    "sprint-1-scrum-meeting-6.md",
]


class ScriptPdf(FPDF):
    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Helvetica", size=8)
        self.set_text_color(90, 90, 90)
        self.cell(0, 8, f"Team QWERTY Sprint 1  |  page {self.page_no()}", align="C")


def clean(text: str) -> str:
    return (
        text.replace("**", "")
        .replace("`", "")
        .replace("—", "-")
        .replace("–", "-")
        .replace("·", "-")
        .replace("’", "'")
        .replace("“", '"')
        .replace("”", '"')
        .encode("latin-1", "replace")
        .decode("latin-1")
    )


def wrap_table(line: str) -> str:
    cells = [cell.strip() for cell in line.strip("|").split("|")]
    if cells and all(set(cell) <= set("-: ") for cell in cells):
        return ""
    return " / ".join(cells)


def render(md_name: str) -> None:
    source = ROOT / md_name
    pdf = ScriptPdf(format="A4")
    pdf.set_margins(16, 16, 16)
    pdf.set_auto_page_break(auto=True, margin=16)
    pdf.add_page()
    pdf.set_text_color(20, 20, 20)

    for raw in source.read_text(encoding="utf-8").splitlines():
        line = clean(raw.rstrip())
        if not line:
            pdf.ln(3)
            continue
        pdf.set_x(16)
        if line.startswith("# "):
            pdf.set_font("Helvetica", "B", 16)
            pdf.multi_cell(0, 8, line[2:])
            pdf.ln(2)
        elif line.startswith("## "):
            pdf.set_font("Helvetica", "B", 13)
            pdf.ln(2)
            pdf.multi_cell(0, 7, line[3:])
        elif line.startswith("### "):
            pdf.set_font("Helvetica", "B", 11)
            pdf.ln(1)
            pdf.multi_cell(0, 6, line[4:])
        elif line.startswith("|"):
            table = wrap_table(line)
            if not table:
                continue
            pdf.set_font("Helvetica", size=8)
            pdf.multi_cell(0, 4.5, table)
        elif line.startswith("- "):
            pdf.set_font("Helvetica", size=10)
            pdf.multi_cell(0, 5, f"- {line[2:]}")
        else:
            pdf.set_font("Helvetica", size=10)
            pdf.multi_cell(0, 5, line)

    out = source.with_suffix(".pdf")
    pdf.output(out)
    print(out)


if __name__ == "__main__":
    for name in FILES:
        render(name)
