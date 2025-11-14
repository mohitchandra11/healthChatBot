import React from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import AuthLayout from '../components/common/AuthLayout';
import { useAuth } from '../context/AuthContext';

const VirtualDoctorGatePage = () => {
  const { openAuthModal } = useAuth();

  return (
    <AuthLayout>
      <div className="w-full max-w-lg bg-black/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-10 text-center">
        <WrenchScrewdriverIcon className="h-20 w-20 text-blue-400 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">
          Virtual Doctor Access
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          The Virtual Doctor feature is currently under development. Sign up or log in to be notified when it launches!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-300 transform hover:scale-105"
          >
            Sign Up for Free
          </button>
          <button
            onClick={() => openAuthModal('login')}
            className="w-full sm:w-auto px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VirtualDoctorGatePage;