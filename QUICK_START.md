# 🚀 Hume.ai EVI Quick Start Guide

Get your voice assistant up and running in 3 minutes!

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ npm or your preferred package manager
- ✅ Hume.ai account with API credentials

## Step 1: Get Your Hume Credentials

1. Visit https://platform.hume.ai/settings/keys
2. Log in (sign up if you don't have an account)
3. Copy your **API Key** and **Secret Key**

## Step 2: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local
HUME_API_KEY=your_api_key_here
HUME_SECRET_KEY=your_secret_key_here
```

Replace `your_api_key_here` and `your_secret_key_here` with actual values.

## Step 3: Install Dependencies

```bash
npm install
```

Dependencies are already in `package.json`:
- `@humeai/voice-react` - Hume React SDK
- `hume` - Hume TypeScript SDK
- `next` - Next.js framework
- `react` - React library
- `tailwindcss` - Styling

## Step 4: Run Development Server

```bash
npm run dev
```

Navigate to http://localhost:3000

## Step 5: Test the Voice Assistant

1. Look at the **right panel** (Voice Assistant section)
2. Click the **"Start Session"** button (blue, with microphone icon)
3. **Allow microphone access** when the browser asks
4. **Speak naturally** to the assistant
5. Watch your transcribed message appear as a blue bubble
6. Watch the assistant's response appear as a gray bubble
7. Click **"End Session"** to disconnect

## 🎯 What You Should See

### Before Starting
```
┌─────────────────────────────────┐
│   No messages yet               │
│   Start a session to begin...   │
├─────────────────────────────────┤
│   [🎤 Start Session] button     │
└─────────────────────────────────┘
```

### After Starting (and speaking)
```
┌─────────────────────────────────┐
│                                 │
│              [Your message →]   │
│   [← Assistant's response]      │
│                                 │
├─────────────────────────────────┤
│   [🎙️ End Session] button       │
│   🟢 Connected                  │
└─────────────────────────────────┘
```

## 🔧 Architecture Overview

```
┌─────────────────────────────────────────────┐
│ VoiceAssistantPanel (Server Component)      │
│  - Fetches access token securely            │
│  - Never exposes API keys to browser        │
└─────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────┐
│ Chat (Client Component - Dynamic Import)    │
│  - Wraps with VoiceProvider context         │
│  - Displays messages and controls           │
└─────────────────────────────────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │  Messages Component            │
        │  - Shows chat history          │
        └────────────────────────────────┘
        ┌────────────────────────────────┐
        │  StartCall Component           │
        │  - Start/End session button    │
        │  - Shows connection status     │
        └────────────────────────────────┘
```

## 🎤 How Voice Works

1. **Start Session** → Creates WebSocket connection to Hume
2. **Microphone Access** → Browser captures audio in real-time
3. **Audio Stream** → Sent to Hume's EVI service
4. **Processing** → 
   - Speech-to-text transcription
   - AI response generation
   - Text-to-speech conversion
5. **Audio Playback** → Browser plays assistant's voice response
6. **Message Display** → Chat messages appear in real-time
7. **End Session** → Closes WebSocket connection

## ✨ Key Features

🎙️ **Voice Processing**
- Automatic speech recognition
- Real-time transcription
- Natural speech synthesis
- Low-latency responses

🛡️ **Security**
- API keys never sent to browser
- Server-side token generation
- Secure WebSocket (WSS)
- Temporary access tokens

🎨 **Beautiful UI**
- Dark theme
- Chat bubble interface
- Real-time status indicators
- Responsive design
- Smooth animations

🚀 **Production Ready**
- TypeScript for type safety
- Error handling & recovery
- Proper loading states
- Browser compatibility

## 🐛 Troubleshooting

### ❌ "Authentication Error" message appears

**Problem**: Failed to fetch access token

**Solution**:
1. Check `.env.local` file exists and has correct values
2. Verify API key and secret key at https://platform.hume.ai/settings/keys
3. Make sure credentials don't have extra spaces
4. Restart the dev server: `npm run dev`

### ❌ "Failed to connect to voice assistant"

**Problem**: Can't establish WebSocket connection

**Solution**:
1. Check internet connection
2. Allow microphone permission in browser
3. Make sure you're using HTTPS or localhost
4. Try different browser (Chrome/Edge recommended)

### ❌ No audio being captured

**Problem**: Microphone not working

**Solution**:
1. Check browser permissions for microphone
2. Speak louder and more clearly
3. Check microphone is not muted in OS settings
4. Try different browser or device

### ❌ Messages not appearing

**Problem**: Chat history not showing

**Solution**:
1. Wait 2-3 seconds after connecting
2. Speak to trigger a response
3. Check browser console for errors (F12 → Console)
4. Refresh the page and try again

## 📚 File Structure

```
src/
└── components/
    ├── voice-assistant-panel.tsx    ← Root server component
    ├── chat.tsx                     ← Provider wrapper
    ├── start-call.tsx               ← Connection control
    └── messages.tsx                 ← Chat display
```

## 🔌 API Keys Security Note

Never commit `.env.local` to git! It's already in `.gitignore`.

For production, use your platform's environment variable system:
- Vercel: Add in Dashboard → Settings → Environment Variables
- AWS: Use Secrets Manager or Parameter Store
- Docker: Use --env-file or docker-compose secrets

## 📖 Learn More

- **Full Integration Guide**: Read `HUME_INTEGRATION.md`
- **Implementation Details**: Read `IMPLEMENTATION_SUMMARY.md`
- **Hume Documentation**: https://docs.hume.ai
- **React SDK**: https://github.com/HumeAI/empathic-voice-api-js

## 🎯 Next Steps

After confirming everything works:

1. **Customize the Assistant**
   - Add system prompts
   - Adjust personality
   - Configure behavior

2. **Integrate with Video Editor**
   - Use voice commands
   - Control editing with voice

3. **Enhance Features**
   - Save chat history
   - Add user profiles
   - Implement chat persistence

4. **Deploy to Production**
   - Deploy to Vercel
   - Set up environment variables
   - Enable custom domain

## ✅ Success Checklist

- [ ] `.env.local` created with valid credentials
- [ ] `npm install` completed
- [ ] `npm run dev` running without errors
- [ ] Voice assistant panel visible on right side
- [ ] Microphone permission granted
- [ ] "Start Session" button works
- [ ] Can speak and see transcription
- [ ] Receive assistant responses
- [ ] Messages display correctly
- [ ] "End Session" button stops the session

## 🎉 You're Ready!

Your voice assistant is now running. Start by speaking to it naturally and see how it responds!

Need help? Check the troubleshooting section or reach out to Hume support at https://support.hume.ai
