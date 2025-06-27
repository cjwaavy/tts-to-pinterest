'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import PinterestPostModal from './PinterestPostModal';
import NotificationToast, { NotificationStatus } from './NotificationToast';

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

export default function VideoGrid() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const retryAttempt = parseInt(searchParams.get('retry') || '0');

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(retryAttempt);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boards, setBoards] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationImage, setNotificationImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (session?.tiktokAccessToken) {
      fetchVideos();
      if (session?.pinterestAccessToken) {
        fetchBoards();
      }
    }
  }, [session, retryAttempt]);

  // Fetch posted videos and update the videos array
  useEffect(() => {
    if (videos.length > 0 && session) {
      fetchPostedVideos();
    }
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/tiktok/videos', {
        headers: {
          Authorization: `Bearer ${session?.tiktokAccessToken}`,
        },
      });
      setVideos(response.data.videos);
      fetchPostedVideos();
      // Reset failed attempts on success
      setFailedAttempts(0);
    } catch (err: any) {
      console.error(err);

      // If we've tried less than 3 times, retry automatically
      if (failedAttempts < 2) {
        const nextAttempt = failedAttempts + 1;
        setFailedAttempts(nextAttempt);

        // Create a new URL with updated retry parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set('retry', nextAttempt.toString());

        // Redirect to the same page with updated retry parameter
        router.push(`?${params.toString()}`);
      } else {
        // On third attempt, show the error
        setError('Failed to fetch videos');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPostedVideos = async () => {
    try {
      const response = await axios.get('/api/pinterest/posted-videos');
      const postedVideoIds = response.data.postedVideos;

      // Update videos with posted_on_pinterest property
      setVideos(prevVideos =>
        prevVideos.map(video => ({
          ...video,
          posted_on_pinterest: postedVideoIds.includes(video.id)
        }))
      );
    } catch (err: any) {
      console.error('Failed to fetch posted videos:', err);
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

    // Close the modal first
    setIsModalOpen(false);

    // Show processing notification
    setNotificationStatus('processing');
    setNotificationMessage(data.title);
    setNotificationImage(selectedVideo.cover_image_url);

    try {
      // First check if the user has reached the daily cap
      await axios.get('/api/pinterest/check-cap');



      // If cap check passes, proceed with downloading the video
      const videoUrl = await axios.get(`/api/download?videoId=${selectedVideo.id}`);

      // Create the pin
      await axios.post('/api/pinterest/pin', {
        videoUrl: videoUrl,
        ...data,
        tiktokVideoId: selectedVideo.id,
        cover_image_url: selectedVideo.cover_image_url
      });

      // Update the video's posted status
      setVideos(videos.map(video =>
        video.id === selectedVideo.id
          ? { ...video, posted_on_pinterest: true }
          : video
      ));

      // Show success notification
      setNotificationStatus('success');

      setSelectedVideo(null);
    } catch (err: any) {
      if(err?.status == 429){
        setNotificationStatus('error');
        // console.log(capCheckResponse?.data)
        setNotificationMessage(`Daily limit reached [5], you can post again in ${err?.response?.data.hoursUntilNextDay} hours`);
        return
      }
      // Show error notification
      setNotificationStatus('error');
      setNotificationMessage(err.message);
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
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <NotificationToast
        status={notificationStatus}
        message={notificationMessage}
        imageUrl={notificationImage}
        onClose={() => setNotificationStatus(null)}
      />

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
                  // console.log('Selected video URL:', video.video_url);
                  setSelectedVideo(video);
                  // console.log('Selected video:', video);
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
