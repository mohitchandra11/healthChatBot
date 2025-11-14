import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { PaperAirplaneIcon, SparklesIcon, GlobeAltIcon, LockClosedIcon, ArrowLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const GuestChatPage = () => {
  const { openAuthModal } = useAuth();
  const [messages, setMessages] = useState([
    { text: "Hello! This is a preview of Aegis Health AI. Your chat history will not be saved. Sign up to unlock all features!", sender: 'bot', id: 1 }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user', id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput('');
    setIsSending(true);

    try {
      const response = await axios.post('http://localhost:5000/api/guest-chat', { message: messageToSend });
      const botMessage = { text: response.data.reply, sender: 'bot', id: Date.now() + 1 };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Sorry, an error occurred.', sender: 'bot', id: Date.now() + 1 }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    // This is the new full-screen layout container
    <div className="flex h-screen bg-gray-900 text-white">
      {/* --- Collapsible Sidebar with Dark Theme --- */}
      <div className={`bg-black/80 text-white flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`flex items-center p-2 mb-2 h-16 border-b border-white/10 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && <span className="text-lg font-semibold ml-2">Features</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-white/10">
            {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <LockClosedIcon className="h-10 w-10 text-gray-400 mb-4 flex-shrink-0"/>
            {isSidebarOpen && (
                <>
                    <h3 className="font-semibold text-lg text-gray-100">Full Features Locked</h3>
                    <p className="text-sm text-gray-400 mt-2">Sign up / Sign in to save, rename, and delete your chat history.</p>
                </>
            )}
        </div>
        <div className="p-4 space-y-3 border-t border-white/10">
          <button onClick={() => openAuthModal('signup')} className={`w-full flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 transition ${isSidebarOpen ? 'justify-start' : 'justify-center h-12'}`} title="Sign Up Now">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-shrink-0"><path d="M11 15.75a.75.75 0 01.75.75v3.011c0 .414.336.75.75.75h1.5a.75.75 0 010 1.5h-1.5A2.25 2.25 0 0110.5 19.5v-3a.75.75 0 01.75-.75z" /><path fillRule="evenodd" d="M12.75 2.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 12.75a.75.75 0 00-1.5 0v.011a.75.75 0 001.5 0V12.75z" clipRule="evenodd" /><path d="M12 3.75a9 9 0 100 18 9 9 0 000-18zM1.5 12a10.5 10.5 0 1121 0 10.5 10.5 0 01-21 0z" /></svg>
            {isSidebarOpen && <span className="font-semibold">Sign Up Now</span>}
          </button>
          {isSidebarOpen && (
             <button onClick={() => openAuthModal('login')} className="w-full flex items-center justify-start gap-2 px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 flex-shrink-0"><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
              <span className="font-semibold">Sign In</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Main Chat Area with Dark Theme --- */}
      <div className="flex-1 flex flex-col">
        <header className="bg-gray-800 border-b border-gray-700 p-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
        </header>
        <div className="flex-1 flex flex-col bg-gray-900 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 text-white flex items-center justify-center font-bold">AI</div>}
                <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm prose prose-invert ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isSending && <div className="text-center text-sm text-gray-400">Aegis is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t border-gray-700">
            <div className="mx-auto w-full max-w-3xl">
              <form onSubmit={handleSendMessage} className="relative">
                <div className="flex items-center bg-gray-800 rounded-full border border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <div className="p-2 ml-2 text-gray-500 cursor-not-allowed" title="Sign up to use tools"><SparklesIcon className="h-6 w-6" /></div>
                  <div className="p-2 text-gray-500 cursor-not-allowed" title="Sign up for Deep Search"><GlobeAltIcon className="h-6 w-6" /></div>
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    className="flex-1 w-full pl-3 pr-4 py-3 bg-transparent focus:outline-none text-white placeholder-gray-400"
                    placeholder="Type your message..." disabled={isSending} />
                  <button type="submit" disabled={isSending || !input.trim()} className="p-3 mr-1 text-white bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition">
                    <PaperAirplaneIcon className="h-6 w-6" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestChatPage;