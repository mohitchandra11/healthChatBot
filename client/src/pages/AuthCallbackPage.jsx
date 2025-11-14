import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const { loginWithGoogleToken } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 1. Call the login function with the token from the URL.
      loginWithGoogleToken(token)
        .then(() => {
          // 2. AFTER the login is complete, navigate to the dashboard.
          navigate('/dashboard', { replace: true });
        })
        .catch(err => {
          // 3. If login fails for any reason, go back to the homepage.
          console.error("Google login callback failed:", err);
          navigate('/', { replace: true });
        });
    } else {
      // If no token is found in the URL, this page was visited in error. Go home.
      console.error("No token found in callback URL.");
      navigate('/', { replace: true });
    }
    // We only want this effect to run once.
  }, []); // An empty dependency array is correct here.

  return (
    // Show a simple loading message to the user while the process happens.
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <p className="text-lg animate-pulse">Authenticating with Google, please wait...</p>
    </div>
  );
};

export default AuthCallbackPage;