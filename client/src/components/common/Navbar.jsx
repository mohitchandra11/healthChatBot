import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HeartIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  // We only need this function to open the modal.
  const { openAuthModal } = useAuth();

  return (
    <header className="bg-black/80 backdrop-blur-sm shadow-md fixed top-0 left-0 w-full z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <HeartIcon className="h-8 w-8 text-blue-500" />
          <span className="text-2xl font-bold text-gray-100">Aegis Health AI</span>
        </Link>
        
        {/* --- THIS IS THE CORRECTED, SIMPLE BUTTON SECTION --- */}
        <div className="space-x-4 flex items-center">
          {/* These buttons are now static and will always be visible on the homepage */}
          <button 
            onClick={() => openAuthModal('login')}
            className="text-gray-300 hover:text-white font-medium transition duration-300"
          >
            Login
          </button>
          <button
            onClick={() => openAuthModal('signup')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-500 font-semibold transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;