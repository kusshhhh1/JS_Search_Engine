# Gemini AI Studio

A modern React application that provides AI-powered conversations and image generation using Google's Gemini API.

## Features

- **Text Chat**: Interactive conversations with Gemini AI
- **Voice Chat**: Speech-to-text and AI responses
- **Image Generation**: AI-powered image creation (placeholder implementation)
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `.env` file in the root directory:
   ```bash
   # Get your API key from: https://makersuite.google.com/app/apikey
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

   **Important**: Replace `your_actual_api_key_here` with your real Gemini API key.

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── ChatTab.tsx     # Text chat interface
│   ├── VoiceTab.tsx    # Voice chat interface
│   └── ImageTab.tsx    # Image generation interface
├── hooks/              # Custom React hooks
├── services/           # API services
│   └── openaiService.ts # Gemini API service
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```

## API Configuration

The application uses Google's Gemini API for AI conversations. The service automatically:

- Converts OpenAI-format messages to Gemini format
- Handles API authentication
- Provides error handling and fallbacks

## Security Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- API keys are only used on the client side for this demo
- For production, consider using a backend service to proxy API calls

## Browser Compatibility

- Modern browsers with ES2020 support
- Speech recognition requires HTTPS in production
- Voice features may not work in all browsers

## Troubleshooting

### ESLint Errors
If you encounter ESLint errors, run:
```bash
npm run lint
```

### TypeScript Errors
To check for TypeScript errors:
```bash
npx tsc --noEmit
```

### API Key Issues
- Ensure your `.env` file exists and contains the correct API key
- Verify your Gemini API key is valid and has sufficient quota
- Check the browser console for any API-related errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and type checking
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
