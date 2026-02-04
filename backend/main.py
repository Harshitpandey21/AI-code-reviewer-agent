from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import zipfile, io
from utils.project_pdf_generator import generate_project_pdf
from graph.graph_builder import Final as SingleFileGraph
from project_graph.graph_builder import FinalProjectGraph
from utils.pdf_generator import generate_single_review_pdf

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

    return {
        "review_code": graph_state.get("review_code", ""),
        "refactored_code": graph_state.get("refactored_code", ""),
        "test_report": graph_state.get("test_report", "")
    }


@app.post("/single-review/pdf")
async def single_review_pdf(file: UploadFile = File(...)):
    raw_code = (await file.read()).decode("utf-8", errors="ignore")

    state = {
        "raw_code": raw_code,
        "language": "python"
    }

    graph_state = SingleFileGraph.invoke(state)

    pdf_path = generate_single_review_pdf(
        graph_state.get("review_code", ""),
        graph_state.get("test_report", ""),
        graph_state.get("refactored_code", "")
    )

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="AI_Code_Review_Report.pdf"
    )

@app.post("/project-review")
async def project_review(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    zip_bytes = io.BytesIO(await file.read())

    with zipfile.ZipFile(zip_bytes) as z:
        project_files = {
            name: z.read(name).decode("utf-8", errors="ignore")
            for name in z.namelist()
            if not name.endswith("/")
        }

    state = {
        "project_files": project_files,
        "user_request": action
    }

    graph_state = FinalProjectGraph.invoke(state)

    if action == "PROJECT_REVIEW":
        return {"review_report": graph_state.get("review_report", "")}

    if action == "PROJECT_EXPLAIN":
        return {"project_explanation": graph_state.get("project_explanation", "")}

    if action == "INTERVIEW":
        return {"interview_questions": graph_state.get("interview_questions", "")}

    return {"error": "Invalid action"}

@app.post("/project-review/pdf")
async def project_review_pdf(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    zip_bytes = io.BytesIO(await file.read())

    with zipfile.ZipFile(zip_bytes) as z:
        project_files = {
            name: z.read(name).decode("utf-8", errors="ignore")
            for name in z.namelist()
            if not name.endswith("/")
        }

    state = {
        "project_files": project_files,
        "user_request": action
    }

    graph_state = FinalProjectGraph.invoke(state)

    if action == "PROJECT_REVIEW":
        title = "AI Project Review Report"
        content = graph_state.get("review_report", "")

    elif action == "PROJECT_EXPLAIN":
        title = "AI Architecture Explanation"
        content = graph_state.get("project_explanation", "")

    elif action == "INTERVIEW":
        title = "AI Interview Questions"
        content = graph_state.get("interview_questions", "")

    else:
        return {"error": "Invalid action"}

    pdf_path = generate_project_pdf(title, content)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{title.replace(' ', '_')}.pdf"
    )

