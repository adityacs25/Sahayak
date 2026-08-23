from abc import ABC, abstractmethod
from typing import List, Dict, Any

class AIService(ABC):
    @abstractmethod
    def generate_summary(self, patient_data: dict) -> dict:
        pass
        
    @abstractmethod
    def generate_followup_questions(self, chief_complaint: str, existing_answers: dict) -> List[Dict[str, Any]]:
        pass
        
    @abstractmethod
    def detect_red_flags(self, complaint: str, answers: dict) -> List[Dict[str, str]]:
        pass
        
    @abstractmethod
    def extract_medical_entities(self, text: str) -> List[Dict[str, Any]]:
        pass
