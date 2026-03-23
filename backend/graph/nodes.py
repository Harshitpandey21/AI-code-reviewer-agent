from pathlib import Path

from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

def load_prompt(path, encoding="utf-8"):
    return open(path, encoding=encoding).read()

PARSER_PROMPT = PromptTemplate.from_template(load_prompt("prompts/parser.txt"))
REVIEWER_PROMPT = PromptTemplate.from_template(load_prompt("prompts/reviewer.txt"))
REFACTOR_PROMPT = PromptTemplate.from_template(load_prompt("prompts/refactor_code.txt"))
TEST_PROMPT = PromptTemplate.from_template(load_prompt("prompts/test.txt"))

def code_parser_node(CodeState):
    prompt = PARSER_PROMPT.format(code=CodeState["raw_code"])
    result = llm.invoke(prompt)
    CodeState["parsed_summary"] = result.content
    return CodeState

def code_reviewer_node(CodeState):
    prompt = REVIEWER_PROMPT.format(
        code=CodeState["raw_code"],
        language=CodeState["language"]
    )
    result = llm.invoke(prompt)
    CodeState["review_code"] = result.content
    return CodeState

def refactored_code(CodeState):
    prompt = REFACTOR_PROMPT.format(
        code=CodeState["raw_code"],
        review=CodeState["review_code"],
        language=CodeState["language"]
    )
    result = llm.invoke(prompt)
    CodeState["refactored_code"] = result.content
    return CodeState

def test_code(CodeState):
    prompt = TEST_PROMPT.format(
        code=CodeState["refactored_code"],
        language=CodeState["language"]
    )
    result = llm.invoke(prompt)
    CodeState["test_report"] = result.content
    return CodeState

def human_approval(CodeState):
    return CodeState

def _stream_prompt(prompt_text: str):
    for chunk in llm.stream(prompt_text):
        token = chunk.content or ""
        if token:
            yield token

def stream_single_file_pipeline(state: dict):
    parser_prompt = PARSER_PROMPT.format(code=state["raw_code"])
    parsed_summary = ""
    for token in _stream_prompt(parser_prompt):
        parsed_summary += token
    state["parsed_summary"] = parsed_summary
    reviewer_prompt = REVIEWER_PROMPT.format(
        code=state["raw_code"],
        language=state["language"]
    )
    review_text = ""
    for token in _stream_prompt(reviewer_prompt):
        review_text += token
        yield {
            "type": "review",
            "content": token
        }
    state["review_code"] = review_text
    test_prompt = TEST_PROMPT.format(
        code=state["raw_code"],
        language=state["language"]
    )
    test_text = ""
    for token in _stream_prompt(test_prompt):
        test_text += token
        yield {
            "type": "test",
            "content": token
        }
    state["test_report"] = test_text
    refactor_prompt = REFACTOR_PROMPT.format(
        code=state["raw_code"],
        review=state["review_code"],
        language=state["language"]
    )
    refactor_text = ""
    for token in _stream_prompt(refactor_prompt):
        refactor_text += token
        yield {
            "type": "refactor",
            "content": token
        }
    state["refactored_code"] = refactor_text
    yield {"type": "done"}