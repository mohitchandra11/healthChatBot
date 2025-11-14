import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

const EmergencyCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-5">
        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <PlusIcon className="h-10 w-10 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Emergency</h2>
          <p className="text-gray-600 mt-1">Nearest hospital and ambulance</p>
        </div>
      </div>
      <button className="mt-6 w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300">
        Call
      </button>
    </div>
  );
};

export default EmergencyCard;