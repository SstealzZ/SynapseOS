import React, { useState, useEffect } from 'react';
import NotesChart from './NotesChart';
import TrendGraphs from './TrendGraphs';
import AIAdviceCard from './AIAdviceCard';
import RawInputLog from './RawInputLog';
import { getUserNotations, getNotationStats, getLatestAIOutput, getUserInputs } from '../api/api';

/**
 * Main dashboard component that displays user's well-being data
 * 
 * @param {Object} props - Component props
 * @param {string} props.username - Username to display data for
 * @returns {JSX.Element} The rendered Dashboard
 */
const Dashboard = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestNotation, setLatestNotation] = useState(null);
  const [notationHistory, setNotationHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [aiAdvice, setAiAdvice] = useState(null);
  const [inputs, setInputs] = useState([]);

  /**
   * Fetch all required data for the dashboard
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user notations (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startDate = formatDate(thirtyDaysAgo);
        const endDate = formatDate(today);
        
        const notations = await getUserNotations(username, startDate, endDate);
        setNotationHistory(notations);
        
        if (notations.length > 0) {
          setLatestNotation(notations[0]); // First item should be the most recent
        }

        // Get notation statistics
        const notationStats = await getNotationStats(username, 30);
        setStats(notationStats);

        // Get latest AI advice
        try {
          const advice = await getLatestAIOutput(username);
          setAiAdvice(advice);
        } catch (err) {
          console.log('No AI advice found, continuing...');
        }

        // Get raw inputs
        const rawInputs = await getUserInputs(username, 10);
        setInputs(rawInputs);

      } catch (err) {
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  /**
   * Format date to YYYY/MM/DD format
   * 
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };

  if (loading) {
    return <div className="card">Chargement des données...</div>;
  }

  if (error) {
    return <div className="card">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4" style={{ 
        fontSize: '1.75rem', 
        fontWeight: '600',
        background: 'linear-gradient(90deg, #ffffff, #a899e6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '24px'
      }}>
        Tableau de bord de {username}
      </h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {latestNotation && (
          <div className="card" style={{ 
            flex: '1',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-60px',
              right: '-60px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(142, 78, 198, 0.15) 0%, rgba(142, 78, 198, 0) 70%)',
              zIndex: 0
            }}></div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff',
              position: 'relative',
              zIndex: 1
            }}>
              Notes du jour ({latestNotation.date})
            </h3>
            <NotesChart notation={latestNotation} />
          </div>
        )}
        
        {aiAdvice && (
          <div className="card" style={{ 
            flex: '2',
            padding: 0,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'linear-gradient(90deg, rgba(30, 30, 35, 0.7), rgba(26, 26, 30, 0.7))'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #8e4ec6, #6e35b7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px'
                }}>AI</span>
                Recommandation IA
              </h3>
            </div>
            <div style={{ padding: '5px' }}>
              <AIAdviceCard advice={aiAdvice} />
            </div>
          </div>
        )}
      </div>
      
      {notationHistory.length > 0 && (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(142, 78, 198, 0.1) 0%, rgba(142, 78, 198, 0) 70%)',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(142, 78, 198, 0.1) 0%, rgba(142, 78, 198, 0) 70%)',
            zIndex: 0
          }}></div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#ffffff',
            position: 'relative',
            zIndex: 1
          }}>
            Tendances (30 derniers jours)
          </h3>
          <TrendGraphs notations={notationHistory} stats={stats} />
        </div>
      )}
      
      {inputs.length > 0 && (
        <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            top: '-80px',
            right: '50%',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(142, 78, 198, 0.1) 0%, rgba(142, 78, 198, 0) 70%)',
            zIndex: 0
          }}></div>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#ffffff',
            position: 'relative',
            zIndex: 1
          }}>
            Journal d'entrées
          </h3>
          <RawInputLog inputs={inputs} />
        </div>
      )}
    </div>
  );
};

export default Dashboard; 