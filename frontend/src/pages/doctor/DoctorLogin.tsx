import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { authApi } from '../../services/api';

const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('doctor@demo.com');
  const [password, setPassword] = useState('demo1234');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      navigate('/doctor/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>👨‍⚕️ Doctor Portal</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', marginTop: '16px' }}>Login</button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: 'var(--color-neutral-600)' }}>
          <p>Demo credentials:</p>
          <p>doctor@demo.com / demo1234</p>
          <a href="/" style={{ display: 'block', marginTop: '16px' }}>Back to Patient Kiosk</a>
        </div>
      </div>
    </div>
  );
};
export default DoctorLogin;
