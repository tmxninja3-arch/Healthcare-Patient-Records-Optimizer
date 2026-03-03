import React, { memo } from 'react';
import './PatientCard.css';

// ============================================
// PatientCard Component
// ============================================
// 
// React.memo() wraps this component to prevent unnecessary re-renders.
// 
// HOW IT WORKS:
// - Without memo: PatientCard re-renders every time Dashboard re-renders
// - With memo: PatientCard only re-renders when its PROPS actually change
// 
// Combined with useCallback (for handleSelect prop), this means:
// - handleSelect function reference stays the same (useCallback)
// - So memo sees "props haven't changed" and skips re-render
// 
// Console will show "Child Rendered" only when props truly change

const PatientCard = memo(({ patient, handleSelect, searchTerm }) => {
  // This log helps us verify that unnecessary re-renders are prevented
  console.log('Child Rendered:', patient.name);

  // ============================================
  // BONUS 1: Highlight searched text
  // ============================================
  // This function wraps matching text in a <mark> tag
  const highlightText = (text) => {
    // If no search term, return plain text
    if (!searchTerm || !searchTerm.trim()) {
      return text;
    }

    // Create a regex to find the search term (case-insensitive)
    // 'gi' means: global (find all matches) + case-insensitive
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    
    // Split the text by the search term
    const parts = text.split(regex);

    // Map through parts: if a part matches search, wrap in <mark>
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
    <div className="patient-card" onClick={() => handleSelect(patient)}>
      {/* Patient Avatar - shows first letter of name */}
      <div className="patient-avatar">
        {patient.name.charAt(0)}
      </div>

      {/* Patient Details */}
      <div className="patient-info">
        <h3 className="patient-name">
          {/* Bonus 1: Name with highlighted search text */}
          {highlightText(patient.name)}
        </h3>

        <div className="patient-detail">
          <span className="detail-icon">📧</span>
          <span className="detail-text">
            {/* Bonus 1: Email with highlighted search text */}
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
      

      {/* Click indicator */}
      <div className="select-hint">Click to select</div>
    </div>
  );
});

// Display name helps in React DevTools for debugging
PatientCard.displayName = 'PatientCard';

export default PatientCard;