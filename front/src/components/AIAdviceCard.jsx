import React from 'react';

/**
 * Component that displays AI-generated advice
 * 
 * @param {Object} props - Component props
 * @param {Object} props.advice - AI advice object with content and metadata
 * @returns {JSX.Element} The rendered advice card
 */
const AIAdviceCard = ({ advice }) => {
  if (!advice || !advice.output) {
    return <div>Aucune recommandation IA disponible</div>;
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
   * Format content with line breaks
   * 
   * @param {string} content - Raw content text
   * @returns {JSX.Element} Formatted content with paragraphs
   */
  const formatContent = (content) => {
    return content.split('\n').map((line, index) => {
      // Format section headers (like ### Phase 1: ...)
      if (line.startsWith('###')) {
        return (
          <h4 key={index} style={{ 
            marginTop: '16px', 
            marginBottom: '8px',
            color: '#a899e6', 
            fontWeight: '600'
          }}>
            {line.replace('###', '').trim()}
          </h4>
        );
      }
      
      // Format keywords highlighted with **
      if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <span key={i} style={{ color: '#b992ff', fontWeight: '600' }}>{part.replace(/\*\*/g, '')}</span>;
              }
              return part;
            })}
          </p>
        );
      }
      
      // Default paragraph
      return (
        <p key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
          {line}
        </p>
      );
    });
  };

  return (
    <div className="ai-advice-card" style={{ 
      width: '100%', 
      maxWidth: '100%',
      background: 'linear-gradient(145deg, rgba(30, 30, 35, 0.7), rgba(26, 26, 30, 0.9))',
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
    }}>
      <div className="ai-advice-content" style={{ color: '#e1e1e3' }}>
        {formatContent(advice.output)}
      </div>
      <div className="ai-advice-metadata" style={{ 
        marginTop: '20px', 
        fontSize: '0.9em', 
        color: 'rgba(255, 255, 255, 0.5)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '12px'
      }}>
        <div>Généré le: {formatDate(advice.Date)}</div>
      </div>
    </div>
  );
};

export default AIAdviceCard; 