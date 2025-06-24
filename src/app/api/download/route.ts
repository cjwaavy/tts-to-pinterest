import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  // Get the videoId from the URL query parameters
  const url = new URL(request.url);
  const videoId = url.searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json({ error: 'Video ID is required' }, { status: 400 });
  }

  try {
    // Make request to TikTok API
    const response = await axios.get(
      `https://api.tikhub.io/api/v1/tiktok/app/v3/fetch_one_video?aweme_id=${videoId}`,
      {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${process.env.TIKHUB_API_KEY}`
        }
      }
    );

    // Return the response data
    return NextResponse.json(response.data.data.aweme_details[0].video.download_no_watermark_addr.url_list[0]);
  } catch (error) {
    console.error('Error fetching video:', error);

    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: 'Failed to fetch video from TikTok API', details: error.response.data },
        { status: error.response.status }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch video from TikTok API' },
      { status: 500 }
    );
  }
}
