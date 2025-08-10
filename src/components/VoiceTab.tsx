import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Send, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { openaiService } from '../services/openaiService';
import { ChatMessage } from '../types';

export const VoiceTab: React.FC = () => {
  const {
    isListening,
    transcript,
    confidence,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    error: speechError,
  } = useSpeechRecognition();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      setError(null);
    }
  };

  const handleSendTranscript = async () => {
    if (!transcript.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: transcript.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);
    setError(null);

    try {
      const response = await openaiService.chatCompletion([
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: userMessage.content }
      ]);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
      resetTranscript();
    }
  };

  useEffect(() => {
    if (speechError) {
      setError(speechError);
    }
  }, [speechError]);

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <MicOff size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Speech Recognition Not Supported
          </h3>
          <p className="text-gray-600">
            Your browser doesn't support speech recognition. Please try using Chrome or Edge.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Volume2 size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Voice Chat with Gemini</p>
            <p className="text-sm text-center">
              Click the microphone to start speaking, then send your message
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-gray-600">Processing voice input...</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="p-6 bg-gray-50 border-t space-y-4">
        {transcript && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Recognized Speech:</p>
            <p className="text-blue-900 mt-1">{transcript}</p>
            {confidence > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Confidence: {Math.round(confidence * 100)}%
              </p>
            )}
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button
            onClick={handleVoiceToggle}
            disabled={isProcessing}
            className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-110'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              {isListening ? 'Listening... (Click to stop)' : 'Click microphone to start recording'}
            </p>
            {transcript && (
              <p className="text-xs text-gray-500 mt-1">
                Speech recognized. Click send to submit to Gemini.
              </p>
            )}
          </div>

          {transcript && (
            <button
              onClick={handleSendTranscript}
              disabled={isProcessing || isListening}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isProcessing ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};