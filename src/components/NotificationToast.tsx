'use client';

import { Fragment, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export type NotificationStatus = 'processing' | 'success' | 'error' | null;

interface NotificationToastProps {
  status: NotificationStatus;
  message: string;
  imageUrl?: string;
  onClose: () => void;
  autoCloseDelay?: number; // in milliseconds
}

export default function NotificationToast({
  status,
  message,
  imageUrl,
  onClose,
  autoCloseDelay = 4000, // Default to 2 seconds
}: NotificationToastProps) {
  // Auto-close the notification after the specified delay when status is 'success' or 'error'
  useEffect(() => {
    if ((status === 'success' || status === 'error') && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [status, autoCloseDelay, onClose]);

  return (
    <Transition
      show={status !== null}
      as={Fragment}
      enter="transform transition ease-in-out duration-500"
      enterFrom="translate-y-[-100%] opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transform transition ease-in-out duration-500"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-[-100%] opacity-0"
    >
      <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto overflow-hidden">
        <div className="p-4">
          <div className="flex items-start">
            {/* Image */}
            {imageUrl && (
              <div className="flex-shrink-0 mr-3">
                <div className="h-12 w-12 rounded overflow-hidden">
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${
                  status === 'success' ? 'text-green-600' :
                  status === 'error' ? 'text-red-600' :
                  'text-gray-900'
                }`}>
                  {message}
                </p>
              </div>

              {/* Loading animation or success icon */}
              <div className="mt-1 flex items-center">
                {status === 'processing' ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin"></div>
                    <p className="text-xs text-gray-500">Processing...</p>
                  </div>
                ) : status === 'success' ? (
                  <div className="flex items-center">
                    <CheckCircleIcon className="mr-2 h-4 w-4 text-green-500" />
                    <p className="text-xs text-green-500">Successfully posted!</p>
                  </div>
                ) : status === 'error' ? (
                  <div className="flex items-center">
                    <XCircleIcon className="mr-2 h-4 w-4 text-red-500" />
                    <p className="text-xs text-red-500">Failed to post</p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Close button */}
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
