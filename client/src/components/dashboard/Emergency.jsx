import React from 'react';
import { PhoneIcon, MapPinIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';

const Emergency = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col items-center justify-center text-center">
      <ShieldExclamationIcon className="h-20 w-20 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800">Emergency Assistance</h2>
      <p className="mt-4 text-gray-600 max-w-md">
        If you are experiencing a medical emergency, please call your local emergency services immediately.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
          onClick={() => alert('This would find nearby hospitals using your location.')}
        >
          <MapPinIcon className="h-5 w-5" />
          Find Nearest Hospital
        </button>
        <a
          href="tel:911"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          <PhoneIcon className="h-5 w-5" />
          Call Services
        </a>
      </div>
    </div>
  );
};

export default Emergency;