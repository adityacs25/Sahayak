# 🏥 MediKiosk
## AI-Assisted Patient Clinical History Platform

**Smart India Hackathon 2026 | Problem Statement SIH26047**  
**Ministry of Ayush | All India Institute of Ayurveda**

---

## 🎯 Problem Statement

High-patient-load OPDs at AIIA and similar institutions face significant challenges:
- Doctors spend 30–40% of consultation time on history-taking
- Paper records are difficult to structure and search  
- Patient-reported history is often incomplete or poorly documented
- Limited time for each patient in high-load settings

## 💡 Solution Overview

MediKiosk is an **AI-assisted, assistive** clinical information and documentation system that:
- Guides patients through structured history-taking before they see the doctor
- Uses rule-based adaptive questioning for relevant follow-up
- Detects potential red-flag symptoms for triage signaling
- Generates AI-assisted structured summaries for doctor review
- Provides doctors with a complete, organized patient case ready for review

> **⚕️ Medical Safety Notice**: MediKiosk is a clinical documentation assistant. It does NOT provide diagnoses, prescribe medications, or replace qualified medical professionals. All AI-generated content requires doctor review and confirmation.

---

## ✨ Features

### Patient Side
- 🌐 Multi-language support (English, Hindi*, Telugu*)
- 📋 Digital consent with clear privacy explanation
- 📝 Structured clinical history (15 sections)
- 🤖 Adaptive follow-up questions based on chief complaint
- ⚠️ Red-flag symptom triage signaling
- 📄 Medical document upload (PDF, JPG, PNG)
- 📊 Auto-extracted document information
- 📅 Medical timeline visualization
- 📋 AI-assisted summary review before submission

### Doctor Side  
- 👨‍⚕️ Dedicated doctor portal with secure login
- 📋 Patient queue with priority indicators
- 🗂️ Full case view with 6 organized tabs
- ✏️ Edit/verify AI-generated content
- ✅ Case confirmation workflow
- 📌 Doctor notes and review trail

### Ayurveda Module
- Prakriti and Vikriti assessment fields
- Ahara-Vihara history
- Extensible for AIIA-specific clinical protocols

*Hindi and Telugu: prototype stubs, full translation in roadmap

---

## 🏗️ Architecture

```
[Patient / Doctor Browser]
         │
         ▼
[React + Vite Frontend :5173]
         │
         ▼
[FastAPI Backend :8000]
    ├──────────────────┐
    ▼                  ▼
[PostgreSQL / SQLite]  [AI/ML Layer]
    │                  │ (Mock for prototype)
    └────────┬─────────┘
             ▼
    [Structured Case Data]
             │
             ▼
    [Doctor Dashboard]
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Routing | React Router v6 |
| HTTP Client | Axios |
| i18n | react-i18next |
| Icons | lucide-react |
| Backend | Python 3.11, FastAPI |
| ORM | SQLAlchemy 2.0 (async) |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (python-jose) |
| AI Layer | Mock (extensible to Gemini/GPT) |
| OCR Layer | Mock (extensible to Tesseract/Document AI) |
| Deployment | Docker Compose |

---

## 📁 Project Structure

```
medikiosk/
├── frontend/           # React + TypeScript frontend
│   └── src/
│       ├── pages/      # 15 patient + doctor screens
│       ├── components/ # Reusable UI components
│       ├── services/   # API calls + mock fallback
│       ├── context/    # App state (auth, language, flow)
│       └── i18n/       # Internationalization
├── backend/            # FastAPI backend
│   └── app/
│       ├── api/        # REST endpoint handlers
│       ├── models/     # SQLAlchemy ORM models
│       ├── schemas/    # Pydantic request/response
│       ├── services/   # Business logic
│       ├── ai/         # AI service abstraction
│       └── ocr/        # OCR service abstraction
├── docs/               # Additional documentation
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- pip

### Option A: Local Development (Recommended for prototype demo)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python seed_data.py      # Creates demo patients
uvicorn app.main:app --reload
```
Backend runs at: http://localhost:8000  
API docs: http://localhost:8000/docs

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

### Option B: Docker Compose
```bash
docker-compose up --build
```

---

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env`:

| Variable | Description | Default |
|----------|-------------|----------|
| `DATABASE_URL` | Database connection string | SQLite local |
| `SECRET_KEY` | JWT signing secret | Change in production |
| `AI_API_KEY` | AI provider API key | Empty (uses mock) |
| `MOCK_AI_MODE` | Use mock AI responses | `true` |
| `MOCK_OCR_MODE` | Use mock OCR extraction | `true` |
| `UPLOAD_DIR` | File upload directory | `./uploads` |

> **Never commit `.env` to version control.**

---

## 👤 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Doctor | doctor@demo.com | demo1234 |
| Patient | patient@demo.com | demo1234 |

---

## 🧑‍🤝‍🧑 Demo Patients

| Patient | Age | Chief Complaint | Priority |
|---------|-----|-----------------|----------|
| Ramesh Kumar | 58M | Chest pain, radiating to left arm | 🔴 Urgent |
| Priya Sharma | 34F | Cough for 3 weeks, mild fever | 🟢 Normal |
| Suresh Rao | 62M | Diabetes follow-up, increased thirst | 🟡 Attention |
| Meena Devi | 45F | Severe headache for 2 days | 🟡 Attention |
| Arjun Verma | 28M | Digestive issues, acidity, fatigue | 🟢 Normal |

---

## 📡 API Documentation

Once the backend is running, access Swagger UI at:  
**http://localhost:8000/docs**

Key endpoints:
```
POST /api/auth/login          — Doctor/patient login
GET  /api/auth/me             — Current user info
POST /api/patients            — Register patient
POST /api/cases               — Create clinical case
POST /api/cases/{id}/history  — Submit history answers
POST /api/cases/{id}/questions — Get adaptive questions
POST /api/cases/{id}/red-flags — Analyze red flags
GET  /api/cases/{id}/summary  — Get AI summary
POST /api/cases/{id}/confirm  — Doctor confirms case
```

---

## 🎬 Demo Flow

1. Open http://localhost:5173
2. Select language → Give consent
3. Enter patient details → Chief complaint: "Chest pain"
4. Answer structured history questions
5. ⚠️ Urgent red flag appears
6. Upload a medical document → See extracted info
7. View medical timeline → Review AI summary
8. Submit case
9. Open http://localhost:5173/doctor/login
10. Login: doctor@demo.com / demo1234
11. See Ramesh Kumar at the top of queue (URGENT)
12. Open case → Review all 6 tabs
13. Edit AI summary → Confirm case

---

## ⚕️ Medical Safety Disclaimer

MediKiosk is a **clinical documentation tool** developed for demonstration purposes.

- It does **NOT** provide medical diagnoses
- It does **NOT** prescribe medications
- It does **NOT** replace qualified medical professionals
- All AI-generated content is clearly labelled and **requires doctor review**
- Red-flag signals are **triage screening tools**, not diagnostic conclusions
- Demo data is completely synthetic — no real patient information is used

---

## 🔮 Future Scope

- [ ] Real LLM integration (Google Gemini) for intelligent summaries
- [ ] Google Cloud Document AI for real OCR
- [ ] Firebase Authentication integration
- [ ] Voice input (Web Speech API / Google STT)
- [ ] Full Hindi and Telugu translations
- [ ] ABDM / Ayushman Bharat Digital Mission integration
- [ ] ICD-10 and SNOMED CT coding
- [ ] EMR/HIS integration APIs
- [ ] Mobile app (Flutter)
- [ ] Telemedicine module
- [ ] Analytics dashboard for OPD management

---

## 👥 Team

Built for **Smart India Hackathon 2026**  
Problem Statement: **SIH26047**  
Organization: Ministry of Ayush / All India Institute of Ayurveda

---

*MediKiosk — Reducing the documentation burden so doctors can focus on healing.*
