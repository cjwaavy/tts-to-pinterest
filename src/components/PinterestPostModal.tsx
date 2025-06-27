'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from './VideoGrid';

interface PinterestPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
  onSubmit: (data: {
    title: string;
    description: string;
    boardId: string;
    link?: string;
    altText?: string;
  }) => Promise<void>;
  boards: Array<{ id: string; name: string }>;
  isSubmitting: boolean;
}

export default function PinterestPostModal({
  isOpen,
  onClose,
  video,
  onSubmit,
  boards,
  isSubmitting
}: PinterestPostModalProps) {
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState('');
  const [boardId, setBoardId] = useState(boards[0]?.id || '');
  const [link, setLink] = useState(video?.share_url || '');
  const [altText, setAltText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      boardId,
      link,
      altText
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              {/* Slide-in panel */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Create Pinterest Pin
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                            onClick={onClose}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Video preview */}
                    {video && (
                      <div className="px-4 sm:px-6">
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={video.cover_image_url}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 sm:px-6">
                      <div className="space-y-6">
                        {/* Board selection */}
                        <div>
                          <label htmlFor="board" className="block text-sm font-medium text-gray-700">
                            Board
                          </label>
                          <select
                            id="board"
                            name="board"
                            value={boardId}
                            onChange={(e) => setBoardId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            {boards.map((board) => (
                              <option key={board.id} value={board.id}>
                                {board.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* Link */}
                        <div>
                          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                            Link (optional)
                          </label>
                          <input
                            type="url"
                            name="link"
                            id="link"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* Alt text */}
                        <div>
                          <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
                            Alt Text (optional)
                          </label>
                          <input
                            type="text"
                            name="altText"
                            id="altText"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex w-full justify-center rounded-md bg-[#E60023] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#AD081B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E60023] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Creating Pin...' : 'Create Pin'}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
