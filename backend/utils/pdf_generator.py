from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Preformatted,
    PageBreak
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
import uuid
import os

def generate_single_review_pdf(review, tests, refactored):
    filename = f"single_review_{uuid.uuid4().hex}.pdf" # single review
    path = f"/tmp/{filename}" # path

    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    ) # Template for Pdf

    styles = getSampleStyleSheet()

    title = ParagraphStyle(
        "Title",
        fontSize=18,
        spaceAfter=20,
        alignment=1
    ) # Title

    header = ParagraphStyle(
        "Header",
        fontSize=14,
        spaceBefore=20,
        spaceAfter=10
    ) # Header

    body = ParagraphStyle(
        "Body",
        fontSize=10,
        leading=14
    ) # Body

    code = ParagraphStyle(
        "Code",
        fontName="Courier",
        fontSize=9,
        leading=12
    ) # Code

    content = []

    content.append(Paragraph("AI Code Review Report", title))
    content.append(Spacer(1, 12))

    content.append(Paragraph("Review Report", header))
    for para in review.split("\n\n"):
        content.append(Paragraph(para.replace("&", "&amp;"), body))
        content.append(Spacer(1, 6))

    content.append(PageBreak())

    content.append(Paragraph("Test Suggestions", header))
    for para in tests.split("\n\n"):
        content.append(Paragraph(para.replace("&", "&amp;"), body))
        content.append(Spacer(1, 6))

    content.append(PageBreak())

    content.append(Paragraph("Refactored Code", header))
    content.append(
        Preformatted(
            refactored,
            style=code,
            maxLineLength=100
        )
    )

    doc.build(content)
    return path # return path
