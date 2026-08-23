import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { authApi } from '../../services/api';

const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAppContext();
  const [email, setEmail] = useState('doctor@demo.com');
  const [password, setPassword] = useState('demo1234');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await authApi.login(email, password);
      setUser(res.user);
      navigate('/doctor/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setErrorMessage('Unable to reach the service. Please try again shortly.');
        } else if (error.response.status === 401) {
          setErrorMessage('The email or password is incorrect.');
        } else if (error.response.status === 404) {
          setErrorMessage('The sign-in service is not available. Please try again later.');
        } else if (error.response.status === 422) {
          setErrorMessage('Please enter a valid email address and password.');
        } else {
          setErrorMessage('Unable to sign in right now. Please try again.');
        }
      } else {
        setErrorMessage('Unable to sign in right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-background)' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', backgroundColor: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>👨‍⚕️ Doctor Portal</h2>
        
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '16px' }}>
          {errorMessage && <p role="alert" style={{ margin: 0, color: 'var(--color-error, #b42318)' }}>{errorMessage}</p>}
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <button type="submit" disabled={isSubmitting} style={{ padding: '12px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '16px', marginTop: '16px' }}>{isSubmitting ? 'Signing in...' : 'Login'}</button>
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
