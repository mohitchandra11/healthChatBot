import React, { useState, useRef, useEffect, Fragment } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { Popover, Transition } from '@headlessui/react';
import { PaperAirplaneIcon, SparklesIcon, CpuChipIcon, HeartIcon, GlobeAltIcon, LinkIcon } from '@heroicons/react/24/solid';

const ChatWindow = () => {
  const { activeChat, createNewChat, sendMessage, error } = useChat();
  const { currentUser } = useAuth();
  
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [useDeepSearch, setUseDeepSearch] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSendMessage = async (e, messageOverride) => {
    if (e) e.preventDefault();
    let messageToSend = messageOverride || input;
    if (!messageToSend.trim() || !activeChat?._id) return;

    if (useDeepSearch) {
      messageToSend += " (Please use Google Search for this query)";
    }

    setIsSending(true);
    setInput('');
    setUseDeepSearch(false);
    await sendMessage(activeChat._id, messageToSend);
    setIsSending(false);
  };

  const handleToolClick = (prompt) => {
    handleSendMessage(null, prompt);
  };
  
  return (
    // Use a transparent background to see the animated layout behind it
    <div className="flex h-full flex-1 flex-col bg-transparent text-white">
      <div className="flex-1 overflow-y-auto">
        {!activeChat?.messages?.length ? (
          <WelcomeScreen 
            userName={currentUser?.name} 
            hasChats={activeChat?._id ? true : false} 
          />
        ) : (
          <MessageList messages={activeChat.messages} isSending={isSending} error={error} messagesEndRef={messagesEndRef} />
        )}
      </div>
      
      {activeChat?._id && (
        <div className="p-4 bg-transparent">
          <InputBar 
              input={input} 
              setInput={setInput} 
              handleSendMessage={handleSendMessage} 
              handleToolClick={handleToolClick}
              isSending={isSending} 
              useDeepSearch={useDeepSearch}
              setUseDeepSearch={setUseDeepSearch}
          />
        </div>
      )}
    </div>
  );
};

// --- Child Components ---

const WelcomeScreen = ({ userName, hasChats }) => (
  <div className="flex h-full items-center justify-center text-center p-4">
    <div>
      <h1 className="text-4xl font-bold text-gray-100">Aegis Health AI</h1>
      <p className="mt-2 text-lg text-gray-400">Hello, {userName || 'User'}!</p>
      {!hasChats ? (
        <p className="mt-4 max-w-md text-gray-400">
          Click "+ New Chat" or select a conversation to get started.
        </p>
      ) : (
        <p className="mt-4 max-w-md text-gray-400">
          All set! Start typing your health-related questions below.
        </p>
      )}
    </div>
  </div>
);

const MessageList = ({ messages, isSending, error, messagesEndRef }) => (
  <div className="p-6 space-y-4">
    {messages && messages.map((msg, index) => (
      <div key={msg._id || index} className="flex flex-col items-start">
        <div className={`flex items-start gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : ''}`}>
          {msg.sender === 'bot' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 text-white flex items-center justify-center font-bold">AI</div>}
          <div 
            // --- THIS IS THE FIX ---
            // 'prose-invert' automatically makes the text white and readable on dark backgrounds.
            className={`px-4 py-2 rounded-lg max-w-[80%] text-sm prose prose-invert ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-black/20 text-gray-200'
            }`}
          >
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>
        
        {/* Source link styling updated for dark mode */}
        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-2 ml-11 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400">Sources:</span>
            {msg.sources.map((source, i) => (
              <a 
                key={i} href={source.uri} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-200 text-xs rounded-full hover:bg-gray-600 transition"
                title={source.title}>
                <LinkIcon className="h-3 w-3"/>
                <span className="truncate max-w-xs">{new URL(source.uri).hostname}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    ))}
    {isSending && <div className="text-center text-sm text-gray-400">Aegis is thinking...</div>}
    {error && <div className="text-center text-sm text-red-400 font-semibold">{error}</div>}
    <div ref={messagesEndRef} />
  </div>
);

const InputBar = ({ input, setInput, handleSendMessage, handleToolClick, isSending, useDeepSearch, setUseDeepSearch }) => {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={handleSendMessage} className="relative">
        {/* Input bar styling updated for dark mode */}
        <div className="flex items-center bg-black/20 rounded-full border border-white/20 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <Popover className="relative ml-2">
            <Popover.Button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-white/10 rounded-full focus:outline-none" disabled={isSending}>
              <SparklesIcon className="h-6 w-6" />
            </Popover.Button>
            <Transition as={Fragment} /* ... */ >
              <Popover.Panel className="absolute bottom-full mb-2 w-72 -translate-x-1/3 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50 text-white">
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Explore Topics</h3>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    <ToolButton icon={<CpuChipIcon className="h-6 w-6 text-purple-400" />} title="Mental Health" subtitle="Stress, anxiety, and well-being" onClick={() => handleToolClick("Talk about mental health and stress.")} />
                    <ToolButton icon={<HeartIcon className="h-6 w-6 text-pink-400" />} title="Physical Health" subtitle="Exercise, nutrition, and fitness" onClick={() => handleToolClick("Give me tips for physical health.")} />
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>

          <button
            type="button"
            onClick={() => setUseDeepSearch(!useDeepSearch)}
            className={`p-2 rounded-full focus:outline-none transition ${useDeepSearch ? 'bg-blue-500/20 text-blue-400' : 'text-gray-400 hover:text-blue-400 hover:bg-white/10'}`}
            title={useDeepSearch ? "Deep Search is ON" : "Turn on Deep Search"}
            disabled={isSending}>
            <GlobeAltIcon className="h-6 w-6" />
          </button>
          
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            className="flex-1 w-full pl-3 pr-4 py-3 bg-transparent focus:outline-none text-white placeholder-gray-400"
            placeholder="Type your message..." disabled={isSending} />
          <button type="submit" disabled={isSending || !input.trim()} className="p-3 mr-1 text-white bg-blue-600 rounded-full hover:bg-blue-500 disabled:bg-blue-800/50 disabled:cursor-not-allowed transition">
            <PaperAirplaneIcon className="h-6 w-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

const ToolButton = ({ icon, title, subtitle, onClick }) => {
    return (
        <Popover.Button as="button" onClick={onClick} className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-700 rounded-lg">{icon}</div>
            <div>
                <p className="font-semibold text-gray-100">{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
        </Popover.Button>
    )
};

export default ChatWindow;