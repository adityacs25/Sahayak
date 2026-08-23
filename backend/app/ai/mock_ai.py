from typing import List, Dict, Any
from .base import AIService

class MockAIService(AIService):
    def detect_red_flags(self, complaint: str, answers: dict) -> List[Dict[str, str]]:
        complaint_lower = complaint.lower()
        if "chest pain" in complaint_lower or "chest discomfort" in complaint_lower:
            return [{"flag_type": "Cardiac", "description": "Chest pain with possible cardiac features", "severity": "urgent", "reason": "Possible MI"}]
        elif "breathlessness" in complaint_lower:
            return [{"flag_type": "Respiratory", "description": "Shortness of breath", "severity": "attention", "reason": "Needs evaluation"}]
        elif "severe headache" in complaint_lower and "vomiting" in complaint_lower:
            return [{"flag_type": "Neurological", "description": "Severe headache with vomiting", "severity": "urgent", "reason": "Rule out increased ICP"}]
        elif "loss of consciousness" in complaint_lower:
            return [{"flag_type": "Neurological", "description": "Loss of consciousness", "severity": "urgent", "reason": "Critical neurological sign"}]
        elif "hemoptysis" in complaint_lower:
            return [{"flag_type": "Respiratory", "description": "Coughing up blood", "severity": "urgent", "reason": "Red flag for TB/malignancy"}]
        
        return [{"flag_type": "None", "description": "No significant red flags detected", "severity": "normal", "reason": "Routine complaint"}]

    def generate_followup_questions(self, chief_complaint: str, existing_answers: dict) -> List[Dict[str, Any]]:
        cc_lower = chief_complaint.lower()
        if "chest" in cc_lower:
            return [
                {"question_key": "q1", "question_text": "When did the chest pain start?", "question_type": "text", "options": []},
                {"question_key": "q2", "question_text": "Does the pain radiate anywhere?", "question_type": "choice", "options": ["Left arm", "Jaw", "Back", "Nowhere"]},
                {"question_key": "q3", "question_text": "Rate the severity", "question_type": "scale", "options": ["1", "10"]}
            ]
        elif "head" in cc_lower:
            return [
                {"question_key": "q1", "question_text": "Where is the headache located?", "question_type": "text", "options": []},
                {"question_key": "q2", "question_text": "Do you have nausea or vomiting?", "question_type": "boolean", "options": []}
            ]
        elif "abdomen" in cc_lower or "stomach" in cc_lower:
            return [
                {"question_key": "q1", "question_text": "Where exactly is the pain?", "question_type": "text", "options": []},
                {"question_key": "q2", "question_text": "Any changes in bowel habits?", "question_type": "boolean", "options": []}
            ]
        return [
            {"question_key": "q1", "question_text": "When did this start?", "question_type": "text", "options": []},
            {"question_key": "q2", "question_text": "How severe is it?", "question_type": "scale", "options": ["1", "10"]}
        ]

    def generate_summary(self, patient_data: dict) -> dict:
        return {
            "patient_overview": str(patient_data.get("patient", {})),
            "chief_complaint_summary": patient_data.get("chief_complaint", ""),
            "history_summary": "Extracted from history answers...",
            "associated_symptoms": "None reported",
            "past_history_summary": "No significant past history",
            "medication_summary": "Not on any current meds",
            "allergies_summary": "No known allergies",
            "investigations_summary": "Pending",
            "red_flag_summary": "Normal",
            "ai_narrative": "Based on the reported history, the patient is stable.",
            "is_mock": True
        }

    def extract_medical_entities(self, text: str) -> List[Dict[str, Any]]:
        return [{"entity": "Mock Entity", "value": "Mock Value"}]
