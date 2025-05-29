import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import VideoGrid from "@/components/VideoGrid";
import LoginButton from "@/components/LoginButton";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">TikTok to Pinterest Reposter</h1>
        <p className="text-xl mb-8">Connect your accounts to get started</p>
        <LoginButton />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your TikTok Videos</h1>
        <VideoGrid />
      </div>
    </main>
  );
}
