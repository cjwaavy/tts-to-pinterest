'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import PinterestPostModal from './PinterestPostModal';

export interface Video {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  video_url: string;
  share_url: string;
  view_count: number;
  like_count: number;
  duration: number;
  create_time: string;
  posted_on_pinterest: boolean;
}

// Helper function to format duration (e.g., 65 seconds -> 1:05)
function formatDuration(seconds?: number): string {
  if (seconds === undefined) return '';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const paddedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${minutes}:${paddedSeconds}`;
}

// Helper function to format date
function formatDate(timestamp?: number): string {
    if (timestamp === undefined) return '';
    const date = new Date(timestamp * 1000); // TikTok timestamp is in seconds
    return date.toLocaleDateString(); // Or customize format
}

export default function VideoGrid() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.tiktokAccessToken) {
      fetchVideos();
      if (session?.pinterestAccessToken) {
        fetchBoards();
      }
    }
  }, [session]);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/tiktok/videos', {
        headers: {
          Authorization: `Bearer ${session?.tiktokAccessToken}`,
        },
      });
      setVideos(response.data.videos);
    } catch (err: any) {
      setError('Failed to fetch videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBoards = async () => {
    try {
      const response = await axios.get('/api/pinterest/boards', {
        headers: {
          Authorization: `Bearer ${session?.pinterestAccessToken}`,
        },
      });
      setBoards(response.data.boards);
    } catch (err: any) {
      console.error('Failed to fetch Pinterest boards:', err);
    }
  };

  const handleCreatePin = async (data: {
    title: string;
    description: string;
    boardId: string;
    link?: string;
    altText?: string;
  }) => {
    if (!selectedVideo) return;

    setIsSubmitting(true);
    try {
      const videoUrl = await axios.get(`/api/download?videoId=${selectedVideo.id}`);
      await axios.post('/api/pinterest/pin', {
        // videoUrl: selectedVideo.video_url,
        videoUrl: videoUrl,
        ...data,
        tiktokVideoId: selectedVideo.id,
      });

      // Update the video's posted status
      setVideos(videos.map(video =>
        video.id === selectedVideo.id
          ? { ...video, posted_on_pinterest: true }
          : video
      ));

      setIsModalOpen(false);
      setSelectedVideo(null);
    } catch (err) {
      setError('Failed to create Pinterest pin');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="relative group">
            <div className="aspect-[9/16] w-full overflow-hidden rounded-lg bg-gray-100 relative">
              <img
                src={video.cover_image_url}
                alt={video.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Video overlay with stats */}
              <div className="absolute inset-0   bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 z-10">
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs">{formatDuration(video.duration)}</span>
                    <div className="flex gap-3">
                      <span className="text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        {formatNumber(video.like_count)}
                      </span>
                      <span className="text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                        {formatNumber(video.view_count)}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xs font-medium truncate">{video.title}</h3>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-2">
              <button
                onClick={() => {
                  console.log('Selected video URL:', video.video_url);
                  setSelectedVideo(video);
                  console.log('Selected video:', video);
                  setIsModalOpen(true);
                }}
                disabled={video.posted_on_pinterest || !session?.isPinterestLinked}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  video.posted_on_pinterest
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : session?.isPinterestLinked
                    ? 'bg-[#E60023] text-white hover:bg-[#AD081B]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {video.posted_on_pinterest
                  ? 'Posted to Pinterest'
                  : session?.isPinterestLinked
                  ? 'Repost to Pinterest'
                  : 'Link Pinterest to post'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <PinterestPostModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVideo(null);
        }}
        video={selectedVideo}
        onSubmit={handleCreatePin}
        boards={boards}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
