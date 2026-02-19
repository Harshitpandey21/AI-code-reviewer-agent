from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

def load_prompt(path,encoding):
    return open(path, encoding=encoding).read()

PROJECT_REVIEW_PROMPT = PromptTemplate.from_template(
    load_prompt("prompts/project_review.txt", encoding="utf-8")
)

PROJECT_EXPLAIN_PROMPT = PromptTemplate.from_template(
    load_prompt("prompts/project_explain.txt", encoding="utf-8")
)

INTERVIEW_PROMPT = PromptTemplate.from_template(
    load_prompt("prompts/interview_questions.txt", encoding="utf-8")
)

def stringify_project_files(project_files: dict) -> str:
    list = []
    for name, content in project_files.items():
        list.append(f"\n--- File: {name} ---\n{content}\n")
    return "\n".join(list)

def project_review_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = PROJECT_REVIEW_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"review_report": result.content}

def project_explain_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = PROJECT_EXPLAIN_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"project_explanation": result.content}

def interview_node(state: dict):
    files_text = stringify_project_files(state["project_files"])

    prompt_text = INTERVIEW_PROMPT.format(
        project_files=files_text
    )

    result = llm.invoke(prompt_text)

    return {"interview_questions": result.content}
