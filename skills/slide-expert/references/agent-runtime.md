# AIPPT Slide Expert - Core Agent Runtime & Anti-Bug Specifications

## Strict Canvas Rule
All slides must be rendered inside an exact `.slide-canvas` bounding container:
- Width: `1920px`
- Height: `1080px`
- Overflow: `hidden`
- Box Sizing: `border-box`
- Padding: `64px 80px 80px 80px`
- Aspect Ratio: `16:9` widescreen

## Zero-Hallucination & Data Integrity Policy
- If user input text lacks empirical statistics or verified percentages, never fabricate false data.
- Use qualitative, evidence-based claims grounded directly in the provided material.
- Every data-bearing slide must include a subtle, high-contrast source band at the bottom footer.

## Visual Diversity Constraint
- Consecutive slides must NOT share identical layout structures.
- Alternate between:
  1. `cover_split_right_image`
  2. `horizontal_milestone_chain`
  3. `quadrant_matrix`
  4. `two_column_comparison`
  5. `stepped_process_flow`
  6. `stat_hero_with_breakdown`
  7. `hierarchical_cards_grid`
  8. `architecture_flow_diagram`
  9. `takeaway_synthesis_closing`

## SVG & Vector Safe-Coding Standard
- Every `<svg>` element must specify explicit `viewBox` attributes.
- Set explicit `max-height` (max 480px) and `overflow: visible` or `hidden` to avoid vertical canvas overrun.
- Use vector shapes, glowing cyan/azure accents, gradients, and backdrop blurs.

## Automated DOM Probe Checklist
- Canvas overall vertical scroll height <= 1080px
- Canvas overall horizontal scroll width <= 1920px
- All content elements must clear Y=1010px reserved footer band
- Zero sibling bounding box collisions (>4px overlap)
- Zero broken `<img>` resources
