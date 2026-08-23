import React from 'react';
import { useNavigate } from 'react-router-dom';

const Timeline: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Medical Timeline</h2>
      
      <div style={{ marginTop: '32px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--color-neutral-200)' }}>
        
        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{ position: 'absolute', left: '-31px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', border: '2px solid white' }}></div>
          <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '14px' }}>Today</div>
          <div style={{ padding: '16px', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', marginTop: '8px', border: '1px solid var(--color-primary)' }}>
            <strong>🏥 Current Visit</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Reporting chest pain and headache.</p>
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '32px' }}>
          <div style={{ position: 'absolute', left: '-31px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-neutral-400)', border: '2px solid white' }}></div>
          <div style={{ color: 'var(--color-neutral-600)', fontWeight: 'bold', fontSize: '14px' }}>2022</div>
          <div style={{ padding: '16px', backgroundColor: 'var(--color-surface)', borderRadius: '8px', marginTop: '8px', border: '1px solid var(--color-neutral-200)' }}>
            <strong>🧪 Lab Test</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>Routine blood work - Normal.</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/summary')} style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Continue</button>
      </div>
    </div>
  );
};
export default Timeline;
