import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { videoUrl, description } = await request.json();

    // First, get the user's boards
    const boardsResponse = await axios.get('https://api.pinterest.com/v5/user/boards', {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      },
    });

    // For this example, we'll use the first board
    const boardId = boardsResponse.data.items[0].id;

    // Create the pin
    const pinResponse = await axios.post(
      'https://api.pinterest.com/v5/pins',
      {
        board_id: boardId,
        media_source: {
          source_type: 'video_url',
          url: videoUrl,
        },
        title: description,
        description: `Reposted from TikTok: ${description}`,
      },
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json({ success: true, pin: pinResponse.data });
  } catch (error) {
    console.error('Error creating Pinterest pin:', error);
    return NextResponse.json(
      { error: 'Failed to create Pinterest pin' },
      { status: 500 }
    );
  }
} 