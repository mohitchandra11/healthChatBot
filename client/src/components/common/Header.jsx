import React, { Fragment, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDashboard } from '../../context/DashboardContext';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon, HeartIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const { currentUser, logout } = useAuth();
  // Get the new toggle function from the context
  const { activeView, setActiveView, isProfileSidebarOpen, toggleProfileSidebar } = useDashboard();
  const navigate = useNavigate();
  const location = useLocation();

  // --- THIS IS THE FIX for the stale active state ---
  // This effect deselects nav items when the profile sidebar opens.
  useEffect(() => {
    if (isProfileSidebarOpen) {
      setActiveView(null);
    } else if (location.pathname === '/dashboard' && activeView === null) {
      // If we close the profile and are on the dashboard, re-select chat.
      setActiveView('chat');
    }
  }, [isProfileSidebarOpen, location.pathname, setActiveView, activeView]);

  const handleLogout = () => { logout(); };
  const handleNavClick = (view) => {
    // Only change view if it's different from current view
    if (activeView !== view) {
      // If profile sidebar is open, close it first
      if (isProfileSidebarOpen) {
        toggleProfileSidebar();
      }
      
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
        // Add a small delay to ensure navigation completes
        setTimeout(() => setActiveView(view), 100);
      } else {
        setActiveView(view);
      }
    }
  };

  const navItemClasses = (view) => 
    `px-3 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
      activeView === view
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 flex-shrink-0 relative z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <HeartIcon className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white hidden sm:block">Aegis Health AI</span>
          </div>
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={() => handleNavClick('chat')} className={navItemClasses('chat')}>Chat AI</button>
            <button onClick={() => handleNavClick('virtualDoctor')} className={navItemClasses('virtualDoctor')}>Virtual Doctor</button>
            <button onClick={() => handleNavClick('emergency')} className={navItemClasses('emergency')}>Emergency</button>
          </nav>
          <div className="ml-4 flex items-center md:ml-6">
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={toggleProfileSidebar}
                        className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 w-full`}
                      >
                        <UserCircleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Your Profile
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={handleLogout} className={`${active ? 'bg-gray-100' : ''} group flex items-center px-4 py-2 text-sm text-gray-700 w-full`}>
                        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;