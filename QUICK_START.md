# Quick Start: Hume AI Tool Use

## ⚡ Quick Setup (5 minutes)

### 1. Create Tools in Hume AI Portal

Visit [Hume AI Portal - Tools](https://platform.hume.ai/evi/tools)

**Tool 1: generate_image**
```json
Name: generate_image
Description: Generates an image based on a text prompt with specified dimensions
Parameters:
{
  "type": "object",
  "required": ["prompt", "width", "height"],
  "properties": {
    "prompt": {
      "type": "string",
      "description": "The prompt of the image to generate."
    },
    "width": {
      "type": "integer",
      "description": "The width of the image."
    },
    "height": {
      "type": "integer",
      "description": "The height of the image."
    }
  }
}
```

**Tool 2: generate_video**
```json
Name: generate_video
Description: Generates a video based on a text prompt with specified duration
Parameters:
{
  "type": "object",
  "required": ["prompt", "duration"],
  "properties": {
    "prompt": {
      "type": "string",
      "description": "The prompt of the video to generate."
    },
    "duration": {
      "type": "integer",
      "description": "The duration of the video in seconds."
    }
  }
}
```

### 2. Add Tools to Your EVI Config

1. Navigate to your EVI Configuration
2. Go to **Tools** section
3. Click **Add** → Select both tools
4. **Important:** Use Claude, GPT, Gemini, or Moonshot AI as your LLM
5. Save configuration

### 3. Update Configuration IDs (if needed)

In `src/components/chat.tsx`, update the config IDs:
```typescript
const configId = agentMode === 'edit_videos' 
  ? 'YOUR_EDIT_CONFIG_ID'      // Update this
  : 'YOUR_GENERATE_CONFIG_ID';  // Update this
```

### 4. Test It!

Start your dev server:
```bash
npm run dev
```

Try these voice commands:
- "Generate a 1024x768 image of a sunset"
- "Create a 10 second video of ocean waves"
- "Make a square image of a cat, 512 pixels"

## 📁 Files Created

```
src/utils/hume-tool-handler.ts      ← Main tool handler
src/utils/runware-ai.ts             ← Generation functions (add your API)
src/components/chat.tsx             ← Updated with tool integration

HUME_TOOL_CONFIGURATION.md          ← Complete setup guide
tool-schemas.json                   ← JSON schemas
IMPLEMENTATION_SUMMARY.md           ← Technical details
QUICK_START.md                      ← This file
```

## 🔧 Next: Implement Runware AI

In `src/utils/runware-ai.ts`, replace the placeholder code with actual Runware API calls:

```typescript
// Replace this:
const mockImageUrl = `https://placeholder...`;

// With actual API call:
const response = await fetch('https://api.runware.ai/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RUNWARE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt, width, height }),
});

const data = await response.json();
return {
  success: true,
  imageUrl: data.url,
};
```

## ✅ Verification Checklist

- [ ] Tools created in Hume AI Portal
- [ ] Tools added to EVI configuration
- [ ] Configuration uses supported LLM (Claude/GPT/Gemini/Moonshot)
- [ ] Config IDs updated in chat.tsx
- [ ] Dev server running
- [ ] Tested with voice commands
- [ ] Console shows tool call logs
- [ ] Ready to add real Runware API

## 🐛 Quick Troubleshooting

**Tools not triggering?**
→ Check config ID, ensure tools are added, verify LLM is supported

**Parameters not parsed?**
→ Verify JSON schemas match exactly, check console for errors

**Getting errors?**
→ Check browser console for detailed error messages

## 📚 Full Documentation

- **Setup Details:** See `HUME_TOOL_CONFIGURATION.md`
- **Technical Info:** See `IMPLEMENTATION_SUMMARY.md`
- **Hume AI Docs:** https://dev.hume.ai/docs/speech-to-speech-evi/features/tool-use

## 💡 Example Test Commands

**Images:**
- "Generate a 512x512 image of a futuristic city"
- "Create a wide landscape image, 1920 by 1080, showing mountains"
- "Make a portrait of a robot, 768 pixels wide by 1024 tall"

**Videos:**
- "Generate a 5 second video of a waterfall"
- "Create a 10 second clip of city traffic"
- "Make a 3 second video showing fireworks"

## 🎉 You're Ready!

The implementation is complete and working with placeholder data. Add your Runware API integration to make it fully functional!

