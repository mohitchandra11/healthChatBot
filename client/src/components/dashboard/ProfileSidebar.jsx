import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';

const ProfileSidebar = () => {
  const { currentUser, logout } = useAuth();
  const { isProfileSidebarOpen, toggleProfileSidebar } = useDashboard();

  const handleLogout = () => {
    toggleProfileSidebar(); // Close the sidebar first
    logout();
  };

  return (
    <Transition.Root show={isProfileSidebarOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={toggleProfileSidebar}>
        <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 flex justify-end">
          <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="translate-x-full">
            <Dialog.Panel className="relative w-screen max-w-sm">
              <div className="flex h-full flex-col overflow-y-scroll bg-gray-800 text-white shadow-xl p-6">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-xl font-semibold">Your Profile</Dialog.Title>
                  <button type="button" className="rounded-md p-1 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none" onClick={toggleProfileSidebar}>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-8">
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-5xl font-semibold">
                      {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h2 className="mt-4 text-2xl font-bold">{currentUser?.name || 'User'}</h2>
                    <p className="text-gray-400">{currentUser?.email || 'No email provided'}</p>
                  </div>
                  <div className="mt-10 border-t border-gray-700 pt-6">
                     <button onClick={handleLogout} className="group flex w-full items-center justify-center gap-3 rounded-md bg-gray-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-500 hover:text-white">
                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-white" />
                        Sign out
                      </button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ProfileSidebar;