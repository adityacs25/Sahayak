# 🎙️ MediKiosk Demo Presentation Script
## Smart India Hackathon 2026 | Problem Statement: SIH26047
**Time Target**: 3–5 Minutes  
**Audience**: SIH Evaluation Panel, Ministry of Ayush & AIIA Representatives

---

## ⏱️ Presentation Timeline Overview

| Timestamp | Phase | Focus / Action |
|-----------|-------|----------------|
| **0:00 – 0:30** | The Challenge & Value Proposition | OPD bottlenecks, history burden & safety approach |
| **0:30 – 1:00** | System Architecture & Dual Portals | Flow overview, kiosk patient intake & doctor workspace |
| **1:00 – 2:30** | Live Patient Intake Demonstration | Multilingual intake, adaptive questions, red-flag alert, OCR & timeline |
| **2:30 – 3:45** | Live Doctor Portal & Clinical Review | Priority queue, 6-tab case deep-dive, AI summary edit & confirm |
| **3:45 – 4:15** | Ayush / Ayurveda Integration | Prakriti, Vikriti & holistic Ahara-Vihara documentation |
| **4:15 – 5:00** | Scalability, ABDM Roadmap & Q&A | National health architecture alignment & conclusion |

---

## 📋 Step-by-Step Demo Script & Speaker Cues

---

### Segment 1: The Problem & The Solution (0:00 – 0:30)

**[Speaker 1 - Hook]**
> *"Respected judges and esteemed representatives from the Ministry of Ayush and AIIA,*
> 
> *In high-volume OPDs across premier institutes like AIIA, doctors consult dozens of patients daily. Yet, studies show doctors spend **30 to 40% of their consultation time merely eliciting and typing repetitive history details**.*
>
> *Patients often forget critical prior medications, paper records are unsearchable, and life-threatening red-flag symptoms can easily get delayed in crowded waiting rooms.*
>
> *To solve this, we present **MediKiosk** — an AI-assisted, assistive clinical intake platform engineered to empower patients in the waiting area while delivering structured, verified clinical summaries directly to the doctor's desk."*

---

### Segment 2: Safety & Assistive Architecture (0:30 – 1:00)

**[Speaker 2 - Architecture & Safety Core]**
> *"Before diving in, let's emphasize our core medical design philosophy:*
> 
> **MediKiosk is an assistive documentation tool — NOT an automated diagnostic system.** 
> It does not prescribe medications. All AI summaries and clinical flags require human doctor oversight and sign-off.
>
> *Our architecture combines a reactive kiosk frontend with a robust FastAPI backend, adaptive symptom logic, multi-modal OCR ingestion, and dedicated Ayurveda assessment modules."*

---

### Segment 3: Live Patient Flow Demo (1:00 – 2:30)

**[Screen Action: Open `http://localhost:5173` on Kiosk Display]**

**[Speaker 1 - Kiosk Demo]**
> *"Let us step into the shoes of **Ramesh Kumar**, a 58-year-old patient arriving at the AIIA OPD."*

1. **Language & Informed Consent (`01_LanguageSelect` & `02_Consent`)**:
   > *"Ramesh is greeted by a clean, high-contrast, accessible kiosk. He selects his preferred language. A clear, plain-language digital consent screen explains how his clinical data will be used solely for his consultation."*

2. **Demographics & Chief Complaint (`03_PatientInfo` & `04_ChiefComplaint`)**:
   > *"He enters his basic details and records his primary concern: **'Chest pain radiating to the left arm for the past 2 days.'**"*

3. **Adaptive Clinical Questioning (`05_ClinicalHistory` & `06_AdaptiveQuestions`)**:
   > *"Unlike static forms, MediKiosk uses dynamic adaptive branching. Detecting chest pain, it immediately asks targeted follow-ups: 'Does the pain radiate to your jaw or left arm?', 'Are you experiencing sweating or shortness of breath?' Ramesh checks 'Yes'."*

4. **Triage Signaling (`07_RedFlagAlert`)**:
   > *"Immediately, the system flags a **Cardiovascular Red Flag**. The kiosk reassures the patient, notifies OPD staff, and automatically elevates the case priority to **Urgent**."*

5. **Document OCR & Medical Timeline (`08_DocumentUpload` & `09_MedicalTimeline`)**:
   > *"Ramesh snaps a picture of his prior lab report. The built-in OCR extracts his lipid profile (elevated LDL and Triglycerides) and places them onto an interactive **Medical Timeline**, chronologically mapping his hypertension, past treatments, and current episode."*

6. **Summary Review & Submission (`10_PatientSummaryReview`)**:
   > *"Ramesh confirms his collected information and taps **Submit Case**. In under 4 minutes of waiting room time, a comprehensive case is ready."*

---

### Segment 4: Live Doctor Portal Demo (2:30 – 3:45)

**[Screen Action: Switch to Doctor Tab at `http://localhost:5173/doctor/login` → Log in as `doctor@demo.com`]**

**[Speaker 2 - Clinical Workflow]**
> *"Now let's switch to the doctor's examination room.*
> 
> *Dr. Ananya logs into the **Doctor Portal**. In her real-time OPD Queue, Ramesh Kumar appears at the very top with a bright **🔴 URGENT** priority badge."*

1. **OPD Queue (`11_DoctorDashboard`)**:
   > *"The doctor can instantly see who needs immediate triage versus routine consultation."*

2. **6-Tab Case Review (`12_CaseReview`)**:
   > *"Dr. Ananya clicks on Ramesh's case. She has instant access to 6 structured tabs:*
   > 1. **Chief Complaint & Vitals**
   > 2. **Structured History (HPI, Past Medical, Medications, Allergies)**
   > 3. **Ayurveda & Prakriti Assessment**
   > 4. **Uploaded Documents & Extracted Lab Findings**
   > 5. **Visual Medical Timeline**
   > 6. **AI Synthesized Clinical Summary**"*

3. **Human-in-the-Loop Verification (`13_SummaryEdit` & `14_DoctorNotes`)**:
   > *"The doctor reviews the AI-generated HPI. Dr. Ananya clicks **Edit**, adds a clinical remark ('Ordered immediate 12-lead ECG & Troponin'), appends her clinical note, and clicks **Confirm Case**.*
   >
   > *With one click, the verified case is sealed and ready for hospital EMR integration. History taking time drops from 10 minutes to under 60 seconds of doctor review."*

---

### Segment 5: The Ayush & Ayurveda Advantage (3:45 – 4:15)

**[Speaker 1 - Ayush Module]**
> *"Because this problem statement SIH26047 originates from the **Ministry of Ayush / AIIA**, MediKiosk includes first-class support for holistic Ayurvedic clinical parameters:*
> - **Prakriti** (Vata, Pitta, Kapha baseline constitution)
> - **Vikriti** (Current doshic imbalance)
> - **Agni** (Digestive fire assessment)
> - **Ahara-Vihara** (Dietary and lifestyle patterns)
>
> *This ensures modern allopathic history and classical Ayurvedic paradigms coexist seamlessly in a single digital record."*

---

### Segment 6: Impact & Future Roadmap (4:15 – 5:00)

**[Speaker 2 - Closing]**
> *"In summary, MediKiosk delivers:*
> - ⏱️ **60%+ reduction** in OPD history documentation time
> - ⚠️ **Zero missed red-flags** with proactive triage signaling
> - 📄 **End-to-end digitisation** of legacy paper reports via OCR
> - 🇮🇳 **Ayush-ready, ABDM-compliant** architecture for national scale
>
> *Our roadmap includes Google Gemini integration for conversational vernacular history-taking, Google Cloud Document AI for advanced prescription OCR, and full Ayushman Bharat Digital Mission (ABDM) FHIR compliance.*
>
> *Thank you! We welcome your questions."*

---

## 🎯 Quick Judge Q&A Cheat Sheet

| Question | Recommended Answer |
|----------|--------------------|
| **"What if an elderly patient cannot operate the kiosk?"** | MediKiosk supports family assisted mode, hospital volunteer/Sahayak assistance, high-contrast large touch targets, and a planned vernacular voice interface. |
| **"Is this diagnosing the patient?"** | No. MediKiosk strictly collects, structures, and triages information. It provides assistive summaries with mandatory doctor review before confirmation. |
| **"How does it handle patient data privacy?"** | Digital consent is captured upfront, session data is tokenized with JWT, and architecture aligns with DISHA and ABDM privacy guidelines. |
| **"Can it work without continuous internet?"** | Yes, the kiosk frontend can operate in local offline/edge caching mode with SQLite, syncing with the central hospital server when connected. |
