import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await axios.get('https://open.tiktokapis.com/v2/video/list/', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        fields: ['id', 'cover_image_url', 'video_url', 'description', 'create_time'],
        max_count: 20,
      },
    });

    return NextResponse.json({ videos: response.data.videos });
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch TikTok videos' },
      { status: 500 }
    );
  }
} 