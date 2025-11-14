import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Get the current user and the loading state from our AuthContext.
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // 1. If the AuthContext is still in the process of checking for a user
  //    (e.g., on a page refresh), we show a loading screen.
  //    This prevents the app from flashing the homepage before redirecting.
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-semibold text-gray-500">Loading Application...</div>
      </div>
    );
  }

  // 2. If the check is complete and there is NO currentUser,
  //    we redirect the user to the homepage. The 'replace' prop
  //    prevents the user from being able to click the "back" button
  //    to get into the protected area.
  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. If the check is complete and there IS a currentUser,
  //    we render the child components. In our App.jsx, the child
  //    is the <ProtectedLayout />, which contains our dashboard.
  return children;
};

export default ProtectedRoute;