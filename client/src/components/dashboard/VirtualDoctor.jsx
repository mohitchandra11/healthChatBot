import React, { useState, useRef, useEffect } from 'react';
import { VideoCameraIcon, VideoCameraSlashIcon, ChatBubbleLeftIcon, XMarkIcon, MicrophoneIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const VirtualDoctor = () => {
  const { currentUser, openAuthModal } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [currentConsultation, setCurrentConsultation] = useState(null);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const audioPlayer = useRef(new Audio());
  
  // Video call states
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  // Avatar animation states
  const [avatarState, setAvatarState] = useState('idle');
  const [avatarExpression, setAvatarExpression] = useState('neutral');

  // Initialize camera when call starts
  useEffect(() => {
    if (isCallActive && !isCameraOn) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isCallActive]);

  const startRecording = async () => {
    try {
      if (!currentUser) {
        openAuthModal('login');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      setIsListening(true);
      setAvatarState('listening');
      setError(null);
      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not access microphone. Please check your permissions.');
      setIsListening(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsListening(false);
      setAvatarState('thinking');
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      setIsProcessing(true);
      setError(null);
      console.log('Processing audio blob:', audioBlob);
      
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => {
          console.log('Base64 conversion completed');
          resolve(reader.result);
        };
        reader.readAsDataURL(audioBlob);
      });
      const base64Audio = await base64Promise;
      console.log('Base64 audio length:', base64Audio.length);

      // First, transcribe the audio
      console.log('Sending request to transcribe endpoint...');
      const transcribeResponse = await axios.post(
        'http://localhost:5000/api/virtual-doctor/transcribe',
        { audioData: base64Audio },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          }
        }
      );
      console.log('Transcribe response:', transcribeResponse.data);

      const { text: transcribedText, isEmergency } = transcribeResponse.data;
      setIsEmergency(isEmergency);

      // Then, get AI response
      const chatResponse = await axios.post(
        'http://localhost:5000/api/virtual-doctor/chat',
        { text: transcribedText },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
          }
        }
      );

      const { text: responseText, audio: audioBase64 } = chatResponse.data;

      // Parse the response (it contains both text and JSON)
      const [textResponse, jsonStr] = responseText.split('\n\n');
      setAiResponse(textResponse);

      // Store in consultation history
      if (jsonStr) {
        try {
          const parsedResponse = JSON.parse(jsonStr);
          const newConsultation = {
            date: new Date().toISOString(),
            userInput: transcribedText,
            response: textResponse,
            summary: parsedResponse.summary,
            action: parsedResponse.action
          };

          setConsultations(prev => {
            const updated = [newConsultation, ...prev];
            localStorage.setItem('consultations', JSON.stringify(updated));
            return updated;
          });
        } catch (e) {
          console.error('Error parsing JSON response:', e);
        }
      }

      // Play the audio response
      if (audioBase64) {
        const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
        audioPlayer.current.src = audioUrl;
        await audioPlayer.current.play();
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
      setAvatarState('idle');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setCameraError(null);
      }
    } catch (error) {
      console.error('Camera error:', error);
      setCameraError('Could not access camera');
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
    }
  };

  const toggleCall = () => {
    if (isCallActive) {
      stopCamera();
      setIsCallActive(false);
    } else {
      setIsCallActive(true);
    }
  };

  useEffect(() => {
    // Initialize consultation history from localStorage or API
    const savedConsultations = localStorage.getItem('consultations');
    if (savedConsultations) {
      setConsultations(JSON.parse(savedConsultations));
    }
  }, []);

  const startListening = async () => {
    try {
      if (!currentUser) {
        openAuthModal('login');
        return;
      }

      setIsListening(true);
      setAvatarState('listening');
      setAvatarExpression('neutral');

      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        processUserInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setAvatarState('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      setAvatarState('idle');
    }
  };

  const processUserInput = async (input) => {
    try {
      if (!currentUser) {
        openAuthModal('login');
        return;
      }

      setIsProcessing(true);
      setAvatarState('thinking');
      setAvatarExpression('thinking');

      // Loading consultations from localStorage
      const savedConsultations = localStorage.getItem('consultations');
      if (savedConsultations) {
        setConsultations(JSON.parse(savedConsultations));
      }

    } catch (error) {
      console.error('Error:', error);
      setAiResponse('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsProcessing(false);
      setAvatarState('idle');
    }
  };

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-lg border-b border-white/10 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Virtual Doctor Consultation</h1>
              <p className="text-gray-400">Experience AI-powered healthcare consultation</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsHistorySidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all"
              >
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>History</span>
              </button>
              <button
                onClick={toggleCall}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  isCallActive 
                    ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30' 
                    : 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30'
                }`}
              >
                {isCallActive ? (
                  <>
                    <VideoCameraSlashIcon className="h-5 w-5" />
                    <span>End Call</span>
                  </>
                ) : (
                  <>
                    <VideoCameraIcon className="h-5 w-5" />
                    <span>Start Call</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Consultation Area */}
        <div className="flex-1 max-w-7xl mx-auto w-full p-6 flex gap-6">
          {/* Left Side - User Video & Controls */}
          <div className="w-1/3 flex flex-col gap-6">
            <div className="aspect-video bg-black/40 rounded-2xl overflow-hidden border border-white/10 relative">
              {isCallActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {cameraError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/75 text-white">
                      {cameraError}
                    </div>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <VideoCameraIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                    <p className="text-gray-400 px-4">Start your video to begin the consultation</p>
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Status */}
            <div className="bg-black/40 rounded-2xl p-6 border border-white/10">
              <div className="text-center">
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
                <button
                  onClick={isListening ? stopRecording : startRecording}
                  disabled={isProcessing || !isCallActive}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                    isListening
                      ? 'bg-red-500 animate-pulse'
                      : isProcessing
                      ? 'bg-yellow-500/50 cursor-not-allowed'
                      : isCallActive
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                >
                  <MicrophoneIcon className="h-8 w-8 text-white" />
                </button>
                <p className="text-gray-300 font-medium">
                  {isListening 
                    ? 'Listening...' 
                    : isProcessing 
                    ? 'Processing...' 
                    : 'Click to speak'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {isCallActive 
                    ? 'Press the microphone button and speak clearly'
                    : 'Start video call to enable voice input'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - AI Doctor */}
          <div className="flex-1 bg-black/40 rounded-2xl border border-white/10 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-blue-900/40" />
            <div className="relative z-10 h-full flex flex-col">
              {/* Doctor Image and Status */}
              <div className="flex items-start gap-6 mb-8">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-blue-500/30">
                  <img
                    src="https://imgs.search.brave.com/5n4mShVBhgcLLOQ3Ols_7YOmdQAw6td9QTg5Sp8ea6o/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTI3/NDQwMzEyMi9waG90/by92aXJ0dWFsLWRv/Y3Rvci1jb25jZXB0/LXRoZS1kb2N0b3Jz/LWhhbmQtd2l0aC1z/dGV0aG9zY29wZS1w/cm90cnVkZXMtZnJv/bS10aGUtbGFwdG9w/LXNjcmVlbi10by5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/d2pqNlpycFdUc1RF/Q1FDV0lUZjR6b0tL/VVJyQVVuV1JtODJm/T2hwTDZ4RT0"
                    alt="AI Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Dr. AI Assistant</h2>
                  <p className="text-blue-400 font-medium mb-1">
                    {avatarState === 'speaking' 
                      ? 'Speaking...' 
                      : avatarState === 'thinking' 
                      ? 'Analyzing...' 
                      : 'Ready to help'}
                  </p>
                  <p className="text-gray-400 text-sm">Advanced Medical AI • Always Available</p>
                </div>
              </div>

              {/* Emergency Warning */}
              {isEmergency && (
                <div className="mb-6">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                    <p className="text-red-400 font-semibold mb-1">Emergency Warning</p>
                    <p className="text-red-300 text-sm">
                      If this is a medical emergency, please call your local emergency number (e.g., 112/911) 
                      or go to the nearest emergency room immediately.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Response Area */}
              <div className="flex-1 bg-black/30 rounded-xl p-6 backdrop-blur-sm border border-white/5">
                {aiResponse ? (
                  <p className="text-white leading-relaxed">{aiResponse}</p>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p>Start the conversation by clicking the microphone button</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat History Sidebar */}
      <div className={`fixed inset-y-0 right-0 w-[420px] bg-gray-900/95 backdrop-blur-xl transform ${
        isHistorySidebarOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 border-l border-white/10`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Consultation History</h3>
              <p className="text-gray-400 text-sm mt-1">Review your past consultations</p>
            </div>
            <button
              onClick={() => setIsHistorySidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {consultations.length > 0 ? (
              <div className="p-4 space-y-4">
                {consultations.map((consultation, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-colors border border-white/5"
                    onClick={() => setCurrentConsultation(consultation)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-400">
                        {new Date(consultation.date).toLocaleDateString(undefined, {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(consultation.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 line-clamp-2">{consultation.summary}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-400">
                      <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                      <span>View full consultation</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                <div>
                  <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <p>No consultation history yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your consultation records will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualDoctor;