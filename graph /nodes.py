from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

llm = ChatOpenAI(model = "gpt-4o", temperature=0.2)

def load_prompt(path):
    return open(path).read()