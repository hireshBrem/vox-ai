# Hume AI Tool Configuration Guide

This guide explains how to configure and use the `generate_image` and `generate_video` tools with Hume AI's EVI (Empathic Voice Interface).

## Overview

The implementation includes:
1. **Tool Handler** (`src/utils/hume-tool-handler.ts`) - Processes tool calls from Hume AI
2. **Runware AI Integration** (`src/utils/runware-ai.ts`) - Handles image and video generation
3. **Chat Component** (`src/components/chat.tsx`) - Integrates tool handling with the voice interface

## Tool Schemas

### 1. Generate Image Tool

**Tool Name:** `generate_image`

**Description:** This tool generates images based on a text prompt with specified dimensions.

**JSON Schema:**
```json
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

### 2. Generate Video Tool

**Tool Name:** `generate_video`

**Description:** This tool generates videos based on a text prompt with specified duration.

**JSON Schema:**
```json
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

## Setting Up Tools in Hume AI

### Option 1: Using the Hume AI Portal (No-Code)

1. Navigate to [Hume AI Portal](https://platform.hume.ai/evi/tools)
2. Click **Create tool**

#### For Generate Image Tool:
- **Name:** `generate_image`
- **Description:** Generates an image based on a text prompt with specified dimensions
- **Parameters:** Copy the JSON schema above

#### For Generate Video Tool:
- **Name:** `generate_video`
- **Description:** Generates a video based on a text prompt with specified duration
- **Parameters:** Copy the JSON schema above

3. Navigate to your EVI Configuration
4. In the **Tools** section, click **Add** and select your created tools
5. Ensure you're using a supported LLM (Claude, GPT, Gemini, or Moonshot AI)

### Option 2: Using the Hume AI API (Full-Code)

#### Create Generate Image Tool

```bash
curl -X POST https://api.hume.ai/v0/evi/tools \
  -H "X-Hume-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_image",
    "version_description": "Generates images with specified dimensions",
    "description": "This tool generates images based on a text prompt with specified dimensions.",
    "parameters": "{\"type\":\"object\",\"required\":[\"prompt\",\"width\",\"height\"],\"properties\":{\"prompt\":{\"type\":\"string\",\"description\":\"The prompt of the image to generate.\"},\"width\":{\"type\":\"integer\",\"description\":\"The width of the image.\"},\"height\":{\"type\":\"integer\",\"description\":\"The height of the image.\"}}}"
  }'
```

#### Create Generate Video Tool

```bash
curl -X POST https://api.hume.ai/v0/evi/tools \
  -H "X-Hume-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "generate_video",
    "version_description": "Generates videos with specified duration",
    "description": "This tool generates videos based on a text prompt with specified duration.",
    "parameters": "{\"type\":\"object\",\"required\":[\"prompt\",\"duration\"],\"properties\":{\"prompt\":{\"type\":\"string\",\"description\":\"The prompt of the video to generate.\"},\"duration\":{\"type\":\"integer\",\"description\":\"The duration of the video in seconds.\"}}}"
  }'
```

#### Add Tools to Configuration

After creating the tools, note their IDs and add them to your configuration:

```bash
curl -X POST https://api.hume.ai/v0/evi/configs \
  -H "X-Hume-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Content Generation Config",
    "language_model": {
      "model_provider": "ANTHROPIC",
      "model_resource": "claude-3-5-sonnet-20241022"
    },
    "tools": [
      {
        "id": "YOUR_GENERATE_IMAGE_TOOL_ID",
        "version": 0
      },
      {
        "id": "YOUR_GENERATE_VIDEO_TOOL_ID",
        "version": 0
      }
    ]
  }'
```

## How It Works

### Message Flow

1. **User speaks to EVI:** "Generate an image of a sunset over mountains"
2. **EVI infers tool call:** EVI determines that `generate_image` should be called
3. **Tool Call Message sent:** 
   ```json
   {
     "type": "tool_call",
     "name": "generate_image",
     "parameters": "{\"prompt\":\"sunset over mountains\",\"width\":1024,\"height\":768}",
     "tool_call_id": "call_abc123"
   }
   ```
4. **Handler processes:** The `handleToolCall` function parses parameters and calls `generateImage()`
5. **Response sent back:** 
   ```json
   {
     "success": true,
     "imageUrl": "https://...",
     "message": "Successfully generated a 1024x768 image"
   }
   ```
6. **EVI responds to user:** "I've generated your image. You can view it at..."

### Error Handling

The implementation includes comprehensive error handling:

- **Missing parameters:** Returns error if required parameters are missing
- **Invalid parameters:** Validates parameter types and ranges
- **Generation failures:** Catches and reports API errors
- **Unknown tools:** Returns error for unrecognized tool names

Example error response:
```json
{
  "error": "Missing required parameter",
  "code": "MISSING_PARAM",
  "level": "warn",
  "content": "The 'prompt' parameter is required for image generation"
}
```

## Implementation Details

### Tool Handler (`src/utils/hume-tool-handler.ts`)

The handler:
1. Receives tool call messages from Hume AI
2. Parses the JSON parameters
3. Routes to the appropriate function (`generateImage` or `generateVideo`)
4. Validates parameters
5. Calls the generation function
6. Returns success or error response using Hume's `send` helpers

### Runware AI Functions (`src/utils/runware-ai.ts`)

Currently contains placeholder implementations:
- `generateImage()`: Accepts prompt, width, height
- `generateVideo()`: Accepts prompt, duration

**Note:** Replace the mock implementations with actual Runware AI API calls.

### Chat Integration (`src/components/chat.tsx`)

The chat component:
1. Passes `onToolCall` handler to `VoiceProvider`
2. Automatically processes tool calls during conversations
3. Updates UI state (thinking/listening) during tool execution
4. Displays errors to users if tool calls fail

## Testing

To test the tools:

1. Start your development server
2. Connect to the voice interface
3. Try commands like:
   - "Generate a 1024x768 image of a forest"
   - "Create a 10-second video of waves crashing"
   - "Make an image showing a futuristic city"

## Next Steps

1. **Implement Runware AI Integration:**
   - Update `src/utils/runware-ai.ts` with actual API calls
   - Add authentication and error handling
   - Handle API rate limits and timeouts

2. **Enhance Error Messages:**
   - Add more specific validation
   - Provide helpful suggestions when errors occur
   - Log errors for debugging

3. **Add Tool Features:**
   - Support additional parameters (style, quality, etc.)
   - Add image editing capabilities
   - Implement video customization options

4. **UI Improvements:**
   - Display generated images/videos in the interface
   - Show progress indicators during generation
   - Add a gallery of generated content

## Troubleshooting

### Tool calls not being triggered
- Ensure your EVI configuration includes the tools
- Verify you're using a supported LLM (Claude, GPT, Gemini, Moonshot)
- Check that tool names match exactly (`generate_image`, `generate_video`)

### Parameters not being parsed correctly
- Verify JSON schemas are properly formatted
- Check that required parameters are marked in the schema
- Review Hume AI console logs for parameter validation errors

### Generation failing
- Check Runware AI API credentials
- Verify API endpoint URLs are correct
- Review error messages in browser console
- Ensure parameter values are within valid ranges

## Resources

- [Hume AI Tool Use Documentation](https://dev.hume.ai/docs/speech-to-speech-evi/features/tool-use)
- [Hume AI Portal](https://platform.hume.ai)
- [Hume AI API Reference](https://dev.hume.ai/reference)
- [TypeScript Example](https://github.com/HumeAI/hume-api-examples/tree/main/evi/evi-typescript-function-calling)
- [Next.js Example](https://github.com/HumeAI/hume-api-examples/tree/main/evi/evi-next-js-function-calling)

