"""Build the Sprint 1 W02 backlog conclusion (Excel + PDF) from the original sheet."""

from __future__ import annotations

from pathlib import Path

from fpdf import FPDF
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.page import PageMargins

ROOT = Path(__file__).resolve().parent
DAYS = [f"Day {i}" for i in range(1, 16)]

# Same task-hour cells as docs/sprint-1-backlog.pdf. Status is the conclusion fill.
STORIES = [
    {
        "id": "US1a",
        "story": "Log a donation: Given a donor, when they submit food type, quantity, and expiry date/time, then the donation appears in the matching queue within 1 minute.",
        "tasks": [
            ("Build donation entry form UI", "PRATANIN KAHTEPMUD", 8, [4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("Implement donation queue ingestion backend logic", "JIRATHIWAT SUNTIPREEDATHAM", 8, [0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("QA test donation creation and queue timing", "SAKKARAJ TUVAJIT", 4, [0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        ],
    },
    {
        "id": "US1b",
        "story": "Auto-match donation to a food bank: Given an open donation, when a food bank within delivery range has reported capacity, then the system proposes a match within 2 minutes.",
        "tasks": [
            ("Develop matching algorithm proximity scoring", "SIRAPASSORN POKASERMSONG", 12, [0, 0, 4, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("Develop matching algorithm food bank capacity check", "JIRATHIWAT SUNTIPREEDATHAM", 8, [0, 0, 0, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("Integrate matching service with queue triggers", "PRATANIN KAHTEPMUD", 12, [0, 0, 0, 4, 4, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("QA test auto-matching performance and criteria", "SAKKARAJ TUVAJIT", 8, [0, 0, 0, 0, 2, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0]),
        ],
    },
    {
        "id": "US6",
        "story": "Select a pickup time window: Given a donor is logging a donation, when they choose a pickup time window from available slots, then the window is attached to the donation record and shown on driver dispatch feeds.",
        "tasks": [
            ("Add pickup time window UI component", "PRATANIN KAHTEPMUD", 5, [0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0]),
            ("Connect time window selection to dispatch feed", "JIRATHIWAT SUNTIPREEDATHAM", 5, [0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0]),
            ("QA test time slot validation and feed updates", "SAKKARAJ TUVAJIT", 3, [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0]),
        ],
    },
    {
        "id": "US2a",
        "story": 'Track pickup status: Given a matched donation, when a driver marks it "Picked Up," then the timestamp and driver ID are recorded and visible to the receiving food bank.',
        "tasks": [
            ("Build driver pickup endpoint and status update logic", "SIRAPASSORN POKASERMSONG", 4, [0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0]),
            ("Update food bank view to display pickup details", "PRATANIN KAHTEPMUD", 2, [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0]),
            ("QA test pickup status transition and notifications", "SAKKARAJ TUVAJIT", 2, [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0]),
        ],
    },
    {
        "id": "US2b",
        "story": 'Track delivery status with proof: Given a picked-up donation, when a driver marks it "Delivered," then a delivery timestamp and digital proof (photo or signature) are attached to the donation record.',
        "tasks": [
            ("Build delivery confirmation API with photo or signature attachment", "SIRAPASSORN POKASERMSONG", 10, [0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 4, 0, 0, 0, 0]),
            ("Render delivery proof & timestamp in food bank portal", "PRATANIN KAHTEPMUD", 6, [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0]),
            ("QA end-to-end delivery confirmation and proof upload", "SAKKARAJ TUVAJIT", 4, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0]),
        ],
    },
    {
        "id": "US5a",
        "story": 'Generate automatic digital donation receipt: Given a donation marked "Delivered," when delivery is confirmed, then a digital receipt with recorded weight, food type, and timestamp is auto generated and emailed to the donor.',
        "tasks": [
            ("Implement PDF receipt generation (weight, food type, timestamp) and email service", "JIRATHIWAT SUNTIPREEDATHAM", 3, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 0, 0]),
            ("QA test receipt content (weight, food type, timestamp) and email deliverability", "SAKKARAJ TUVAJIT", 2, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0]),
        ],
    },
    {
        "id": "US3a",
        "story": 'Check and flag expiry dates: Given a logged donation, when its expiry date is within 24 hours, then it is automatically flagged "urgent" in the matching queue.',
        "tasks": [
            ("Build expiry date monitor background job", "JIRATHIWAT SUNTIPREEDATHAM", 5, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 0, 0]),
            ("QA test urgent status flagging triggers", "SAKKARAJ TUVAJIT", 3, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0]),
        ],
    },
]


NAVY = "1F4E79"
BLUE = "2E75B6"
PALE = "D6EAF8"
GREEN = "C6EFCE"
GREEN_FONT = "006100"
WHITE = "FFFFFF"
THIN = Border(
    left=Side(style="thin", color="000000"),
    right=Side(style="thin", color="000000"),
    top=Side(style="thin", color="000000"),
    bottom=Side(style="thin", color="000000"),
)
CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)


def rows():
    for story in STORIES:
        for i, task in enumerate(story["tasks"]):
            yield story["id"] if i == 0 else "", story["story"] if i == 0 else "", task, len(story["tasks"]) if i == 0 else 0


def day_totals():
    totals = [0] * 15
    effort = 0
    for story in STORIES:
        for _name, _owner, est, hours in story["tasks"]:
            effort += est
            for i, value in enumerate(hours):
                totals[i] += value
    return effort, totals


def write_xlsx() -> Path:
    wb = Workbook()
    ws = wb.active
    ws.title = "Sprint 1 Backlog"

    ws.merge_cells("A1:U1")
    title = ws["A1"]
    title.value = "SPRINT 1 BACKLOG  —  CONCLUSION"
    title.font = Font(name="Calibri", size=16, bold=True, color=WHITE)
    title.fill = PatternFill("solid", fgColor=NAVY)
    title.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 28

    ws.merge_cells("A2:U2")
    banner = ws["A2"]
    banner.value = (
        "Team QWERTY  |  14–23 October 2026  |  7 of 7 Sprint 1 stories Done  |  "
        "Actual 114 / Planned 114 hours  |  Remaining 0  |  No carry-over to Sprint 2"
    )
    banner.font = Font(name="Calibri", size=10, bold=True, color=WHITE)
    banner.fill = PatternFill("solid", fgColor=BLUE)
    banner.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[2].height = 20

    headers = ["ID", "User Story", "Tasks", "Owner", "Status", "Estimated effort", *DAYS]
    header_fill = PatternFill("solid", fgColor=NAVY)
    header_font = Font(name="Calibri", size=8, bold=True, color=WHITE)
    for col, text in enumerate(headers, 1):
        cell = ws.cell(3, col, text)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = CENTER
        cell.border = THIN
    ws.row_dimensions[3].height = 22

    excel_row = 4
    story_fills = ["FFFFFF", "F2F2F2"]
    for story_index, story in enumerate(STORIES):
        fill = PatternFill("solid", fgColor=story_fills[story_index % 2])
        start = excel_row
        end = excel_row + len(story["tasks"]) - 1
        for name, owner, est, hours in story["tasks"]:
            values = [story["id"] if excel_row == start else "", story["story"] if excel_row == start else "", name, owner, "Done", est, *hours]
            for col, value in enumerate(values, 1):
                cell = ws.cell(excel_row, col, value)
                cell.border = THIN
                cell.alignment = CENTER if col not in (2, 3, 4) else LEFT
                cell.font = Font(name="Calibri", size=8)
                cell.fill = fill
                if col == 5:
                    cell.fill = PatternFill("solid", fgColor=GREEN)
                    cell.font = Font(name="Calibri", size=8, bold=True, color=GREEN_FONT)
            ws.row_dimensions[excel_row].height = 32
            excel_row += 1
        if end > start:
            ws.merge_cells(start_row=start, start_column=1, end_row=end, end_column=1)
            ws.merge_cells(start_row=start, start_column=2, end_row=end, end_column=2)
        ws.cell(start, 1).alignment = CENTER
        ws.cell(start, 2).alignment = LEFT

    effort, totals = day_totals()
    total_fill = PatternFill("solid", fgColor=BLUE)
    total_font = Font(name="Calibri", size=9, bold=True, color=WHITE)
    for col in range(1, 22):
        cell = ws.cell(excel_row, col, "")
        cell.fill = total_fill
        cell.font = total_font
        cell.alignment = CENTER
        cell.border = THIN
    ws.cell(excel_row, 5, "TOTAL")
    ws.cell(excel_row, 6, effort)
    for i, value in enumerate(totals, 7):
        ws.cell(excel_row, i, value)
    ws.row_dimensions[excel_row].height = 20

    note_row = excel_row + 2
    ws.merge_cells(start_row=note_row, start_column=1, end_row=note_row + 3, end_column=21)
    ws.cell(
        note_row,
        1,
        "Sprint 1 conclusion. Same W02 columns as the planning sheet (ID, User Story, Tasks, Owner, Status, "
        "Estimated effort, Day 1–15). Day cells are actual hours logged and match the Daily Scrum scripts: "
        "Meeting 3 = Day 2 (8h); Meeting 4 = Days 3–4 (22h); Meeting 5 = Days 5–8 (41h); Meeting 6 = Days 9–14 (39h); "
        "Day 1 (4h) is Meeting 2; Day 15 buffer is 0. Status is Done after Meeting 6 DoD. Remaining effort is 0. "
        "See sheet Standup map. This Done column is the Thursday 22 October result after Meeting 6. "
        "On Friday 16 October (Meeting 3) the live board is Day 2 only. "
        "Sprint 2 stories (US3b, US4a, US4b, US5b, US7, US8) stay on the product backlog.",
    )
    ws.cell(note_row, 1).alignment = LEFT
    ws.cell(note_row, 1).font = Font(name="Calibri", size=9)
    ws.row_dimensions[note_row].height = 18

    widths = [8, 36, 38, 22, 10, 12] + [6] * 15
    for i, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_margins = PageMargins(left=0.25, right=0.25, top=0.4, bottom=0.4)
    ws.print_title_rows = "1:3"
    ws.sheet_properties.pageSetUpPr.fitToPage = True

    write_standup_sheet(wb)

    path = ROOT / "sprint-1-backlog-conclusion.xlsx"
    wb.save(path)
    return path


STANDUP_ROWS = [
    ("Meeting", "When", "Script", "Hour-days", "Hours", "Accomplished in that window (board after the meeting)"),
    (
        "1",
        "Wed 14 Oct 2026",
        "sprint-1-scrum-meeting-1.pdf",
        "Kickoff. Day 1 starts after.",
        0,
        "Plans and risks for US1a. No build hours in the meeting.",
    ),
    (
        "2",
        "Template",
        "sprint-1-scrum-meeting-2.pdf",
        "Day 1",
        4,
        "Pratanin form 4 of 8h.",
    ),
    (
        "3",
        "Fri 16 Oct 2026",
        "sprint-1-scrum-meeting-3.md",
        "Day 2",
        8,
        "Form 8/8 In Review. Ingestion 4/8 In Progress. Sirapassorn 0. Sakkaraj 0.",
    ),
    (
        "4",
        "Mon 19 Oct 2026",
        "sprint-1-scrum-meeting-4.md",
        "Days 3–4",
        22,
        "Ingestion 8/8. US1a QA 4/4 In Review. Proximity 7/12. Capacity 3/8. Integrate 4/12. US6 still To-Do.",
    ),
    (
        "5",
        "Wed 21 Oct 2026",
        "sprint-1-scrum-meeting-5.md",
        "Days 5–8",
        41,
        "US1a Done. US1b 40/40. US6 13/13. US2a pickup 2/4 In Progress. Incoming, US2b, US5a, US3a To-Do.",
    ),
    (
        "6",
        "Thu 22 Oct 2026",
        "sprint-1-scrum-meeting-6.md",
        "Days 9–14 (Day 15 = 0)",
        39,
        "Finish US2a, US2b, US5a, US3a. All 7 Sprint 1 stories Done. Actual 114 / planned 114. Remaining 0.",
    ),
]


PERSON_HOURS = [
    ("Person", "M2 Day 1", "M3 Day 2", "M4 Days 3–4", "M5 Days 5–8", "M6 Days 9–14", "Sprint total"),
    ("Pratanin", 4, 4, 4, 13, 8, 33),
    ("Jirathiwat", 0, 4, 7, 10, 8, 29),
    ("Sirapassorn", 0, 0, 7, 7, 12, 26),
    ("Sakkaraj", 0, 0, 4, 11, 11, 26),
    ("TOTAL", 4, 8, 22, 41, 39, 114),
]


def write_standup_sheet(wb: Workbook) -> None:
    ws = wb.create_sheet("Standup map")
    ws.merge_cells("A1:F1")
    title = ws["A1"]
    title.value = "SPRINT 1  —  STANDUP MAP (W02 Day 1–15 aligned to Daily Scrum scripts)"
    title.font = Font(name="Calibri", size=14, bold=True, color=WHITE)
    title.fill = PatternFill("solid", fgColor=NAVY)
    title.alignment = Alignment(horizontal="center", vertical="center")
    ws.row_dimensions[1].height = 24

    header_fill = PatternFill("solid", fgColor=BLUE)
    header_font = Font(name="Calibri", size=9, bold=True, color=WHITE)
    for col, text in enumerate(STANDUP_ROWS[0], 1):
        cell = ws.cell(3, col, text)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = CENTER
        cell.border = THIN
    for r, row in enumerate(STANDUP_ROWS[1:], 4):
        for col, value in enumerate(row, 1):
            cell = ws.cell(r, col, value)
            cell.border = THIN
            cell.alignment = LEFT if col in (3, 4, 6) else CENTER
            cell.font = Font(name="Calibri", size=9)
            if r % 2 == 0:
                cell.fill = PatternFill("solid", fgColor=PALE)
        ws.row_dimensions[r].height = 36

    start = 12
    ws.merge_cells(start_row=start, start_column=1, end_row=start, end_column=7)
    ws.cell(start, 1, "Hours logged by person in each standup window (same cells as the W02 Day 1–15 table)")
    ws.cell(start, 1).font = Font(name="Calibri", size=11, bold=True, color=NAVY)
    for col, text in enumerate(PERSON_HOURS[0], 1):
        cell = ws.cell(start + 1, col, text)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = CENTER
        cell.border = THIN
    for r, row in enumerate(PERSON_HOURS[1:], start + 2):
        for col, value in enumerate(row, 1):
            cell = ws.cell(r, col, value)
            cell.border = THIN
            cell.alignment = CENTER
            cell.font = Font(name="Calibri", size=9, bold=True if row[0] == "TOTAL" else False)
            if row[0] == "TOTAL":
                cell.fill = PatternFill("solid", fgColor=BLUE)
                cell.font = Font(name="Calibri", size=9, bold=True, color=WHITE)

    note = start + 8
    ws.merge_cells(start_row=note, start_column=1, end_row=note + 2, end_column=7)
    ws.cell(
        note,
        1,
        "Today is Friday 16 October (Meeting 3): live board is Day 2 only. "
        "Meeting 4 must not say US6 is built (Days 6-8, Meeting 5). "
        "Meeting 5 must not say US2a incoming or US2b are finished (Days 9-11, Meeting 6). "
        "US1a moves to Done at Meeting 5. Remaining 0 only after Meeting 6 on Thursday 22 October. Friday 23 has no standup. "
        "Sprint 2 (US3b, US4a, US4b, US5b, US7, US8) is not Sprint 1 Done.",
    )
    ws.cell(note, 1).alignment = LEFT
    ws.cell(note, 1).font = Font(name="Calibri", size=9)

    widths = [12, 20, 32, 28, 10, 78, 14]
    for i, width in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_margins = PageMargins(left=0.25, right=0.25, top=0.4, bottom=0.4)


HEADERS = ["ID", "User Story", "Tasks", "Owner", "Status", "Estimated effort", *DAYS]


class ConclusionPdf(FPDF):
    def footer(self) -> None:
        self.set_y(-10)
        self.set_font("Helvetica", size=7)
        self.set_text_color(90, 90, 90)
        self.cell(0, 6, f"W02 Sprint Backlog template  |  Sprint 1 conclusion  |  page {self.page_no()}", align="C")


def write_pdf() -> Path:
    pdf = ConclusionPdf(orientation="L", format="A4")
    pdf.set_auto_page_break(auto=False)
    pdf.add_page()
    left = 6
    usable = pdf.w - 12
    col_w = [11, 46, 50, 30, 14, 16] + [7.05] * 15
    col_w = [w * (usable / sum(col_w)) for w in col_w]
    bottom = pdf.h - 12

    def draw_banner():
        pdf.set_xy(left, 7)
        pdf.set_fill_color(31, 78, 121)
        pdf.set_text_color(255, 255, 255)
        pdf.set_font("Helvetica", "B", 13)
        pdf.cell(usable, 8, "SPRINT 1 BACKLOG", align="C", fill=True)
        pdf.ln(8)
        pdf.set_x(left)
        pdf.set_fill_color(46, 117, 182)
        pdf.set_font("Helvetica", size=7.5)
        pdf.cell(
            usable,
            5.5,
            "Team QWERTY  |  Conclusion  |  14-23 October 2026  |  7 of 7 stories Done  |  Actual 114 / Planned 114 hours  |  Remaining 0  |  No Sprint 2 carry-over",
            align="C",
            fill=True,
        )
        pdf.ln(6)

    def measure(values, fonts, line_h=3.1) -> float:
        max_h = line_h + 1
        for i, text in enumerate(values):
            pdf.set_font(*fonts[i])
            lines = pdf.multi_cell(col_w[i] - 0.8, line_h, str(text), dry_run=True, output="LINES")
            max_h = max(max_h, line_h * max(len(lines), 1) + 1.0)
        return max_h

    def paint_row(values, fills, fonts, text_colors, min_h=7.0):
        height = max(min_h, measure(values, fonts))
        if pdf.get_y() + height > bottom:
            pdf.add_page()
            draw_banner()
            paint_row(HEADERS, [(31, 78, 121)] * 21, [("Helvetica", "B", 5.5)] * 21, [(255, 255, 255)] * 21, 8)
            height = max(min_h, measure(values, fonts))
        x0 = left
        y0 = pdf.get_y()
        for i, text in enumerate(values):
            x = x0 + sum(col_w[:i])
            pdf.set_fill_color(*fills[i])
            pdf.set_draw_color(0, 0, 0)
            pdf.rect(x, y0, col_w[i], height, style="DF")
            pdf.set_xy(x + 0.35, y0 + 0.35)
            pdf.set_text_color(*text_colors[i])
            pdf.set_font(*fonts[i])
            align = "C" if i not in (1, 2, 3) else "L"
            pdf.multi_cell(col_w[i] - 0.7, 3.1, str(text), align=align)
        pdf.set_y(y0 + height)

    draw_banner()
    navy = (31, 78, 121)
    white = (255, 255, 255)
    paint_row(HEADERS, [navy] * 21, [("Helvetica", "B", 5.5)] * 21, [white] * 21, 8)

    alt = [(255, 255, 255), (242, 242, 242)]
    black = (20, 20, 20)
    for story_index, story in enumerate(STORIES):
        bg = alt[story_index % 2]
        for i, (name, owner, est, hours) in enumerate(story["tasks"]):
            values = [story["id"] if i == 0 else "", story["story"] if i == 0 else "", name, owner, "Done", est, *hours]
            fills = [bg] * 21
            fills[4] = (198, 239, 206)
            fonts = [("Helvetica", "", 5.8)] * 21
            fonts[4] = ("Helvetica", "B", 6)
            colors = [black] * 21
            colors[4] = (0, 97, 0)
            paint_row(values, fills, fonts, colors, 8 if i == 0 else 6.5)

    effort, totals = day_totals()
    total_values = ["", "", "", "", "TOTAL", effort, *totals]
    blue = (46, 117, 182)
    paint_row(total_values, [blue] * 21, [("Helvetica", "B", 6.5)] * 21, [white] * 21, 7)

    if pdf.get_y() + 28 > bottom:
        pdf.add_page()
        draw_banner()
    pdf.ln(3)
    pdf.set_x(left)
    pdf.set_text_color(30, 30, 30)
    pdf.set_font("Helvetica", size=8)
    pdf.multi_cell(
        usable,
        4,
        "Conclusion: Sprint 1 is complete on the W02 sprint-backlog template. Every Sprint 1 task moved from To-Do to Done. "
        "Day 1-15 cells are actual hours and match the Daily Scrum scripts: Meeting 2 = Day 1 (4h); Meeting 3 = Day 2 (8h); "
        "Meeting 4 = Days 3-4 (22h); Meeting 5 = Days 5-8 (41h); Meeting 6 = Days 9-14 (39h); Day 15 buffer = 0. "
        "4+8+22+41+39+0 = 114. Meeting 4 does not close US6. Meeting 5 does not close US2a incoming or US2b. "
        "Remaining effort is 0 after Meeting 6 DoD on Thursday 22 October. Friday 23 has no standup. "
        "On Friday 16 October (Meeting 3) the live board is Day 2 only: do not present this Done column that day. "
        "Sprint 1 stories are US1a, US1b, US6, US2a, US2b, US5a, US3a. "
        "Sprint 2 stories (US3b, US4a, US4b, US5b, US7, US8) stay on the product backlog.",
    )

    pdf.add_page()
    draw_banner()
    pdf.set_x(left)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(31, 78, 121)
    pdf.cell(usable, 6, "Standup map  -  W02 Day 1-15 cells vs Daily Scrum scripts", align="L")
    pdf.ln(8)

    map_w = [14, 36, 42, 16, usable - 108]
    map_headers = ["Mtg", "When", "Hour-days", "Hours", "Accomplished (board after the meeting)"]
    map_rows = [
        ["1", "Wed 14 Oct", "Kickoff (Day 1 after)", "0", "Plans and risks. No build hours in the meeting."],
        ["2", "Template", "Day 1", "4", "Pratanin form 4 of 8h."],
        ["3", "Fri 16 Oct", "Day 2", "8", "Form 8/8 In Review. Ingestion 4/8 In Progress. Sirapassorn 0. Sakkaraj 0."],
        ["4", "Mon 19 Oct", "Days 3-4", "22", "Ingestion 8/8. US1a QA 4/4 In Review. Proximity 7/12. Capacity 3/8. Integrate 4/12. US6 To-Do."],
        ["5", "Wed 21 Oct", "Days 5-8", "41", "US1a Done. US1b 40/40. US6 13/13. US2a pickup 2/4 In Progress. Incoming, US2b, US5a, US3a To-Do."],
        ["6", "Thu 22 Oct", "Days 9-14 (Fri 23 = 0)", "39", "Finish US2a, US2b, US5a, US3a. 7 of 7 Done. Actual 114 / planned 114. Remaining 0. No Friday standup."],
    ]

    def paint_map(values, fills, fonts, colors, min_h=8.0):
        pdf.set_font("Helvetica", size=7)
        heights = []
        for i, text in enumerate(values):
            pdf.set_font(*fonts[i])
            lines = pdf.multi_cell(map_w[i] - 0.8, 3.2, str(text), dry_run=True, output="LINES")
            heights.append(3.2 * max(len(lines), 1) + 1.2)
        height = max(min_h, max(heights))
        x0 = left
        y0 = pdf.get_y()
        for i, text in enumerate(values):
            x = x0 + sum(map_w[:i])
            pdf.set_fill_color(*fills[i])
            pdf.set_draw_color(0, 0, 0)
            pdf.rect(x, y0, map_w[i], height, style="DF")
            pdf.set_xy(x + 0.4, y0 + 0.4)
            pdf.set_text_color(*colors[i])
            pdf.set_font(*fonts[i])
            pdf.multi_cell(map_w[i] - 0.8, 3.2, str(text), align="C" if i != 4 else "L")
        pdf.set_y(y0 + height)

    navy = (31, 78, 121)
    white = (255, 255, 255)
    black = (20, 20, 20)
    paint_map(map_headers, [navy] * 5, [("Helvetica", "B", 7)] * 5, [white] * 5, 8)
    pale_rows = [(255, 255, 255), (214, 234, 248)]
    for i, row in enumerate(map_rows):
        bg = pale_rows[i % 2]
        paint_map(row, [bg] * 5, [("Helvetica", "", 7)] * 5, [black] * 5, 10)

    pdf.ln(6)
    pdf.set_x(left)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(31, 78, 121)
    pdf.cell(usable, 6, "Hours by person in each standup window", align="L")
    pdf.ln(8)
    person_headers = ["Person", "M2 Day 1", "M3 Day 2", "M4 Days 3-4", "M5 Days 5-8", "M6 Days 9-14", "Total"]
    person_w = [40, 28, 28, 36, 36, 40, 28]
    person_w = [w * (usable / sum(person_w)) for w in person_w]

    def paint_person(values, fill, font, color, min_h=7.0):
        x0 = left
        y0 = pdf.get_y()
        height = min_h
        for i, text in enumerate(values):
            x = x0 + sum(person_w[:i])
            pdf.set_fill_color(*fill)
            pdf.rect(x, y0, person_w[i], height, style="DF")
            pdf.set_xy(x, y0 + 1.5)
            pdf.set_text_color(*color)
            pdf.set_font(*font)
            pdf.cell(person_w[i], 4, str(text), align="C")
        pdf.set_y(y0 + height)

    paint_person(person_headers, navy, ("Helvetica", "B", 7.5), white)
    person_data = [
        ["Pratanin", "4", "4", "4", "13", "8", "33"],
        ["Jirathiwat", "0", "4", "7", "10", "8", "29"],
        ["Sirapassorn", "0", "0", "7", "7", "12", "26"],
        ["Sakkaraj", "0", "0", "4", "11", "11", "26"],
        ["TOTAL", "4", "8", "22", "41", "39", "114"],
    ]
    for i, row in enumerate(person_data):
        if row[0] == "TOTAL":
            paint_person(row, (46, 117, 182), ("Helvetica", "B", 7.5), white)
        else:
            paint_person(row, pale_rows[i % 2], ("Helvetica", "", 7.5), black)

    path = ROOT / "sprint-1-backlog-conclusion.pdf"
    pdf.output(path)
    return path


if __name__ == "__main__":
    xlsx = write_xlsx()
    pdf = write_pdf()
    effort, totals = day_totals()
    print(xlsx)
    print(pdf)
    print("effort", effort, "days", totals, "sum", sum(totals))
