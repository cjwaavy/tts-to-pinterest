import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';
import { prisma } from '@/lib/prisma'; // Import the prisma client

export async function POST(request: Request) {
  const session = await auth();

  // Ensure user is authenticated and has a Pinterest access token
  if (!session?.pinterestAccessToken || !session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { videoUrl, description, tiktokVideoId, link, altText } = await request.json();

    // First, get the user's boards
    const boardsResponse = await axios.get('https://api.pinterest.com/v5/boards?', {
      headers: {
        'Authorization': `Bearer ${session.pinterestAccessToken}`,
        'Content-Type':  'application/json'
      },
    }); 

    // For this example, we'll use the first board
    // Make sure there's at least one board
    if (!boardsResponse.data.items || boardsResponse.data.items.length === 0) {
      console.error('No Pinterest boards found for the user.');
      return NextResponse.json({ error: 'No Pinterest boards found.' }, { status: 400 });
    }
    const boardId = boardsResponse.data.items[0].id;

    console.log('Attempting to create pin with videoUrl:', videoUrl);

    // Create the pin
    const pinResponse = await axios.post(
      'https://api-sandbox.pinterest.com/v5/pins',
      {
        board_id: boardId,
        media_source: {
          source_type: 'image_url',
          url: videoUrl,
        },
        title: description,
        description: `Reposted from TikTok: ${description}`,
        link: link || undefined,  // Only include if provided
      alt_text: altText || undefined,  // Only include if provided
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINTEREST_APP_SANDBOX_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const createdPinId = pinResponse.data.id; // Get the created pin ID from Pinterest

    // Save the posting record in the database
    try {
      await prisma.postedVideo.create({
        data: {
          userId: session.userId, // Use the userId from the session
          tiktokVideoId: tiktokVideoId, // Use the TikTok video ID from the request
          pinterestPinId: createdPinId, // Store the Pinterest pin ID
        },
      });
    } catch (dbError: any) {
      // Handle potential unique constraint violation (user already posted this video)
      if (dbError.code === 'P2002') {
        console.warn(`User ${session.userId} already posted TikTok video ${tiktokVideoId}`);
        // You might want to return a different status code or message here
      } else {
        console.error('Error saving posted video to database:', dbError);
        // Re-throw other database errors
        throw dbError;
      }
    }

    return NextResponse.json({ success: true, pin: pinResponse.data });
  } catch (error: any) {
    console.error('Error creating Pinterest pin:', error);
    console.error('Heres The response for that error:', error.response)

    // Consider more specific error handling for Pinterest API errors vs database errors

    return NextResponse.json(
      
      { error: 'Failed to create Pinterest pin' },
      { status: 500 }
    );
  }
} 