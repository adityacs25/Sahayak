import axios from 'axios';
import { LoginResponse, Patient, PatientCreate, ClinicalCase, CaseCreate, CaseListItem, HistoryAnswer, RedFlag, Document, AiSummary, Question, FullCase } from '../types';

export const ACCESS_TOKEN_STORAGE_KEY = 'medikiosk_access_token';

export const getAccessToken = (): string | null => sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

export const setAccessToken = (token: string): void => {
  sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
};

export const clearAccessToken = (): void => {
  sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
});

const isMock = import.meta.env.VITE_API_MODE === 'mock';

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Mock Data
const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', full_name: 'Rahul Sharma', age: 45, gender: 'Male', phone_number: '9876543210' },
  { id: 'p2', full_name: 'Priya Patel', age: 32, gender: 'Female', phone_number: '9876543211' }
];

const MOCK_CASES: CaseListItem[] = [
  { id: 'c1', patient_id: 'p1', chief_complaint: 'Chest pain and shortness of breath', case_status: 'ready_for_review', priority: 'urgent', created_at: new Date().toISOString(), patient_name: 'Rahul Sharma', patient_age: 45, wait_time_minutes: 15 },
  { id: 'c2', patient_id: 'p2', chief_complaint: 'Persistent headache for 3 days', case_status: 'ready_for_review', priority: 'attention', created_at: new Date().toISOString(), patient_name: 'Priya Patel', patient_age: 32, wait_time_minutes: 45 }
];

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response: LoginResponse = isMock
      ? { access_token: 'mock-token', token_type: 'bearer', user: { id: 'u1', email, role: 'doctor', full_name: 'Dr. Smith' } }
      : (await api.post<LoginResponse>('/auth/login', { email, password })).data;

    setAccessToken(response.access_token);
    return response;
  }
};

export const patientApi = {
  createPatient: async (data: PatientCreate): Promise<Patient> => {
    if (isMock) return { ...data, id: 'p' + Date.now() } as Patient;
    const res = await api.post<Patient>('/patients', data);
    return res.data;
  },
  createCase: async (patientId: string, chiefComplaint: string): Promise<ClinicalCase> => {
    if (isMock) return { id: 'c' + Date.now(), patient_id: patientId, chief_complaint: chiefComplaint, case_status: 'in_progress', priority: 'normal', created_at: new Date().toISOString() };
    const payload: CaseCreate = { patient_id: patientId, chief_complaint: chiefComplaint };
    const res = await api.post<ClinicalCase>('/cases', payload);
    return res.data;
  },
  submitHistory: async (caseId: string, answers: HistoryAnswer[]): Promise<void> => {
    if (isMock) return;
    await api.post(`/cases/${caseId}/history`, { answers });
  },
  getAdaptiveQuestions: async (caseId: string, complaint: string): Promise<Question[]> => {
    if (isMock) return [
      { question_key: 'q1', question_text: 'On a scale of 1-10, how severe is the pain?', question_type: 'scale' },
      { question_key: 'q2', question_text: 'Does the pain radiate anywhere else?', question_type: 'boolean' }
    ];
    const res = await api.get(`/cases/${caseId}/adaptive-questions`, { params: { complaint } });
    return res.data;
  },
  detectRedFlags: async (caseId: string): Promise<RedFlag[]> => {
    if (isMock) return [
      { id: 'rf1', flag_type: 'Cardiac', description: 'Possible cardiac event based on chest pain description', severity: 'urgent', reason: 'Patient mentioned left arm radiation' }
    ];
    const res = await api.get(`/cases/${caseId}/red-flags`);
    return res.data;
  },
  uploadDocument: async (caseId: string, file: File, documentType: string): Promise<Document> => {
    if (isMock) return { id: 'd' + Date.now(), file_name: file.name, document_type: documentType, processing_status: 'processing', upload_date: new Date().toISOString() };
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    const res = await api.post(`/cases/${caseId}/documents`, formData);
    return res.data;
  },
  getSummary: async (caseId: string): Promise<AiSummary> => {
    if (isMock) return {
      patient_overview: { age: 45, gender: 'Male' },
      chief_complaint_summary: 'Patient reports severe chest pain.',
      history_summary: 'Pain started 2 hours ago. Radiates to left arm.',
      ai_narrative: 'Patient presents with acute chest pain suspicious for ischemic origin.',
      is_mock: true
    };
    const res = await api.get(`/cases/${caseId}/summary`);
    return res.data;
  }
};

export const doctorApi = {
  getQueue: async (): Promise<CaseListItem[]> => {
    if (isMock) return MOCK_CASES;
    const res = await api.get('/doctor/queue');
    return res.data;
  },
  getCase: async (caseId: string): Promise<FullCase> => {
    if (isMock) {
      const caseItem = MOCK_CASES.find(c => c.id === caseId) || MOCK_CASES[0];
      const patient = MOCK_PATIENTS.find(p => p.id === caseItem.patient_id) || MOCK_PATIENTS[0];
      return {
        case_info: caseItem,
        patient,
        red_flags: [],
        documents: [],
        timeline: [],
        summary: await patientApi.getSummary(caseId),
        history: {}
      };
    }
    const res = await api.get(`/doctor/cases/${caseId}`);
    return res.data;
  },
  confirmCase: async (caseId: string): Promise<void> => {
    if (isMock) return;
    await api.post(`/doctor/cases/${caseId}/confirm`);
  }
};
