import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const register = (name, email, password, country) => {
  return axios.post(API_URL + 'register', { name, email, password, country });
};

const login = (email, password) => {
  return axios
    .post(API_URL + 'login', { email, password })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    });
};

// --- THIS IS THE NEW, BULLETPROOF LOGOUT FUNCTION ---
const logout = () => {
  // 1. Remove the user's data from storage.
  localStorage.removeItem('user');
  // 2. Force a hard refresh and navigate to the homepage.
  // This is the key to destroying all old React state.
  window.location.href = '/'; 
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;