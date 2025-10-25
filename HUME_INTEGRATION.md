# Hume.ai EVI Integration Guide

This document explains how the Empathic Voice Interface (EVI) from Hume.ai is integrated into this Next.js application.

## Overview

The voice assistant panel uses Hume's React SDK to provide voice-based conversations. The integration includes:

- **Authentication**: Server-side access token generation
- **Voice Connection**: WebSocket connection management with real-time audio
- **Message Display**: Chat history visualization
- **Connection Control**: Start/end session management

## Architecture

### Component Structure

```
VoiceAssistantPanel (Server Component)
├── Fetches access token
└── Chat (Client Component - Dynamic)
    ├── VoiceProvider (Context)
    ├── Messages (Display chat history)
    └── StartCall (Connection control)
```

### Files

1. **`voice-assistant-panel.tsx`** - Root server component
   - Fetches access token using Hume's TypeScript SDK
   - Dynamically imports Chat component (client-side)
   - Handles authentication errors gracefully

2. **`chat.tsx`** - Client component wrapper
   - Wraps everything in `VoiceProvider` from `@humeai/voice-react`
   - Provides layout structure (messages + controls)
   - Shows authentication errors if token is missing

3. **`start-call.tsx`** - Voice connection controller
   - Uses `useVoice()` hook to manage connection state
   - Provides UI for starting/ending sessions
   - Shows connection status and errors
   - Uses Mic/MicOff icons from lucide-react

4. **`messages.tsx`** - Chat history display
   - Displays user and assistant messages
   - Uses `useVoice()` hook to access message history
   - Shows placeholder when no messages exist
   - Formats messages as chat bubbles

## Setup

### Environment Variables

Add these to your `.env.local`:

```env
HUME_API_KEY=your_api_key_here
HUME_SECRET_KEY=your_secret_key_here
```

Get your credentials from: https://platform.hume.ai/settings/keys

### Installation

The required packages are already in `package.json`:

```bash
npm i @humeai/voice-react hume
```

## How It Works

### 1. Authentication Flow

```typescript
// In voice-assistant-panel.tsx (Server Component)
const accessToken = await fetchAccessToken({
  apiKey: String(process.env.HUME_API_KEY),
  secretKey: String(process.env.HUME_SECRET_KEY),
});
```

- Generates a temporary access token on the server
- Token is passed to the Chat component
- Token is used to establish WebSocket connection

### 2. Connection Management

```typescript
// In start-call.tsx (Client Component)
const { connect, disconnect, readyState } = useVoice();

// Connect when user clicks "Start Session"
await connect({
  auth: { type: "accessToken", value: accessToken },
});

// Disconnect when user clicks "End Session"
disconnect();
```

### 3. Message Handling

```typescript
// In messages.tsx
const { messages } = useVoice();

// Messages include:
// - user_message: Transcribed user speech
// - assistant_message: EVI response
// - Other event types (not displayed)
```

## Features

### Voice Recording & Playback
- Automatically captures user audio when connected
- Handles audio encoding/decoding
- Plays assistant responses

### Real-time Processing
- WebSocket connection for low-latency communication
- Immediate transcription and response

### Connection Status
- Shows "Connected" indicator with pulsing dot
- Displays error messages if connection fails
- Loading state while connecting

### Responsive UI
- Mobile-friendly layout
- Dark theme with Tailwind CSS
- Chat bubble style messages

## Customization

### EVI Configuration

To customize EVI behavior, pass a configuration object to `connect()`:

```typescript
await connect({
  auth: { type: "accessToken", value: accessToken },
  config: {
    // See Hume documentation for available options
  },
});
```

### Styling

All components use Tailwind CSS. Modify the className attributes to customize:
- Colors (blue-600, red-600, neutral-900, etc.)
- Sizing (px-4, py-3, etc.)
- Spacing (gap-2, p-6, etc.)

### Error Handling

Errors are displayed inline:
- Authentication errors in Chat component
- Connection errors in StartCall component
- Network errors with descriptive messages

## Troubleshooting

### "Failed to fetch access token"
- Verify API key and secret key in environment variables
- Check that credentials are valid at https://platform.hume.ai/settings/keys

### "Failed to connect to voice assistant"
- Ensure browser has microphone permissions
- Check internet connection
- Verify access token is valid

### No audio being captured
- Browser permissions: Check microphone access
- HTTPS requirement: Voice API requires secure context
- Browser compatibility: Use Chrome, Edge, or Safari (latest versions)

### Messages not displaying
- Wait a few seconds after connecting
- Speak clearly and loudly
- Check console for errors

## Browser Requirements

- **Chrome/Chromium**: Latest version
- **Edge**: Latest version
- **Safari**: Latest version
- **Firefox**: Limited support

Voice capture requires:
- HTTPS connection (or localhost for development)
- User permission for microphone access
- Modern browser with Web Audio API support

## API Reference

For detailed documentation, see:
- [Hume React SDK](https://github.com/HumeAI/empathic-voice-api-js)
- [EVI Configuration](https://docs.hume.ai/docs/speech-to-speech-evi/configuration)
- [API Reference](https://docs.hume.ai/reference/speech-to-speech-evi/chat)

## Next Steps

1. Configure EVI with custom system prompts or personality
2. Implement chat history persistence
3. Add expression analysis to respond to user emotions
4. Integrate with your video editor for voice commands
