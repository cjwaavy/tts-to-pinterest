'use client';

import VideoGrid from "@/components/VideoGrid";
import LoginButton from "@/components/LoginButton";
import { signOut } from "next-auth/react";
import { useSession } from 'next-auth/react';
import { redirect } from "next/navigation";

export default function Home() {
  // useSession handles loading and session state
  const { data: session, status } = useSession();

  // Show a loading state while session is being fetched
  if (status === 'loading') {
    return <main className="min-h-screen flex justify-center items-center">Loading...</main>;
  }

  // Redirect to sign-in if not authenticated
  if (status === 'unauthenticated') {
    // Redirect to sign-in page, which will only show TikTok option now
    redirect("/auth/signin"); 
  }

  // Render the videos page if authenticated
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Welcome Back {session?.user?.name}!</h1>
        <VideoGrid />
        {/* <div className="mt-8">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div> */}
      </div>
    </main>
  );
}
