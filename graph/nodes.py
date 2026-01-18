from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
load_dotenv()

llm = ChatOpenAI(model = "gpt-4o", temperature=0.2)

def load_prompt(path):
    return open(path).read()

def code_parser_node(CodeState):
    prompt = PromptTemplate.from_template(load_prompt("prompts/parser.txt"))
    result = llm.invoke(prompt.format(code=CodeState["raw_code"]))
    CodeState["parsed_summary"]= result.content 
    return CodeState

def code_reviewer_node(CodeState):
    prompt = PromptTemplate.from_template(load_prompt("prompts/reviewer.txt"))
    result = llm.invoke(prompt.format(code=CodeState["raw_code"]))
    CodeState["review_code"]= result.content 
    return CodeState 

def refactored_code(CodeState):
    prompt = PromptTemplate.from_template(load_prompt("prompts/refactor_code.txt"))
    result = llm.invoke(prompt.format(code=CodeState["raw_code"],
                                      review = CodeState["review_code"]))
    CodeState["refactored_code"] = result.content
    return CodeState 

def test_code(CodeState):
    prompt = PromptTemplate.from_template(load_prompt("prompts/test.txt"))
    result= llm.invoke(prompt.format(code=CodeState["refactored_code"]))
    CodeState["test_report"] = result.content
    return CodeState 

def human_approval(CodeState):
    return CodeState