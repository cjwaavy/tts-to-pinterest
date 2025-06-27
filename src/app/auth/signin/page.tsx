'use client';

import { signIn, useSession } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";

export default function SignIn() {

  const { data: session, status } = useSession();
  if(status === "authenticated"){
    redirect("/pinner");
  }
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/pinner";
  // console.log("callbackUrl: " + callbackUrl);
  const error = searchParams.get("error");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center ph-24 pb-24 pt-0">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8"> Sign in to connect your accounts </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error === "AccessDenied"
                ? "Access was denied. Please try again."
                : "An error occurred during sign in. Please try again."}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => signIn("tiktok", { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            Sign in with TikTok
          </button>

          {/* Pinterest Sign-in Button - Removed from initial sign-in page */}
          {/* Users can link Pinterest from Navbar after signing in with TikTok */}

        </div>

        {/* Legal Disclaimer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          By continuing to sign in, you are agreeing to our{
          ' '}
          <a href="/terms-of-service" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          {
          ' and '}
          <a href="/privacy-policy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
