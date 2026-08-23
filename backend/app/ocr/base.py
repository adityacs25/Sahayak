from abc import ABC, abstractmethod
from typing import List, Dict, Any

class OCRService(ABC):
    @abstractmethod
    def extract_text(self, file_path: str) -> str:
        pass
        
    @abstractmethod
    def extract_structured(self, file_path: str) -> List[Dict[str, Any]]:
        pass
