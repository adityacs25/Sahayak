import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h1>🏥 MediKiosk</h1>
      <p>Your health history, prepared before you meet the doctor.</p>
      <p style={{ color: 'var(--color-neutral-600)' }}>Ministry of Ayush | All India Institute of Ayurveda</p>
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <button onClick={() => navigate('/language')} style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Start New Visit</button>
      </div>
      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', color: 'var(--color-success)' }}>
        <span>🔒 Secure</span> • <span>Confidential</span> • <span>🤖 AI-Assisted</span>
      </div>
    </div>
  );
};
export default Welcome;
