import React from 'react';
import { Outlet } from 'react-router-dom';

const PatientLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '16px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <h2>🏥 MediKiosk</h2>
      </header>
      <main style={{ flex: 1, padding: '24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
