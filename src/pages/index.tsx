import { useState, useEffect } from 'react';

interface Liker {
  username: string;
  total_likes: number;
}

const Home = () => {
  const [username, setUsername] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [topLikers, setTopLikers] = useState<Liker[]>([]);
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
      setError('Table Cleared');
    } catch (error) {
      setError('An error occurred while clearing table');
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {
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
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: '#e0dbd4', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', fontSize: '24px' }}>TikTok Live Engage Tracker</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {!connected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter TikTok username"
            style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            onClick={connectToLive}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px'
            }}
          >
            Connect
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#e0dbd4', padding: '20px', borderRadius: '10px', color: '#333' }}>
          <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '22px' }}>Top 5 Users</h2>
          <ul style={{ listStyleType: 'none', padding: '0', marginBottom: '20px' }}>
            {topLikers.map((liker) => (
              <li
                key={liker.username}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #555',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  color: '#333'
                }}
              >
                <span>{liker.username}</span>
                <span>{liker.total_likes} points</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleClearTable}
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
          >
            Clear Table
          </button>
          <button
            onClick={handleDisconnect}
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
