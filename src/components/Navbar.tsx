'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckIcon, LinkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import axios from 'axios';

export default function Navbar() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();

  const isUserAuthenticated = status === 'authenticated';
  const isTikTokLinked = session?.isTikTokLinked;
  const isPinterestLinked = session?.isPinterestLinked;

  const isSignInPage = pathname === '/auth/signin';

  const [isPinterestHovered, setIsPinterestHovered] = useState(false);

  const handleUnlinkPinterest = async () => {
    if (!session?.userId) return;

    try {
      await axios.post('/api/pinterest/unlink');
      await update();
    } catch (error) {
      console.error('Error unlinking Pinterest account:', error);
    }
  };

  return (
    <nav className="bg-gray-100 text-gray-800 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-xl font-bold flex items-center ${isSignInPage ? 'mx-auto' : ''}`}>
          <img src="/v4.png" alt="App Logo" className="h-8 w-8 mr-2" />
          TikTok Shop Pinner
        </Link>
        {!isSignInPage && (
          <div className="flex items-center space-x-4">
            {/* TikTok Status */}
            <div className="flex items-center">
              {isUserAuthenticated ? (
                isTikTokLinked ? (
                  <div className="flex items-center space-x-2">
                    <div className="bg-black text-white rounded px-2 py-1 flex items-center justify-center space-x-1">
                      {/* TikTok Logo SVG */}
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span className="text-xs font-bold text-center p-1">Connected</span>
                      {/* Check icon inside the box */}
                      <CheckIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => signIn('tiktok')}
                    className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700 transition-colors text-white"
                  >
                    Link TikTok
                  </button>
                )
              ) : null}
            </div>

            {/* Pinterest Status - Changed to a button for unlink functionality */}
            <div className="flex items-center">
               {isUserAuthenticated ? (
                isPinterestLinked ? (
                   <button
                     onClick={handleUnlinkPinterest}
                     onMouseEnter={() => setIsPinterestHovered(true)}
                     onMouseLeave={() => setIsPinterestHovered(false)}
                     className="flex items-center justify-center w-full space-x-2 rounded px-2 py-1 transition-colors focus:outline-none"
                   >
                    <div className={`flex items-center justify-center w-full space-x-1 rounded px-2 py-1 ${isPinterestHovered ? 'bg-gray-600' : 'bg-[#E60023]'} transition-colors duration-200 ease-in-out`}>
                      {isPinterestHovered ? (
                        <>
                          <LinkIcon className="h-4 w-4 fill-current text-white transform rotate-45 transition-transform duration-200 ease-in-out" />
                          <span className="text-white text-xs font-bold text-center px-5">Unlink</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
                          </svg>
                          <span className="text-xs font-bold text-center p-1 text-white">Connected</span>
                          {/* Check icon inside the box */}
                          <CheckIcon className="h-4 w-4 text-white" />
                        </>
                      )}
                    </div>
                   </button>
                ) : (
                  <button
                    onClick={() => signIn('pinterest')}
                     className="px-3 py-1 text-sm bg-red-600 rounded hover:bg-red-700 transition-colors text-white"
                >
                    Link Pinterest
                  </button>
                )
              ) : null}
            </div>

            {/* Overall Logout Button */}
            <div>
              {isUserAuthenticated && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors text-white"
                >
                  Logout
                </button>
              )}
               {!isUserAuthenticated && (
                   <Link href="/auth/signin" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-white">
                       Sign In
                   </Link>
               )}
            </div>

          </div>
        )}
      </div>
    </nav>
  );
} 