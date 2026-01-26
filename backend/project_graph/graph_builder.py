from langgraph.graph import StateGraph, END
from project_graph.state import ProjectState
from project_graph.nodes import (
    project_review_node,
    project_explain_node,
    interview_node
)

# ---------------------------
# Router NODE (must return dict)
# ---------------------------
def router_node(state):
    # No state update needed
    return {}

# ---------------------------
# Condition function (returns string)
# ---------------------------
def route_condition(state):
    return state["user_request"]

# ---------------------------
# Build Graph
# ---------------------------
graph = StateGraph(ProjectState)

graph.add_node("router", router_node)
graph.add_node("PROJECT_REVIEW", project_review_node)
graph.add_node("PROJECT_EXPLAIN", project_explain_node)
graph.add_node("INTERVIEW", interview_node)

graph.set_entry_point("router")

graph.add_conditional_edges(
    "router",
    route_condition,   # <-- separate function
    {
        "PROJECT_REVIEW": "PROJECT_REVIEW",
        "PROJECT_EXPLAIN": "PROJECT_EXPLAIN",
        "INTERVIEW": "INTERVIEW"
    }
)

graph.add_edge("PROJECT_REVIEW", END)
graph.add_edge("PROJECT_EXPLAIN", END)
graph.add_edge("INTERVIEW", END)

FinalProjectGraph = graph.compile()
