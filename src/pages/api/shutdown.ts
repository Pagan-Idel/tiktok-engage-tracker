import { NextApiRequest, NextApiResponse } from 'next';
// pages/api/shutdown.ts
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      // Optionally add authentication or other checks here
      res.status(200).json({ message: 'Shutting down' });
  
      // Send a signal to the server process to shutdown
      process.exit(0);  // This will stop the server
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  