from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# ----------------------------
# Load prompts once
# ----------------------------
PROJECT_REVIEW_PROMPT = PromptTemplate.from_template(
    open("prompts/project_review.txt", encoding="utf-8").read()
)

PROJECT_EXPLAIN_PROMPT = PromptTemplate.from_template(
    open("prompts/project_explain.txt", encoding="utf-8").read()
)

INTERVIEW_PROMPT = PromptTemplate.from_template(
    open("prompts/interview_questions.txt", encoding="utf-8").read()
)


# ----------------------------
# Helper: flatten project files
# ----------------------------
def stringify_project_files(project_files: dict) -> str:
    combined = []
    for name, content in project_files.items():
        combined.append(f"\n--- File: {name} ---\n{content}\n")
    return "\n".join(combined)


# ----------------------------
# PROJECT REVIEW NODE
# ----------------------------
def project_review_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = PROJECT_REVIEW_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"review_report": result.content}


# ----------------------------
# PROJECT EXPLANATION NODE
# ----------------------------
def project_explain_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = PROJECT_EXPLAIN_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"project_explanation": result.content}


# ----------------------------
# INTERVIEW QUESTIONS NODE
# ----------------------------
def interview_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = INTERVIEW_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"interview_questions": result.content}
