import { NextApiRequest, NextApiResponse } from 'next';
import { WebcastPushConnection } from 'tiktok-live-connector';

type LikeCountMap = Map<string, number>;

let likeCounts: LikeCountMap = new Map();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const tiktokConnection = new WebcastPushConnection(username);

    try {
      const state = await tiktokConnection.connect();
      console.info(`Connected to roomId ${state.roomId}`);
      res.status(200).json({ message: `Connected to ${username}`, roomId: state.roomId });

      tiktokConnection.on('like', (data) => {
        const currentLikes = likeCounts.get(data.uniqueId) || 0;
        likeCounts.set(data.uniqueId, currentLikes + data.likeCount);
      });

      tiktokConnection.on('error', (err) => {
        console.error('Error!', err);
      });

    } catch (err) {
      console.error('Failed to connect', err);
      res.status(500).json({ error: 'Failed to connect' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export function getTopLikers(): Array<{ username: string, likes: number }> {
  return Array.from(likeCounts.entries())
    .sort(([, likesA], [, likesB]) => likesB - likesA)
    .slice(0, 5)
    .map(([username, likes]) => ({ username, likes }));
}
