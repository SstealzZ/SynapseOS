import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';

/**
 * Main application component
 * 
 * @returns {JSX.Element} The rendered App
 */
function App() {
  const [username, setUsername] = useState('Antoine'); // Valeur par défaut pour la démo

  return (
    <div className="App">
      <header className="header" style={{ 
        background: 'linear-gradient(180deg, rgba(14, 14, 18, 0.95), rgba(9, 9, 11, 0.97))',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8e4ec6, #6e35b7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(142, 78, 198, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
                fontSize: '18px',
                color: 'white'
              }}>
                S
              </div>
              <h1 style={{ 
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '600',
                background: 'linear-gradient(90deg, #e2c4ff, #a899e6, #8e4ec6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                SynapseOS
              </h1>
            </div>
            <div style={{
              background: 'rgba(30, 30, 35, 0.5)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#e1e1e3',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8e4ec6, #6e35b7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white'
              }}>
                {username.charAt(0)}
              </div>
              <span>Utilisateur: {username}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="container">
        <Dashboard username={username} />
      </main>
    </div>
  );
}

export default App; 