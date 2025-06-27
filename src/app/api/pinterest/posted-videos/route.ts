import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get the current user's session
    const session = await auth();
    // console.log("posted-videos session: ", session)

    if (!session || !session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Query the database for all PostedVideo entries for the current user
    const postedVideos = await prisma.postedVideo.findMany({
      where: {
        userId: session.userId,
      },
      select: {
        tiktokVideoId: true,
      },
    });

    // Return the list of tiktokVideoIds that have been posted to Pinterest
    return NextResponse.json({
      postedVideos: postedVideos.map(video => video.tiktokVideoId),
    });
  } catch (error) {
    console.error('Error fetching posted videos:', error);
    return NextResponse.json({ error: 'Failed to fetch posted videos' }, { status: 500 });
  }
}
