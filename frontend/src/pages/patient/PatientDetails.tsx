import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const PatientDetails: React.FC = () => {
  const navigate = useNavigate();
  const { setPatientData } = useAppContext();
  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: 'Male', phone_number: '',
    address: '', dob: '', emergency_contact_name: '', emergency_contact_phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPatientData(formData as any);
    navigate('/chief-complaint');
  };

  return (
    <div>
      <div style={{ color: 'var(--color-neutral-600)', marginBottom: '8px' }}>Step 3 of 12</div>
      <h2>Your Details</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'grid', gap: '16px', backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
        <div style={{ display: 'grid', gap: '4px' }}>
          <label>Full Name *</label>
          <input required type="text" name="full_name" value={formData.full_name} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Age *</label>
            <input required type="number" min="1" max="120" name="age" value={formData.age} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }}>
              <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Phone Number *</label>
            <input required type="tel" pattern="[0-9]{10}" name="phone_number" value={formData.phone_number} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '4px' }}>
          <label>City/Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Emergency Contact Name</label>
            <input type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
          <div style={{ display: 'grid', gap: '4px' }}>
            <label>Emergency Contact Phone</label>
            <input type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
          </div>
        </div>

        <button type="submit" style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Continue</button>
      </form>
    </div>
  );
};
export default PatientDetails;
