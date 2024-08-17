import { NextApiRequest, NextApiResponse } from 'next';
import { getTopLikers } from './connect';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const topLikers = getTopLikers();
    res.status(200).json(topLikers);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
