import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios, { AxiosError } from 'axios';
import { prisma } from '@/lib/prisma'; // Import the prisma client

export async function GET(request: Request) {
  const session = await auth();

//   console.log("session");
//   console.log(session);

  // Ensure user is authenticated and has a TikTok access token
  if (!session?.tiktokAccessToken || !session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch videos from TikTok API
    const tiktokResponse = await axios.post(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,cover_image_url,view_count,like_count,title,duration,share_url,create_time',
      {
        max_count: 20,
        // Optional: pagination.cursor, etc.
      },
      {
        headers: {
          Authorization: `Bearer ${session.tiktokAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const videos = tiktokResponse.data.data.videos || []; // Get videos from TikTok response

    // Get all posted videos for the current user from the database
    const postedVideos = await prisma.postedVideo.findMany({
      where: {
        userId: session.userId,
      },
      select: {
        tiktokVideoId: true,
      },
    });

    // Create a quick lookup Set for posted video IDs
    const postedVideoIds = new Set(postedVideos.map((pv: { tiktokVideoId: string }) => pv.tiktokVideoId));

    // Add posted_on_pinterest status to each video
    const videosWithStatus = videos.map((video: any) => ({
      ...video,
      posted_on_pinterest: postedVideoIds.has(video.id),
    }));

    // console.log("Fetched videos with posted status:", videosWithStatus);


    return NextResponse.json({ videos: videosWithStatus }); // Return videos with status
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