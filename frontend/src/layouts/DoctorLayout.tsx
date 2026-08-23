import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const DoctorLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      <aside style={{ width: '250px', backgroundColor: 'var(--color-neutral-900)', color: 'white', padding: '24px' }}>
        <h2>MediKiosk Pro</h2>
        <nav style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Link to="/doctor/dashboard" style={{ color: 'white' }}>🏠 Dashboard</Link>
          <Link to="/doctor/dashboard" style={{ color: 'white' }}>👥 Patient Queue</Link>
          <Link to="/" style={{ color: 'white', marginTop: 'auto' }}>Logout</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '32px', backgroundColor: 'var(--color-background)' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
