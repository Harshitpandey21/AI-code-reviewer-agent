import streamlit as st
import difflib
import zipfile, io

from graph.graph_builder import Final as SingleFileGraph
from project_graph.graph_builder import FinalProjectGraph

st.set_page_config(page_title="AI Agent Studio", layout="wide")
st.title("🧠 AI Agent Studio")

# -------------------------------------------------
# Utility Functions
# -------------------------------------------------

def detect_language(filename):
    ext = filename.split(".")[-1].lower()
    mapping = {
        "py":"python","js":"javascript","ts":"typescript","java":"java",
        "cpp":"cpp","c":"c","cs":"csharp","go":"go","rb":"ruby",
        "php":"php","html":"html","css":"css"
    }
    return mapping.get(ext,"text")


def generate_diff_html(original, refactored):
    differ = difflib.HtmlDiff(wrapcolumn=80)
    html = differ.make_file(
        original.splitlines(),
        refactored.splitlines(),
        "Original Code",
        "Refactored Code"
    )

    custom_css = """
    <style>
        table.diff { font-family: monospace; font-size: 14px; }
        .diff_add { background-color: #a6f3a6 !important; }
        .diff_sub { background-color: #f7b5b5 !important; }
        .diff_chg { background-color: #ffe066 !important; }
        .diff_header { background-color: #262730 !important; color: white !important; }
    </style>
    """
    return custom_css + html


# -------------------------------------------------
# Mode Selector
# -------------------------------------------------

mode = st.radio(
    "Select Mode",
    ["Single File Code Review", "Full Project Intelligence"],
    horizontal=True
)

# =================================================
# MODE 1 — SINGLE FILE CODE REVIEW
# =================================================

if mode == "Single File Code Review":

    st.subheader("📄 Single File Reviewer")

    uploaded = st.file_uploader(
        "Upload any source code file",
        key="single_file_uploader"
    )

    if uploaded:
        raw_code = uploaded.read().decode("utf-8", errors="ignore")
        language = detect_language(uploaded.name)

        if st.button("Run Code Review", key="run_single"):

            with st.spinner("Reviewing code..."):
                state = {"raw_code": raw_code, "language": language}
                result = SingleFileGraph.invoke(state)

                st.session_state.single_result = result
                st.session_state.single_original = raw_code
                st.session_state.single_language = language

    if "single_result" in st.session_state:
        r = st.session_state.single_result

        st.divider()
        st.subheader("📋 Review Report")
        st.markdown(r["review_report"])

        st.subheader("🧪 Test Suggestions")
        st.markdown(r["test_report"])

        st.subheader("🛠️ Refactored Code")
        st.code(r["refactored_code"], language=st.session_state.single_language)

        st.subheader("🔍 Code Diff")
        diff_html = generate_diff_html(
            st.session_state.single_original,
            r["refactored_code"]
        )
        st.components.v1.html(diff_html, height=600, scrolling=True)


# =================================================
# MODE 2 — FULL PROJECT INTELLIGENCE (ZIP)
# =================================================

if mode == "Full Project Intelligence":

    st.subheader("📂 Full Project Intelligence")

    uploaded_zip = st.file_uploader(
        "Upload Project as ZIP",
        type=["zip"],
        key="project_zip_uploader"
    )

    if uploaded_zip:

        with st.spinner("Extracting ZIP..."):

            zip_bytes = io.BytesIO(uploaded_zip.read())

            with zipfile.ZipFile(zip_bytes) as z:
                project_files = {
                    name: z.read(name).decode("utf-8", errors="ignore")
                    for name in z.namelist()
                    if not name.endswith("/")
                }

        st.success(f"Loaded {len(project_files)} files")

        action = st.selectbox(
            "Select Action",
            ["Project Review", "Project Explanation", "Interview Questions"],
            key="project_action"
        )

        if st.button("Run Project Agent", key="run_project"):

            with st.spinner("Analyzing project..."):

                request_map = {
                    "Project Review": "PROJECT_REVIEW",
                    "Project Explanation": "PROJECT_EXPLAIN",
                    "Interview Questions": "INTERVIEW"
                }

                state = {
                    "project_files": project_files,
                    "user_request": request_map[action]
                }

                result = FinalProjectGraph.invoke(state)
                st.session_state.project_result = result

    if "project_result" in st.session_state:
        r = st.session_state.project_result

        st.divider()

        if r.get("review_report"):
            st.subheader("📋 Project Review Report")
            st.markdown(r["review_report"])

        if r.get("project_explanation"):
            st.subheader("📘 Project Explanation")
            st.markdown(r["project_explanation"])

        if r.get("interview_questions"):
            st.subheader("🎯 Interview Questions")
            st.markdown(r["interview_questions"])
