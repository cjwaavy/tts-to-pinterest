'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckIcon, LinkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Navbar() {
  const { data: session, status, update } = useSession();
  const pathname = usePathname();

  const isUserAuthenticated = status === 'authenticated';
  const isTikTokLinked = session?.isTikTokLinked;
  const isPinterestLinked = session?.isPinterestLinked;
  const isDiscordLinked = session?.isDiscordLinked;

  const isSignInPage = pathname === '/auth/signin';

  const [isPinterestHovered, setIsPinterestHovered] = useState(false);
  const [isDiscordHovered, setIsDiscordHovered] = useState(false);

  const handleUnlinkPinterest = async () => {
    if (!session?.userId) return;

    try {
      await axios.post('/api/pinterest/unlink');
      await update({customParams: 'deletePinterestAccount'});
      // console.log("Unlinked Pinterest account session info: ", session)
    } catch (error) {
      console.error('Error unlinking Pinterest account:', error);
    }
  };
  const handleUnlinkDiscord = async () => {
    if (!session?.userId) return;

    try {
      await axios.post('/api/discord/unlink');
      await update({customParams: 'deleteDiscordAccount'});
    } catch (error) {
      console.error('Error unlinking Discord account:', error);
    }
  };

  return (
    <nav className="bg-gray-100 text-gray-800 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className={`text-xl font-bold flex items-center ${isSignInPage ? 'mx-auto' : ''}`}>
          <img src="/fullsize.png" alt="App Logo" className="h-8 w-8 mr-2" />
          {pathname === '/home' ? "Winner's Circle | Official TikTok Shop Partner" : 'TikTok Shop Pinner'}
        </Link>
        {!isSignInPage && (
          <div className="flex items-center space-x-4">
            {/* Dashboard Link - Only show for authenticated users on the landing page */}
            {isUserAuthenticated && pathname === '/' && (
              <Link href="/pinner" className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-white">
                Dashboard
              </Link>
            )}

            {/* TikTok Status - Only show on the pinner page */}
            {pathname === '/pinner' && (
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
            )}

            {/* Discord Status - Only show on the pinner page */}
            {pathname === '/pinner' && (
              <div className="flex items-center space-x-3">
                {isUserAuthenticated ? (
                  <>
                    {/* Discord Button */}
                    {isDiscordLinked ? (
                      <button
                        onClick={handleUnlinkDiscord}
                        onMouseEnter={() => setIsDiscordHovered(true)}
                        onMouseLeave={() => setIsDiscordHovered(false)}
                        className="flex items-center justify-center w-full space-x-2 rounded px-2 py-1 transition-colors focus:outline-none"
                      >
                        <div className={`flex items-center justify-center w-full space-x-1 rounded px-2 py-1 ${isDiscordHovered ? 'bg-gray-600' : 'bg-[#5865F2]'} transition-colors duration-200 ease-in-out`}>
                          {isDiscordHovered ? (
                            <>
                              <LinkIcon className="h-4 w-4 fill-current text-white transform rotate-45 transition-transform duration-200 ease-in-out" />
                              <span className="text-white text-xs font-bold text-center px-5">Unlink</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 fill-current text-white" viewBox="0 -28.5 256 256" preserveAspectRatio="xMidYMid">
                                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
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
                        onClick={() => signIn('discord')}
                        className="px-3 py-1 text-sm bg-[#5865F2] rounded hover:bg-[#4752C4] transition-colors text-white"
                      >
                        Link Discord
                      </button>
                    )}

                    {/* Pinterest Button - Only show if Discord is connected */}
                    {isDiscordLinked && (
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
                          className="px-4 py-1 text-sm bg-red-600 rounded hover:bg-red-700 transition-colors text-white min-w-[120px] whitespace-nowrap"
                        >
                          Link Pinterest
                        </button>
                      )
                    )}
                  </>
                ) : null}
              </div>
            )}

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
