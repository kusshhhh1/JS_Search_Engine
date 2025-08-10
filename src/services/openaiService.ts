// Gemini API service for chat completions and image generation
export class GeminiService {
  private apiKey: string;
  private geminiBaseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || this.getApiKeyFromEnv();
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set VITE_GEMINI_API_KEY environment variable.');
    }
  }

  private getApiKeyFromEnv(): string {
    const key = import.meta.env.VITE_GEMINI_API_KEY || 
                (window as any).VITE_GEMINI_API_KEY || 
                '';
    return key;
  }

  async chatCompletion(messages: Array<{role: string; content: string}>): Promise<string> {
    if (!this.apiKey) {
      this.apiKey = this.getApiKeyFromEnv();
    }
    
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY environment variable.');
    }

    try {
      const geminiMessages = messages.map(msg => ({
        parts: [{ text: msg.content }],
        role: msg.role === 'assistant' ? 'model' : 'user'
      }));
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 403) {
          throw new Error('API key is invalid or has insufficient permissions. Please check your Gemini API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error. The Gemini API may not support direct browser requests. Please check your internet connection.');
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get response from Gemini: ${errorMessage}`);
    }
  }

  async generateImage(): Promise<string> {
    await this.delay(2000 + Math.random() * 1500);
    return this.mockImageResponse();
  }

  private mockImageResponse(): string {
    const imageQueries = [
      'abstract-art',
      'landscape',
      'technology',
      'nature',
      'architecture',
      'space',
      'ocean',
      'mountains'
    ];
    
    const randomQuery = imageQueries[Math.floor(Math.random() * imageQueries.length)];
    return `https://images.unsplash.com/image-${randomQuery}-${Date.now()}.jpg`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export const openaiService = new GeminiService();