export interface User {
  id: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  full_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Patient {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  phone_number: string;
  address?: string;
  dob?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface ClinicalCase {
  id: string;
  patient_id: string;
  chief_complaint: string;
  case_status: CaseStatus;
  priority: Priority;
  created_at: string;
}

export interface CaseListItem extends ClinicalCase {
  patient_name: string;
  patient_age: number;
  wait_time_minutes: number;
}

export interface HistoryAnswer {
  question_key: string;
  question_text: string;
  answer_text: string;
}

export interface RedFlag {
  id: string;
  flag_type: string;
  description: string;
  severity: 'normal' | 'attention' | 'urgent';
  reason: string;
}

export interface Document {
  id: string;
  file_name: string;
  document_type: string;
  processing_status: 'processing' | 'done' | 'error';
  upload_date: string;
}

export interface ExtractedData {
  field_name: string;
  field_value: string;
  unit: string;
  reference_range: string;
  is_abnormal: boolean;
}

export interface TimelineEvent {
  id: string;
  event_date: string;
  event_type: string;
  title: string;
  description: string;
  source: string;
}

export interface AiSummary {
  patient_overview: any;
  chief_complaint_summary: string;
  history_summary: string;
  ai_narrative: string;
  is_mock: boolean;
}

export interface Question {
  question_key: string;
  question_text: string;
  question_type: 'text' | 'scale' | 'boolean' | 'choice';
  options?: string[];
}

export interface FullCase {
  case_info: ClinicalCase;
  patient: Patient;
  red_flags: RedFlag[];
  documents: Document[];
  timeline: TimelineEvent[];
  summary: AiSummary;
  history: Record<string, HistoryAnswer[]>;
}

export type CaseStatus = 'draft' | 'in_progress' | 'ready_for_review' | 'reviewed' | 'confirmed';
export type Priority = 'normal' | 'attention' | 'urgent';
