import { NextApiRequest, NextApiResponse } from 'next';
import { WebcastPushConnection } from 'tiktok-live-connector';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface FollowCheckResult extends RowDataPacket {
  count: number;
}

let tiktokConnection: WebcastPushConnection | null = null;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function ensureUserExists(username: string) {
  await pool.query('USE tiktok_likes;');
  // Check if the user exists in either table
  const [rows] = await pool.query<FollowCheckResult[]>(
    'SELECT COUNT(*) as count FROM users WHERE username = ?',
    [username]
  );

  if (rows[0].count === 0) {
    // Insert the user into users if they don't exist
    await pool.execute('INSERT INTO users (username) VALUES (?)', [username]);
  }
}

async function updatePoints(username: string, likeCount: number) {
  await pool.query('USE tiktok_likes;');
  // Ensure user exists in users table
  await ensureUserExists(username);
  await pool.execute(
    'INSERT INTO like_counts (username, likes) VALUES (?, ?) ON DUPLICATE KEY UPDATE likes = likes + VALUES(likes)',
    [username, likeCount]
  );
}

async function hasFollowed(username: string): Promise<boolean> {
  await pool.query('USE tiktok_likes;');
  await ensureUserExists(username);
  const [rows] = await pool.query<FollowCheckResult[]>(
    'SELECT COUNT(*) as count FROM followed WHERE username = ?',
    [username]
  );
  return rows[0].count > 0;
}

async function markAsFollowed(username: string) {
  await pool.query('USE tiktok_likes;');
  await ensureUserExists(username);
  await pool.execute(
    'INSERT INTO followed (username) VALUES (?)',
    [username]
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
        await updatePoints(data.uniqueId, data.likeCount);
      });
      // Handle incoming 'follow' events
      tiktokConnection.on('follow', async (data) => {
        await ensureUserExists(data.uniqueId);  // Ensure the user exists before marking as followed
        const alreadyFollowed = await hasFollowed(data.uniqueId);
        if (!alreadyFollowed) {
          await markAsFollowed(data.uniqueId);
          await updatePoints(data.uniqueId, 50);  // Add 50 points for following
        }
      });


      tiktokConnection.on('error', (err) => {
        console.error('Error!', err);
      });

    } catch (err) {
      console.error('Failed to connect', err);
      res.status(500).json({ error: 'Failed to connect' });
    }
  } else if (req.method === 'DELETE' && req.headers.closetype == 'disconnect') {
    // Disconnect and clean up
    if (tiktokConnection) {
      tiktokConnection.disconnect();
      tiktokConnection = null;
    }
    await pool.query('USE tiktok_likes;');
    await pool.execute('DELETE FROM followed');
    await pool.execute('DELETE FROM like_counts');
    await pool.execute('DELETE FROM users');
    res.status(200).json({ message: 'Disconnected and cleared likeCounts table' });
  } else if (req.method === 'DELETE' && req.headers.closetype == 'table') {
    await pool.query('USE tiktok_likes;');
    await pool.execute('DELETE FROM followed');
    await pool.execute('DELETE FROM like_counts');
    await pool.execute('DELETE FROM users');
    res.status(200).json({ message: 'Disconnected and cleared likeCounts table' });
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
