import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import { ChatBubbleLeftRightIcon, VideoCameraIcon, MapPinIcon } from '@heroicons/react/24/outline';

// Animation variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white">
      <Navbar />
      <main>
        {/* Hero Section */}
        {/* --- THE FIX: Significantly reduced bottom padding --- */}
        <section className="relative pt-40 pb-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/80 to-black"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent"></div>
          
          <div className="container mx-auto px-6 relative">
            <motion.h1 
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl font-extrabold text-gray-100 md:text-7xl tracking-tighter"
            >
              Your Personal AI Health Companion
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto"
            >
              Aegis Health AI provides real-time symptom analysis, personalized health advice, and instant access to emergency services, all powered by advanced AI.
            </motion.p>
          </div>
        </section>

        {/* Features Section */}
        {/* --- THE FIX: Significantly reduced top padding --- */}
        <motion.section 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="pt-12 pb-24 bg-black"
        >
          <div className="container mx-auto px-6">
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold text-center text-gray-100 mb-16">
              How We Can Help
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              
              {/* Card 1: AI Chatbot (Public Guest Access) */}
              <motion.div 
                variants={fadeInUp} 
                onClick={() => navigate('/guest-chat')}
                className="relative text-center p-8 bg-gray-900 rounded-xl border border-gray-800 transform hover:scale-105 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="relative z-10">
                  <div className="flex justify-center items-center mb-6 w-20 h-20 mx-auto bg-gray-800 rounded-full">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-100">Try the Chatbot</h3>
                  <p className="text-gray-400">Get instant analysis without an account. Your chat will not be saved.</p>
                </div>
              </motion.div>

              {/* Card 2: Virtual Doctor (Leads to Gate Page) */}
              <motion.div 
                variants={fadeInUp} 
                onClick={() => navigate('/virtual-doctor-access')}
                className="relative text-center p-8 bg-gray-900 rounded-xl border border-gray-800 transform hover:scale-105 hover:border-blue-500 transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                 <div className="relative z-10">
                  <div className="flex justify-center items-center mb-6 w-20 h-20 mx-auto bg-gray-800 rounded-full">
                    <VideoCameraIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-100">Virtual Animated Doctor</h3>
                  <p className="text-gray-400">Engage with our virtual doctor for guided assistance. Account required to access.</p>
                </div>
              </motion.div>

              {/* Card 3: Emergency Services (Public) */}
              <motion.div 
                variants={fadeInUp} 
                onClick={() => navigate('/emergency')}
                className="relative text-center p-8 bg-gray-900 rounded-xl border border-gray-800 transform hover:scale-105 hover:border-red-500 transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                <div className="relative z-10">
                  <div className="flex justify-center items-center mb-6 w-20 h-20 mx-auto bg-gray-800 rounded-full">
                    <MapPinIcon className="h-10 w-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-gray-100">Instant Emergency Assistance</h3>
                  <p className="text-gray-400">Find the nearest hospitals and get connected to services. No login required.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="bg-black border-t border-gray-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500">&copy; {new Date().getFullYear()} Aegis Health AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;