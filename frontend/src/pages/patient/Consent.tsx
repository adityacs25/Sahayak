import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Consent: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div>
      <h2>Your Privacy & Consent</h2>
      <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>
          <h3>📋 Why we collect your information</h3>
          <p>To help the doctor understand your condition better before you meet.</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>
          <h3>🔒 How it is kept secure</h3>
          <p>Your data is encrypted and stored safely following medical standards.</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>
          <h3>👨‍⚕️ Who will see your information</h3>
          <p>Only your consulting doctor and authorized medical staff.</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>
          <h3>🤖 About AI-assisted review</h3>
          <p>AI helps summarize your history, but a qualified doctor will always verify it.</p>
        </div>
      </div>
      
      <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" id="consent" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width: '20px', height: '20px' }} />
        <label htmlFor="consent">I have read and understood the above. I consent to provide my clinical history.</label>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '12px 24px', backgroundColor: 'var(--color-neutral-200)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Go Back</button>
        <button onClick={() => navigate('/patient-details')} disabled={!agreed} style={{ padding: '12px 24px', backgroundColor: agreed ? 'var(--color-primary)' : 'var(--color-neutral-200)', color: agreed ? 'white' : 'var(--color-neutral-600)', border: 'none', borderRadius: '8px', cursor: agreed ? 'pointer' : 'not-allowed' }}>I Agree & Continue</button>
      </div>
    </div>
  );
};
export default Consent;
