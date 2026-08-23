import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdaptiveQuestions: React.FC = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);

  const questions = [
    { type: 'scale', text: 'On a scale of 1-10, how severe is the pain?' },
    { type: 'boolean', text: 'Does the pain radiate anywhere else?' }
  ];

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      navigate('/red-flags');
    }
  };

  return (
    <div>
      <div style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '16px', fontSize: '12px', marginBottom: '16px' }}>
        🤖 Questions generated based on your chief complaint
      </div>
      <h2>A few more questions based on what you told us</h2>
      
      <div style={{ marginTop: '32px', padding: '24px', backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
        <h3 style={{ marginBottom: '24px' }}>{questions[currentQ].text}</h3>
        
        {questions[currentQ].type === 'scale' && (
          <input type="range" min="1" max="10" style={{ width: '100%' }} />
        )}
        
        {questions[currentQ].type === 'boolean' && (
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>Yes</button>
            <button style={{ flex: 1, padding: '16px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }}>No</button>
          </div>
        )}

        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} style={{ padding: '8px 16px' }}>Back</button>
          <button onClick={handleNext} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Next</button>
        </div>
      </div>
    </div>
  );
};
export default AdaptiveQuestions;
