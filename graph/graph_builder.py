from langgraph.graph import StateGraph, START,END
from graph.state import CodeState 

from graph.nodes import *

graph = StateGraph(CodeState)

graph.add_node("code_parser", code_parser_node)
graph.add_node("code_reviewer", code_reviewer_node)
graph.add_node("refactored_code", refactored_code)
graph.add_node("test_code", test_code)
graph.add_node("human_approval", human_approval)

graph.set_entry_point("code_parser")

graph.add_edge(START, "code_parser")
graph.add_edge("code_parser", "code_reviewer")
graph.add_edge("code_reviewer", "refactored_code")
graph.add_edge("refactored_code", "test_code")
graph.add_edge("test_code", END)

Final = graph.compile()