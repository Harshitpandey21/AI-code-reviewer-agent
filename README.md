# 🧠 Codexa — AI-Powered Code Intelligence Platform

> Analyze, understand, and improve your codebase with AI agents built for real developer workflows.

Codexa is a full-stack web application that uses LangGraph-powered AI agent pipelines to review source code, explain project architecture, generate documentation, produce test reports, refactor code, and prepare interview questions — all with real-time streaming output and downloadable PDF reports.

---

## ✨ Features

- **Single File Code Review** — Upload any source file and receive a structured AI review covering code quality, issues, and improvement suggestions, along with a test report and refactored version of the code.
- **Full Project Intelligence** — Upload a complete project as a ZIP archive and choose from four AI-powered analysis modes:
  - **Project Review** — Architecture analysis, code quality assessment, and risk identification across the entire codebase.
  - **Project Explanation** — A plain-language walkthrough of how the project works, its modules, and their relationships.
  - **Interview Questions** — Generates technical interview Q&A from the project Zip file.
  - **README / Documentation** — Auto-generates polished, developer-ready documentation from real project files.
- **Real-Time Streaming** — All AI output streams token-by-token directly into the UI for a responsive, chat-like experience.
- **PDF Export** — One-click download of complete reports as professionally formatted PDF files.
- **Multi-Language Support** — Automatically detects and handles Python, JavaScript, TypeScript, Go, Rust, Java, C/C++, HTML, CSS, SQL, and more.

---

## 🖥️ Application Workflow

```
1. Upload Code        →  Single source file  OR  ZIP project archive
2. Select Analysis    →  Review / Explain / Interview / Documentation
3. Stream Results     →  Watch AI output appear in real time
4. Download Report    →  Export a complete PDF with one click
```

---

## 📂 Project Structure

```
codexa/
├── backend/
│   ├── main.py                        # FastAPI application & API endpoints
│   ├── requirements.txt               # Python dependencies
│   ├── stapp.py                       # Streamlit prototype interface
│   ├── .streamlit/
│   │   └── config.toml
│   │
│   ├── graph/                         # Single-file LangGraph pipeline
│   │   ├── graph_builder.py           # LangGraph workflow definition
│   │   ├── nodes.py                   # Agent node implementations + streaming
│   │   └── state.py                   # Shared state schema
│   │
│   ├── project_graph/                 # Multi-file / project LangGraph pipeline
│   │   ├── graph_builder.py
│   │   ├── nodes.py
│   │   └── state.py
│   │
│   ├── prompts/                       # LLM prompt templates
│   │   ├── parser.txt                 # Code summary/parsing prompt
│   │   ├── reviewer.txt               # Code review agent prompt
│   │   ├── refactor_code.txt          # Refactoring agent prompt
│   │   ├── test.txt                   # Test report agent prompt
│   │   ├── project_review.txt         # Full-project review prompt
│   │   ├── project_explain.txt        # Project explanation prompt
│   │   ├── interview_questions.txt    # Interview Q&A generation prompt
│   │   └── documentation.txt          # README/docs generation prompt
│   │
│   └── utils/
│       ├── pdf_generator.py           # PDF generator for single-file reports
│       └── project_pdf_generator.py   # PDF generator for project reports
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        └── components/
            ├── Home.jsx               # Landing page
            ├── SingleFile.jsx         # Single file review UI
            └── Project.jsx            # Project intelligence UI
```

---

## ⚙️ Tech Stack
| Layer | Technology |
|--------|----------|
| Frontend | React 18, React Router, Tailwind CSS, Vite |
| Backend | FastAPI, Python, Uvicorn |
| AI / Agents | LangGraph, OpenAI |
| PDF Generation | ReportLab |
| Streaming | FastAPI `StreamingResponse` |

---

## 🔧 Installation & Setup

### Prerequisites

- Python 3.9+
- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys)

### 1. Clone the repository

```bash
git clone https://github.com/Harshitpandey21/AI-code-reviewer-agent
cd AI-code-reviewer-agent
```

### 2. Backend setup

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate       # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

### 4. Run the application

Open two terminals:

**Terminal 1 — Backend**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Server Check |
| `POST` | `/single-review-stream` | Stream single-file review (review + test + refactor) |
| `POST` | `/single-review/pdf` | Generate single-file PDF report |
| `POST` | `/project-review-stream` | Stream project analysis (action-based) |
| `POST` | `/project-review/pdf` | Generate project PDF report |

### Project analysis actions

Pass one of the following as the `action` form field to `/project-review-stream` or `/project-review/pdf`:

| Action | Description |
|--------|-------------|
| `PROJECT_REVIEW` | Full project code quality and architecture review |
| `PROJECT_EXPLAIN` | Full Precise Explanation of the project |
| `INTERVIEW` | Technical interview questions based on the full Project ZIP File |
| `DOCUMENTATION` | README and technical documentation generation |

---

## 📄 Supported File Types

Single file uploads accept any of the following extensions:

`.py` `.js` `.ts` `.tsx` `.jsx` `.java` `.go` `.rs` `.cpp` `.c` `.h` `.hpp` `.html` `.css` `.scss` `.json` `.md` `.txt` `.yml` `.yaml` `.toml` `.xml` `.sh` `.env` `.sql`

Project uploads must be `.zip` archives. Files inside `node_modules/`, `__pycache__/`, and `.git/` are automatically excluded.

---

## 📦 Dependencies

### Backend (`requirements.txt`)

```
fastapi
uvicorn
python-multipart
langgraph
langchain-openai
python-dotenv
reportlab
```

### Frontend (`package.json`)

```json
{
  "dependencies": {
    "axios": "^1.13.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-markdown": "^10.1.0",
    "react-router-dom": "^7.13.0"
  }
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

*Built with LangGraph · FastAPI · React*
