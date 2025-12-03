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