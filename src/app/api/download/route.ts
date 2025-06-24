import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { videoUrl } = req.body;

    // Here, you can add your logic to handle the download, like calling the TikTok download function from your original script. For now, we’ll just send a placeholder response.
    res.status(200).json({ message: `Download started for ${videoUrl}` });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function GET(request: Request){
    const { videoUrl }
}