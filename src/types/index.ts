export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface VoiceRecognitionHook {
  isListening: boolean;
  transcript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  error: string | null;
}