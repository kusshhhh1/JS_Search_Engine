import React, { useState } from 'react';
import { Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { openaiService } from '../services/openaiService';

export const ImageTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ prompt: string; imageUrl: string; timestamp: Date }>>([]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await openaiService.generateImage(prompt.trim());
      
      const newGeneration = {
        prompt: prompt.trim(),
        imageUrl,
        timestamp: new Date(),
      };
      
      setGeneratedImage(imageUrl);
      setHistory(prev => [newGeneration, ...prev.slice(0, 9)]); // Keep last 10 generations
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.jpg`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6">
        {!generatedImage && history.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ImageIcon size={48} className="mb-4 opacity-50" />
            <p className="text-lg font-medium">Generate Images with AI</p>
            <p className="text-sm text-center">
              Describe what you want to see and AI will create it for you
            </p>
          </div>
        )}

        {generatedImage && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Latest Generation</h3>
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="relative group">
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-auto rounded-lg shadow-sm"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleDownload(generatedImage)}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Download size={20} className="text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Recent Generations ({history.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-3">
                  <div className="relative group mb-2">
                    <img
                      src={item.imageUrl}
                      alt={item.prompt}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => handleDownload(item.imageUrl)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Download size={16} className="text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium truncate" title={item.prompt}>
                    {item.prompt}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.timestamp.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Loader2 size={48} className="animate-spin mx-auto mb-4 text-blue-500" />
              <p className="text-lg font-medium text-gray-800 mb-2">Generating Image...</p>
              <p className="text-sm text-gray-600">This may take a few moments</p>
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

      <div className="p-6 bg-gray-50 border-t">
        <div className="flex space-x-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe the image you want to generate... (e.g., 'A futuristic city skyline at sunset')"
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isGenerating}
          />
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            {isGenerating ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ImageIcon size={20} />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? 'Generating...' : 'Generate'}
            </span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: Be specific with your descriptions for better results
        </p>
      </div>
    </div>
  );
};