import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';

export async function GET(request: Request) {
  const session = await auth();
  console.log("boards session access token:")
  console.log(session?.pinterestAccessToken)

  // Ensure user is authenticated and has a Pinterest access token
  if (!session?.pinterestAccessToken || !session?.isPinterestLinked) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch boards from Pinterest API
    const response = await axios.get('https://api.pinterest.com/v5/boards', {
      headers: {
        'Authorization': `Bearer ${session.pinterestAccessToken}`,
        'Content-Type':  'application/json',
      },
    //   params: {
    //     page_size: 100, // Adjust as needed
    //     fields: 'id,name,description,privacy,created_at,updated_at',
    //   },
    });

    // Transform the response to include only necessary fields
    const boards = response.data.items.map((board: any) => ({
      id: board.id,
      name: board.name,
    }));

    return NextResponse.json({ boards });
  } catch (error: any) {
    console.error('Error fetching Pinterest boards:', error);
    console.error('Heres The response for that error:', error.response)
    return NextResponse.json(
      { error: 'Failed to fetch Pinterest boards' },
      { status: 500 }
    );
  }
}
