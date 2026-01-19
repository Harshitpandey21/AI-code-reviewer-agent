import streamlit as st
from graph.graph_builder import Final

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

        col1, col2 = st.columns(2)

        with col1:
            if st.button("✅ Approve"):
                st.success("Final Approved Code:")
                st.code(result["refactored_code"],language=st.session_state.CodeState["language"])

        with col2:
            if st.button("❌ Reject and Improve Again"):
                # Feed refactored code back as new raw_code
                st.session_state.CodeState["raw_code"] = result["refactored_code"]
                del st.session_state.result
                st.experimental_rerun()

