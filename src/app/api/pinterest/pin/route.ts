import { NextResponse } from 'next/server';
import { auth } from '@/auth.config';
import axios from 'axios';
import { prisma } from '@/lib/prisma'; // Import the prisma client

async function uploadVideoFromUrl(videoUrl: string, upload_url: string, upload_parameters: any) {
  // Step 1: Download video as buffer
  const videoResponse = await axios.get(videoUrl, {
    responseType: 'stream',
  });

  // Step 2: Accumulate stream into a Buffer
  const chunks = [];
  for await (const chunk of videoResponse.data) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  // Step 2: Convert to a Blob (fixes Pinterest rejection)
  const blob = new Blob([buffer], { type: 'video/mp4' });

  const form = new FormData()

  Object.entries(upload_parameters).forEach(([key, value]) => {
    form.append(key, value as string)
  })
  form.append('file', blob, 'video.mp4')

  const videoUploadResponse = await axios.post(upload_url,
    form,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

  if (videoUploadResponse.status !== 204) {
    console.error('Video upload response failed', videoUploadResponse)
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
  // console.log('✅ Upload response status:', videoUploadResponse.status);
}

export async function POST(request: Request) {
  const session = await auth();

  // Ensure user is authenticated and has a Pinterest access token
  if (!session?.pinterestAccessToken || !session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { videoUrl, cover_image_url, description, tiktokVideoId, link, altText } = await request.json();
    // console.log("cover_image_url:", cover_image_url)
    // First, get the user's boards
    const boardsResponse = await axios.get('https://api.pinterest.com/v5/boards?', {
      headers: {
        'Authorization': `Bearer ${session.pinterestAccessToken}`,
        'Content-Type': 'application/json'
      },
    });

    // For this example, we'll use the first board
    // Make sure there's at least one board
    if (!boardsResponse.data.items || boardsResponse.data.items.length === 0) {
      console.error('No Pinterest boards found for the user.');
      return NextResponse.json({ error: 'No Pinterest boards found.' }, { status: 400 });
    }
    const boardId = boardsResponse.data.items[0].id;

    //to get info to make request to post to pinterest AWS bucket
    const mediaResponse = await axios.post(`https://api-sandbox.pinterest.com/v5/media`,
      {
        media_type: 'video'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PINTEREST_APP_SANDBOX_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    )

    if (!mediaResponse.data) {
      console.error('Media response is empty / failed')
      return NextResponse.json({ error: 'Failed get templates from media endpoint' }, { status: 500 });
    }

    // console.log("Media response: ", mediaResponse.data)

    const { media_id, upload_url, upload_parameters } = mediaResponse.data

    // console.log("Media id: ", media_id)

    // console.log("videoUrl: ", videoUrl.data)

    // const videoStream = await axios.get(videoUrl.data, {
    //   responseType: 'stream'
    // })

    // const FILE_PATH = `./${tiktokVideoId}_${media_id}.mp4`;
    // console.log("videoStream:", videoStream)
    // console.log("type of videoStream:", typeof videoStream.data)
    // await pipeline(videoStream.data, fs.createWriteStream(FILE_PATH));

    // console.log('✅ Download complete:', FILE_PATH);




    // let curl = `curl --location --request POST '${upload_url}'`;

    // Object.entries(upload_parameters).forEach(([key, val]) => {
    //   curl += ` \\\n  --form '${key}=${val}'`;
    // });

    // curl += ` \\\n  --form 'file=@${FILE_PATH}'`;

    // console.log('\n🧨 CURL COMMAND:\n');
    // console.log(curl);
    // const outputFile = `./curl_${tiktokVideoId}_${media_id}.txt`;
    // fs.writeFileSync(outputFile, curl);
    // console.log(`\n✅ Saved to ${outputFile}`);

    // let formData: any = [];
    // Object.entries(upload_parameters).forEach(([key, val]) => {
    //   formData.push({name: key, contents: val})
    // });

    uploadVideoFromUrl(videoUrl.data, upload_url, upload_parameters)

    // console.log("Video upload response came through")

    const TIMEOUT = 600000;
    const startTime = Date.now();



    while (true) {
      if (Date.now() - startTime > TIMEOUT) {
        // console.log("Video Upload Status Check Timed Out")
        return NextResponse.json({ error: 'Video Upload Status Check Timed Out' }, { status: 504 })
      }
      const videoUploadStatusResponse = await axios.get(`https://api-sandbox.pinterest.com/v5/media/${media_id}?`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PINTEREST_APP_SANDBOX_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      )

      if (!videoUploadStatusResponse.data) {
        console.error('Video upload status response is empty / failed')
        return NextResponse.json({ error: 'Failed to get video upload status' }, { status: 500 });
      }
      const { status } = videoUploadStatusResponse.data
      // console.log(status)
      // console.log(videoUploadStatusResponse.data)
      if (status === "succeeded") {
        // console.log("UPLOAD SUCCEEDED")
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // console.log('Attempting to create pin with videoUrl:', videoUrl);



    // Create the pin
    const pinResponse = await axios.post(
      'https://api-sandbox.pinterest.com/v5/pins',
      {
        board_id: boardId,
        media_source: {
          source_type: 'video_id',
          media_id: media_id,
          cover_image_url: cover_image_url,
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
    if(error.status == 429){
      return NextResponse.json(
        { error: 'Reached Max of 5 videos today' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create Pinterest pin' },
      { status: 500 }
    );
  }
}
