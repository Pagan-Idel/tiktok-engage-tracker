import { useState, useEffect } from 'react';

interface Liker {
  username: string;
  likes: number;
}

const Home = () => {
  const [username, setUsername] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [topLikers, setTopLikers] = useState<Liker[]>([]);
  const [error, setError] = useState<string | null>(null); // Add error state

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
        setError(null); // Clear any previous error
      } else {
        setError('Failed to connect'); // Set error message
      }
    } catch (error) {
      setError('An error occurred while connecting'); // Set error message
      console.error('An error occurred:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/connect', {
        method: 'DELETE',
      });
  
      if (response.ok) {
        console.log('Disconnected and cleared likeCounts map');
        setConnected(false);
        setError(null); // Clear any previous error
      } else {
        setError('Failed to disconnect'); // Set error message
      }
    } catch (error) {
      setError('An error occurred while disconnecting'); // Set error message
      console.error('An error occurred:', error);
    }
  };
  
  const handleShutdown = async () => {
    setConnected(false);
    try {
      await fetch('/api/shutdown', {
        method: 'POST',
      });
      window.close();
    } catch (error) {
      setError('An error occurred while shuting down'); // Set error message
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
          setError(null); // Clear any previous error
        } else {
          setError('Failed to fetch top likers'); // Set error message
        }
      } catch (error) {
        setError('An error occurred while fetching top likers'); // Set error message
        console.error('An error occurred:', error);
      }
    };

    const interval = setInterval(fetchTopLikers, 3000);
    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>TikTok Live Like Tracker</h1>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>} {/* Display error message */}
      {!connected ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter TikTok username"
            style={{ padding: '10px', fontSize: '16px', marginBottom: '10px', width: '100%' }}
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
            }}
          >
            Connect
          </button>
        </div>
      ) : (
        <div>
          <h2 style={{ color: '#555' }}>Top 5 Likers</h2>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {topLikers.map((liker) => (
              <li
                key={liker.username}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #ddd',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{liker.username}</span>
                <span>{liker.likes} likes</span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleDisconnect}
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Disconnect & Clear Table
          </button><br></br>
          <button
            onClick={handleShutdown}
            style={{ marginTop: '10px', padding: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Shutdown Server
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
