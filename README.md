# 🧠 Codexa - AI Code Reviewer Agent

An interactive web application that automatically reviews source code, generates improvement suggestions, creates test reports, refactors the code, and visualizes differences — all powered by an AI agent pipeline. The app provides a complete review workflow with iteration cycles and downloadable PDF reports.

# 🚀 What This Application Does

1. Accepts a source code file upload
2. Detects the programming language automatically
3. Sends code to an AI agent pipeline for:
   - Code review analysis
   - Test report generation
   - Refactored code generation
4. Displays structured reports in a web UI
5. Shows unified diff between original and refactored code
6. Allows approval or iterative improvement cycles
7. Exports a complete PDF review report

# 🧩 Core Features

* Multi-language code upload support

* AI-powered code review and refactoring

* Structured review & test reports

* Unified diff visualization (+ / - style like Git)

* Iterative improvement loop

* PDF export of full report

* Clean multi-page web UI

* Session state managed workflow

# 🖥️ Application Workflow

# 1. Upload Code
   
  Upload a supported source file.

  The system reads the code and detects language automatically.

# 2. Run AI Review
   
  The AI agent:
   * Reviews code quality
   * Generates a test report
   * Produces refactored code
  
# 3. Review Results
   
  You see:
   * Review report
   * Test report
   * Refactored code
   * Unified diff against original

# 4. Final Approval
* Approve final code
* Or reject and trigger another AI improvement cycle
  
Each rejection re-runs the agent on the latest refactored code.

# 📂 Project Structure
```
AI_CODE_REVIEWER_AGENT/
├── app.py #Streamlit user interface
├── requirements.txt #Project dependencies
├── .env #Environment variables (API keys)
│
├── graph/
│ ├── graph_builder.py #LangGraph workflow definition
│ ├── nodes.py #Agent node implementations
│ └── state.py #Shared state schema
│
├── prompts/
│ ├── parser.txt #Summary of the code 
│ ├── reviewer.txt #Review agent prompt
│ ├── test.txt #Test report agent prompt
│ └── refactor_code.txt #Refactor agent prompt
│
└── README #Project documentation
```
# requirements.txt
```
fastapi
uvicorn
python-multipart
langgraph
langchain-openai
python-dotenv
reportlab
```
# ⚙️ Tech Stack

* Streamlit — Web UI framework
* Python — Backend runtime
* ReportLab — PDF generation
* difflib — Unified diff generation
* Custom AI Agent Graph — Code review pipeline

# 🔧 Installation
# 1. Clone repository
```
git clone https://github.com/Harshitpandey21/AI-code-reviewer-agent
cd AI-code-reviewer-agent
```
# 2. Install dependencies
```
pip install -r requirements.txt
```
# 3. Run application
```
streamlit run app.py
```
# 📄 PDF Report Export

One-click download generates a structured PDF containing:
* Review Report
* Test Report
* Final Refactored Code
