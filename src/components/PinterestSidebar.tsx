'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import VideoGrid from './VideoGrid';
import DiscordSignInPrompt from './DiscordSignInPrompt';
import DiscordServerJoinPrompt from './DiscordServerJoinPrompt';
import axios from 'axios';

interface PinterestSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PinterestSidebar({ isOpen, onClose }: PinterestSidebarProps) {
  const { data: session, status } = useSession();
  const [isCheckingGuild, setIsCheckingGuild] = useState(false);
  const [isInGuild, setIsInGuild] = useState(false);
  const [guildCheckError, setGuildCheckError] = useState<string | null>(null);

  // Check if user is in the Discord guild
  useEffect(() => {
    const checkGuildMembership = async () => {
      if (session?.isDiscordLinked) {
        setIsCheckingGuild(true);
        try {
          const response = await axios.get('/api/discord/check-guild');
          setIsInGuild(response.data.isInGuild);
        } catch (error) {
          console.error('Error checking guild membership:', error);
          setGuildCheckError('Failed to verify Discord server membership');
        } finally {
          setIsCheckingGuild(false);
        }
      }
    };

    if (isOpen && session?.isDiscordLinked) {
      checkGuildMembership();
    }
  }, [session?.isDiscordLinked, isOpen]);

  const handleSignIn = () => {
    signIn('tiktok', { callbackUrl: '/' });
  };

  const renderContent = () => {
    // Show loading state
    if (status === 'loading' || isCheckingGuild) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      );
    }

    // Show sign-in if not authenticated
    if (status === 'unauthenticated') {
      return (
        <div className="p-6 text-center">
          <div className="mb-6">
            <img
              src="/fullsize.png"
              alt="Pinterest Reposter"
              className="w-16 h-16 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pinterest Reposter</h2>
            <p className="text-gray-600 mb-6">
              Sign in with TikTok to start reposting your videos to Pinterest
            </p>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.5a6.34 6.34 0 0 0 10.86-4.43V7.83a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z"/>
            </svg>
            Continue with TikTok
          </button>
        </div>
      );
    }

    // If Discord is not linked, show the Discord sign-in prompt
    if (!session?.isDiscordLinked) {
      return <DiscordSignInPrompt />;
    }

    // If Discord is linked but user is not in the guild, show the server join prompt
    if (session?.isDiscordLinked && !isInGuild) {
      return <DiscordServerJoinPrompt />;
    }

    // Show the main Pinterest reposter interface
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back {session?.user?.name}!
          </h2>
          {guildCheckError && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p className="text-sm">{guildCheckError}</p>
              <p className="text-sm mt-1">Continuing with limited functionality.</p>
            </div>
          )}
        </div>
        <VideoGrid />
      </div>
    );
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className="text-lg font-semibold text-gray-900">Pinterest Reposter</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}