# AIPPT Slide Expert - Core Agent Runtime & Anti-Bug Specifications

## Strict Canvas Rule
All slides must be rendered inside an exact `.slide-canvas` bounding container:
- Width: `1920px`
- Height: `1080px`
- Overflow: `hidden`
- Box Sizing: `border-box`
- Padding: `64px 80px 80px 80px`
- Aspect Ratio: `16:9` widescreen

## Autonomous Semantic Slide Sizing & Dynamic Outlines
- **Rule of One Core Concept Per Slide**: Never cram multiple unrelated topics into a single slide, and never stretch thin content across fluff slides just to hit an arbitrary number.
- **Dynamic Content Sizing Bounds**: Slide count $N$ must satisfy $4 \le N \le 25$.
- **Content-to-Slide Mapping Heuristics**:
  - **Short Prompt / Brief Summary (< 150 words or 1–3 concepts)**: Generate **5 to 7 slides** (1 Cover + 3–5 Content Slides + 1 Closing Synthesis).
  - **Medium Article / Standard Topic (150 – 600 words or 4–7 distinct subtopics)**: Generate **8 to 11 slides**.
  - **Long Document / Deep Technical (600 – 1,500 words or 8–12 distinct subtopics)**: Generate **12 to 16 slides**.
  - **Comprehensive Report / Deep-Dive (> 1,500 words)**: Generate **16 to 24 slides**.
- **Explicit User Override**: If the user explicitly asks for $X$ slides (e.g. "make a 7-slide presentation"), strictly honor $N = X$.

## Zero-Hallucination & Data Integrity Policy
- If user input text lacks empirical statistics or verified percentages, never fabricate false data.
- Use qualitative, evidence-based claims grounded directly in the provided material.
- Every data-bearing slide must include a subtle, high-contrast source band at the bottom footer.

## Visual Diversity Constraint
- Consecutive slides must NOT share identical layout structures.
- Alternate between:
  1. `cover_split_right_image` (Always Page 1)
  2. `horizontal_milestone_chain`
  3. `quadrant_matrix`
  4. `two_column_comparison`
  5. `stepped_process_flow`
  6. `stat_hero_with_breakdown`
  7. `hierarchical_cards_grid`
  8. `architecture_flow_diagram`
  9. `takeaway_synthesis_closing` (Always Last Page)

## SVG & Vector Safe-Coding Standard
- Every `<svg>` element must specify explicit `viewBox` attributes.
- Set explicit `max-height` (max 480px) and `overflow: visible` or `hidden` to avoid vertical canvas overrun.
- Use vector shapes, glowing accents, gradients, and backdrop blurs.

## Automated DOM Probe Checklist
- Canvas overall vertical scroll height <= 1080px
- Canvas overall horizontal scroll width <= 1920px
- All content elements must clear Y=1010px reserved footer band
- Zero sibling bounding box collisions (>4px overlap)
- Zero broken `<img>` resources
