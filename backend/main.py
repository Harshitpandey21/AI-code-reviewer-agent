from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import zipfile, io

from graph.graph_builder import Final as SingleFileGraph
from project_graph.graph_builder import FinalProjectGraph

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/single-review")
async def single_review(file: UploadFile = File(...)):
    raw_code = (await file.read()).decode("utf-8", errors="ignore")

    state = {
        "raw_code": raw_code,
        "language": "python"
    }

    graph_state = SingleFileGraph.invoke(state)

    # Enforce output contract
    return {
        "review_report": graph_state.get("review_report", ""),
        "refactored_code": graph_state.get("refactored_code", ""),
        "test_report": graph_state.get("test_report", "")
    }


# ------------------------
# FULL PROJECT INTELLIGENCE
# ------------------------
@app.post("/project-review")
async def project_review(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    # Read ZIP
    zip_bytes = io.BytesIO(await file.read())

    with zipfile.ZipFile(zip_bytes) as z:
        project_files = {
            name: z.read(name).decode("utf-8", errors="ignore")
            for name in z.namelist()
            if not name.endswith("/")
        }

    # Build graph state
    state = {
        "project_files": project_files,
        "user_request": action
    }

    graph_state = FinalProjectGraph.invoke(state)

    # ---- Strict output mapping ----
    # LangGraph returns final state dictionary.
    # Each node must write its result into state.

    response = {}

    if action == "PROJECT_REVIEW":
        response["review_report"] = graph_state.get("review_report", "")

    elif action == "PROJECT_EXPLAIN":
        response["project_explanation"] = graph_state.get("project_explanation", "")

    elif action == "INTERVIEW":
        response["interview_questions"] = graph_state.get("interview_questions", "")

    else:
        response["error"] = "Invalid action"

    return response
