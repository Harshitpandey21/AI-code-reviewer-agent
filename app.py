import streamlit as st
from graph.graph_builder import Final
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from io import BytesIO
import difflib

def generate_pdf(review_report, test_report, refactored_code):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("AI Code Review Report", styles["Title"]))
    story.append(Spacer(1, 20))

    story.append(Paragraph("Review Report", styles["Heading2"]))
    story.append(Paragraph(review_report.replace("\n", "<br/>"), styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("Test Report", styles["Heading2"]))
    story.append(Paragraph(test_report.replace("\n", "<br/>"), styles["Normal"]))
    story.append(Spacer(1, 15))

    story.append(Paragraph("Final Refactored Code", styles["Heading2"]))
    story.append(Paragraph(
        refactored_code.replace("&","&amp;")
        .replace("<","&lt;")
        .replace(">","&gt;")
        .replace("\n","<br/>"),
        styles["Code"]
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer

st.set_page_config(
    page_title="AI Code Review Platform",
    page_icon="🧠",
    layout="wide"
)

st.markdown("""
<style>
body { background-color: #0e1117; }
.main-title {
    font-size: 38px;
    font-weight: 700;
}
.section-card {
    background-color: #161b22;
    padding: 20px;
    border-radius: 12px;
    margin-bottom: 20px;
}
</style>
""", unsafe_allow_html=True)

if "CodeState" not in st.session_state:
    st.session_state.CodeState = None

if "result" not in st.session_state:
    st.session_state.result = None

if "page" not in st.session_state:
    st.session_state.page = "Upload Code"

pages = ["Upload Code", "Review Results", "Final Approval"]
st.sidebar.markdown("## **🧠 AI Code Reviewer + Refactor Agent**")
page = st.sidebar.radio(
    "Features",
    pages,
    index=pages.index(st.session_state.page)
)
st.session_state.page = page
st.sidebar.markdown("---")
st.sidebar.markdown("## **Feel free to use and test it 😜** ")
if page == "Upload Code":

    st.markdown("<div class='main-title'>AI Code Review Platform</div>", unsafe_allow_html=True)
    st.caption("Upload your code and let the AI agent review, test and refactor it.")

    uploaded_file = st.file_uploader(
        "Upload source code",
        type=["py","js","ts","java","cpp","c","cs","go","rs","php","html"]
    )

    if uploaded_file:
        raw_code = uploaded_file.read().decode("utf-8")
        filename = uploaded_file.name
        ext = filename.split(".")[-1]

        language_map = {
            "py": "python","js": "javascript","ts": "typescript","java": "java",
            "cpp": "c++","c": "c","cs": "c#","go": "go",
            "rs": "rust","php": "php","html": "html"
        }

        language = language_map.get(ext, "text")

        st.session_state.CodeState = {
            "raw_code": raw_code,
            "language": language
        }

        st.success("File loaded successfully")
        st.code(raw_code, language=language)

        if st.button("🚀 Run AI Review", use_container_width=True):
            with st.spinner("AI Agent is analyzing code..."):
                result = Final.invoke(st.session_state.CodeState)

            st.session_state.result = result
            st.session_state.page = "Review Results"
            st.rerun()

if page == "Review Results":

    if not st.session_state.result:
        st.warning("No review result available. Run the agent first.")
        st.stop()

    result = st.session_state.result
    raw_code = st.session_state.CodeState["raw_code"]
    language = st.session_state.CodeState["language"]

    st.markdown("<div class='main-title'>Review Results</div>", unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown("<div class='section-card'>", unsafe_allow_html=True)
        st.subheader("📋 Review Report")
        st.write(result["review_code"])
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown("<div class='section-card'>", unsafe_allow_html=True)
        st.subheader("🧪 Test Report")
        st.write(result["test_report"])
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown("<div class='section-card'>", unsafe_allow_html=True)
    st.subheader("🛠️ Refactored Code")
    st.code(result["refactored_code"], language=language)
    st.markdown("</div>", unsafe_allow_html=True)
    st.markdown("<div class='section-card'>", unsafe_allow_html=True)
    st.subheader("🔀 Code Difference (Original Vs Refactored)")

    diff = difflib.unified_diff(
      raw_code.splitlines(),
      result["refactored_code"].splitlines(),
      fromfile="Original",
      tofile="Refactored",
      lineterm=""
    )

    st.code("\n".join(diff), language="diff")

    st.markdown("</div>", unsafe_allow_html=True)

    pdf_buffer = generate_pdf(
        result["review_code"],
        result["test_report"],
        result["refactored_code"]
    )

    st.download_button(
        "📄 Download Full Report (PDF)",
        data=pdf_buffer,
        file_name="code_review_report.pdf",
        mime="application/pdf",
        use_container_width=True
    )

if page == "Final Approval":

    if not st.session_state.result:
        st.warning("No review result available.")
        st.stop()

    result = st.session_state.result
    language = st.session_state.CodeState["language"]

    st.markdown("<div class='main-title'>Final Approval</div>", unsafe_allow_html=True)
    st.caption("Approve or reject and re-run improvement cycle.")

    col1, col2 = st.columns(2)

    with col1:
        if st.button("✅ Approve Final Code", use_container_width=True):
            st.success("Final Approved Code")
            st.code(result["refactored_code"], language=language)

    with col2:
        if st.button("❌ Reject & Improve Again", use_container_width=True):

           st.session_state.CodeState["raw_code"] = result["refactored_code"]
 
           with st.spinner("Re-running AI Agent on improved code..."):
              new_result = Final.invoke(st.session_state.CodeState)

           st.session_state.result = new_result

           st.success("New review generated. Go to 'Review Results' to see updated reports.")
