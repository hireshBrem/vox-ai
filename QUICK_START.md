# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Clone & Install (1 minute)

```bash
git clone https://github.com/hireshb/memories-ai-hackathon.git
cd memories-ai-hackathon
npm install
```

### 2. Get API Keys (2 minutes)

#### Hume AI
1. Go to [platform.hume.ai](https://platform.hume.ai)
2. Sign up / Log in
3. Navigate to API Keys
4. Create API key + Secret key
5. Configure EVI tools (see `HUME_TOOL_CONFIGURATION.md`)

#### Memories.ai
1. Go to [memories.ai](https://memories.ai)
2. Sign up / Log in  
3. Navigate to API section
4. Generate API key

#### Runware AI
1. Go to [runware.ai](https://runware.ai)
2. Sign up / Log in
3. Access dashboard
4. Generate API key

### 3. Configure Environment (1 minute)

Create `.env.local` file in root directory:

```bash
# Hume AI
HUME_API_KEY=your_hume_api_key_here
HUME_SECRET_KEY=your_hume_secret_key_here

# Memories.ai
MEMORIES_AI_API_KEY=your_memories_ai_api_key_here

# Runware AI
NEXT_PUBLIC_RUNWARE_API_KEY=your_runware_api_key_here
```

### 4. Run (1 minute)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Verify Setup

### Test Voice
1. Click microphone icon
2. Allow browser microphone access
3. Say "Hello"
4. You should hear AI response

### Test Image Generation
1. Say: "Generate a 512x512 image of a cat"
2. Wait for generation
3. Image should appear in generate panel

### Test Video Generation
1. Say: "Generate a 5 second video of ocean waves"
2. Wait for generation (may take longer)
3. Video should appear in generate panel

---

## 🐛 Troubleshooting

### Voice Not Working
- Check microphone permissions in browser
- Verify Hume AI keys are correct
- Check browser console for errors

### Generation Failing
- Verify Runware API key is set
- Check API rate limits
- Ensure prompt is valid

### Memory Issues
- Verify Memories.ai API key
- Check network connectivity
- Ensure session ID is being passed

### Build Errors
- Delete `node_modules` and run `npm install` again
- Clear Next.js cache: `rm -rf .next`
- Verify Node.js version is 20+

---

## 📚 Next Steps

After setup:
1. Read `README.md` for full documentation
2. Check `HUME_TOOL_CONFIGURATION.md` for tool setup
3. See `DEMO_SCRIPT.md` for demo ideas
4. Review `SUBMISSION_STATUS.md` for progress

---

## 💡 Pro Tips

- **Test incrementally** - Verify each API works before moving on
- **Check console** - Lots of helpful logs for debugging
- **API costs** - Be mindful of generation costs during testing
- **Browser** - Chrome/Edge work best for voice features

---

## 📞 Need Help?

If you encounter issues:
1. Check browser console logs
2. Verify all API keys are correct
3. Ensure `.env.local` file exists and is properly formatted
4. Try restarting the dev server

---

**Happy coding! 🎉**

