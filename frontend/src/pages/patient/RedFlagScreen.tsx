import React from 'react';
import { useNavigate } from 'react-router-dom';

const RedFlagScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ padding: '24px', backgroundColor: '#fef2f2', border: '1px solid var(--color-urgent)', borderRadius: '12px', color: 'var(--color-urgent)' }}>
        <h2>⚠️ Clinical Attention Recommended</h2>
        <p style={{ marginTop: '16px' }}>Reported symptoms include features that may require prompt clinical assessment.</p>
        <p><strong>Please immediately inform the triage/nursing staff.</strong></p>
        
        <ul style={{ marginTop: '16px', paddingLeft: '24px' }}>
          <li>Chest pain with potential radiation</li>
        </ul>

        <p style={{ marginTop: '16px', fontSize: '12px' }}>Disclaimer: This is a triage signal only. A qualified doctor will assess you.</p>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button onClick={() => alert('Staff alerted!')} style={{ padding: '12px 24px', backgroundColor: 'white', color: 'var(--color-urgent)', border: '1px solid var(--color-urgent)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Alert Staff</button>
        <button onClick={() => navigate('/documents')} style={{ padding: '12px 24px', backgroundColor: 'var(--color-urgent)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Continue</button>
      </div>
    </div>
  );
};
export default RedFlagScreen;
