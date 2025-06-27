const fs = require('fs');
const axios = require('axios');
const { pipeline } = require('stream/promises');

// TikTok CDN link or any direct .mp4 URL
const VIDEO_URL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  'https://v16m.tiktokcdn-us.com/9e79d1ca0a0d9149457a0edf8fada9f0/685b27fd/video/tos/useast5/tos-useast5-ve-0068c002-tx/oA6rmgkMQCXF8NFXQMalfAQeIHCu8roAfjIZyt/?a=1233&...'; // truncated for readability

// Local file path
const FILE_PATH = './downloaded_video.mp4';

async function run() {
  try {
    console.log('📥 Starting download...');

    const response = await axios.get(VIDEO_URL, {
      responseType: 'stream',
    });

    await pipeline(response.data, fs.createWriteStream(FILE_PATH));

    console.log(`✅ Download complete! Saved to: ${FILE_PATH}`);
  } catch (error) {
    console.log(error);
    console.error('❌ Download failed:', error.message);
  }
}

run();
