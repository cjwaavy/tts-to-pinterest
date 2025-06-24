import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios, { AxiosError } from 'axios';

export async function GET(request: Request) {
  const session = await auth();

  console.log("session");
  console.log(session);

  if (!session?.tiktokAccessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("about to request videos?", session.tiktokAccessToken);
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,cover_image_url,view_count,like_count,title,duration,share_url,create_time',
      {
        
        // cursor: 'optional_cursor_string',
        max_count: 20,
      },
      {
        headers: {
          Authorization: `Bearer ${session.tiktokAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("response", response.data);
    return NextResponse.json({ videos: response.data.data.videos });
  } catch (error: any) {
    console.error('Error fetching TikTok videos:', error);
    console.error('request:', error.response);
    return NextResponse.json(
      { error: 'Failed to fetch TikTok videos',
      },
      { status: 500 }
    );
  }
} 