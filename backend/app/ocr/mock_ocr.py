from typing import List, Dict, Any
from .base import OCRService

class MockOCRService(OCRService):
    def extract_text(self, file_path: str) -> str:
        return "Mock extracted text from document."
        
    def extract_structured(self, file_path: str) -> List[Dict[str, Any]]:
        if "lab" in file_path.lower():
            return [
                {"field_name": "HbA1c", "field_value": "7.2", "unit": "%", "reference_range": "<5.7", "is_abnormal": True},
                {"field_name": "Fasting Glucose", "field_value": "142", "unit": "mg/dL", "reference_range": "70-100", "is_abnormal": True},
                {"field_name": "Cholesterol", "field_value": "198", "unit": "mg/dL", "reference_range": "<200", "is_abnormal": False}
            ]
        elif "prescription" in file_path.lower():
            return [
                {"field_name": "Medicine", "field_value": "Metformin 500mg twice daily", "is_abnormal": False},
                {"field_name": "Medicine", "field_value": "Atorvastatin 10mg once daily", "is_abnormal": False}
            ]
        return [
            {"field_name": "Diagnosis", "field_value": "Type 2 DM with HTN", "is_abnormal": False},
            {"field_name": "Discharge date", "field_value": "2025-03-15", "is_abnormal": False}
        ]
