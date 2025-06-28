import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <img src="/fullsize.png" alt="TikTok Shop Pinner Logo" className="h-16 w-16" />
        </div>
        <h1 className="text-5xl font-bold mb-6">TikTok Shop Pinner</h1>
        <p className="text-xl text-gray-600 mb-8">
          Easily repost your TikTok videos to Pinterest with just a few clicks.
          Expand your reach and drive more traffic to your content.
        </p>
        <Link
          href="/auth/signin"
          className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
