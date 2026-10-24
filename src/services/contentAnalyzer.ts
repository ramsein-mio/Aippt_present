export interface ContentMetrics {
  word_count: number;
  paragraph_count: number;
  distinct_topics_count: number;
  has_explicit_page_request: boolean;
  explicit_page_count?: number;
}

export interface ContentAnalysisResult {
  optimal_slide_count: number;
  reasoning: string;
  metrics: ContentMetrics;
  is_explicit_override: boolean;
}

/**
 * Analyzes semantic and structural density of input text to determine optimal slide count N (4 <= N <= 25).
 */
export function analyzeContentDensity(input: string): ContentAnalysisResult {
  const text = (input || '').trim();

  // 1. Check for explicit slide count in text, e.g. "make a 7-slide deck", "in 9 slides", "10 pages"
  const explicitRegexes = [
    /(?:make|create|generate|present|build|in)\s+(\d+)\s*(?:slides?|pages?|parts?)/i,
    /(\d+)\s*(?:slides?|pages?)\s*(?:presentation|deck|monograph|summary)/i,
    /\b(\d+)\s*(?:slides?|pages?)\b/i
  ];

  let explicitCount: number | undefined;
  for (const rx of explicitRegexes) {
    const match = text.match(rx);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (parsed >= 3 && parsed <= 30) {
        explicitCount = Math.max(4, Math.min(25, parsed));
        break;
      }
    }
  }

  // 2. Extract structural metrics
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  const paragraphs = text
    ? text.split(/\n\s*\n|\r\n\s*\r\n/).filter((p) => p.trim().length > 0)
    : [];
  const paragraphCount = Math.max(1, paragraphs.length);

  // Look for headings, bullets, numbered lists, or subtopics
  const bulletMatches = text.match(/^[\*\-\•\d+\.]\s+[^\n]+/gm) || [];
  const headingMatches = text.match(/^#{1,4}\s+[^\n]+/gm) || [];
  const distinctTopicsCount = Math.max(1, bulletMatches.length + headingMatches.length);

  const metrics: ContentMetrics = {
    word_count: wordCount,
    paragraph_count: paragraphCount,
    distinct_topics_count: distinctTopicsCount,
    has_explicit_page_request: explicitCount !== undefined,
    explicit_page_count: explicitCount
  };

  // 3. Apply Decision Logic
  if (explicitCount !== undefined) {
    return {
      optimal_slide_count: explicitCount,
      reasoning: `User explicitly requested a ${explicitCount}-slide deck.`,
      metrics,
      is_explicit_override: true
    };
  }

  // Content-to-Slide Mapping Heuristics
  // A. Short Prompt / Brief (< 150 words): 5 to 7 slides (1 Cover + 3-5 Content + 1 Closing)
  if (wordCount < 150) {
    const count = distinctTopicsCount >= 3 ? 7 : wordCount < 30 ? 5 : 6;
    return {
      optimal_slide_count: count,
      reasoning: `Brief source content (${wordCount} words): mapped to concise ${count}-slide structure (1 Cover + ${count - 2} Content Pillars + 1 Synthesis).`,
      metrics,
      is_explicit_override: false
    };
  }

  // B. Medium Article / Standard Topic (150 – 600 words or 4-7 subtopics): 8 to 11 slides
  if (wordCount <= 600) {
    let count = Math.min(11, Math.max(8, Math.round(wordCount / 50) + 4));
    if (distinctTopicsCount >= 5) count = Math.max(count, Math.min(11, distinctTopicsCount + 2));
    return {
      optimal_slide_count: count,
      reasoning: `Medium article density (${wordCount} words, ${distinctTopicsCount} subtopics): mapped to comprehensive ${count}-slide architecture.`,
      metrics,
      is_explicit_override: false
    };
  }

  // C. Long Document / Deep Technical (600 – 1500 words or 8-12 subtopics): 12 to 16 slides
  if (wordCount <= 1500) {
    const count = Math.min(16, Math.max(12, Math.round(wordCount / 90) + 4));
    return {
      optimal_slide_count: count,
      reasoning: `Long-form technical document (${wordCount} words): allocated deep-dive ${count}-slide framework.`,
      metrics,
      is_explicit_override: false
    };
  }

  // D. Comprehensive Report / Deep-Dive (> 1500 words): 16 to 24 slides
  const count = Math.min(24, Math.max(16, Math.round(wordCount / 120) + 4));
  return {
    optimal_slide_count: count,
    reasoning: `Extensive technical monograph (${wordCount} words): allocated full ${count}-slide master deck.`,
    metrics,
    is_explicit_override: false
  };
}
