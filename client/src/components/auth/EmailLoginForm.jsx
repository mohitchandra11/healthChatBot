import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.802 8.922C34.789 5.316 29.818 3 24 3C12.438 3 3 12.438 3 24s9.438 21 21 21s21-9.438 21-21c0-1.564-.148-3.09-.411-4.582z"></path><path fill="#FF3D00" d="M6.306 14.691c-1.644 3.279-2.623 7.025-2.623 11.029c0 4.003.979 7.75 2.623 11.029L12.592 30.6C11.139 27.989 10.5 24.961 10.5 21.916c0-3.044.639-6.072 1.942-8.793L6.306 14.691z" transform="translate(0 2.084)"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C39.993 35.857 42 32.25 42 27.917c0-2.316-.34-4.545-.949-6.625z"></path></svg>
);

const EmailLoginForm = () => {
  const { login, openAuthModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState('password');

  const handleEmailBlur = async () => {
    if (!email) return;
    try {
      const res = await axios.post('http://localhost:5000/api/auth/check-method', { email });
      setAuthMethod(res.data.method);
    } catch (error) {
      setAuthMethod('password');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      closeAuthModal();
      navigate('/dashboard');
    } catch (error) {
      setMessage((error.response?.data?.message) || 'Invalid credentials or server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>
      <div className="mt-8">
        <a href="http://localhost:5000/api/auth/google" className="w-full flex justify-center items-center gap-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <GoogleIcon />
          <span className="font-semibold">Continue with Google</span>
        </a>
      </div>

      <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-200"></div><span className="mx-4 text-xs font-semibold text-gray-400">OR</span><div className="flex-grow border-t border-gray-200"></div></div>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleEmailBlur} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        {authMethod === 'google' ? (
          <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-medium text-blue-800">
              You signed up with Google. Please use the button above.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>
        )}
        
        {message && <p className="text-sm font-medium text-red-500 text-center">{message}</p>}

        <div>
          <button type="submit" className="w-full py-2.5 mt-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-semibold" disabled={loading || authMethod !== 'password'}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-sm text-center text-gray-600">
        No account?{' '}
        <button onClick={() => openAuthModal('signup')} className="font-medium text-blue-600 hover:underline focus:outline-none">
          Create one
        </button>
      </p>
    </div>
  );
};

export default EmailLoginForm;