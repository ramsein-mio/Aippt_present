# Phase 2: Dynamic Slide Count Engine & Fullscreen Presentation Viewer

Upgrade the AIPPT presentation orchestrator from a static 12-slide fallback into a content-density-driven slide engine ($N \in [4, 25]$) and deliver an interactive, zero-flicker fullscreen presentation deck player with dynamic $1920 \times 1080$ viewport scaling, auto-hiding HUD, slide grid overview, and PDF export.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions have been aligned based on user answers in Phase 1:
> - **Short Prompt Pacing (< 150 words)**: Balanced pacing yielding 5 to 7 slides (1 Cover + 3–5 Content slides + 1 Closing synthesis).
> - **Default Player Launch**: Single slide view with an auto-hiding floating HUD bar that fades out after 2.5 seconds of inactivity.
> - **Slide Transition Style**: Instant smooth cut backed by a zero-flicker preloaded iframe buffer (`currentSlide - 1` and `currentSlide + 1`).
> - **Slide Count Selection**: Added "Auto (AI-Optimized based on content)" alongside manual presets (6, 8, 10, 12, 16, custom) and natural language regex overrides (e.g. "make a 7-slide deck").

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Content-Driven Dynamic Slide Engine**: Replaces the hardcoded `12` slide ceiling with intelligent semantic density scoring. Analyzes word count, paragraphs, and distinct subtopics to compute an optimal slide count $N \in [4, 25]$ (e.g. 5–7 slides for brief summaries, 8–11 for standard articles, 12–16 for deep-dives, 16–24 for comprehensive reports), or honors explicit user counts ("7 slides").
  2. **Interactive Fullscreen Presentation Deck Player**: A dedicated presentation viewer utilizing a dynamic `useViewportScale` hook to letterbox/pillarbox fixed $1920 \times 1080$ HTML slide canvases on any screen resolution (16:9, 16:10, mobile, ultrawide). Features keyboard navigation (`ArrowRight`, `Space`, `F/F11`, `G`, `Esc`), auto-hiding floating HUD bar, slide grid overview mode, and direct PDF/HTML exports.
- **Target Audience**: Executives, engineers, researchers, and educators who need instantly generated, presentation-ready decks scaled perfectly to conference projectors and laptops.
- **Key Value**: No more padding thin topics with fluff slides or cramming deep research into an arbitrary 12-page box; plus instant zero-flicker presentation playback.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Parameter Selection or Zero-Click Auto Flow**:
   - In the Parameter Locking Widget (`Node 1`), the user sees the slide count control defaulted to **"Auto (AI-Optimized)"**.
   - If they enter "7 slides on Quantum Crypto", the engine extracts `7` via regex override.
   - If they provide a 200-word summary in "Auto", the engine calculates $N = 6$ or $7$ and shows the reasoning badge.
2. **Generation & Verification**:
   - The sequential coding loop and `render_probe_all` QA automatically scale to the dynamic count $N$.
   - The carousel and delivery report reflect the exact $N$ verified slides.
3. **Entering Fullscreen Presentation Mode**:
   - User clicks **"Present Fullscreen"** (or hits `F`/`P` or clicks any thumbnail card).
   - The presentation player launches in full-viewport mode with clean letterboxing.
   - Moving the mouse reveals the floating bottom HUD (Slide Counter `03 / 08`, Prev/Next, Grid View toggle, PDF Export, Close).
   - Leaving the mouse still for 2.5s smoothly dims the HUD out.
4. **Slide Grid Overview (`G` key)**:
   - Toggling Grid View opens a clean, responsive thumbnail grid of all $N$ slides. Clicking any card immediately focuses that slide and returns to presentation mode.

#### Visual System & Layout Tokens
- **Canvas Aspect Ratio**: Strictly $16:9$ ($1920 \times 1080$ native internal canvas).
- **Scale Math**: `scale = Math.min(viewportWidth / 1920, viewportHeight / 1080)`.
- **Theme Consistency**: Supports all four curated themes (`scholarly-deep-blue`, `cyber-slate-emerald`, `warm-editorial-amber`, `obsidian-neon-violet`).
- **Floating HUD**: Pill container styled with `bg-slate-900/90`, subtle border `rgba(255,255,255,0.1)`, `backdrop-blur-xl`, tabular figures for `Slide 03 / 08`, and glowing active states.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Dual-Buffer Preloader vs. Single Iframe Re-render**
  - *Chosen Approach*: Keep active slide iframe plus preloaded `current - 1` and `current + 1` iframes hidden in the DOM.
  - *Why*: Switching slides becomes instantaneous ($0\text{ms}$ cut) with zero white flash or DOM re-parsing flicker.
  - *Alternatives Considered*: Single iframe updated via `srcdoc` caused noticeable 50–100ms flash between slide changes.
- **Decision 2: Semantic Density Heuristics + LLM Resolver**
  - *Chosen Approach*: Combine fast client/server heuristic scoring (`word_count`, regex matching `"(\d+)\s*slides?"`) with Gemini's outline architect (`determined_page_count` and `reasoning_for_page_count`).
  - *Why*: Guarantees instant deterministic bounds while allowing the LLM to choose the exact optimal structure.
- **Decision 3: Slide Grid Overlay vs Separate Route**
  - *Chosen Approach*: In-place modal and overlay mode (`G` key toggle) inside the viewer rather than routing away.
  - *Why*: Keeps presentation state, active timers, and full-screen display context uninterrupted.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER INPUT / PROMPT                             │
│   "Explain Quantum Key Distribution in 8 slides..." OR Raw Article     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   CONTENT DENSITY ANALYZER (Task 1.1)                  │
│  - Word/Paragraph Metric Extractor                                     │
│  - Regex Override: /(\d+)\s*(?:slides?|pages?)/i                       │
│  - Heuristic Bucketer: 4-7 | 8-11 | 12-16 | 16-24                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PLANNER AGENT & LOCK OUTLINE                       │
│  - lock_outline: { determined_page_count: N, reasoning, outline[N] }   │
│  - State update: state.locked_params.page_count = N                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                DYNAMIC SEQUENTIAL CODING & QA ENGINE                   │
│  - Node 4: Loops i = 0 to N-1 (pages/00.html .. pages/{N-1}.html)      │
│  - Node 5: render_probe_all inspects all N pages                       │
│  - Node 6: Delivery report verifies N delivered pages                  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             INTERACTIVE FULLSCREEN PRESENTATION DECK PLAYER            │
│  - useViewportScale: responsive Math.min(W/1920, H/1080) scaler        │
│  - Zero-Flicker Preload Buffers (prev, current, next iframes)          │
│  - Floating Auto-Hiding HUD (2.5s timer)                               │
│  - Keyboard Listener (ArrowRight/Left, Space, F, G, Esc)               │
│  - Slide Grid Overview Overlay (jump to any slide 1..N)                │
│  - Export Actions (Direct Multi-Page PDF & Standalone HTML)            │
└────────────────────────────────────────────────────────────────────────┘
```

#### Component & File Updates
- `src/services/contentAnalyzer.ts` (New): Content density analyzer and regex parser.
- `skills/slide-expert/references/agent-runtime.md`: Dynamic slide count rules and heuristics.
- `src/types/presentation.ts`: Add `page_count_mode: 'AUTO' | 'MANUAL'`, `determined_page_count`, and `reasoning`.
- `src/services/orchestrator.ts`: Integrate `analyzeContentDensity`, dynamic loop $0$ to $N-1$, dynamic `render_probe_all`.
- `src/components/ParameterLockingModal.tsx`: Add "Auto (AI-Optimized)" option and custom input.
- `src/hooks/useViewportScale.ts` (New): Dynamic letterboxing scale calculator hook.
- `src/components/PresentationMode.tsx`: Fullscreen API, preloaded buffer iframes, auto-hiding HUD, slide grid overview mode, keyboard hotkeys.
- `PROGRESS_STATE.json` (New): Persistent task state tracking per project policy.
