import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentUpload: React.FC = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);

  const handleUpload = () => {
    setFiles([...files, { name: 'report.pdf', type: 'Lab Report' }]);
  };

  return (
    <div>
      <h2>Upload Medical Documents (Optional)</h2>
      <p style={{ color: 'var(--color-neutral-600)' }}>Note: Uploaded documents will be reviewed by your doctor.</p>
      
      <div onClick={handleUpload} style={{ marginTop: '24px', padding: '48px', border: '2px dashed var(--color-primary)', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', backgroundColor: 'var(--color-primary-light)' }}>
        <div style={{ fontSize: '32px' }}>📄</div>
        <div style={{ marginTop: '16px', color: 'var(--color-primary-dark)' }}>Click or drag files to upload</div>
        <div style={{ fontSize: '12px', marginTop: '8px', color: 'var(--color-neutral-600)' }}>Support: PDF, JPG, PNG (max 10MB)</div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3>Uploaded Documents</h3>
          {files.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', marginTop: '8px' }}>
              <div>
                <strong>{f.name}</strong>
                <div style={{ fontSize: '12px', color: 'var(--color-neutral-600)' }}>{f.type}</div>
              </div>
              <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: '4px', fontSize: '12px' }}>Done</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/ocr-results')} style={{ padding: '12px 24px', backgroundColor: 'transparent', color: 'var(--color-neutral-600)', border: 'none', cursor: 'pointer', fontSize: '16px' }}>Skip</button>
        <button onClick={() => navigate('/ocr-results')} disabled={files.length === 0} style={{ padding: '12px 24px', backgroundColor: files.length > 0 ? 'var(--color-primary)' : 'var(--color-neutral-200)', color: files.length > 0 ? 'white' : 'var(--color-neutral-600)', border: 'none', borderRadius: '8px', cursor: files.length > 0 ? 'pointer' : 'not-allowed', fontSize: '16px' }}>Continue</button>
      </div>
    </div>
  );
};
export default DocumentUpload;
