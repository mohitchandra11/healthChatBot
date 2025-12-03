import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import axios from 'axios';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- NEW: Start in a loading state
  const [authModalState, setAuthModalState] = useState('closed');

  const openAuthModal = (state) => setAuthModalState(state);
  const closeAuthModal = () => setAuthModalState('closed');

  // On initial app load, check for a user to persist the session
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false); // We are done with the initial check
  }, []);

  const login = async (email, password) => {
    const user = await authService.login(email, password);
    setCurrentUser(user);
    return user;
  };

  const loginWithGoogleToken = async (token) => {
    try {
      // REACT_APP_API_URL is expected to be 'http://localhost:5000/api' or similar (including /api)
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

      const response = await axios.get(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const userProfile = response.data;
      // Combine profile with token to match authService structure
      const userToSave = { ...userProfile, token };

      localStorage.setItem('user', JSON.stringify(userToSave));
      setCurrentUser(userToSave);
      return userToSave;
    } catch (error) {
      console.error("Error logging in with Google token:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading, // <-- NEW: Expose the loading state
    login,
    logout,
    loginWithGoogleToken,
    authModalState,
    openAuthModal,
    closeAuthModal,
  };

  // We still render children, but the consumer will decide what to do with 'loading'
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}