import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const [rows] = await pool.query(`
    SELECT username, SUM(likes) as total_likes
    FROM like_counts
    GROUP BY username
    ORDER BY total_likes DESC
    LIMIT 5;
    `);
    res.status(200).json(rows);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
