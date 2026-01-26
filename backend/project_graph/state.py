from typing import TypedDict, Dict, Optional

class ProjectState(TypedDict):
    project_files: Dict[str, str]
    user_request: str
    review_report: Optional[str]
    project_explanation: Optional[str]
    interview_questions: Optional[str]

