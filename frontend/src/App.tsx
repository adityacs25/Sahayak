import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';

// Pages - Patient
import Welcome from './pages/patient/Welcome';
import LanguageSelect from './pages/patient/LanguageSelect';
import Consent from './pages/patient/Consent';
import PatientDetails from './pages/patient/PatientDetails';
import ChiefComplaint from './pages/patient/ChiefComplaint';
import ClinicalHistory from './pages/patient/ClinicalHistory';
import AdaptiveQuestions from './pages/patient/AdaptiveQuestions';
import RedFlagScreen from './pages/patient/RedFlagScreen';
import DocumentUpload from './pages/patient/DocumentUpload';
import OcrResults from './pages/patient/OcrResults';
import Timeline from './pages/patient/Timeline';
import AiSummaryReview from './pages/patient/AiSummaryReview';

// Pages - Doctor
import DoctorLogin from './pages/doctor/DoctorLogin';
import Dashboard from './pages/doctor/Dashboard';
import CaseView from './pages/doctor/CaseView';

// Layouts
import PatientLayout from './layouts/PatientLayout';
import DoctorLayout from './layouts/DoctorLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  if (!user || user.role !== 'doctor') {
    return <Navigate to="/doctor/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PatientLayout />}>
        <Route path="/" element={<Welcome />} />
        <Route path="/language" element={<LanguageSelect />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/patient-details" element={<PatientDetails />} />
        <Route path="/chief-complaint" element={<ChiefComplaint />} />
        <Route path="/clinical-history" element={<ClinicalHistory />} />
        <Route path="/adaptive-questions" element={<AdaptiveQuestions />} />
        <Route path="/red-flags" element={<RedFlagScreen />} />
        <Route path="/documents" element={<DocumentUpload />} />
        <Route path="/ocr-results" element={<OcrResults />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/summary" element={<AiSummaryReview />} />
      </Route>

      <Route path="/doctor/login" element={<DoctorLogin />} />
      <Route element={<ProtectedRoute><DoctorLayout /></ProtectedRoute>}>
        <Route path="/doctor/dashboard" element={<Dashboard />} />
        <Route path="/doctor/cases/:caseId" element={<CaseView />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
