from graph.graph_builder import Final

file_path = input("Enter Python code file path: ")

with open(file_path, "r") as f:
    code_text = f.read()

CodeState = {
    "raw_code": code_text
}

final_state = Final.invoke(CodeState)
print("\n====== FINAL APPROVED CODE ======\n")
print(final_state["refactored_code"])
