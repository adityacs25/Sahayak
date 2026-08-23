import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChiefComplaint: React.FC = () => {
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState('');

  const chips = ['Chest pain', 'Headache', 'Cough', 'Joint pain', 'Fever', 'Stomach pain'];

  return (
    <div>
      <h2>What brings you to the clinic today?</h2>
      
      <div style={{ marginTop: '24px' }}>
        <textarea 
          value={complaint} 
          onChange={e => setComplaint(e.target.value)}
          placeholder="E.g. I have been having a severe headache for the past 3 days..."
          style={{ width: '100%', height: '150px', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', resize: 'none', fontSize: '16px' }}
        />
        <div style={{ textAlign: 'right', color: 'var(--color-neutral-600)', fontSize: '12px', marginTop: '4px' }}>
          {complaint.length}/500 characters
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {chips.map(chip => (
          <button key={chip} onClick={() => setComplaint(chip)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', cursor: 'pointer' }}>
            {chip}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button onClick={() => alert("Voice input will be available soon — please type your complaint.")} style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-primary)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-primary)' }}>
          🎤 Voice Input
        </button>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/clinical-history')} disabled={!complaint} style={{ padding: '12px 24px', backgroundColor: complaint ? 'var(--color-primary)' : 'var(--color-neutral-200)', color: complaint ? 'white' : 'var(--color-neutral-600)', border: 'none', borderRadius: '8px', cursor: complaint ? 'pointer' : 'not-allowed', fontSize: '16px' }}>Continue</button>
      </div>
    </div>
  );
};
export default ChiefComplaint;
