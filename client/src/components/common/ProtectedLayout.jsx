import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { DashboardProvider } from '../../context/DashboardContext';
import { ChatProvider } from '../../context/ChatContext';
import Header from './Header';
import ProfileSidebar from '../dashboard/ProfileSidebar'; // Import the new component
import { motion } from 'framer-motion';

// --- Floating Sticker Component (for consistent theme) ---
const Sticker = ({ children, className }) => (
  <motion.div
    className={`absolute text-white/5 ${className}`}
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 1 }}
    drag dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  >
    {children}
  </motion.div>
);

const ProtectedLayout = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-2xl font-semibold text-gray-500">Loading Application...</div>
      </div>
    );
  }

  return (
    <DashboardProvider>
      <ChatProvider>
        {/* This is the main full-screen container. 'overflow-hidden' is critical. */}
        <div className="relative h-screen flex flex-col bg-gray-900 overflow-hidden">
          
          {/* --- Animated Background Elements --- */}
          <motion.div
            animate={{ x: [0, -100, 0], y: [0, 50, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[-30%] left-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full filter blur-3xl opacity-50"
          />
          <motion.div
            animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
            transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[-30%] right-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full filter blur-3xl opacity-50"
          />
          <Sticker className="top-[5%] left-[15%] text-blue-500"><svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10.5 21l-3-3m0 0l3-3m-3 3h6m-6 0H7.5" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13.5 3l3 3m0 0l-3 3m3-3h-6m6 0h2.5" /></svg></Sticker>
          <Sticker className="bottom-[10%] right-[5%] text-pink-500"><svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21.75l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg></Sticker>

          <div className="relative z-10 flex flex-col h-full">
            <Header />
            {/* --- THIS IS THE FIX for the scrollbar --- */}
            {/* The 'main' area now takes up the remaining space and handles its own internal scrolling. */}
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>

          {/* The Profile Sidebar is now part of the layout and can slide over */}
          <ProfileSidebar />
        </div>
      </ChatProvider>
    </DashboardProvider>
  );
};

export default ProtectedLayout;