import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AuthLayout from '../components/common/AuthLayout';
import { PhoneIcon, MapPinIcon, ShieldExclamationIcon, XMarkIcon } from '@heroicons/react/24/solid';

const EmergencyAccessPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [smartInput, setSmartInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleHospitalClick = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        window.open(`https://www.google.com/maps/search/hospitals/@${latitude},${longitude},15z`, '_blank');
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert(`Location Access Failed: ${error.message}. \n\nPlease check your browser settings to allow location access for this site.`);
        window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
        setIsLoading(false);
      }
    );
  };

  const handleCall = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleSmartCall = (e) => {
    e.preventDefault();
    const input = smartInput.toLowerCase();

    if (input.includes('fire') || input.includes('burn')) {
      handleCall('101'); // Fire
    } else if (input.includes('police') || input.includes('thief') || input.includes('rob') || input.includes('unsafe')) {
      handleCall('100'); // Police
    } else if (input.includes('suicide') || input.includes('die') || input.includes('kill') || input.includes('sad') || input.includes('depressed')) {
      handleCall('988'); // Suicide Prevention
    } else if (input.includes('ambulance') || input.includes('hurt') || input.includes('blood') || input.includes('pain')) {
      handleCall('102'); // Ambulance
    } else {
      handleCall('112'); // Universal Emergency
    }
    setShowModal(false);
    setSmartInput('');
  };

  return (
    <AuthLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto px-2 sm:px-4"
      >
        <div className="relative overflow-hidden bg-black/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 md:p-12 text-center">

          {/* Background Ambience */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-red-500/20 p-4 sm:p-5 md:p-6 rounded-full mb-6 sm:mb-8 animate-pulse">
              <ShieldExclamationIcon className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 text-red-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">Emergency Assistance</h1>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 md:mb-12 leading-relaxed px-2">
              Immediate help is just a click away. If you are in a life-threatening situation, please act now.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 w-full max-w-2xl">
              <button
                onClick={handleHospitalClick}
                disabled={isLoading}
                className={`group flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
              >
                <div className="bg-blue-500/20 p-3 sm:p-4 rounded-full group-hover:bg-blue-500/30 transition-colors">
                  <MapPinIcon className={`h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-blue-400 ${isLoading ? 'animate-bounce' : ''}`} />
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{isLoading ? 'Locating...' : 'Find Hospital'}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Locate nearest medical center</p>
                </div>
              </button>

              <button
                onClick={() => setShowModal(true)}
                className="group flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-6 md:p-8 bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-green-500/20 p-3 sm:p-4 rounded-full group-hover:bg-green-500/30 transition-colors">
                  <PhoneIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Call Services</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">Connect with emergency lines</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Smart Call Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 max-w-md w-full relative shadow-2xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Select Service</h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <button onClick={() => handleCall('102')} className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all">
                  🚑 Ambulance
                </button>
                <button onClick={() => handleCall('100')} className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all">
                  👮 Police
                </button>
                <button onClick={() => handleCall('101')} className="bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all">
                  🚒 Fire
                </button>
                <button onClick={() => handleCall('988')} className="bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-400 py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all">
                  💜 Suicide Help
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or type your emergency</span>
                </div>
              </div>

              <form onSubmit={handleSmartCall} className="mt-6">
                <input
                  type="text"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  placeholder="e.g., 'I feel unsafe', 'House fire'..."
                  className="w-full bg-black/50 border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full mt-3 sm:mt-4 bg-white text-black font-bold py-2.5 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Connect Help
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AuthLayout>
  );
};

export default EmergencyAccessPage;