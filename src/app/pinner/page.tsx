'use client';

import VideoGrid from "@/components/VideoGrid";
import DiscordSignInPrompt from "@/components/DiscordSignInPrompt";
import DiscordServerJoinPrompt from "@/components/DiscordServerJoinPrompt";
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PinnerPage() {
  // useSession handles loading and session state
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

    checkGuildMembership();
  }, [session?.isDiscordLinked]);

  // Show a loading state while session is being fetched
  if (status === 'loading' || isCheckingGuild) {
    return <main className="min-h-screen flex justify-center items-center">Loading...</main>;
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    // Redirect to sign-in page, which will only show TikTok option now
    redirect("/auth/signin");
  }

  // If Discord is not linked, show the Discord sign-in prompt
  if (!session?.isDiscordLinked) {
    return <DiscordSignInPrompt />;
  }

  // If Discord is linked but user is not in the guild, show the server join prompt
  if (session?.isDiscordLinked && !isInGuild) {
    return <DiscordServerJoinPrompt />;
  }

  // Render the videos page if authenticated and in the Discord guild
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome Back {session?.user?.name}!</h1>
        {guildCheckError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
            <p>{guildCheckError}</p>
            <p className="mt-2">Continuing with limited functionality.</p>
          </div>
        )}
        <VideoGrid />
      </div>
    </main>
  );
}
