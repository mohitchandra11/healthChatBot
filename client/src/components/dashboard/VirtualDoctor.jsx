import React, { useState, useRef, useEffect } from 'react';
import { MicrophoneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const VirtualDoctor = () => {
  const { currentUser, openAuthModal } = useAuth();

  // Avatars Configuration
  const AVATARS = [
    {
      id: 'sarah',
      name: 'Dr. Sarah',
      role: 'General Practitioner',
      voiceIndex: 4, // Approximate index for a female voice
      image: 'https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg?w=500',
      description: 'Empathetic and thorough. Great for general health queries.'
    },
    {
      id: 'michael',
      name: 'Dr. Michael',
      role: 'Specialist',
      voiceIndex: 0, // Approximate index for a male voice
      image: 'https://img.freepik.com/free-photo/hospital-healthcare-workers-covid-19-treatment-concept-young-doctor-scrubs-making-daily-errands-clinic-listening-patient-symptoms-look-camera-professional-physician-curing-diseases_1258-57233.jpg?w=500',
      description: 'Direct and professional. Focuses on clear, actionable advice.'
    },
    {
      id: 'emily',
      name: 'Dr. Emily',
      role: 'Wellness Coach',
      voiceIndex: 3,
      image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg?w=500',
      description: 'Energetic and motivating. Perfect for lifestyle and fitness tips.'
    },
    {
      id: 'david',
      name: 'Dr. David',
      role: 'Senior Consultant',
      voiceIndex: 1,
      image: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg?w=500',
      description: 'Calm and experienced. reassuring presence for complex concerns.'
    }
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);

  // State for UI, Ref for Logic (to avoid stale closures)
  const [conversationHistory, setConversationHistory] = useState([]);
  const conversationHistoryRef = useRef([]);

  // Web Speech API Refs
  const recognition = useRef(null);
  const synth = useRef(window.speechSynthesis);
  const silenceTimer = useRef(null);
  const finalTranscript = useRef('');
  const interimTranscriptRef = useRef(''); // Track interim results
  const shouldListen = useRef(false);

  // Avatar animation states
  const [avatarState, setAvatarState] = useState('idle');
  const [transcript, setTranscript] = useState(''); // Visual feedback

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = 'en-US';

      recognition.current.onstart = () => {
        setIsListening(true);
        setAvatarState('listening');
        setError(null);
        finalTranscript.current = '';
        interimTranscriptRef.current = '';
        setTranscript('');
      };

      recognition.current.onend = () => {
        if (shouldListen.current) {
          try {
            recognition.current.start();
          } catch (e) {
            console.log("Restarting recognition...");
          }
        } else {
          setIsListening(false);

          // Combine final and interim text to ensure we catch everything
          const fullText = (finalTranscript.current + ' ' + interimTranscriptRef.current).trim();

          if (fullText && !isProcessing) {
            processUserText(fullText);
            finalTranscript.current = '';
            interimTranscriptRef.current = '';
            setTranscript('');
          } else if (!isProcessing && avatarState !== 'speaking') {
            setAvatarState('idle');
          }
        }
      };

      recognition.current.onError = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') return;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          shouldListen.current = false;
          setIsListening(false);
          setError(`Microphone access denied: ${event.error}`);
        }
      };

      recognition.current.onresult = (event) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript.current += event.results[i][0].transcript + ' ';
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        interimTranscriptRef.current = interim;
        setTranscript((finalTranscript.current + interim).substring(0, 100)); // Show preview

        // Reset silence timer
        if (silenceTimer.current) clearTimeout(silenceTimer.current);

        silenceTimer.current = setTimeout(() => {
          // Only stop if we have some text
          if (finalTranscript.current.trim() || interimTranscriptRef.current.trim()) {
            stopListening();
          }
        }, 2500);
      };
    } else {
      setError('Browser does not support Speech Recognition.');
    }

    return () => {
      shouldListen.current = false;
      if (recognition.current) recognition.current.abort();
      if (synth.current) synth.current.cancel();
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, [selectedAvatar]);

  const startListening = () => {
    if (!currentUser) {
      openAuthModal('login');
      return;
    }

    shouldListen.current = true; // We WANT to listen
    finalTranscript.current = '';
    interimTranscriptRef.current = '';
    setTranscript('');

    if (recognition.current) {
      try {
        recognition.current.start();
      } catch (e) {
        console.error("Recognition already started");
      }
    }
  };

  const stopListening = () => {
    shouldListen.current = false; // We WANT to stop
    if (recognition.current) {
      recognition.current.stop();
    }
  };

  const processUserText = async (text) => {
    try {
      setIsProcessing(true);
      setAvatarState('thinking');

      // Use Ref for history to avoid stale closures in useEffect
      const currentHistory = conversationHistoryRef.current;

      // Call Server for Gemini Intelligence
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/virtual-doctor/chat`,
        {
          text: text,
          history: currentHistory // Send current history from REF
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          }
        }
      );

      const { text: aiText, isEmergency: emergencyStatus } = response.data;
      setAiResponse(aiText);
      setIsEmergency(emergencyStatus);

      // Update History Ref
      const newHistory = [
        ...currentHistory,
        { role: "user", parts: [{ text: text }] },
        { role: "model", parts: [{ text: aiText }] }
      ];
      conversationHistoryRef.current = newHistory;
      setConversationHistory(newHistory); // Sync state for UI if needed

      speakResponse(aiText);

    } catch (err) {
      console.error('Error getting AI response:', err);
      setError('Failed to get response from Virtual Doctor.');
      setAvatarState('idle');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = (text) => {
    if (!synth.current) return;

    // Cancel any current speech
    synth.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Select Voice based on Avatar
    const voices = synth.current.getVoices();
    // Try to find a voice that matches the avatar's "style" or just use index
    // This is browser dependent, so it's a best-effort
    const voice = voices[selectedAvatar.voiceIndex] || voices[0];
    utterance.voice = voice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setAvatarState('speaking');
    };

    utterance.onend = () => {
      setAvatarState('idle');
      // Auto-restart listening for "Live" feel
      setTimeout(() => {
        startListening();
      }, 500);
    };

    synth.current.speak(utterance);
  };

  if (!selectedAvatar) {
    return (
      <div className="flex h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 items-center justify-center overflow-y-auto">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl font-bold text-white text-center mb-4">Choose Your Virtual Doctor</h1>
          <p className="text-gray-400 text-center mb-12 text-lg">Select a specialist to begin your consultation</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar)}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 group"
              >
                <div className="aspect-square rounded-xl overflow-hidden mb-4 border-2 border-transparent group-hover:border-blue-500/50">
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{avatar.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-2">{avatar.role}</p>
                <p className="text-gray-400 text-sm">{avatar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900/50 to-black pointer-events-none" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start pointer-events-none">
        <button
          onClick={() => {
            stopListening();
            if (synth.current) synth.current.cancel();
            setSelectedAvatar(null);
            setConversationHistory([]); // Reset history on exit
            conversationHistoryRef.current = []; // Reset ref too
          }}
          className="pointer-events-auto flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Switch Doctor</span>
        </button>

        {isEmergency && (
          <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-lg border border-red-400 animate-pulse pointer-events-auto">
            <p className="font-bold">⚠️ Emergency Warning</p>
            <p className="text-sm">Please call emergency services immediately.</p>
          </div>
        )}
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="absolute inset-0 overflow-y-auto pb-48 scrollbar-hide">
        <div className="min-h-full flex flex-col items-center justify-center p-4 pt-24">

          {/* Avatar Section */}
          <div className={`relative transition-all duration-500 mb-8 ${avatarState === 'speaking' ? 'scale-105' : 'scale-100'}`}>
            {/* Glow Effect */}
            <div className={`absolute inset-0 rounded-full blur-3xl transition-opacity duration-500 ${avatarState === 'speaking' ? 'bg-blue-500/30 opacity-100' :
              avatarState === 'listening' ? 'bg-green-500/20 opacity-100' :
                avatarState === 'thinking' ? 'bg-yellow-500/20 opacity-100' :
                  'opacity-0'
              }`} />

            {/* Avatar Image */}
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl relative z-10 bg-gray-800">
              <img
                src={selectedAvatar.image}
                alt={selectedAvatar.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Status & Name */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">{selectedAvatar.name}</h2>
            <p className={`text-base font-medium transition-colors duration-300 ${avatarState === 'speaking' ? 'text-blue-400' :
              avatarState === 'listening' ? 'text-green-400' :
                avatarState === 'thinking' ? 'text-yellow-400' :
                  'text-gray-400'
              }`}>
              {avatarState === 'speaking' ? 'Speaking...' :
                avatarState === 'listening' ? 'Listening...' :
                  avatarState === 'thinking' ? 'Thinking...' :
                    'Tap microphone to start'}
            </p>

            {/* Real-time Transcript Preview */}
            {isListening && (
              <p className="text-gray-400 text-sm mt-2 h-6 animate-pulse">
                {transcript || "..."}
              </p>
            )}
          </div>

          {/* Subtitles/Messages */}
          <div className="w-full max-w-2xl px-4 min-h-[100px] flex items-center justify-center">
            {aiResponse ? (
              <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed text-center bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/5 shadow-xl">
                "{aiResponse}"
              </p>
            ) : (
              <div className="h-4" /> /* Spacer */
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls - Fixed */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-30 flex flex-col items-center justify-end h-48 pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/90 text-white px-6 py-2 rounded-full shadow-lg backdrop-blur-md text-sm animate-bounce">
              {error}
            </div>
          )}

          {/* Mic Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-110 ${isListening ? 'bg-red-500 animate-pulse ring-4 ring-red-500/30' :
              isProcessing ? 'bg-yellow-500 cursor-wait' :
                'bg-blue-600 hover:bg-blue-500 ring-4 ring-blue-500/30'
              }`}
          >
            <MicrophoneIcon className="h-10 w-10 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualDoctor;