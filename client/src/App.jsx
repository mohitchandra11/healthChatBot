import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// --- Import all Page Components ---
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
// Note: ProfilePage is no longer imported as it's not a separate route
import EmergencyAccessPage from './pages/EmergencyAccessPage';
import GuestChatPage from './pages/GuestChatPage';
import VirtualDoctorGatePage from './pages/VirtualDoctorGatePage';
import AuthCallbackPage from './pages/AuthCallbackPage'; // For Google login

// --- Import Layout, Protection, and Modal Components ---
import ProtectedRoute from './components/common/ProtectedRoute';
import ProtectedLayout from './components/common/ProtectedLayout';
import AuthModal from './components/common/AuthModal';

function App() {
  return (
    // The AuthProvider wraps the entire application, making user authentication
    // state and modal controls globally available.
    <AuthProvider>
      <Router>
        {/* The AuthModal is placed here so it can be triggered from any page */}
        <AuthModal />
        
        <Routes>
          {/* --- Public Routes --- */}
          {/* These routes are accessible to everyone. */}
          <Route path="/" element={<HomePage />} />
          <Route path="/emergency" element={<EmergencyAccessPage />} />
          <Route path="/guest-chat" element={<GuestChatPage />} />
          <Route path="/virtual-doctor-access" element={<VirtualDoctorGatePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          
          {/* --- Protected Routes --- */}
          {/* This is the single entry point for the entire logged-in section of your app. */}
          <Route 
            element={
              // The 'ProtectedRoute' component acts as a security guard.
              // It checks if a user is logged in. If not, it redirects them.
              <ProtectedRoute>
                {/* If the user is logged in, it renders the 'ProtectedLayout'. */}
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            {/* All routes nested inside here are protected and will share the same layout.
                They are rendered by the <Outlet /> inside ProtectedLayout. */}
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* The profile is now a slide-out panel managed by the Header, so it does not have its own route. */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;