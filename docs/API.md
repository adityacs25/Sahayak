# 📡 MediKiosk API Reference Manual

**Version**: 1.0.0  
**Base URL**: `http://localhost:8000/api` (Development) / `/api` (Production)  
**OpenAPI / Swagger Documentation**: `http://localhost:8000/docs`  
**ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 🔒 Authentication & Authorization

MediKiosk uses **JSON Web Tokens (JWT)** passed via standard Bearer tokens in the `Authorization` header:

```http
Authorization: Bearer <jwt_token>
```

### Roles
- **`patient`**: Access to active self-registration, history-taking, document upload, and self case submission.
- **`doctor`**: Access to doctor queue, complete case inspection, AI summary edits, doctor notes, and case confirmation.

---

## 🚦 Standard Status & Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200 OK` | Success | Request succeeded and returned requested data. |
| `201 Created` | Created | Resource successfully created. |
| `400 Bad Request` | Validation Error | Malformed body, missing fields, or invalid enum values. |
| `401 Unauthorized` | Auth Required | Missing, expired, or malformed JWT token. |
| `403 Forbidden` | Access Denied | Insufficient permissions for endpoint/action. |
| `404 Not Found` | Not Found | Requested entity (patient, case, document) does not exist. |
| `422 Unprocessable Entity` | Schema Error | Pydantic validation failure on request payload. |
| `500 Internal Error` | Server Error | Internal unhandled exception. |

---

## 📚 Endpoints

### 1. Authentication

#### `POST /auth/login`
Authenticate doctor or patient and retrieve JWT access token.

**Request Body:**
```json
{
  "email": "doctor@demo.com",
  "password": "demo1234"
}
```

**Response (`200 OK`):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "usr_doc_01",
    "name": "Dr. Ananya Sharma",
    "email": "doctor@demo.com",
    "role": "doctor",
    "department": "Kayachikitsa (Internal Medicine)"
  }
}
```

---

#### `GET /auth/me`
Retrieve authenticated user profile.

**Headers:** `Authorization: Bearer <token>`

**Response (`200 OK`):**
```json
{
  "id": "usr_doc_01",
  "name": "Dr. Ananya Sharma",
  "email": "doctor@demo.com",
  "role": "doctor",
  "department": "Kayachikitsa"
}
```

---

### 2. Patient Registration

#### `POST /patients`
Create or register a patient record at kiosk intake.

**Request Body:**
```json
{
  "first_name": "Ramesh",
  "last_name": "Kumar",
  "age": 58,
  "gender": "male",
  "phone": "+91 98765 43210",
  "consent_given": true,
  "consent_timestamp": "2026-08-23T10:15:30Z",
  "preferred_language": "en"
}
```

**Response (`201 Created`):**
```json
{
  "id": "pat_ramesh_01",
  "first_name": "Ramesh",
  "last_name": "Kumar",
  "age": 58,
  "gender": "male",
  "phone": "+91 98765 43210",
  "created_at": "2026-08-23T10:15:30Z"
}
```

---

### 3. Clinical Cases & Doctor Queue

#### `POST /cases`
Initialize a new clinical history case session for a patient.

**Request Body:**
```json
{
  "patient_id": "pat_ramesh_01",
  "chief_complaint": "Chest pain, radiating to left arm",
  "duration_days": 2,
  "severity": "severe"
}
```

**Response (`201 Created`):**
```json
{
  "id": "case_101",
  "patient_id": "pat_ramesh_01",
  "status": "in_progress",
  "priority": "normal",
  "created_at": "2026-08-23T10:16:00Z"
}
```

---

#### `GET /cases/queue`
Retrieve doctor OPD queue with priority indicators and triage flags.

**Headers:** `Authorization: Bearer <doctor_token>`

**Response (`200 OK`):**
```json
[
  {
    "case_id": "case_101",
    "patient_id": "pat_ramesh_01",
    "patient_name": "Ramesh Kumar",
    "age": 58,
    "gender": "male",
    "chief_complaint": "Chest pain, radiating to left arm",
    "priority": "urgent",
    "red_flags_count": 2,
    "status": "ready_for_review",
    "submitted_at": "2026-08-23T10:25:00Z"
  },
  {
    "case_id": "case_102",
    "patient_id": "pat_priya_02",
    "patient_name": "Priya Sharma",
    "age": 34,
    "gender": "female",
    "chief_complaint": "Cough for 3 weeks, mild fever",
    "priority": "normal",
    "red_flags_count": 0,
    "status": "ready_for_review",
    "submitted_at": "2026-08-23T10:30:00Z"
  }
]
```

---

#### `GET /cases/{id}`
Retrieve full clinical case payload (all 6 sections/tabs).

**Response (`200 OK`):**
```json
{
  "id": "case_101",
  "patient": {
    "id": "pat_ramesh_01",
    "name": "Ramesh Kumar",
    "age": 58,
    "gender": "male"
  },
  "chief_complaint": "Chest pain, radiating to left arm",
  "status": "ready_for_review",
  "priority": "urgent",
  "history": { ... },
  "red_flags": [ ... ],
  "documents": [ ... ],
  "timeline": [ ... ],
  "ayurveda": { ... },
  "summary": { ... },
  "doctor_notes": []
}
```

---

### 4. Structured History & Adaptive Questioning

#### `POST /cases/{id}/history`
Submit structured patient history responses across clinical domains.

**Request Body:**
```json
{
  "history_of_present_illness": "Sudden onset substernal pressure, worsened with exertion.",
  "past_medical_history": ["Hypertension (5 yrs)", "Dyslipidemia"],
  "medications": [
    { "name": "Amlodipine", "dosage": "5mg", "frequency": "once daily" },
    { "name": "Atorvastatin", "dosage": "10mg", "frequency": "once daily" }
  ],
  "allergies": ["Penicillin"],
  "family_history": ["Father had CAD at age 52"],
  "personal_social_history": {
    "smoking": "Non-smoker",
    "alcohol": "Occasional",
    "diet": "Mixed"
  },
  "ayurveda_assessment": {
    "prakriti": "Pitta-Kapha",
    "vikriti": "Vata-Pitta Dushti",
    "agni": "Mandagni",
    "koshta": "Madhyama",
    "ahara_habits": "Irregular meal timings, spicy diet"
  }
}
```

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "history_recorded": true,
  "updated_at": "2026-08-23T10:18:22Z"
}
```

---

#### `POST /cases/{id}/questions`
Generate rule-based adaptive follow-up questions tailored to chief complaint & preliminary responses.

**Request Body:**
```json
{
  "chief_complaint": "Chest pain",
  "current_answers": {
    "onset": "sudden",
    "pain_character": "pressure"
  }
}
```

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "adaptive_questions": [
    {
      "id": "q_cp_01",
      "question": "Does the pain radiate to your jaw, neck, back, or left arm?",
      "type": "single_choice",
      "options": ["Yes, left arm and jaw", "Yes, back", "No radiation"],
      "triggers_red_flag": true
    },
    {
      "id": "q_cp_02",
      "question": "Are you experiencing any shortness of breath, diaphoresis (sweating), or nausea?",
      "type": "multiple_choice",
      "options": ["Shortness of breath", "Cold sweating", "Nausea/vomiting", "None of these"],
      "triggers_red_flag": true
    }
  ]
}
```

---

### 5. Triage & Red-Flag Signaling

#### `POST /cases/{id}/red-flags`
Analyze clinical symptoms for critical emergency triage signals.

**Request Body:**
```json
{
  "reported_symptoms": ["chest pain radiating to arm", "diaphoresis", "shortness of breath"]
}
```

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "triage_priority": "urgent",
  "red_flags": [
    {
      "category": "Cardiovascular",
      "symptom": "Chest pain radiating to left arm with diaphoresis",
      "severity": "high",
      "recommendation": "Immediate ECG and physician evaluation required (Rule out Acute Coronary Syndrome)."
    }
  ]
}
```

---

### 6. Medical Documents & OCR Extraction

#### `POST /cases/{id}/documents`
Upload lab reports, discharge summaries, or prescriptions (PDF, JPG, PNG).

**Request (Multipart Form):**
- `file`: `<binary>`
- `document_type`: `lab_report | prescription | discharge_summary | imaging`
- `document_date`: `2026-08-10`

**Response (`201 Created`):**
```json
{
  "document_id": "doc_991",
  "case_id": "case_101",
  "filename": "lipid_panel_aug2026.pdf",
  "file_url": "/uploads/case_101/lipid_panel_aug2026.pdf",
  "uploaded_at": "2026-08-23T10:20:00Z"
}
```

---

#### `POST /cases/{id}/documents/ocr`
Trigger OCR extraction on uploaded medical documents.

**Request Body:**
```json
{
  "document_id": "doc_991"
}
```

**Response (`200 OK`):**
```json
{
  "document_id": "doc_991",
  "extraction_status": "completed",
  "extracted_data": {
    "facility": "AIIA Central Laboratory",
    "test_name": "Lipid Profile",
    "date": "2026-08-10",
    "findings": [
      { "parameter": "Total Cholesterol", "value": "242", "unit": "mg/dL", "flag": "HIGH" },
      { "parameter": "LDL Cholesterol", "value": "165", "unit": "mg/dL", "flag": "HIGH" },
      { "parameter": "HDL Cholesterol", "value": "38", "unit": "mg/dL", "flag": "LOW" },
      { "parameter": "Triglycerides", "value": "195", "unit": "mg/dL", "flag": "HIGH" }
    ]
  }
}
```

---

### 7. Medical Timeline

#### `GET /cases/{id}/timeline`
Retrieve aggregated chronological timeline of past medical episodes, documents, and hospitalizations.

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "timeline_events": [
    {
      "date": "2021-04-12",
      "category": "Diagnosis",
      "title": "Hypertension Diagnosed",
      "description": "Prescribed Amlodipine 5mg daily"
    },
    {
      "date": "2024-09-18",
      "category": "Lab Investigation",
      "title": "Elevated Lipid Markers",
      "description": "Started Atorvastatin 10mg"
    },
    {
      "date": "2026-08-21",
      "category": "Onset",
      "title": "Substernal Chest Discomfort",
      "description": "Initial onset after moderate exertion"
    },
    {
      "date": "2026-08-23",
      "category": "Current Visit",
      "title": "MediKiosk Intake at AIIA OPD",
      "description": "Urgent triage triggered"
    }
  ]
}
```

---

### 8. AI Summary & Doctor Confirmation Workflow

#### `GET /cases/{id}/summary`
Fetch the structured AI clinical history synthesis.

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "ai_summary": {
    "hpi_summary": "58-year-old male with a history of HTN and dyslipidemia presenting with 2 days of worsening retrosternal chest tightness radiating to the left arm, associated with cold sweats.",
    "key_risk_factors": ["Hypertension (5 yrs)", "Dyslipidemia", "Family history of premature CAD"],
    "differential_hints_for_review": ["Acute Coronary Syndrome", "Unstable Angina", "Gastroesophageal Reflux"],
    "suggested_initial_workup": ["12-lead ECG stat", "Cardiac Troponin I / T", "CPK-MB", "Chest X-Ray"]
  },
  "is_edited": false,
  "is_confirmed": false
}
```

---

#### `PUT /cases/{id}/summary`
Doctor edits or rectifies the AI-synthesized clinical summary.

**Headers:** `Authorization: Bearer <doctor_token>`

**Request Body:**
```json
{
  "edited_summary": "58yo male with known HTN, dyslipidemia presenting with acute exertional retrosternal pressure radiating to left arm. High suspicion of ACS. Urgent ECG ordered.",
  "edited_by": "usr_doc_01"
}
```

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "is_edited": true,
  "updated_at": "2026-08-23T10:35:10Z"
}
```

---

#### `POST /cases/{id}/notes`
Doctor appends clinical observations, diagnosis, or treatment directions.

**Headers:** `Authorization: Bearer <doctor_token>`

**Request Body:**
```json
{
  "note": "Patient transferred to emergency observation for immediate 12-lead ECG & cardiac enzyme evaluation. Vitals monitored.",
  "category": "clinical_decision"
}
```

**Response (`201 Created`):**
```json
{
  "id": "note_501",
  "case_id": "case_101",
  "created_at": "2026-08-23T10:36:00Z"
}
```

---

#### `POST /cases/{id}/confirm`
Finalize doctor sign-off on case history. Locks record and marks case completed for EMR/OPD integration.

**Headers:** `Authorization: Bearer <doctor_token>`

**Request Body:**
```json
{
  "doctor_id": "usr_doc_01",
  "confirmation_status": "confirmed",
  "final_remarks": "History reviewed, verified with patient, and signed off."
}
```

**Response (`200 OK`):**
```json
{
  "case_id": "case_101",
  "status": "confirmed",
  "confirmed_by": "Dr. Ananya Sharma",
  "confirmed_at": "2026-08-23T10:37:00Z"
}
```

---

### 9. System Health

#### `GET /health`
Returns backend health status, database connectivity, and mock mode status.

**Response (`200 OK`):**
```json
{
  "status": "healthy",
  "database": "connected",
  "mock_ai_mode": true,
  "mock_ocr_mode": true,
  "version": "1.0.0"
}
```
