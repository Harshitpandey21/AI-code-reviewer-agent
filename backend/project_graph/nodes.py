from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)


def load_prompt(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


# ----------------------------
# PROJECT REVIEW NODE
# ----------------------------
def project_review_node(state: dict):

    prompt = PromptTemplate.from_template(load_prompt("prompts/project_review.txt"))

    result = llm.invoke(
        prompt.format(project_files=state["project_files"])
    )

    return {
        "review_report": result.content
    }


# ----------------------------
# PROJECT EXPLANATION NODE
# ----------------------------
def project_explain_node(state: dict):

    prompt = PromptTemplate.from_template(load_prompt("prompts/project_explain.txt"))

    result = llm.invoke(
        prompt.format(
            project_files=state["project_files"]
            
        )
    )

    return {
        "project_explanation": result.content
    }


# ----------------------------
# INTERVIEW QUESTIONS NODE
# ----------------------------
def interview_node(state: dict):

    prompt = PromptTemplate.from_template(load_prompt("prompts/interview_questions.txt"))

    result = llm.invoke(
        prompt.format(
            project_files=state["project_files"],
            
        )
    )

    return {
        "interview_questions": result.content
    }
