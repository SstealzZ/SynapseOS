import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

/**
 * Component that displays trend graphs for each well-being category
 * 
 * @param {Object} props - Component props
 * @param {Array} props.notations - Array of notation objects
 * @param {Object} props.stats - Statistics data object
 * @returns {JSX.Element} The rendered trend graphs
 */
const TrendGraphs = ({ notations, stats }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  /**
   * Transform notations data into format required by Recharts
   * 
   * @param {Array} notations - Array of notation objects
   * @returns {Array} Data formatted for line charts
   */
  const prepareChartData = (notations) => {
    if (!notations || notations.length === 0) return [];
    
    // Sort by date ascending
    const sortedNotations = [...notations].sort((a, b) => {
      return new Date(a.date.replace(/\//g, '-')) - new Date(b.date.replace(/\//g, '-'));
    });

    return sortedNotations.map(notation => {
      // Convert date to more readable format for display
      const [year, month, day] = notation.date.split('/');
      const displayDate = `${day}/${month}`;
      
      return {
        date: displayDate,
        fullDate: notation.date,
        spirituel: notation.spiritual_note,
        physique: notation.physical_note,
        mental: notation.mental_note,
        business: notation.business_note,
        social: notation.social_note,
        troisChoses: notation.three_things_note || notation['3_things_note'],
        russe: notation.russian_note
      };
    });
  };

  /**
   * Create statistics display for each category
   * 
   * @param {Object} stats - Statistics data
   * @returns {JSX.Element} Formatted statistics display
   */
  const renderStats = (stats) => {
    if (!stats || !stats.stats) return null;
    
    const categoryMapping = {
      spiritual_note: 'Spirituel',
      physical_note: 'Physique',
      mental_note: 'Mental',
      business_note: 'Business',
      social_note: 'Social',
      three_things_note: '3 Choses',
      russian_note: 'Russe'
    };
    
    const trendIcons = {
      up: '↗️',
      down: '↘️',
      stable: '➡️',
      insufficient_data: '❓'
    };
    
    return (
      <div className="stats-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
        {Object.entries(stats.stats).map(([category, data]) => (
          <div key={category} className="stat-card" style={{ 
            padding: '12px', 
            borderRadius: '8px', 
            backgroundColor: 'rgba(30, 30, 35, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            minWidth: '130px',
            color: '#e1e1e3',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}>
            <h4 style={{ color: '#ffffff', marginBottom: '10px', fontSize: '1rem' }}>
              {categoryMapping[category] || category}
            </h4>
            <div style={{ fontSize: '0.95rem' }}>Moyenne: {data.average.toFixed(1)}</div>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>Min: {data.min} | Max: {data.max}</div>
            <div style={{ fontSize: '0.95rem', marginTop: '5px' }}>
              Tendance: {trendIcons[data.trend] || data.trend}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const data = prepareChartData(notations);
  
  /**
   * Get color for each category line
   * 
   * @param {string} category - Category name
   * @returns {string} Hex color code
   */
  const getCategoryColor = (category) => {
    const colors = {
      spirituel: '#8884d8',
      physique: '#82ca9d',
      mental: '#ffc658',
      business: '#ff8042',
      social: '#0088fe',
      troisChoses: '#00c49f',
      russe: '#ff0000'
    };
    return colors[category] || '#000000';
  };

  /**
   * Handle category selection change
   * 
   * @param {Object} e - Event object
   */
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  /**
   * Render the appropriate chart based on selected category
   * 
   * @returns {JSX.Element} The rendered chart
   */
  const renderChart = () => {
    if (selectedCategory === 'all') {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#e1e1e3' }} />
            <YAxis domain={[0, 10]} tick={{ fill: '#e1e1e3' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 35, 0.9)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e1e1e3',
                borderRadius: '8px'
              }} 
            />
            <Legend wrapperStyle={{ color: '#e1e1e3' }} />
            <Line type="monotone" dataKey="spirituel" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="physique" stroke="#82ca9d" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="mental" stroke="#ffc658" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="business" stroke="#ff8042" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="social" stroke="#0088fe" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="troisChoses" stroke="#00c49f" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="russe" stroke="#ff0000" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="date" tick={{ fill: '#e1e1e3' }} />
            <YAxis domain={[0, 10]} tick={{ fill: '#e1e1e3' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(30, 30, 35, 0.9)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#e1e1e3',
                borderRadius: '8px'
              }} 
            />
            <Legend wrapperStyle={{ color: '#e1e1e3' }} />
            <Line 
              type="monotone" 
              dataKey={selectedCategory} 
              stroke={getCategoryColor(selectedCategory)} 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  if (!notations || notations.length === 0) {
    return <div>Aucune donnée disponible pour les tendances</div>;
  }

  return (
    <div>
      {renderStats(stats)}
      
      <div className="mb-4">
        <label htmlFor="category-select" style={{ marginRight: '10px', color: '#e1e1e3' }}>Catégorie: </label>
        <select 
          id="category-select" 
          value={selectedCategory} 
          onChange={handleCategoryChange} 
          style={{ 
            padding: '5px 10px', 
            borderRadius: '6px',
            backgroundColor: 'rgba(30, 30, 35, 0.8)',
            color: '#e1e1e3',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">Toutes les catégories</option>
          <option value="spirituel">Spirituel</option>
          <option value="physique">Physique</option>
          <option value="mental">Mental</option>
          <option value="business">Business</option>
          <option value="social">Social</option>
          <option value="troisChoses">3 Choses</option>
          <option value="russe">Russe</option>
        </select>
      </div>
      
      {renderChart()}
    </div>
  );
};

export default TrendGraphs; 