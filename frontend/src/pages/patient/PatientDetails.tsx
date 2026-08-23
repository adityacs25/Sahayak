import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { patientApi } from '../../services/api';
import { PatientCreate } from '../../types';

const getRequestErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error) || !error.response) {
    return 'Unable to reach the service. Please try again shortly.';
  }

  if (error.response.status === 401) return 'You are not authorized to complete this request.';
  if (error.response.status === 422) return 'Please check the details you entered and try again.';
  return 'Unable to save your details right now. Please try again.';
};

const PatientDetails: React.FC = () => {
  const navigate = useNavigate();
  const { setPatientData, setPatientId } = useAppContext();
  const [formData, setFormData] = useState({
    full_name: '', age: '', gender: 'Male', phone_number: '',
    address: '', date_of_birth: '', emergency_contact_name: '', emergency_contact_phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const patient: PatientCreate = {
      full_name: formData.full_name.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      phone_number: formData.phone_number.trim(),
      ...(formData.date_of_birth && { date_of_birth: formData.date_of_birth }),
      ...(formData.address.trim() && { address: formData.address.trim() }),
      ...(formData.emergency_contact_name.trim() && { emergency_contact_name: formData.emergency_contact_name.trim() }),
      ...(formData.emergency_contact_phone.trim() && { emergency_contact_phone: formData.emergency_contact_phone.trim() }),
    };

    try {
      const createdPatient = await patientApi.createPatient(patient);
      setPatientId(createdPatient.id);
      setPatientData(createdPatient);
      navigate('/chief-complaint');
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ color: 'var(--color-neutral-600)', marginBottom: '8px' }}>Step 3 of 12</div>
      <h2>Your Details</h2>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '24px', display: 'grid', gap: '16px', backgroundColor: 'var(--color-surface)', padding: '24px', borderRadius: '12px', border: '1px solid var(--color-neutral-200)' }}>
        {errorMessage && <p role="alert" style={{ margin: 0, color: 'var(--color-error, #b42318)' }}>{errorMessage}</p>}
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
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--color-neutral-200)' }} />
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

        <button type="submit" disabled={isSubmitting} style={{ marginTop: '16px', padding: '12px 24px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '16px' }}>{isSubmitting ? 'Saving...' : 'Continue'}</button>
      </form>
    </div>
  );
};
export default PatientDetails;
