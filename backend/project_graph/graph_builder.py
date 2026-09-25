from langgraph.graph import StateGraph, END
from project_graph.state import ProjectState
from project_graph.nodes import (
    project_review_node,
    project_explain_node,
    interview_node,
    documentation_node,
)

def router_node(state):
    return {}

def route_condition(state):
    return state["user_request"]

graph = StateGraph(ProjectState) # graph

graph.add_node("router", router_node)
graph.add_node("PROJECT_REVIEW", project_review_node)
graph.add_node("PROJECT_EXPLAIN", project_explain_node)
graph.add_node("INTERVIEW", interview_node)
graph.add_node("DOCUMENTATION", documentation_node)

graph.set_entry_point("router")

graph.add_conditional_edges(
    "router",
    route_condition,
    {
        "PROJECT_REVIEW": "PROJECT_REVIEW",
        "PROJECT_EXPLAIN": "PROJECT_EXPLAIN",
        "INTERVIEW": "INTERVIEW",
        "DOCUMENTATION": "DOCUMENTATION",
    },
)

graph.add_edge("PROJECT_REVIEW", END)# Project review edge
graph.add_edge("PROJECT_EXPLAIN", END) # Project Explain edge
graph.add_edge("INTERVIEW", END) # Interview edge
graph.add_edge("DOCUMENTATION", END) # Documentation edge

FinalProjectGraph = graph.compile() # Final Project Graph