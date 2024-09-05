import { useState, useEffect } from 'react';

interface Liker {
  username: string;
  total_likes: number;
}

const Home = () => {
  const [username, setUsername] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [topLikers, setTopLikers] = useState<Liker[]>([]);
  const [rounds, setRounds] = useState<Liker[][]>([]); // To track rounds
  const [error, setError] = useState<string | null>(null);

  const connectToLive = async () => {
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        setConnected(true);
        setError(null);
      } else {
        setError('Failed to connect');
      }
    } catch (error) {
      setError('An error occurred while connecting');
      console.error('An error occurred:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/connect', {
        method: 'DELETE',
        headers: {
          'closetype': 'disconnect'
        }
      });

      if (response.ok) {
        console.log('Disconnected and cleared likeCounts map');
        setConnected(false);
        setError(null);
      } else {
        setError('Failed to disconnect');
      }
    } catch (error) {
      setError('An error occurred while disconnecting');
      console.error('An error occurred:', error);
    }
  };

  const handleClearTable = async () => {
    try {
      const response = await fetch('/api/connect', {
        method: 'DELETE',
        headers: {
          'closetype': 'table'
        }
      });
      setError('Starting New Round...');
    } catch (error) {
      setError('An error occurred while clearing table');
      console.error('An error occurred:', error);
    }
  };

  const handleEndRound = () => {
    // Capture the top 3 users
    const top3 = topLikers.slice(0, 3);

    // Add the current round's top 3 to the rounds array, limiting it to 3 rounds max
    setRounds((prevRounds) => {
      const newRounds = [...prevRounds, top3];
      return newRounds.slice(-3); // Keep only the last 3 rounds
    });
  };

  const handleClearRounds = () => {
    setRounds([]); // Clear the rounds
  };

  useEffect(() => {
    if (connected) {
      const fetchTopLikers = async () => {
        try {
          const response = await fetch('/api/top-likers');
          if (response.ok) {
            const data = await response.json();
            setTopLikers(data);
            setError(null);
          } else {
            setError('Failed to fetch top likers');
          }
        } catch (error) {
          if (!connected) {
            setError('An error occurred while fetching top likers');
            console.error('An error occurred:', error);
          }
        }
      };
  
      fetchTopLikers();
      const interval = setInterval(fetchTopLikers, 3000);
      
      // Cleanup the interval on unmount
      return () => clearInterval(interval);
    }
  }, [connected]);  // Only trigger the effect when `connected` changes
  

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif', 
      padding: '20px', 
      maxWidth: '800px',  // Increased width for better spacing
      margin: 'auto', 
      backgroundColor: '#b5aba2', 
      borderRadius: '10px', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{
        textAlign: 'center', 
        color: '#4c4d5f', 
        marginBottom: '20px', 
        fontSize: '24px'
      }}>
        TikTok Live Engage Tracker
      </h1>
  
      {error && <div style={{ color: '#4c4d5f', marginBottom: '10px' }}>{error}</div>}
  
      {!connected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter TikTok username"
            style={{
              padding: '9px', 
              fontSize: '16px', 
              marginBottom: '10px', 
              width: '96%', 
              borderRadius: '5px', 
              border: '1px solid #ccc'
            }}
          />
          <button
            onClick={connectToLive}
            style={{
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#4c4d5f', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              width: '100%'
            }}
          >
            Connect
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#b5aba2', 
          padding: '20px', 
          borderRadius: '10px', 
          color: '#333'
        }}>
          <h2 style={{ color: '#4c4d5f', marginBottom: '15px', fontSize: '22px' }}>Top 5 Users</h2>
  
          <ul style={{
            listStyleType: 'none', 
            padding: '0', 
            marginBottom: '20px'
          }}>
            {topLikers.map((liker) => (
              <li key={liker.username} style={{
                padding: '10px', 
                borderBottom: '1px solid #555', 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '18px', 
                color: '#4c4d5f'
              }}>
                <span>{liker.username}</span>
                <span>{liker.total_likes} points</span>
              </li>
            ))}
          </ul>
  
          {rounds.length < 3 && (
            <>
              <button
                onClick={handleClearTable}
                style={{
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#5c2932', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  width: '100%'
                }}
              >
                Start Round
              </button>
  
              <button
                onClick={handleEndRound}
                style={{
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#5c2932', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  width: '100%'
                }}
              >
                End Round
              </button>
            </>
          )}
  
          <button
            onClick={handleClearRounds}
            style={{
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#5c2932', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              width: '100%'
            }}
          >
            Clear Rounds
          </button>
  
          <button
            onClick={handleDisconnect}
            style={{
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#5c2932', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              width: '100%'
            }}
          >
            Disconnect
          </button>
  
          {/* Render saved rounds */}
          {rounds.length > 0 && (
            <div style={{
              display: 'flex', 
              justifyContent: 'space-between',  // Space the rounds properly
              marginTop: '20px'
            }}>
              {rounds.map((round, index) => (
                <div key={index} style={{
                  padding: '10px', 
                  backgroundColor: '#4c4d5f', 
                  borderRadius: '5px', 
                  width: '30%', 
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
                  marginLeft: index > 0 ? '10px' : '0'
                }}>
                  <h3 style={{
                    color: '#5c2932', 
                    textAlign: 'left'
                  }}>
                    Round {index + 1} Winners
                  </h3>
  
                  <ul style={{
                    listStyleType: 'none', 
                    padding: '0',
                    color: '#5c2932'
                  }}>
                    {round.map((liker) => (
                      <li key={liker.username} style={{
                        padding: '5px', 
                        borderBottom: '1px solid #ddd', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        color: '#fff'
                      }}>
                        <span>{liker.username}</span>
                        <span>{liker.total_likes} points</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );  
};

export default Home;
