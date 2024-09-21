import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';
import credentials from "../../../credentials.json";

const pool = mysql.createPool({
  host: credentials.DB_HOST,
  user: credentials.DB_USER,
  password: credentials.DB_PASSWORD,
  database: credentials.DB_DATABASE,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await pool.query('USE tiktok_likes;');
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
