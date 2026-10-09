# AI Photo Storyteller

> **Tagline:** “Turn your photos into stories worth remembering.”

An AI-powered web application that transforms 5–20 photographs into a personalized cinematic documentary with intelligent chapter sequencing, story scripting, studio voice narration, background music, and genuine MP4 video generation.

---

## 1. System Architecture

```
[User Browser]
  │
  ├── 1. Upload & Sequence Photos (5-20 frames, Drag & Drop, Reordering)
  ├── 2. Context & Customization (Title, Names, Dates, 8 Story Styles, Voice & Audio)
  │
  ▼
[Full-Stack Express & Vite Server (Port 3000)]
  │
  ├── POST /api/analyze-photos ──────► Google Gemini 3.8 Flash (Multimodal Vision)
  │                                    - Scene understanding, object activities, mood
  │
  ├── POST /api/generate-story  ──────► Google Gemini 3.8 Flash (Documentary Scripting)
  │                                    - Beginning/middle/end narrative arcs
  │                                    - Chapter sequencing & individualized subtitles
  │
  ├── POST /api/generate-narration ──► Google Gemini 3.8 Flash Lite TTS
  │                                    - Studio voices: Kore, Puck, Charon, Fenrir, Zephyr
  │
  └── POST /api/render-video    ──────► FFmpeg & Canvas Engine
                                       - Ken Burns Pan & Zoom motion
                                       - Smooth dissolves, typography overlays
                                       - Mixed audio (Narration + Ambient Synth Music)
                                       - Export to standard MP4 (H.264/AAC)
```

---

## 2. Key Features

- **Multimodal AI Scene Understanding**: Understands visual content, setting, and mood without guessing unverified private identities.
- **Intelligent Chapter Sequencing**: Groups related memories into cohesive chapters with evocative overarching narratives and personalized captions.
- **Interactive Story Studio**: Review, refine, and edit story titles, chapter scripts, individual captions, and photo order with instant preview.
- **Studio Neural Voice Narration**: Powered by `gemini-3.8-flash-lite-tts` with selectable voices (*Kore, Puck, Charon, Fenrir, Zephyr*).
- **Procedural Ambient Soundtrack**: Web Audio & server audio synthesis offering *Emotional, Peaceful, Uplifting, and Energetic* moods with volume ducking.
- **Cinematic Video Rendering & MP4 Download**: Produces actual downloadable MP4 video files with Ken Burns zoom, custom typography (*Elegant, Minimal, Bold*), and aspect ratios (*16:9, 9:16, 1:1*).
- **1-Click Interactive Example Story**: Pre-bundled with 6 curated photographs, sample chapter breakdown, and precomputed narration for instant demonstration.

---

## 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
# GEMINI_API_KEY: Required for multimodal vision, storytelling, and TTS voiceover
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# PORT: Server listening port (default 3000)
PORT=3000
```

*Note: In Google AI Studio, `GEMINI_API_KEY` is injected automatically.*

---

## 4. Local Development & Build

Install dependencies and start the full-stack dev server:

```bash
npm install
npm run dev
```

To build for production:

```bash
npm run build
npm run start
```

---

## 5. Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **AI Models**:
  - `gemini-3.8-flash`: Multimodal image scene understanding, chapter sequencing, and documentary scriptwriting.
  - `gemini-3.8-flash-lite-tts`: Text-to-speech voice narration synthesis.
- **Video Rendering**: Server-side `/usr/bin/ffmpeg` (H.264 / AAC) with in-browser HTML5 Canvas and WebAudio recorder fallback.
- **Backend**: Node.js, Express, tsx.
