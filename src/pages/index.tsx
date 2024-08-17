import { useState, useEffect } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [connected, setConnected] = useState(false);
  const [topLikers, setTopLikers] = useState<Array<{ username: string, likes: number }>>([]);

  const connectToLive = async () => {
    const response = await fetch('/api/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      setConnected(true);
    } else {
      console.error('Failed to connect');
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch('/api/top-likers');
      if (response.ok) {
        const data = await response.json();
        setTopLikers(data);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [connected]);

  return (
    <div>
      <h1>TikTok Live Like Tracker</h1>
      {!connected ? (
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter TikTok username"
          />
          <button onClick={connectToLive}>Connect</button>
        </div>
      ) : (
        <div>
          <h2>Top 5 Likers</h2>
          <ul>
            {topLikers.map((liker) => (
              <li key={liker.username}>
                {liker.username}: {liker.likes} likes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
