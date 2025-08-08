'use client'
import BackgroundGradient from "@/components/BackgroundGradient";
import Link from "next/link";
import { useEffect, useState } from "react";
import PinterestSidebar from "@/components/PinterestSidebar";
import BackgroundGradient from "@/components/BackgroundGradient";
import Link from "next/link";
  const [typedText, setTypedText] = useState("");
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fullText = "Scale Your TikTok Shop\nFrom Zero";

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        // Show backdrop after demo starts sliding
        setTimeout(() => setShowBackdrop(true), 400);
      }
    }, 30); // ~0.5s total for typing

    return () => clearInterval(typingInterval);
  }, []);

import { useEffect, useState } from "react";
    <>
      <BackgroundGradient />

      {/* Pinterest Sidebar */}
      <PinterestSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
  useEffect(() => {
      )}
    return () => clearInterval(typingInterval);
      <div className="flex-1 h-full w-full">
        {/* Header with Pinterest access button */}
        <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <img
                  src="/fullsize.png"
                  alt="Winners Circle Logo"
                  className="w-10 h-10"
                />
                <span className="ml-2 text-xl font-bold text-gray-900">Winners Circle</span>
              </div>
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Pinterest Reposter
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-50 to-gray-100 pt-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <img
                src="/fullsize.png"
                alt="TikTok Shop Pinner Logo"
                className="w-24"
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              {typedText.split("\n").map((line, index) => (
                <div key={index}>
                  {line}
                  {index === typedText.split("\n").length - 1 && (
                    <span className="animate-pulse">|</span>
                  )}
                </div>
              ))}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {`Our Creator Roster does 100M+ views/mo and $1M/mo in revenue.\n
                high quality UGC at $50/video on average`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://calendly.com/influencer-winnerscircle/30min"
                className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                Book a Call
              </Link>
              <button
                onClick={() => setSidebarOpen(true)}
                className="px-8 py-4 bg-red-600 text-white text-lg font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Pinterest Reposter
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
                Try Pinterest Reposter
}            </div>
          </div>
        </main>
      </div>
    </>
                Try Pinterest Reposter
}            </div>
          </div>
        </main>
      </div>
    </>
                Try Pinterest Reposter
}            </div>
          </div>
        </main>
      </div>
    </>
              </button>
}          </div>
        </main>
      </div>
    </>
}
