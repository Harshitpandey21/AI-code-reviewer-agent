from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import zipfile
import io
import json
from utils.project_pdf_generator import generate_project_pdf
from graph.graph_builder import Final as SingleFileGraph
from project_graph.graph_builder import FinalProjectGraph
from utils.pdf_generator import generate_single_review_pdf
from graph.nodes import stream_single_file_pipeline
from project_graph.nodes import stream_project_pipeline

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/single-review-stream")
async def single_review_stream(file: UploadFile = File(...)):
    raw_code = (await file.read()).decode("utf-8", errors="ignore")
    state = {
        "raw_code": raw_code,
        "language": "python, go, html, css, java"
    }
    def event_generator():
        try:
            for event in stream_single_file_pipeline(state):
                yield json.dumps(event, ensure_ascii=False) + "\n"
        except Exception as e:
            yield json.dumps({
                "type": "error",
                "message": str(e)
            }, ensure_ascii=False) + "\n"
    return StreamingResponse(
        event_generator(),
        media_type="text/plain"
    )

@app.post("/single-review")
async def single_review(file: UploadFile = File(...)):
    raw_code = (await file.read()).decode("utf-8", errors="ignore")
    state = {
        "raw_code": raw_code,
        "language": "python, go, html, css, java"
    }
    graph_state = SingleFileGraph.invoke(state)
    return {
        "review_code": graph_state.get("review_code"),
        "refactored_code": graph_state.get("refactored_code"),
        "test_report": graph_state.get("test_report")
    }

@app.post("/single-review/pdf")
async def single_review_pdf(file: UploadFile = File(...)):
    raw_code = (await file.read()).decode("utf-8", errors="ignore")
    state = {
        "raw_code": raw_code,
        "language": "python, go, html, css, java"
    }
    graph_state = SingleFileGraph.invoke(state)
    pdf_path = generate_single_review_pdf(
        graph_state.get("review_code"),
        graph_state.get("test_report"),
        graph_state.get("refactored_code")
    )
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="AI_Single_Code_Review_Report.pdf"
    )

@app.post("/project-review-stream")
async def project_review_stream(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    try:
        zip_bytes = io.BytesIO(await file.read())

        with zipfile.ZipFile(zip_bytes) as f:
            project_files = {
                name: f.read(name).decode("utf-8", errors="ignore")
                for name in f.namelist()
                if not name.endswith("/")
            }
        state = {
            "project_files": project_files,
            "user_request": action
        }
        def event_generator():
            try:
                for event in stream_project_pipeline(state):
                    yield json.dumps(event, ensure_ascii=False) + "\n"
            except Exception as e:
                yield json.dumps({
                    "type": "error",
                    "message": str(e)
                }, ensure_ascii=False) + "\n"
        return StreamingResponse(
            event_generator(),
            media_type="text/plain"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/project-review")
async def project_review(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    try:
        zip_bytes = io.BytesIO(await file.read())

        with zipfile.ZipFile(zip_bytes) as f:
            project_files = {
                name: f.read(name).decode("utf-8", errors="ignore")
                for name in f.namelist()
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

        if action == "DOCUMENTATION":
            return {"documentation": graph_state.get("documentation_generation", "")}

        raise HTTPException(status_code=400, detail="Invalid action")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/project-review/pdf")
async def project_review_pdf(
    file: UploadFile = File(...),
    action: str = Form(...)
):
    zip_bytes = io.BytesIO(await file.read())

    with zipfile.ZipFile(zip_bytes) as f:
        project_files = {
            name: f.read(name).decode("utf-8", errors="ignore")
            for name in f.namelist()
            if not name.endswith("/")
        }
    state = {
        "project_files": project_files,
        "user_request": action
    }
    graph_state = FinalProjectGraph.invoke(state)

    if action == "PROJECT_REVIEW":
        Name = "AI Project Review Report"
        content = graph_state.get("review_report", "")

    elif action == "PROJECT_EXPLAIN":
        Name = "AI Project Explanation"
        content = graph_state.get("project_explanation", "")

    elif action == "INTERVIEW":
        Name = "AI Interview Questions"
        content = graph_state.get("interview_questions", "")

    elif action == "DOCUMENTATION":
        Name = "README FILE"
        content = graph_state.get("documentation_generation", "")

    else:
        raise HTTPException(status_code=400, detail="Invalid action")

    pdf_path = generate_project_pdf(Name, content)
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"{Name.replace(' ', '_')}.pdf"
    )