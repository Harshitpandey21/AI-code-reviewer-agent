from typing import TypedDict 

class CodeState(TypedDict):
    raw_code: str
    language:str 
    parsed_summary: str
    review_code : str
    refactored_code: str
    test_report: str
    human_approval: str 
     

