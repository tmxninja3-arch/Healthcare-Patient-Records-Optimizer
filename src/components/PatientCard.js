import React, { memo, useRef, useEffect } from 'react';
import './PatientCard.css';

const PatientCard = memo(({ patient, handleSelect, searchTerm, isSelected }) => {
  console.log('Child Rendered:', patient.name);

  const cardRef = useRef(null);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isSelected]);
 
  // ──────────────────────────────────────────
  // Highlight Search Text (Bonus 1 - unchanged)
  // ──────────────────────────────────────────
  const highlightText = (text) => {
    if (!searchTerm || !searchTerm.trim()) {
      return text;
    }

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark key={index} className="highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
   
    <div
      ref={cardRef}
      className={`patient-card ${isSelected ? 'patient-card-selected' : ''}`}
      onClick={() => handleSelect(patient)}
    >
    
      {isSelected && (
        <div className="selected-badge">✅ SELECTED</div>
      )}

      {/* Avatar */}
      <div className={`patient-avatar ${isSelected ? 'avatar-selected' : ''}`}>
        {patient.name.charAt(0)}
      </div>

      {/* Patient Details */}
      <div className="patient-info">
        <h3 className="patient-name">
          {highlightText(patient.name)}
        </h3>

        <div className="patient-detail">
          <span className="detail-icon">📧</span>
          <span className="detail-text">
            {highlightText(patient.email)}
          </span>
        </div>

        <div className="patient-detail">
          <span className="detail-icon">📞</span>
          <span className="detail-text">{patient.phone}</span>
        </div>

        <div className="patient-detail">
          <span className="detail-icon">🏥</span>
          <span className="detail-text hospital-name">
            {patient.company?.name || 'N/A'}
          </span>
        </div>
      </div>
      <br/>

      {/* Click hint */}
      <div className="select-hint">
        {isSelected ? '✅ Currently Selected' : 'Click to select'}
      </div>
    </div>
  );
});

PatientCard.displayName = 'PatientCard';

export default PatientCard;