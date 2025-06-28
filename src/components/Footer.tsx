'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and app name */}
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/fullsize.png" alt="App Logo" className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">TikTok Shop Pinner</span>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <Link
              href="/privacy-policy"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Terms of Service
            </Link>
            <a
              href="mailto:cjmcclasky@gmail.com"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-6 pt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Winner's Circle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
