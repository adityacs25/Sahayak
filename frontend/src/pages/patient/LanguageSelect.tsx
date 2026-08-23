import React from 'react';
import { useNavigate } from 'react-router-dom';

const LanguageSelect: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Please select your preferred language</h2>
      <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <button onClick={() => navigate('/consent')} style={{ padding: '24px', fontSize: '18px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', cursor: 'pointer' }}>🇮🇳 English</button>
        <button onClick={() => navigate('/consent')} style={{ padding: '24px', fontSize: '18px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', cursor: 'pointer' }}>हिंदी (Hindi)</button>
        <button onClick={() => navigate('/consent')} style={{ padding: '24px', fontSize: '18px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', cursor: 'pointer' }}>తెలుగు (Telugu)</button>
      </div>
      <p style={{ marginTop: '24px', color: 'var(--color-neutral-600)' }}>Note: Hindi and Telugu are prototype stubs — English is fully implemented.</p>
    </div>
  );
};
export default LanguageSelect;
