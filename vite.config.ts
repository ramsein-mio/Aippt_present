import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { GoogleGenAI } from '@google/genai';

function aipptServerPlugin(): Plugin {
  return {
    name: 'aippt-server-endpoints',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
        const pathname = url.pathname;

        // Parse JSON body helper
        const readBody = async (): Promise<any> => {
          return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch (err) {
                reject(err);
              }
            });
            req.on('error', reject);
          });
        };

        const json = (data: any, status = 200) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        const getAi = () => {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) {
            return null;
          }
          return new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build'
              }
            }
          });
        };

        try {
          if (pathname === '/api/health') {
            return json({
              status: 'ok',
              hasApiKey: !!process.env.GEMINI_API_KEY,
              model: 'gemini-3.8-flash'
            });
          }

          if (pathname === '/api/gemini/generate-outline' && req.method === 'POST') {
            const body = await readBody();
            const {
              topic,
              pageCount,
              pageCountMode = 'AUTO',
              language = 'en',
              audience = 'general',
              tone = 'informative',
              theme = 'scholarly-deep-blue'
            } = body;
            const ai = getAi();

            if (!ai) {
              return json({ error: 'GEMINI_API_KEY not configured on server' }, 503);
            }

            const prompt = `You are the lead presentation architect for AIPPT Present.
Generate a structured, professional slide outline based on this subject matter:
"${topic}"

Audience: ${audience}
Tone: ${tone}
Language: ${language}
Selected Visual Theme: ${theme}
Requested Slide Count: ${pageCount || 'DYNAMIC AUTO-OPTIMIZED'}
Count Strategy: ${pageCountMode}

Rules for Slide Count & Sizing:
1. One Core Concept per Slide: Never cram multiple unrelated topics, and never add fluff.
2. If Requested Slide Count is provided and mode is MANUAL: produce exactly that number of slides.
3. If mode is AUTO: analyze semantic density and choose optimal N between 4 and 25 slides (short inputs < 150 words -> 5-7 slides; standard 150-600 words -> 8-11 slides; long 600-1500 words -> 12-16 slides; comprehensive > 1500 words -> 16-24 slides).
4. Page 1 must always be layout_type "cover_split_right_image".
5. Last page (Page N) must always be layout_type "takeaway_synthesis_closing".
6. Consecutive slides must never share the same layout_type.

Return valid JSON:
{
  "determined_page_count": ${pageCount || 8},
  "reasoning_for_page_count": "Clear explanation of chosen slide count and content allocation",
  "visual_system": {
    "theme_name": "${theme}",
    "primary_bg": "#0A1128",
    "secondary_bg": "#101F42",
    "accent_color": "#00E5FF",
    "text_primary": "#FFFFFF",
    "text_muted": "#94A3B8",
    "font_family": "Inter, sans-serif"
  },
  "outline": [
    {
      "page_number": 1,
      "file_name": "pages/00.html",
      "title": "Slide title",
      "subtitle": "Informative subtitle",
      "layout_type": "cover_split_right_image",
      "visual_component": "vector_constellation_svg",
      "key_points": ["Point 1", "Point 2"],
      "source_reference": "Verified Framework Reference"
    }
  ]
}`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                temperature: 0.3
              }
            });

            const text = response.text || '{}';
            const parsed = JSON.parse(text);
            return json(parsed);
          }

          if (pathname === '/api/gemini/generate-slide' && req.method === 'POST') {
            const body = await readBody();
            const {
              topic,
              pageNumber,
              totalCount,
              slideMeta,
              visualSystem,
              previousSlideHtml
            } = body;

            const ai = getAi();
            if (!ai) {
              return json({ error: 'GEMINI_API_KEY not configured on server' }, 503);
            }

            const prompt = `You are the master HTML/SVG presentation developer for AIPPT Present.
Generate a complete, self-contained HTML slide (1920x1080 canvas) for Slide #${pageNumber} of ${totalCount}.

Topic: ${topic}
Slide Title: ${slideMeta.title}
Subtitle: ${slideMeta.subtitle || ''}
Layout Type: ${slideMeta.layout_type}
Visual Component: ${slideMeta.visual_component}
Key Points: ${JSON.stringify(slideMeta.key_points || [])}
Source Reference: ${slideMeta.source_reference || 'AIPPT Engineered System'}
Visual Theme: ${JSON.stringify(visualSystem)}

STRICT ANTI-BUG & SIZING RULES:
1. Root element MUST be:
<div class="slide-canvas" style="width: 1920px; height: 1080px; position: relative; overflow: hidden; box-sizing: border-box; padding: 64px 80px 80px 80px; background: ${visualSystem.primary_bg}; color: ${visualSystem.text_primary}; font-family: ${visualSystem.font_family || 'Inter, sans-serif'}; display: flex; flex-direction: column; justify-content: space-between;">
2. Header area must contain eyebrow, title, and slide counter (${pageNumber}/${totalCount}).
3. Footer area MUST stay at bottom with height 50px, containing source reference and logo/topic badge.
4. The central content area MUST NOT exceed 780px in height to prevent any vertical overflow!
5. All SVGs must have viewBox and explicit width/max-height (e.g. max-height: 480px).
6. Modern visual design: Rich vector graphics, glowing gradients, clean border radii (16px), subtle border strokes (1px solid rgba(255,255,255,0.1)), badge pills, and crisp cards.
7. Return pure HTML with NO markdown backticks (no \`\`\`html). Start directly with <!DOCTYPE html> or <div class="slide-canvas">.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                temperature: 0.3
              }
            });

            let html = response.text || '';
            // Strip any accidental markdown formatting
            html = html.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();

            return json({
              pageNumber,
              fileName: `pages/${String(pageNumber - 1).padStart(2, '0')}.html`,
              html
            });
          }

          if (pathname === '/api/gemini/surgical-edit' && req.method === 'POST') {
            const body = await readBody();
            const { html, instruction, issues = [] } = body;
            const ai = getAi();

            if (!ai) {
              return json({ error: 'GEMINI_API_KEY not configured on server' }, 503);
            }

            const prompt = `You are the self-healing and surgical code editor for AIPPT Present.
Edit this 1920x1080 slide HTML according to instructions and render-probe issues.

Reported Issues to Fix:
${JSON.stringify(issues, null, 2)}

User Instruction:
${instruction || 'Self-heal DOM overflow and element clipping. Adjust padding, gaps, or SVG heights so canvas fits within 1080px exactly.'}

Current Slide HTML:
${html}

Rules:
1. Ensure the canvas remains exactly 1920x1080 with overflow: hidden.
2. Resolve any vertical overflow (reduce font sizes, card padding, or SVG max-height).
3. Preserve aesthetic harmony and colors.
4. Return ONLY the repaired complete HTML, with NO markdown backticks.`;

            const response = await ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                temperature: 0.2
              }
            });

            let fixedHtml = response.text || '';
            fixedHtml = fixedHtml.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();

            return json({
              success: true,
              fixedHtml
            });
          }

        } catch (error: any) {
          const isRateLimit =
            error?.status === 429 ||
            String(error?.message).includes('429') ||
            String(error?.message).includes('RESOURCE_EXHAUSTED') ||
            String(error?.message).includes('Quota exceeded');

          if (isRateLimit) {
            return json(
              {
                rateLimited: true,
                error: 'Gemini Free Tier rate limit (5 RPM) reached. Fallback to structural synthesis.'
              },
              429
            );
          }

          console.error('[API Error]', error?.message || error);
          return json({ error: error?.message || 'Internal Server Error' }, 500);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    aipptServerPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true
  }
});
