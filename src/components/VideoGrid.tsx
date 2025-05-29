'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Video {
  id: string;
  cover_image_url: string;
  video_url: string;
  description: string;
  create_time: number;
}

export default function VideoGrid() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reposting, setReposting] = useState<string | null>(null);

  useEffect(() => {
    if (session?.accessToken) {
      fetchVideos();
    }
  }, [session]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/tiktok/videos', {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      setVideos(response.data.videos);
    } catch (err) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const repostToPinterest = async (video: Video) => {
    try {
      setReposting(video.id);
      await axios.post('/api/pinterest/pin', {
        videoUrl: video.video_url,
        description: video.description,
        accessToken: session?.accessToken,
      });
      alert('Successfully reposted to Pinterest!');
    } catch (err) {
      setError('Failed to repost to Pinterest');
      console.error(err);
    } finally {
      setReposting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative aspect-[9/16]">
            <img
              src={video.cover_image_url}
              alt={video.description}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {video.description}
            </p>
            <button
              onClick={() => repostToPinterest(video)}
              disabled={reposting === video.id}
              className={`w-full py-2 px-4 rounded-lg ${
                reposting === video.id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#E60023] hover:bg-[#AD081B]'
              } text-white transition-colors`}
            >
              {reposting === video.id ? 'Reposting...' : 'Repost to Pinterest'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 