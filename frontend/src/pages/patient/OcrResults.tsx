import React from 'react';
import { useNavigate } from 'react-router-dom';

const OcrResults: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div style={{ padding: '12px', backgroundColor: '#fffbeb', color: '#b45309', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fde68a' }}>
        ⚠️ Extracted information — Requires Doctor Verification
      </div>
      
      <h2>Extracted Document Information</h2>
      
      <div style={{ marginTop: '24px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--color-neutral-100)' }}>
            <tr>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>Field Name</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>Value</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>Unit</th>
              <th style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>Hemoglobin</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)', color: 'var(--color-urgent)', fontWeight: 'bold' }}>10.2</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>g/dL</td>
              <td style={{ padding: '12px', borderBottom: '1px solid var(--color-neutral-200)' }}>12.0 - 15.5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/timeline')} style={{ padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Continue</button>
      </div>
    </div>
  );
};
export default OcrResults;
