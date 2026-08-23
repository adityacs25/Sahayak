import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicalHistory: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { title: 'Presenting Complaint', questions: ['When did it start?', 'Is it continuous?'] },
    { title: 'Onset & Duration', questions: ['Did it start suddenly?'] },
    { title: 'Location & Character', questions: ['Where exactly is the pain?'] },
    { title: 'Severity', questions: ['How severe is it on a scale of 1-10?'] },
    { title: 'Aggravating & Relieving Factors', questions: ['What makes it better or worse?'] },
    { title: 'Associated Symptoms', questions: ['Any fever or vomiting?'] },
    { title: 'Past Medical History', questions: ['Any previous medical conditions?'] },
    { title: 'Medication & Allergies', questions: ['Are you taking any medications?'] },
    { title: 'Family History', questions: ['Any similar conditions in the family?'] },
    { title: 'Ayurveda History (Optional — Prototype Fields)', questions: ['Prakriti', 'Dietary habits', 'Sleep pattern', 'Exercise level'] }
  ];

  const handleNext = () => {
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1);
    } else {
      navigate('/adaptive-questions');
    }
  };

  return (
    <div>
      <h2>Clinical History</h2>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-neutral-200)', borderRadius: '4px', marginTop: '16px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((activeSection + 1) / sections.length) * 100}%`, backgroundColor: 'var(--color-primary)' }} />
      </div>

      <div style={{ marginTop: '24px' }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '16px', border: '1px solid var(--color-neutral-200)', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
            <div onClick={() => setActiveSection(idx)} style={{ padding: '16px', backgroundColor: activeSection === idx ? 'var(--color-primary-light)' : 'transparent', cursor: 'pointer', fontWeight: 'bold' }}>
              {idx + 1}. {section.title}
            </div>
            {activeSection === idx && (
              <div style={{ padding: '16px', borderTop: '1px solid var(--color-neutral-200)' }}>
                {section.questions.map((q, qIdx) => (
                  <div key={qIdx} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>{q}</label>
                    {q === 'Prakriti' ? (
                      <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-neutral-200)' }}>
                        <option>Vata</option><option>Pitta</option><option>Kapha</option><option>Vata-Pitta</option>
                        <option>Pitta-Kapha</option><option>Vata-Kapha</option><option>Tridosha</option>
                      </select>
                    ) : (
                      <input type="text" placeholder="Your answer..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-neutral-200)' }} />
                    )}
                  </div>
                ))}
                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  <button onClick={handleNext} style={{ padding: '8px 16px', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Save & Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default ClinicalHistory;
