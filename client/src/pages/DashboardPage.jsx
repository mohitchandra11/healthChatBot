import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from '../components/dashboard/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import VirtualDoctor from '../components/dashboard/VirtualDoctor';
import Emergency from '../components/dashboard/Emergency';

const ChatLayout = () => (
  // The 'glassmorphism' container for the chat layout
  <div className="flex h-[calc(100vh-5rem)] mt-12 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
    <Sidebar />
    <ChatWindow />
  </div>
);

const DashboardPage = () => {
  const { activeView } = useDashboard();

  const WelcomeDashboard = () => (
    <div className="h-[calc(100vh-5rem)] mt-12 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to Your Health Dashboard</h1>
        <p className="text-xl text-gray-300">Select an option from the sidebar to get started</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeView) {
      case 'chat':
        return <ChatLayout />;
      case 'virtualDoctor':
        return <div className="h-[calc(100vh-5rem)] mt-12 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden"><VirtualDoctor /></div>;
      case 'emergency':
        return <div className="h-[calc(100vh-5rem)] mt-12 bg-black/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/10 overflow-hidden"><Emergency /></div>;
      default:
        // Show welcome dashboard when no view is selected
        return <WelcomeDashboard />;
    }
  };
  
  // The page now has padding to frame the content. The content itself is h-full.
  return (
    <div className="h-screen p-4 fixed inset-0 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default DashboardPage;