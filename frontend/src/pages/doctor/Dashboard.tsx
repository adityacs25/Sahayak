import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorApi } from '../../services/api';
import { CaseListItem } from '../../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<CaseListItem[]>([]);

  useEffect(() => {
    doctorApi.getQueue().then(setQueue);
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Good morning, Dr. Smith</h2>
        <span style={{ color: 'var(--color-neutral-600)' }}>{new Date().toDateString()}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-neutral-600)' }}>Total Today</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{queue.length}</div>
        </div>
        <div style={{ padding: '24px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-neutral-600)' }}>Pending Review</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>{queue.filter(q => q.case_status === 'ready_for_review').length}</div>
        </div>
        <div style={{ padding: '24px', backgroundColor: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-urgent)' }}>Urgent</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-urgent)' }}>{queue.filter(q => q.priority === 'urgent').length}</div>
        </div>
        <div style={{ padding: '24px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '14px', color: 'var(--color-success)' }}>Confirmed</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-success)' }}>0</div>
        </div>
      </div>

      <h3 style={{ marginTop: '48px', marginBottom: '16px' }}>Today's Queue</h3>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid var(--color-neutral-200)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--color-neutral-50)' }}>
            <tr>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>Patient</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>Chief Complaint</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>Priority</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>Wait Time</th>
              <th style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {queue.map(item => (
              <tr key={item.id} style={{ cursor: 'pointer', transition: 'background-color 0.2s' }} onClick={() => navigate(`/doctor/cases/${item.id}`)} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-neutral-50)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>
                  <strong>{item.patient_name}</strong><br/>
                  <span style={{ fontSize: '12px', color: 'var(--color-neutral-600)' }}>{item.patient_age} yrs</span>
                </td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>{item.chief_complaint}</td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>
                  {item.priority === 'urgent' && <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-urgent)', color: 'white', borderRadius: '16px', fontSize: '12px' }}>Urgent Review</span>}
                  {item.priority === 'attention' && <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-warning)', color: 'white', borderRadius: '16px', fontSize: '12px' }}>Attention</span>}
                  {item.priority === 'normal' && <span style={{ padding: '4px 8px', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: '16px', fontSize: '12px' }}>Normal</span>}
                </td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>{item.wait_time_minutes} mins</td>
                <td style={{ padding: '16px', borderBottom: '1px solid var(--color-neutral-200)' }}>
                  <button style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Dashboard;
