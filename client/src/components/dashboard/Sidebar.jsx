import React, { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useDashboard } from '../../context/DashboardContext';
import { PlusIcon, TrashIcon, ChatBubbleLeftIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  // Get state and functions from both contexts
  const chatContext = useChat();
  const { isSidebarOpen, toggleSidebar } = useDashboard();

  // Local state to manage the inline renaming UI
  const [renamingChatId, setRenamingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState('');

  // Gracefully handle the initial render when the context might not be ready
  if (!chatContext) {
    return (
      <div className={`bg-gray-800 text-white flex-shrink-0 flex flex-col p-2 transition-all duration-300 animate-pulse ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-9 bg-gray-700 rounded-md mb-4"></div>
        <div className="space-y-3">
          <div className="h-5 bg-gray-700 rounded"></div>
          <div className="h-5 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  const { chats, activeChatId, setActiveChatId, createNewChat, deleteChat, renameChat, loading, setShouldCreateChat } = chatContext;

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat && newChat._id) {
      setActiveChatId(newChat._id);
      setShouldCreateChat(true);
    }
  };

  const handleRenameStart = (chat) => {
    setRenamingChatId(chat._id);
    setNewTitle(chat.title);
  };

  const handleRenameSave = (chatId) => {
    if (newTitle && newTitle.trim() !== '') {
      renameChat(chatId, newTitle.trim());
    }
    setRenamingChatId(null);
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation(); // Prevents the click from selecting the chat
    if (window.confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      deleteChat(chatId);
    }
  };

  return (
    <div className={`bg-gray-800 text-white flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
      {/* Header with Toggle Button */}
      <div className={`flex items-center p-2 mb-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {isSidebarOpen && (
          <span className="text-lg font-semibold ml-2">History</span>
        )}
        <button onClick={toggleSidebar} className="p-2 rounded-md hover:bg-gray-700 focus:outline-none">
          {isSidebarOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition"
        >
          <PlusIcon className="h-5 w-5" />
          {isSidebarOpen && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {loading && <p className={`text-center text-sm text-gray-400 mt-4 ${!isSidebarOpen && 'hidden'}`}>Loading...</p>}
        <nav className="mt-2">
          {Array.isArray(chats) && chats.map(chat => (
            <div key={chat._id} className="relative group mx-2">
              {renamingChatId === chat._id ? (
                // Input field for renaming
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onBlur={() => handleRenameSave(chat._id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSave(chat._id); }}
                  className="w-full bg-gray-700 text-white px-3 py-2 text-sm rounded-md border border-blue-500 focus:outline-none"
                  autoFocus
                />
              ) : (
                // Standard chat item display
                <>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveChatId(chat._id); }}
                    onDoubleClick={() => handleRenameStart(chat)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition w-full text-left ${activeChatId === chat._id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                    title={isSidebarOpen ? "Double-click to rename" : chat.title}
                  >
                    <ChatBubbleLeftIcon className="h-5 w-5 flex-shrink-0" />
                    {isSidebarOpen && <span className="flex-1 truncate">{chat.title}</span>}
                  </a>
                  {isSidebarOpen && (
                    <button
                      onClick={(e) => handleDelete(e, chat._id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                      title="Delete chat"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;