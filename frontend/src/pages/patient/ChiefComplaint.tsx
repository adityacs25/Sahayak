import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { patientApi } from '../../services/api';

const getRequestErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error) || !error.response) {
    return 'Unable to reach the service. Please try again shortly.';
  }

  if (error.response.status === 401) return 'You are not authorized to complete this request.';
  if (error.response.status === 422) return 'Please check your complaint and try again.';
  return 'Unable to save your complaint right now. Please try again.';
};

const ChiefComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { patientId, setCaseId } = useAppContext();
  const [complaint, setComplaint] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chips = ['Chest pain', 'Headache', 'Cough', 'Joint pain', 'Fever', 'Stomach pain'];

  const handleContinue = async () => {
    const chiefComplaint = complaint.trim();
    setErrorMessage('');

    if (!patientId) {
      setErrorMessage('Your registration is incomplete. Please return to your details and try again.');
      return;
    }

    if (!chiefComplaint) return;
    setIsSubmitting(true);

    try {
      const createdCase = await patientApi.createCase(patientId, chiefComplaint);
      setCaseId(createdCase.id);
      navigate('/clinical-history');
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2>What brings you to the clinic today?</h2>
      {errorMessage && <p role="alert" style={{ color: 'var(--color-error, #b42318)' }}>{errorMessage}</p>}
      
      <div style={{ marginTop: '24px' }}>
        <textarea 
          value={complaint} 
          onChange={e => setComplaint(e.target.value)}
          maxLength={500}
          placeholder="E.g. I have been having a severe headache for the past 3 days..."
          style={{ width: '100%', height: '150px', padding: '16px', borderRadius: '8px', border: '1px solid var(--color-neutral-200)', resize: 'none', fontSize: '16px' }}
        />
        <div style={{ textAlign: 'right', color: 'var(--color-neutral-600)', fontSize: '12px', marginTop: '4px' }}>
          {complaint.length}/500 characters
        </div>
      </div>

      <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {chips.map(chip => (
          <button key={chip} onClick={() => setComplaint(chip)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary-dark)', cursor: 'pointer' }}>
            {chip}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '24px' }}>
        <button onClick={() => alert("Voice input will be available soon — please type your complaint.")} style={{ width: '100%', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px dashed var(--color-primary)', borderRadius: '8px', cursor: 'pointer', color: 'var(--color-primary)' }}>
          🎤 Voice Input
        </button>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={handleContinue} disabled={!complaint.trim() || isSubmitting} style={{ padding: '12px 24px', backgroundColor: complaint.trim() ? 'var(--color-primary)' : 'var(--color-neutral-200)', color: complaint.trim() ? 'white' : 'var(--color-neutral-600)', border: 'none', borderRadius: '8px', cursor: isSubmitting ? 'wait' : complaint.trim() ? 'pointer' : 'not-allowed', fontSize: '16px' }}>{isSubmitting ? 'Saving...' : 'Continue'}</button>
      </div>
    </div>
  );
};
export default ChiefComplaint;
