import { NextApiRequest, NextApiResponse } from 'next';
import { WebcastPushConnection } from 'tiktok-live-connector';
import mysql from 'mysql2/promise';

let tiktokConnection: WebcastPushConnection | null = null;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function updateLikes(username: string, likeCount: number) {
  // Insert or update the like count directly in the MySQL database
  await pool.execute(
    'INSERT INTO like_counts (username, likes) VALUES (?, ?) ON DUPLICATE KEY UPDATE likes = likes + VALUES(likes)',
    [username, likeCount]
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    if (tiktokConnection) {
      return res.status(204).end();
    }

    tiktokConnection = new WebcastPushConnection(username);

    try {
      const state = await tiktokConnection.connect();
      console.info(`Connected to roomId ${state.roomId}`);
      res.status(200).json({ message: `Connected to ${username}`, roomId: state.roomId });

      // Handle incoming 'like' events
      tiktokConnection.on('like', async (data) => {
        await updateLikes(data.uniqueId, data.likeCount);
      });

      tiktokConnection.on('error', (err) => {
        console.error('Error!', err);
      });

    } catch (err) {
      console.error('Failed to connect', err);
      res.status(500).json({ error: 'Failed to connect' });
    }
  } else if (req.method === 'DELETE') {
    // Disconnect and clean up
    if (tiktokConnection) {
      tiktokConnection.disconnect();
      tiktokConnection = null;
    }

    // Clear the like_counts table (if necessary)
    await pool.execute('DELETE FROM like_counts');
    res.status(200).json({ message: 'Disconnected and cleared likeCounts table' });
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
