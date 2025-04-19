import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

/**
 * Component that displays a radar chart of daily well-being scores
 * 
 * @param {Object} props - Component props
 * @param {Object} props.notation - Notation data object with scores
 * @returns {JSX.Element} The rendered radar chart
 */
const NotesChart = ({ notation }) => {
  /**
   * Transform notation data into format required by Recharts
   * 
   * @param {Object} notation - Notation data to transform
   * @returns {Array} Data formatted for radar chart
   */
  const prepareChartData = (notation) => {
    if (!notation) return [];

    return [
      { 
        category: 'Spirituel', 
        value: notation.spiritual_note,
        fullMark: 10 
      },
      { 
        category: 'Physique', 
        value: notation.physical_note,
        fullMark: 10 
      },
      { 
        category: 'Mental', 
        value: notation.mental_note,
        fullMark: 10 
      },
      { 
        category: 'Business', 
        value: notation.business_note,
        fullMark: 10 
      },
      { 
        category: 'Social', 
        value: notation.social_note,
        fullMark: 10 
      },
      { 
        category: '3 Choses', 
        value: notation.three_things_note || notation['3_things_note'],
        fullMark: 10 
      },
      { 
        category: 'Russe', 
        value: notation.russian_note,
        fullMark: 10 
      },
    ];
  };

  const data = prepareChartData(notation);

  if (!notation) {
    return <div>Aucune donnée disponible</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={90} data={data}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
          <PolarAngleAxis dataKey="category" tick={{ fill: '#e1e1e3' }} />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 10]} 
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          <Radar
            name="Notes"
            dataKey="value"
            stroke="#8e4ec6"
            fill="#8e4ec6"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NotesChart; 