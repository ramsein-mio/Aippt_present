import { RenderProbeIssue, RenderProbeResult } from '../types/presentation';

/**
 * Executes DOM render inspection on a 1920x1080 slide container or iframe document.
 * Matches exact logic specified in Task 1.3 of the master engineering blueprint.
 */
export function inspectSlideDom(doc: Document, pageNumber: number, fileName: string): RenderProbeResult {
  const CANVAS_W = 1920;
  const CANVAS_H = 1080;
  const issues: RenderProbeIssue[] = [];

  const slideRoot = (doc.querySelector('.slide-canvas') as HTMLElement) || doc.body;

  if (!slideRoot) {
    return {
      page_number: pageNumber,
      file_name: fileName,
      passed: false,
      issues: [{
        type: 'ELEMENT_OUT_OF_BOUNDS',
        description: `Page ${pageNumber} missing .slide-canvas root element.`
      }]
    };
  }

  // 1. Overall Canvas Overflow Check
  if (slideRoot.scrollHeight > CANVAS_H + 2) {
    issues.push({
      type: 'VERTICAL_OVERFLOW',
      overflow_px: slideRoot.scrollHeight - CANVAS_H,
      description: `Page ${pageNumber} (${fileName}) overflows vertically by ${slideRoot.scrollHeight - CANVAS_H}px.`
    });
  }

  if (slideRoot.scrollWidth > CANVAS_W + 2) {
    issues.push({
      type: 'HORIZONTAL_OVERFLOW',
      overflow_px: slideRoot.scrollWidth - CANVAS_W,
      description: `Page ${pageNumber} (${fileName}) overflows horizontally by ${slideRoot.scrollWidth - CANVAS_W}px.`
    });
  }

  // 2. Elements out of bounds & Internal Clipping
  const contentElements = slideRoot.querySelectorAll('div, section, svg, p, h1, h2, h3, ul, table');
  contentElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    if (htmlEl.classList.contains('slide-footer') || htmlEl.closest('.slide-footer')) {
      return;
    }

    const rect = htmlEl.getBoundingClientRect();

    // Check if element spills past bottom of 1080px canvas
    if (rect.bottom > CANVAS_H + 2) {
      issues.push({
        type: 'ELEMENT_OUT_OF_BOUNDS',
        element: `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').slice(0, 2).join('.') : ''}`,
        overflow_px: Math.ceil(rect.bottom - CANVAS_H),
        description: `Element <${el.tagName.toLowerCase()}> in Page ${pageNumber} overflows bottom edge by ${Math.ceil(rect.bottom - CANVAS_H)}px.`
      });
    }

    // Check internal clipping
    try {
      const win = doc.defaultView || window;
      const style = win.getComputedStyle(htmlEl);
      if ((style.overflowY === 'hidden' || style.overflow === 'hidden') && htmlEl.scrollHeight > htmlEl.clientHeight + 4) {
        issues.push({
          type: 'INTERNAL_CLIPPING',
          element: el.tagName.toLowerCase(),
          overflow_px: htmlEl.scrollHeight - htmlEl.clientHeight,
          description: `Internal content inside <${el.tagName.toLowerCase()}> overflows by ${htmlEl.scrollHeight - htmlEl.clientHeight}px and is clipped.`
        });
      }
    } catch {
      // ignore getComputedStyle cross-frame errors if any
    }
  });

  // 3. Sibling Bounding-Box Collision Check
  const cards = Array.from(slideRoot.querySelectorAll('.card, .grid-item, .column, svg, .diagram-node'));
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (cards[i].contains(cards[j]) || cards[j].contains(cards[i])) continue;
      const r1 = cards[i].getBoundingClientRect();
      const r2 = cards[j].getBoundingClientRect();
      const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
      const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
      if (overlapX > 6 && overlapY > 6) {
        issues.push({
          type: 'ELEMENT_COLLISION',
          description: `Collision detected on Page ${pageNumber} between layout blocks (${Math.round(overlapX)}x${Math.round(overlapY)}px overlap).`
        });
      }
    }
  }

  // 4. Broken image resource check
  doc.querySelectorAll('img').forEach((img) => {
    if (!img.complete || img.naturalWidth === 0) {
      const src = img.getAttribute('src') || '';
      // allow data URLs and inline svgs
      if (!src.startsWith('data:') && !src.startsWith('blob:')) {
        issues.push({
          type: 'BROKEN_RESOURCE',
          src,
          description: `Broken image resource on Page ${pageNumber}: ${src}`
        });
      }
    }
  });

  return {
    page_number: pageNumber,
    file_name: fileName,
    passed: issues.length === 0,
    issues
  };
}

/**
 * Surgical DOM healer function to repair common overflow/clipping in HTML strings.
 */
export function surgicallyHealHtml(html: string, issues: RenderProbeIssue[]): string {
  let healed = html;

  for (const issue of issues) {
    if (issue.type === 'VERTICAL_OVERFLOW' || issue.type === 'ELEMENT_OUT_OF_BOUNDS') {
      const overflow = issue.overflow_px || 20;

      // Rule 1: shrink large SVG heights if present
      if (healed.includes('height="') || healed.includes('max-height:')) {
        healed = healed.replace(/height="(\d+)"/g, (_, h) => {
          const newH = Math.max(180, parseInt(h, 10) - Math.ceil(overflow * 0.8));
          return `height="${newH}"`;
        });
        healed = healed.replace(/max-height:\s*(\d+)px/g, (_, h) => {
          const newH = Math.max(180, parseInt(h, 10) - Math.ceil(overflow * 0.8));
          return `max-height: ${newH}px`;
        });
      }

      // Rule 2: adjust slide-canvas vertical padding or content gap
      if (healed.includes('padding: 64px 80px 80px 80px') || healed.includes('padding: 64px 80px')) {
        healed = healed.replace(/padding:\s*64px\s+80px\s+80px\s+80px/g, 'padding: 44px 80px 54px 80px');
      }

      // Rule 3: reduce large gap spacing
      healed = healed.replace(/gap:\s*32px/g, 'gap: 20px');
      healed = healed.replace(/gap:\s*40px/g, 'gap: 24px');
      healed = healed.replace(/margin-bottom:\s*40px/g, 'margin-bottom: 24px');
      healed = healed.replace(/margin-bottom:\s*32px/g, 'margin-bottom: 18px');

      // Rule 4: trim font sizes slightly if cards are tight
      healed = healed.replace(/font-size:\s*24px/g, 'font-size: 20px');
      healed = healed.replace(/font-size:\s*18px/g, 'font-size: 16px');
      healed = healed.replace(/line-height:\s*1\.6/g, 'line-height: 1.4');
    }

    if (issue.type === 'INTERNAL_CLIPPING') {
      healed = healed.replace(/overflow:\s*hidden/g, 'overflow: visible');
    }
  }

  return healed;
}
