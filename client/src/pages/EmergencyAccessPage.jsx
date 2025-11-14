import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/common/AuthLayout'; // <-- Import our beautiful layout
import { PhoneIcon, MapIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const EmergencyAccessPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFindHospital = () => {
    setMessage('Requesting your location...');
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setMessage('');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setError('');
        // In a real app, you would now use these coordinates to call a mapping API.
        setMessage(`Location found! Searching for hospitals near you...`);
      },
      (err) => {
        setMessage('');
        setError(`Error: ${err.message}. Please grant location permissions.`);
      }
    );
  };

  return (
    // We wrap the entire page in the AuthLayout to get the animated background
    // and the "Back to Home" button.
    <AuthLayout>
      {/* This is the "glassmorphism" card that floats on top of the animated background */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-10 text-center"
      >
        <ShieldExclamationIcon className="h-20 w-20 text-red-400 mx-auto" />
        
        <h1 className="mt-6 text-4xl font-extrabold text-white">
          Emergency Assistance
        </h1>
        
        <p className="text-gray-300 text-lg mt-4">
          If this is a life-threatening emergency, call your local services immediately. This tool is for assistance only.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
          <button
            onClick={handleFindHospital}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition duration-300 transform hover:scale-105"
          >
            <MapIcon className="h-5 w-5" />
            Find Nearest Hospital
          </button>
          <a
            href="tel:911" // Change to your local emergency number
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
          >
            <PhoneIcon className="h-5 w-5" />
            Call Services
          </a>
        </div>

        {/* Display area for messages and errors */}
        <div className="pt-6 text-sm min-h-[40px]">
          {message && <p className="text-blue-400 font-semibold">{message}</p>}
          {error && <p className="text-red-400 font-semibold">{error}</p>}
        </div>
      </motion.div>
    </AuthLayout>
  );
};

export default EmergencyAccessPage;