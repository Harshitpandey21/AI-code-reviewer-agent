from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
import asyncio
import io
import json
import os
import traceback
import zipfile
from typing import Dict
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

ALLOWED_ACTIONS = {
    "PROJECT_REVIEW": ("AI Project Review Report", "review_report"),
    "PROJECT_EXPLAIN": ("AI Project Explanation", "project_explanation"),
    "INTERVIEW": ("AI Interview Questions", "interview_questions"),
    "DOCUMENTATION": ("AI Project Documentation", "documentation_generation"),
}

TEXT_FILE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx",
    ".java", ".go", ".rs", ".cpp", ".c", ".h", ".hpp",
    ".html", ".css", ".scss",
    ".json", ".md", ".txt", ".yml", ".yaml", ".toml", ".xml",
    ".sh", ".env", ".sql"
}

def is_text_file(filename: str) -> bool:
    lower = filename.lower()
    return any(lower.endswith(ext) for ext in TEXT_FILE_EXTENSIONS)

def extract_project_files_from_zip(zip_content: bytes) -> Dict[str, str]:
    if not zip_content:
        raise HTTPException(status_code=400, detail="Uploaded ZIP file is empty")

    zip_buffer = io.BytesIO(zip_content)

    if not zipfile.is_zipfile(zip_buffer):
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid ZIP archive")

    zip_buffer.seek(0)
    extracted_files: Dict[str, str] = {}

    with zipfile.ZipFile(zip_buffer, "r") as zip_file:
        for name in zip_file.namelist():
            if name.endswith("/"):
                continue
            lower_name = name.lower()
            if "__pycache__" in lower_name or "/.git/" in lower_name or "node_modules/" in lower_name:
                continue

            if not is_text_file(name):
                continue

            try:
                content = zip_file.read(name).decode("utf-8", errors="ignore")
                if content.strip():
                    extracted_files[name] = content
            except Exception:
                continue

    if not extracted_files:
        raise HTTPException(
            status_code=400,
            detail="No supported code files were found inside the ZIP archive",
        )

    return extracted_files

def validate_graph_output(graph_state, required_key: str) -> str:
    if not isinstance(graph_state, dict):
        raise RuntimeError(
            f"Graph returned invalid type: {type(graph_state).__name__}. Expected dict."
        )

    content = graph_state.get(required_key)

    if not isinstance(content, str) or not content.strip():
        raise RuntimeError(f"Missing or invalid graph output for key: '{required_key}'")

    return content

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/single-review-stream")
async def single_review_stream(file: UploadFile = File(...)):
    raw_bytes = await file.read()
    if not raw_bytes:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    raw_code = raw_bytes.decode("utf-8", errors="ignore")

    state = {
        "raw_code": raw_code,
        "language": "python, go, html, css, java, javascript, typescript, rust, c, cpp"
    }

    def event_generator():
        try:
            for event in stream_single_file_pipeline(state):
                yield json.dumps(event, ensure_ascii=False) + "\n"
        except Exception as e:
            traceback.print_exc()
            yield json.dumps(
                {
                    "type": "error",
                    "message": f"{type(e).__name__}: {str(e)}",
                },
                ensure_ascii=False,
            ) + "\n"

    return StreamingResponse(event_generator(), media_type="text/plain")

@app.post("/single-review/pdf")
async def single_review_pdf(file: UploadFile = File(...)):
    try:
        raw_bytes = await file.read()
        if not raw_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        raw_code = raw_bytes.decode("utf-8", errors="ignore")

        state = {
            "raw_code": raw_code,
            "language": "python, go, html, css, java, javascript, typescript, rust, c, cpp"
        }

        graph_state = await asyncio.to_thread(SingleFileGraph.invoke, state)

        if not isinstance(graph_state, dict):
            raise RuntimeError(
                f"SingleFileGraph returned invalid type: {type(graph_state).__name__}"
            )

        review_code = graph_state.get("review_code")
        test_report = graph_state.get("test_report")
        refactored_code = graph_state.get("refactored_code")

        if not isinstance(review_code, str):
            raise RuntimeError("Missing or invalid 'review_code'")
        if not isinstance(test_report, str):
            raise RuntimeError("Missing or invalid 'test_report'")
        if not isinstance(refactored_code, str):
            raise RuntimeError("Missing or invalid 'refactored_code'")

        pdf_path = await asyncio.to_thread(
            generate_single_review_pdf,
            review_code,
            test_report,
            refactored_code,
        )
        if not pdf_path or not os.path.exists(pdf_path):
            raise RuntimeError("Single review PDF file was not created")

        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename="AI_Single_Code_Review_Report.pdf",
        )

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

@app.post("/project-review-stream")
async def project_review_stream(
    file: UploadFile = File(...),
    action: str = Form(...),):
    try:
        if action not in ALLOWED_ACTIONS:
            raise HTTPException(status_code=400, detail="Invalid action")

        zip_bytes = await file.read()
        project_files = extract_project_files_from_zip(zip_bytes)

        state = {
            "project_files": project_files,
            "user_request": action,
        }
        async def event_generator():
            try:
                async for event in stream_project_pipeline(state):
                    yield json.dumps(event, ensure_ascii=False) + "\n"
            except Exception as e:
                traceback.print_exc()
                yield json.dumps(
                    {
                        "type": "error",
                        "message": f"{type(e).__name__}: {str(e)}"
                    },
                    ensure_ascii=False,
                ) + "\n"
        return StreamingResponse(
            event_generator(),
            media_type="application/x-ndjson"
        )
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")

@app.post("/project-review/pdf")
async def project_review_pdf(
    file: UploadFile = File(...),
    action: str = Form(...)):
    try:
        project_files = extract_project_files_from_zip(await file.read())
        state = {
            "project_files": project_files,
            "user_request": action,
        }
        graph_state = await FinalProjectGraph.ainvoke(state)
        if action == "PROJECT_REVIEW":
            name = "AI Project Review Report"
            content = graph_state.get("review_report", "")
        elif action == "PROJECT_EXPLAIN":
            name = "AI Project Explanation"
            content = graph_state.get("project_explanation", "")
        elif action == "INTERVIEW":
            name = "AI Interview Questions"
            content = graph_state.get("interview_questions", "")
        elif action == "DOCUMENTATION":
            name = "README FILE"
            content = graph_state.get("documentation_generation", "")
        else:
            raise HTTPException(status_code=400, detail="Invalid action")
        
        pdf_path = await asyncio.to_thread(generate_project_pdf, name, content)
        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"{name.replace(' ', '_')}.pdf",
        )
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"{type(e).__name__}: {str(e)}")