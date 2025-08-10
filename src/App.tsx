import React, { useState } from 'react';
import { MessageCircle, Mic, Image as ImageIcon, Settings } from 'lucide-react';
import { ChatTab } from './components/ChatTab';
import { VoiceTab } from './components/VoiceTab';
import { ImageTab } from './components/ImageTab';

type TabType = 'chat' | 'voice' | 'image';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: 'chat', label: 'Text Chat', icon: MessageCircle },
    { id: 'voice', label: 'Voice Chat', icon: Mic },
    { id: 'image', label: 'Image Gen', icon: ImageIcon },
  ] as const;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatTab />;
      case 'voice':
        return <VoiceTab />;
      case 'image':
        return <ImageTab />;
      default:
        return <ChatTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-6xl h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Gemini AI Studio</h1>
              <p className="text-sm text-gray-600">AI-powered conversations and creations</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <Settings size={20} />
          </button>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-3">
            <div className="flex items-center space-x-2 text-yellow-800">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm font-medium">
                Powered by Google Gemini API. 
                <span className="ml-1 font-normal">
                  Image generation uses placeholder images for demonstration.
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200 px-6">
          <div className="flex space-x-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as TabType)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                  activeTab === id
                    ? 'bg-white text-blue-600 border-b-2 border-blue-500 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 bg-white/40 backdrop-blur-sm">
          <div className="h-full bg-white/60 backdrop-blur-sm">
            {renderActiveTab()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Powered by Google Gemini</span>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Built with React & Tailwind</span>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Ready</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;