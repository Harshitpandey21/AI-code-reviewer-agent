from fastapi import FastAPI, UploadFile, File
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
    
    state = {"raw_code": raw_code, "language": "python"}
    result = SingleFileGraph.invoke(state)

    return result


@app.post("/project-review")
async def project_review(file: UploadFile = File(...), action: str = "PROJECT_REVIEW"):
    
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

    graph_result = FinalProjectGraph.invoke(state)

    # ---- NORMALIZE OUTPUT ----
    text = None

    # Handle common LangGraph output shapes
    if isinstance(graph_result, dict):
        # if graph already returns a text field
        if "result" in graph_result:
            text = graph_result["result"]
        elif "final" in graph_result:
            text = graph_result["final"]
        else:
            # fallback: stringify whole dict
            text = str(graph_result)
    else:
        text = str(graph_result)

    # ---- Map to frontend expected keys ----
    if action == "PROJECT_REVIEW":
        return {"review_report": text}

    if action == "PROJECT_EXPLAIN":
        return {"project_explanation": text}

    if action == "INTERVIEW":
        return {"interview_questions": text}

    return {"error": "Unknown action"}

