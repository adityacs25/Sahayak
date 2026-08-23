import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AiSummaryReview: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2>Success!</h2>
        <p>Your clinical history has been submitted.</p>
        <p>Case ID: <strong>CAS-{Math.floor(Math.random() * 10000)}</strong></p>
        <button onClick={() => navigate('/')} style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Return to Home</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '16px', backgroundColor: '#fffbeb', color: '#b45309', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fde68a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>🤖 AI-Generated Summary — Requires Doctor Review</span>
        <span style={{ fontSize: '12px', padding: '4px 8px', backgroundColor: '#fef3c7', borderRadius: '4px' }}>[DEMO] Mock AI Response</span>
      </div>

      <h2>Your Visit Summary</h2>
      
      <div style={{ display: 'grid', gap: '16px', marginTop: '24px' }}>
        <div style={{ padding: '16px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', backgroundColor: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Patient Overview</h3>
          <p>Male, 45 years old.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', backgroundColor: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Chief Complaint</h3>
          <p>Chest pain and shortness of breath.</p>
        </div>
        <div style={{ padding: '16px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', backgroundColor: 'var(--color-surface)' }}>
          <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>AI Narrative</h3>
          <p>Patient presents with acute chest pain suspicious for ischemic origin. Follow-up questions indicate radiation to the left arm.</p>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button style={{ padding: '12px 24px', backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Review & Edit</button>
        <button onClick={() => setSubmitted(true)} style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Submit to Doctor</button>
      </div>
    </div>
  );
};
export default AiSummaryReview;
