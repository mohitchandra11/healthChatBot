import React, { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useDashboard } from './DashboardContext';

const ChatContext = createContext(null);

export function useChat() {
  return useContext(ChatContext);
}

export function ChatProvider({ children }) {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { activeView } = useDashboard();

  const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/chat/`;

  const getAuthConfig = useCallback(() => {
    if (!currentUser?.token) {
      console.error("Auth token not found.");
      return null;
    }
    return { headers: { Authorization: `Bearer ${currentUser.token}` } };
  }, [currentUser]);

  const fetchChats = useCallback(async () => {
    const config = getAuthConfig();
    if (!config) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL, config);
      setChats(res.data);
    } catch (err) {
      setError("Failed to load chat history.");
      console.error("Fetch Chats Error:", err);
    } finally {
      setLoading(false);
    }
  }, [getAuthConfig]);

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    } else {
      setChats([]);
      setActiveChatId(null);
    }
  }, [currentUser, fetchChats]);

  // Reset active chat when switching away from chat view
  useEffect(() => {
    if (activeView !== 'chat') {
      setActiveChatId(null);
    }
  }, [activeView]);

  const createNewChat = useCallback(async () => {
    const config = getAuthConfig();
    if (!config) return;
    setError(null);
    try {
      const res = await axios.post(API_URL, {}, config);
      setChats(prev => [res.data, ...prev]);
      setActiveChatId(res.data._id);
    } catch (err) {
      setError("Failed to create a new chat.");
      console.error("Create Chat Error:", err);
    }
  }, [getAuthConfig]);

  const sendMessage = useCallback(async (chatId, message) => {
    const config = getAuthConfig();
    if (!config) return;
    const userMessage = { sender: 'user', content: message, _id: Date.now().toString() };
    setChats(prev => prev.map(c => c._id === chatId ? { ...c, messages: [...c.messages, userMessage] } : c));
    try {
      const res = await axios.post(`${API_URL}${chatId}/messages`, { message }, config);
      setChats(prev => prev.map(c => c._id === chatId ? res.data : c));
    } catch (err) {
      setError("Failed to get a response from the AI.");
    }
  }, [getAuthConfig]);

  // --- COMPLETE AND CORRECT DELETE FUNCTION ---
  const deleteChat = useCallback(async (chatId) => {
    const config = getAuthConfig();
    if (!config) return;

    const originalChats = chats; // Keep a copy in case of failure
    setChats(prev => prev.filter(c => c._id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }

    try {
      await axios.delete(`${API_URL}${chatId}`, config);
    } catch (err) {
      setError("Failed to delete chat on server. Reverting.");
      setChats(originalChats); // On failure, restore the original chats
      console.error("Delete Chat Error:", err);
    }
  }, [getAuthConfig, activeChatId, chats]);

  // --- COMPLETE AND CORRECT RENAME FUNCTION ---
  const renameChat = useCallback(async (chatId, newTitle) => {
    const config = getAuthConfig();
    if (!config) return;
    try {
      const res = await axios.put(`${API_URL}${chatId}`, { title: newTitle }, config);
      setChats(prev => prev.map(c => c._id === chatId ? res.data : c));
    } catch (err) {
      setError("Failed to rename chat.");
      console.error("Rename Chat Error:", err);
    }
  }, [getAuthConfig]);

  const activeChat = useMemo(() => chats.find(chat => chat._id === activeChatId), [chats, activeChatId]);

  const value = useMemo(() => ({
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    loading,
    error,
    fetchChats,
    createNewChat,
    sendMessage,
    deleteChat,
    renameChat
  }), [chats, activeChat, activeChatId, loading, error, fetchChats, createNewChat, sendMessage, deleteChat, renameChat]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}