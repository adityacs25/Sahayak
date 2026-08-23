import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorApi } from '../../services/api';
import { FullCase } from '../../types';

const CaseView: React.FC = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<FullCase | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (caseId) {
      doctorApi.getCase(caseId).then(setCaseData);
    }
  }, [caseId]);

  if (!caseData) return <div>Loading...</div>;

  const handleConfirm = async () => {
    if (window.confirm("Are you sure you want to confirm this case? This will mark the clinical history as reviewed by you.")) {
      await doctorApi.confirmCase(caseId!);
      alert('Case confirmed successfully!');
      navigate('/doctor/dashboard');
    }
  };

  return (
    <div>
      <div style={{ color: 'var(--color-neutral-600)', fontSize: '14px', marginBottom: '16px' }}>
        Dashboard &gt; Patient Queue &gt; {caseData.patient.full_name}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
        <div>
          <h2>{caseData.patient.full_name}</h2>
          <div style={{ color: 'var(--color-neutral-600)', marginTop: '8px' }}>
            {caseData.patient.age} yrs • {caseData.patient.gender} • ID: {caseId}
          </div>
        </div>
        <div>
          {caseData.case_info.priority === 'urgent' && <span style={{ padding: '8px 16px', backgroundColor: 'var(--color-urgent)', color: 'white', borderRadius: '24px', fontWeight: 'bold' }}>Urgent Review</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginTop: '24px', borderBottom: '1px solid var(--color-neutral-200)', paddingBottom: '8px' }}>
        {['Overview', 'History', 'Red Flags', 'Documents', 'Timeline', 'AI Summary'].map(tab => {
          const tabKey = tab.toLowerCase().replace(' ', '-');
          return (
            <button key={tab} onClick={() => setActiveTab(tabKey)} style={{ padding: '8px 16px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderBottom: activeTab === tabKey ? '2px solid var(--color-primary)' : 'none', color: activeTab === tabKey ? 'var(--color-primary)' : 'var(--color-neutral-600)', fontWeight: activeTab === tabKey ? 'bold' : 'normal', fontSize: '16px' }}>
              {tab}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '24px' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
              <h3 style={{ color: 'var(--color-neutral-600)', fontSize: '14px', marginBottom: '8px' }}>Chief Complaint</h3>
              <div style={{ fontSize: '24px' }}>{caseData.case_info.chief_complaint}</div>
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
              <h3>AI Summary Preview</h3>
              <div style={{ padding: '16px', backgroundColor: '#fffbeb', color: '#b45309', borderRadius: '8px', marginBottom: '16px', border: '1px solid #fde68a', marginTop: '16px' }}>
                🤖 AI-Generated — Requires Doctor Review and Confirmation
              </div>
              <p>{caseData.summary.ai_narrative}</p>
              <button onClick={() => setActiveTab('ai-summary')} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>View Full Summary</button>
            </div>
          </div>
        )}

        {activeTab === 'ai-summary' && (
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
            <div style={{ padding: '16px', backgroundColor: '#fffbeb', color: '#b45309', borderRadius: '8px', marginBottom: '24px', border: '1px solid #fde68a' }}>
              <h2>⚠️ AI-Generated Summary</h2>
              <p>Requires Doctor Review and Confirmation. [DEMO] Prototype Mock AI Output.</p>
            </div>
            
            <div style={{ display: 'grid', gap: '24px' }}>
              <div>
                <h3>Narrative</h3>
                <textarea defaultValue={caseData.summary.ai_narrative} style={{ width: '100%', height: '100px', marginTop: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }} />
              </div>
              
              <div>
                <h3>Doctor Notes</h3>
                <textarea placeholder="Add your notes here..." style={{ width: '100%', height: '100px', marginTop: '8px', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)' }} />
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'flex-end', borderTop: '1px solid var(--color-neutral-200)', paddingTop: '24px' }}>
              <button style={{ padding: '12px 24px', backgroundColor: 'white', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', borderRadius: '8px', cursor: 'pointer' }}>Save Changes</button>
              <button onClick={handleConfirm} style={{ padding: '12px 24px', backgroundColor: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>Confirm Case</button>
            </div>
          </div>
        )}

        {['history', 'red-flags', 'documents', 'timeline'].includes(activeTab) && (
          <div style={{ padding: '48px', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-neutral-200)', color: 'var(--color-neutral-600)' }}>
            Section details loaded here. Switch to AI Summary to confirm case.
          </div>
        )}
      </div>
    </div>
  );
};
export default CaseView;
