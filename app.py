import streamlit as st
from graph.graph_builder import Final
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO

def generate_pdf(review_report, test_report, refactored_code):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("AI Code Review Report", styles["Title"]))
    story.append(Spacer(1, 20))

    story.append(Paragraph("Review Report:", styles["Heading2"]))
    story.append(Paragraph(review_report.replace("\n", "<br/>"), styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("Test Report:", styles["Heading2"]))
    story.append(Paragraph(test_report.replace("\n", "<br/>"), styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("Final Refactored Code:", styles["Heading2"]))
    story.append(Paragraph(
        refactored_code.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("\n","<br/>"),
        styles["Code"]
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer

st.set_page_config(page_title="AI Code Reviewer Agent", layout="wide")

st.title("🧠 AI Code Reviewer + Refactor Agent")

uploaded_file = st.file_uploader(
    "Upload code file",
    type=["py","js","ts","java","cpp","c","cs","go","rs","php","html"]
)

if uploaded_file:
    raw_code = uploaded_file.read().decode("utf-8")
    filename = uploaded_file.name

    ext = filename.split(".")[-1]

    language_map = {
        "py": "python",
        "js": "javascript",
        "ts": "typescript",
        "java": "java",
        "cpp": "c++",
        "c": "c",
        "cs": "c#",
        "go": "go",
        "rs": "rust",
        "php": "php",
        "html": "html"
    }

    language = language_map.get(ext, "unknown")

    if "state" not in st.session_state:
        st.session_state.CodeState = {
            "raw_code": raw_code,
            "language": language
        }

    if st.button("Run Code Review Agent"):
        with st.spinner("Agent is reviewing code..."):
            result = Final.invoke(st.session_state.CodeState)
            st.session_state.result = result

    if "result" in st.session_state:
        result = st.session_state.result

        st.subheader("📋 Review Report")
        st.text(result["review_code"])

        st.subheader("🧪 Test Report")
        st.text(result["test_report"])

        st.subheader("🛠️ Refactored Code")
        st.code(result["refactored_code"], language=st.session_state.CodeState["language"])

        pdf_buffer = generate_pdf(
           result["review_code"],
           result["test_report"],
           result["refactored_code"]
        )

        st.download_button(
          label="📄 Download Full Report as PDF",
          data=pdf_buffer,
          file_name="code_report.pdf",
          mime="application/pdf"
        )


        col1, col2 = st.columns(2)

        with col1:
            if st.button("✅ Approve"):
                st.success("Final Approved Code:")
                st.code(result["refactored_code"],language=st.session_state.CodeState["language"])

        with col2:
            if st.button("❌ Reject and Improve Again"):
                st.session_state.CodeState["raw_code"] = result["refactored_code"]
                del st.session_state.result
                st.experimental_rerun()

