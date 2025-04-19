import React, { useState } from 'react';

/**
 * Component that displays raw input entries from Telegram
 * 
 * @param {Object} props - Component props
 * @param {Array} props.inputs - Array of input objects
 * @returns {JSX.Element} The rendered input log
 */
const RawInputLog = ({ inputs }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!inputs || inputs.length === 0) {
    return <div>Aucune entrée disponible</div>;
  }

  /**
   * Format date to a more readable format
   * 
   * @param {string} dateString - Date string in YYYY/MM/DD format
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const [year, month, day] = dateString.split('/');
    return `${day}/${month}/${year}`;
  };

  /**
   * Toggle expanded state for an input entry
   * 
   * @param {number} index - Index of the entry to toggle
   */
  const toggleExpand = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  /**
   * Create a summary string from all input fields
   * 
   * @param {Object} input - Input object with all fields
   * @returns {string} Summary of all inputs
   */
  const createSummary = (input) => {
    const fields = [
      { label: "Spirituel", value: input.Spiritual_meaning },
      { label: "Physique", value: input.Physical_meaning },
      { label: "Mental", value: input.Mental_meaning },
      { label: "Business", value: input.Business_meaning },
      { label: "Social", value: input.Social_meaning },
      { label: "3 Choses", value: input["3_things"] },
      { label: "Russe", value: input.Russian_lesson }
    ];
    
    return fields.map(field => `${field.label}: ${field.value}`).join('\n\n');
  };

  /**
   * Format content with truncation for long entries
   * 
   * @param {string} content - Raw content text
   * @param {boolean} isExpanded - Whether the entry is expanded
   * @returns {string} Formatted or truncated content
   */
  const formatContent = (content, isExpanded) => {
    if (!content) return '';
    
    if (isExpanded || content.length <= 100) {
      return content;
    }
    
    return content.substring(0, 100) + '...';
  };

  /**
   * Render detailed view of an input entry
   * 
   * @param {Object} input - Input object with all fields
   * @returns {JSX.Element} Detailed view of the input
   */
  const renderDetailedInput = (input) => {
    return (
      <div className="detailed-input">
        <div className="input-field">
          <h4>Spirituel</h4>
          <p>{input.Spiritual_meaning}</p>
        </div>
        
        <div className="input-field">
          <h4>Physique</h4>
          <p>{input.Physical_meaning}</p>
        </div>
        
        <div className="input-field">
          <h4>Mental</h4>
          <p>{input.Mental_meaning}</p>
        </div>
        
        <div className="input-field">
          <h4>Business</h4>
          <p>{input.Business_meaning}</p>
        </div>
        
        <div className="input-field">
          <h4>Social</h4>
          <p>{input.Social_meaning}</p>
        </div>
        
        <div className="input-field">
          <h4>3 Choses</h4>
          <p style={{ whiteSpace: 'pre-line' }}>{input["3_things"]}</p>
        </div>
        
        <div className="input-field">
          <h4>Russe</h4>
          <p>{input.Russian_lesson}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="raw-input-log">
      <div className="input-list">
        {inputs.map((input, index) => (
          <div 
            key={input._id || index} 
            className="input-item" 
            style={{ 
              padding: '10px', 
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}
            onClick={() => toggleExpand(index)}
          >
            <div className="input-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div className="input-date" style={{ fontWeight: 'bold' }}>
                {formatDate(input.Date)}
              </div>
              <div className="input-source" style={{ fontSize: '0.9em', color: '#666' }}>
                Telegram
              </div>
            </div>
            
            {expandedIndex === index ? (
              renderDetailedInput(input)
            ) : (
              <div className="input-summary" style={{ fontSize: '0.95em' }}>
                {formatContent(input.Spiritual_meaning, false)}...
              </div>
            )}
            
            <div 
              className="expand-toggle" 
              style={{ 
                marginTop: '5px', 
                color: '#007bff',
                fontSize: '0.9em'
              }}
            >
              {expandedIndex === index ? 'Réduire' : 'Voir plus'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RawInputLog; 