<h1 align="center">
    <br>
    🎤 Vox AI
    <br>
</h1>

<h4 align="center">AI video editor using voice</h4>

<p align="center">
    <a href="#project-overview">Overview</a> •
    <a href="#team-introduction">Team</a> •
    <a href="#key-features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#sponsor-tools-used">Sponsor Tools</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#setup-instructions">Setup</a> •
    <a href="#demo-video">Demo</a>
</p>

---

## 🎯 Project Overview

**Vox AI** is an AI video editor controlled using voice that makes professional video editing accessible to everyone. Vox AI is trying to transform hours of tedious editing into minutes of natural conversation.

### The Problem
Video editing is time-consuming, technically demanding, and requires expensive software expertise. Content creators spend hours on tasks that should take minutes, creating a significant barrier to quality content production.

### Our Solution
Vox AI enables users to edit videos, generate images, and create video content through natural voice commands. The AI assistant understands context, remembers your preferences and past edits, and provides an empathic, human-like interaction experience.

### Why It Matters
The global video editing software market is estimated between **$2.43B - $3.54B in 2025**. With the explosion of content creation, there's a massive need for accessible, intelligent editing tools. Vox AI democratizes professional video editing, making it available to anyone who can speak.

---

## 👥 Team Introduction

- **Team Name:** Vox AI
- **Members:**
  - **Hiresh Bremanand** - Full-Stack Developer - United Kingdom
- **Fun Fact:** Built my first AI project at 17 and reached 1000 users! 🚀

---

## ✨ Key Features

### 1. 🎙️ Empathic Voice Interface
- Natural conversation with an AI assistant powered by Hume AI's EVI
- Real-time voice interaction with emotional awareness
- Context-aware responses that adapt to user tone and intent

### 2. 🧠 Contextual Memory System
- **Powered by Memories.ai** - Video indexing and semantic search
- Remembers past conversations and editing decisions
- Retrieves relevant video segments and context automatically
- Session-based memory management with history tracking

### 3. 🎨 AI Content Generation
- **Image Generation** via Runware AI with custom dimensions
- **Video Generation** via Runware AI with duration control

### 4. 📹 Voice-based Video Editor
- Timeline-based editing interface
- Generated content integration
- Responsive panel-based layout

---

## 🛠 Tech Stack

### Frontend Framework
- **Next.js 15.5.6** - React framework with App Router and Turbopack
- **React 19.1.0** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling

### UI Components & Styling
- **Shadcn UI** - Beautiful, accessible component system
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Modern icon library (548+ icons)
- **Framer Motion 12** - Production-ready animations
- **class-variance-authority** - Type-safe variant styling
- **tailwind-merge** - Merge Tailwind classes intelligently

### 3D Graphics & Visualization
- **Three.js 0.180** - WebGL 3D graphics library
- **React Three Fiber 9.4** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F

### AI & Voice APIs
- **Hume AI SDK** - Empathic Voice Interface (EVI)
  - `hume` (0.14.1) - Core SDK
  - `@humeai/voice-react` (0.2.6) - React integration
- **Memories.ai** - Video indexing and semantic memory
- **Runware AI SDK** (1.1.48) - Image and video generation
- **ElevenLabs React** (0.8.1) - Advanced text-to-speech

### File Management & Media
- **Filestack** (3.44.2) - File upload and transformation
- **Uploadcare** (6.18.0) - File uploading service
- **ImageKit** (4.3.0) - Image optimization and delivery
- **Next.js Image Optimization** - Built-in image handling

### Development Tools
- **tsx** - TypeScript execution engine for testing
- **ts-node** - TypeScript Node.js runtime
- **dotenv** - Environment variable management
- **Node.js 20+** - JavaScript runtime

### Architecture & Patterns
- **Server Components** - Optimized React Server Components
- **Server Actions** - Type-safe server mutations
- **Custom Hooks** - Reusable React logic
- **Tool-Based Architecture** - Extensible AI tool system
- **Event-Driven Updates** - Real-time UI synchronization

---

## 🤝 Sponsor Tools Used

### 1. **Hume AI - Empathic Voice Interface (EVI)**

**Integration:** Core voice interaction layer

**How It Works:**
- Implemented custom tool use system with `generate_image` and `generate_video` and more tools
- Real-time streaming
- Emotional awareness in responses
- Tool call handling with proper success/error responses

**Why Chose It:**
Hume AI's EVI provides unmatched emotional intelligence in voice interactions. The empathic responses create a natural, human-like experience that's crucial for creative work like video editing. The tool use capability allows seamless integration with our generation pipeline.



**Documentation:** `HUME_TOOL_CONFIGURATION.md`

---

### 2. **Memories.ai - Video Memory & Indexing**

**Integration:** Semantic memory layer for video content

**How It Works:**
- Index videos from URLs for semantic search
- Maintain conversation history with session management
- Retrieve relevant video segments based on natural language queries
- Store and recall editing context across sessions

**Why Chose It:**
Memories.ai enables true contextual awareness by enabling to understand context of videos by chatting with it.

---

### 3. **Runware AI - Image & Video Generation**

**Integration:** Content generation engine

**How It Works:**
- Generate images with custom dimensions via text prompts
- Create videos with specified duration
- Real-time generation with live preview updates
- localStorage + event-driven updates for UI synchronization

**Key Capabilities:**
- Image generation with multiple models (runware:101@1)
- Video generation with KlingAI models (klingai:5@3)
- Custom dimension support (width, height)
- Duration control for videos (1-60 seconds)

**Why We Chose It:**
Runware AI provides fast, high-quality generation through a simple SDK. The ability to generate both images and videos through a single API simplifies our architecture and ensures consistent quality across media types.
---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Interface                       │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │ Voice Panel    │  │ Video Editor   │  │ Generate      │ │
│  │ (Hume AI EVI)  │  │ Panel          │  │ Panel         │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Tool Handler Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  handleToolCall() - Routes to appropriate tools      │   │
│  │  • generate_image → Runware AI                       │   │
│  │  • generate_video → Runware AI                       │   │
│  │  • Error handling & validation                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Hume AI     │     │ Memories.ai  │     │ Runware AI   │
│  • Voice I/O │     │ • Video Index│     │ • Image Gen  │
│  • EVI       │     │ • Chat Memory│     │ • Video Gen  │
│  • Tools     │     │ • Sessions   │     │ • SDK        │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## 💙 Affective Intelligence & Human-Centered UX

### Affect Signals

**Implemented with Hume AI's Empathic Voice Interface:**

1. **Prosody Analysis**
   - Detects user frustration, excitement, confusion
   - Adapts response tone accordingly
   - Provides encouragement during complex tasks

2. **Conversational Pacing**
   - Adjusts speed based on user comprehension
   - Natural pauses and rhythm
   - Human-like interruption handling

3. **Emotional Awareness**
   - Celebrates successful generations
   - Offers help when errors occur
   - Maintains encouraging tone throughout

**User Value:**
- Reduces cognitive load during editing
- Makes technical tasks feel approachable
- Creates enjoyable, creative experience

### Safety & Bias

**Current Implementation:**
- Input validation prevents malformed requests
- Error messages are clear and non-technical
- No sensitive data logged or stored

---

## 🌍 Real-World Value & Use-Case Scope

### User Needs

**Primary Problem Solved:**
Video editing is time-consuming and requires technical expertise. Content creators lose hours to tasks that could be automated or simplified.

**Jobs-to-be-Done:**
- "I need to edit my YouTube video quickly"
- "I want to generate video b-roll without stock footage sites"
- "I need to create custom graphics for my content"
- "I want professional results without professional tools"

### Domain & Stakeholders

**Domain Expertise Applied:**
- Video editing workflows and terminology
- Content creation pipeline optimization
- User experience design for creative tools
- AI-assisted creative processes

**Key Stakeholders:**

1. **Content Creators** - Primary users, need efficiency
2. **Platform Owners** (YouTube, TikTok) - Want quality content
3. **Agencies** - Need scalable production
4. **Education** - Teaching video skills
5. **Enterprise** - Corporate communications

**Stakeholder Fit:**
- Reduces production costs by 60-80%
- Increases content output velocity
- Lowers barrier to entry for video creation
- Enables focus on creativity over technical execution

### Market Analysis

**Market Size:**
- Global video editing software market: $2.43B - $3.54B (2025)
- Content creator economy: $104.2B (2024)
- Projected CAGR: 5-7% through 2030

**Potential ROI:**
- Traditional editing: 2-4 hours per video at $50/hr = $100-200
- Vox AI: 15-30 minutes = 75-90% time savings
- Cost per video reduced from $100-200 to $20-40

**Competitive Advantage:**
1. **Voice-First Interface** - Unique in video editing space
2. **Emotional Intelligence** - Hume AI's empathic responses
3. **Memory & Context** - Learns from user behavior
4. **Integrated Generation** - All-in-one solution
5. **Lower Learning Curve** - Natural language vs complex UI

**Competitors:**
- Adobe Premiere Pro: Professional but complex ($54.99/mo)
- Final Cut Pro: Mac-only, steep learning curve ($299)
- DaVinci Resolve: Free but technical
- Descript: Text-based, limited generation
- **Vox AI: Voice-controlled, AI-native, accessible**

---

## 🎥 Demo Video

[TODO: Add demo video link here]

**Demo Contents:**
- Voice interaction demonstration
- Image and video generation
- Memory and context showcase
- End-to-end editing workflow

---

## 💡 Challenges & Learnings

### Technical Challenges

**Challenge 1: Voice Tool Integration**
- **Problem:** Integrating custom tools with Hume AI's EVI required understanding their specific tool call format
- **Solution:** Read through Hume AI documentation extensively and used AI assistants to clarify implementation details
- **Learning:** The importance of proper tool schema definition and response formatting

**Challenge 2: Real-Time UI Updates**
- **Problem:** Keeping UI synchronized with asynchronous generation processes
- **Solution:** Implemented event-driven architecture with localStorage and custom events
- **Learning:** Browser APIs can effectively coordinate state across components

**Challenge 3: Memory Context Management**
- **Problem:** Maintaining conversation context across multiple sessions
- **Solution:** Leveraged Memories.ai's session management API
- **Learning:** Dedicated memory systems are crucial for agent-like behavior

### Key Learnings

1. **Empathic AI is Transformative**
   - Using Hume AI's EVI was shocking - the responsive, human-like interaction felt "scary good"
   - Emotional intelligence in AI makes creative tools feel more intuitive
   - Voice-first interfaces can be more natural than GUIs for certain tasks

2. **Documentation + AI = Fast Learning**
   - Combining official docs with AI-powered Q&A accelerated development
   - Understanding API contracts is crucial for integration success

3. **User Experience Matters**
   - Technical capability means nothing without good UX
   - Voice feedback and live updates create engaging experiences
   - Error messages should guide, not confuse

4. **Integration Architecture**
   - Tool-based architecture enables easy extensibility
   - Clear separation of concerns simplifies debugging
   - TypeScript interfaces prevent runtime errors

---

## 🔮 Future Improvements / Next Steps

### Immediate Priorities (1-3 months)

1. **Full Video Editing Suite**
   - Multi-clip timeline editor
   - Drag-and-drop interface
   - Trim, cut, split operations
   - Transitions and effects library

2. **Advanced Stitching**
   - Combine multiple clips into polished videos
   - Auto-transitions based on content
   - Smart scene detection
   - Audio synchronization

3. **Export & Sharing**
   - Multiple format support (MP4, MOV, WebM)
   - Resolution presets (1080p, 4K, mobile)
   - Direct upload to YouTube/TikTok
   - Cloud storage integration

### Medium-Term Goals (3-6 months)

4. **Enhanced AI Capabilities**
   - Auto-captioning with AI
   - Background music generation
   - Style transfer for consistent branding
   - Smart b-roll suggestions

5. **Collaboration Features**
   - Real-time co-editing
   - Comment and annotation system
   - Version control
   - Team workspaces

6. **Template Marketplace**
   - Pre-built editing templates
   - Style presets
   - Effect libraries
   - Community sharing

### Long-Term Vision (6-12 months)

**Mission:** Make anyone a professional video editor

**Vision:**
- Natural language video editing becomes the standard
- AI handles technical complexity, humans focus on creativity
- Barrier to entry for video creation eliminated
- Global access to professional-grade tools

**Strategic Goals:**
- 100K+ active users
- 1M+ videos edited
- Integration with major platforms (YouTube, TikTok, Instagram)
- Mobile app for on-the-go editing
- Enterprise tier for agencies and brands
- API for third-party integrations

**Technical Roadmap:**
- Advanced computer vision for scene understanding
- Real-time collaboration infrastructure
- Edge computing for reduced latency
- Plugin system for extensibility
- Multi-language support for global reach

---

## 📄 License

This project is licensed under the terms specified in the [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Hume AI** for the incredible Empathic Voice Interface
- **Memories.ai** for powerful memory and video indexing capabilities
- **Runware AI** for fast, high-quality content generation
- The hackathon organizers for this opportunity

---

## 📞 Contact & Links

- **GitHub:** [@hireshb](https://github.com/hireshb)
- **Twitter:** [@hiresh_b](https://x.com/hiresh_b)

---

<p align="center">
  <strong>Built with ❤️ for the AI Hackathon 2025</strong>
</p>
