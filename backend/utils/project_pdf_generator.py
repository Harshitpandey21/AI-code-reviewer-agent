from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Preformatted
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from xml.sax.saxutils import escape
import uuid, os

def generate_project_pdf(title: str, content: str) -> str:
    filename = f"project_report_{uuid.uuid4().hex}.pdf"
    path = os.path.join(os.getcwd(), filename)

    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    code_style = ParagraphStyle(
        "CodeStyle",
        fontName="Courier",
        fontSize=9,
        leading=12
    )

    story = []

    # Title
    story.append(Paragraph(escape(title), styles["Title"]))
    story.append(Spacer(1, 0.3 * inch))

    # IMPORTANT: use Preformatted
    safe_text = escape(content)

    story.append(Preformatted(safe_text, code_style))

    doc.build(story)

    # HARD CHECK
    if not os.path.exists(path) or os.path.getsize(path) < 1000:
        raise RuntimeError("PDF generation failed")

    return path
