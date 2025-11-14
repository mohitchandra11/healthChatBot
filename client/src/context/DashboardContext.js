import React, { createContext, useState, useContext } from 'react';

const DashboardContext = createContext(null);

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardProvider({ children }) {
  const [activeView, setActiveView] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isProfileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [previousView, setPreviousView] = useState(null);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const toggleProfileSidebar = () => setProfileSidebarOpen(prev => !prev);
  
  const setView = (view) => {
    setPreviousView(activeView);
    setActiveView(view);
  };

  const value = {
    activeView,
    setActiveView: setView,
    previousView,
    isSidebarOpen,
    toggleSidebar,
    isProfileSidebarOpen,
    toggleProfileSidebar
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}