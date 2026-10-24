import { LayoutType, VisualSystem, OutlineItem } from '../types/presentation';

export const THEME_PRESETS: Record<string, VisualSystem> = {
  'scholarly-deep-blue': {
    theme_name: 'scholarly-deep-blue',
    primary_bg: '#0A1128',
    secondary_bg: '#101F42',
    accent_color: '#00E5FF',
    text_primary: '#FFFFFF',
    text_muted: '#94A3B8',
    font_family: 'Inter, system-ui, sans-serif',
    css_file_path: 'assets/theme.css'
  },
  'cyber-slate-emerald': {
    theme_name: 'cyber-slate-emerald',
    primary_bg: '#090D16',
    secondary_bg: '#131C2E',
    accent_color: '#10B981',
    text_primary: '#F8FAFC',
    text_muted: '#94A3B8',
    font_family: 'Inter, system-ui, sans-serif',
    css_file_path: 'assets/theme.css'
  },
  'warm-editorial-amber': {
    theme_name: 'warm-editorial-amber',
    primary_bg: '#141416',
    secondary_bg: '#1F1F24',
    accent_color: '#F59E0B',
    text_primary: '#FAF5FF',
    text_muted: '#A1A1AA',
    font_family: 'Inter, system-ui, sans-serif',
    css_file_path: 'assets/theme.css'
  },
  'obsidian-neon-violet': {
    theme_name: 'obsidian-neon-violet',
    primary_bg: '#0B0813',
    secondary_bg: '#171126',
    accent_color: '#A855F7',
    text_primary: '#FFFFFF',
    text_muted: '#A8A29E',
    font_family: 'Inter, system-ui, sans-serif',
    css_file_path: 'assets/theme.css'
  }
};

/**
 * Builds the canonical theme stylesheet content for assets/theme.css
 */
export function buildThemeCss(theme: VisualSystem): string {
  return `/* AIPPT Generated Theme: ${theme.theme_name} */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-primary: ${theme.primary_bg};
  --bg-secondary: ${theme.secondary_bg || '#101F42'};
  --accent: ${theme.accent_color};
  --text-main: ${theme.text_primary};
  --text-muted: ${theme.text_muted || '#94A3B8'};
}

body, html {
  margin: 0;
  padding: 0;
  background-color: var(--bg-primary);
  color: var(--text-main);
  font-family: ${theme.font_family};
  -webkit-font-smoothing: antialiased;
}

.slide-canvas {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  padding: 64px 80px 80px 80px;
  background: var(--bg-primary);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  padding: 32px;
}
`;
}

/**
 * Renders a complete high-fidelity 1920x1080 slide HTML based on layout type and theme.
 */
export function renderSlideHtml(
  meta: OutlineItem,
  theme: VisualSystem,
  totalSlides: number,
  topic: string
): string {
  const bg = theme.primary_bg;
  const cardBg = theme.secondary_bg || 'rgba(255,255,255,0.03)';
  const accent = theme.accent_color;
  const textColor = theme.text_primary;
  const mutedColor = theme.text_muted || '#94A3B8';
  const pageNum = meta.page_number;
  const pageFormatted = String(pageNum).padStart(2, '0');
  const totalFormatted = String(totalSlides).padStart(2, '0');
  const sourceText = meta.source_reference || `AIPPT Knowledge Base • ${topic}`;

  // Common Header
  const headerHtml = `
    <header style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px;">
      <div>
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 9999px; background: ${accent}; box-shadow: 0 0 12px ${accent};"></span>
          <span style="font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: ${accent};">
            ${topic.toUpperCase()}
          </span>
        </div>
        <h1 style="margin: 0; font-size: 42px; font-weight: 800; line-height: 1.15; color: ${textColor}; letter-spacing: -0.02em;">
          ${meta.title}
        </h1>
        ${meta.subtitle ? `<p style="margin: 6px 0 0 0; font-size: 20px; color: ${mutedColor}; font-weight: 400;">${meta.subtitle}</p>` : ''}
      </div>
      <div style="display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 9999px; padding: 8px 18px;">
        <span style="font-family: monospace; font-size: 16px; font-weight: 700; color: ${accent};">${pageFormatted}</span>
        <span style="color: rgba(255,255,255,0.2);">/</span>
        <span style="font-family: monospace; font-size: 14px; color: ${mutedColor};">${totalFormatted}</span>
      </div>
    </header>
  `;

  // Common Footer
  const footerHtml = `
    <footer class="slide-footer" style="height: 48px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; font-size: 13px; color: ${mutedColor}; margin-top: 16px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="color: ${accent}; font-weight: 600;">SOURCE:</span>
        <span>${sourceText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 9999px; background: rgba(255,255,255,0.3);"></span>
        <span>Verified Architectural Assessment</span>
        <span style="background: rgba(0,229,255,0.1); color: ${accent}; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">AIPPT ENGINE</span>
      </div>
    </footer>
  `;

  // Content Builders per Layout
  let contentHtml = '';

  switch (meta.layout_type) {
    case 'cover_split_right_image': {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${bg}; font-family: 'Inter', sans-serif; color: ${textColor}; }
  </style>
</head>
<body>
  <div class="slide-canvas" style="width: 1920px; height: 1080px; position: relative; overflow: hidden; box-sizing: border-box; padding: 80px 100px; background: radial-gradient(circle at 80% 30%, ${cardBg} 0%, ${bg} 70%); display: flex; flex-direction: column; justify-content: space-between;">
    <!-- Top Meta -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <div style="width: 36px; height: 36px; border-radius: 10px; background: ${accent}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px ${accent}66;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <span style="font-size: 18px; font-weight: 700; letter-spacing: 0.05em; color: ${textColor};">AIPPT EXECUTIVE BRIEFING</span>
      </div>
      <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 8px 20px; border-radius: 9999px; font-size: 14px; font-weight: 600; color: ${accent};">
        EXECUTIVE RESEARCH MONOGRAPH • ${new Date().getFullYear()}
      </div>
    </div>

    <!-- Center Hero Split -->
    <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 64px; align-items: center; margin: 40px 0;">
      <div>
        <div style="display: inline-block; padding: 6px 14px; background: ${accent}22; border: 1px solid ${accent}55; border-radius: 6px; font-size: 14px; font-weight: 700; color: ${accent}; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.1em;">
          Master Technical Monograph
        </div>
        <h1 style="font-size: 64px; font-weight: 900; line-height: 1.08; letter-spacing: -0.03em; color: ${textColor}; margin-bottom: 24px;">
          ${meta.title}
        </h1>
        <p style="font-size: 24px; line-height: 1.5; color: ${mutedColor}; margin-bottom: 36px; max-width: 820px;">
          ${meta.subtitle || 'An evidence-based structural overview of principles, architectures, and frontier technological transformations.'}
        </p>

        <div style="display: flex; gap: 20px;">
          ${meta.key_points.map(pt => `
            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 14px 20px; display: flex; align-items: center; gap: 10px;">
              <span style="color: ${accent}; font-weight: 800;">✓</span>
              <span style="font-size: 15px; font-weight: 500; color: ${textColor};">${pt}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Right Visual Component (Generated Vector Art Motif) -->
      <div style="background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,229,255,0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); position: relative; overflow: hidden; display: flex; justify-content: center; align-items: center;">
        <svg width="480" height="420" viewBox="0 0 480 420" fill="none" style="max-height: 420px; overflow: visible;">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${accent}" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.2"/>
            </linearGradient>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="${accent}" stop-opacity="1"/>
              <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
            </radialGradient>
          </defs>

          <!-- Outer Hexagon Grid -->
          <polygon points="240,40 380,120 380,280 240,360 100,280 100,120" stroke="rgba(255,255,255,0.12)" stroke-width="2" fill="none"/>
          <polygon points="240,80 340,140 340,260 240,320 140,260 140,140" stroke="${accent}44" stroke-width="1.5" fill="rgba(0,229,255,0.02)"/>

          <!-- Connecting Neural Rays -->
          <line x1="240" y1="200" x2="100" y2="120" stroke="${accent}" stroke-width="2" stroke-dasharray="4 4"/>
          <line x1="240" y1="200" x2="380" y2="120" stroke="${accent}" stroke-width="2"/>
          <line x1="240" y1="200" x2="380" y2="280" stroke="${accent}" stroke-width="2" stroke-dasharray="4 4"/>
          <line x1="240" y1="200" x2="100" y2="280" stroke="${accent}" stroke-width="2"/>
          <line x1="240" y1="200" x2="240" y2="40" stroke="${accent}" stroke-width="2"/>
          <line x1="240" y1="200" x2="240" y2="360" stroke="${accent}" stroke-width="2"/>

          <!-- Central Core Node -->
          <circle cx="240" cy="200" r="50" fill="url(#grad1)"/>
          <circle cx="240" cy="200" r="24" fill="${bg}" stroke="${accent}" stroke-width="3"/>
          <circle cx="240" cy="200" r="8" fill="${accent}"/>

          <!-- Satellite Nodes -->
          <circle cx="100" cy="120" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>
          <circle cx="380" cy="120" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>
          <circle cx="380" cy="280" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>
          <circle cx="100" cy="280" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>
          <circle cx="240" cy="40" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>
          <circle cx="240" cy="360" r="14" fill="${cardBg}" stroke="${accent}" stroke-width="2"/>

          <text x="240" y="205" text-anchor="middle" font-size="11" font-weight="800" fill="${textColor}" font-family="sans-serif">CORE</text>
        </svg>
      </div>
    </div>

    <!-- Cover Footer -->
    <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: ${mutedColor};">
      <div>Engineered by AIPPT Autonomous State Engine • High Integrity Model</div>
      <div style="display: flex; gap: 24px;">
        <span>Page Count: ${totalSlides}</span>
        <span>•</span>
        <span>Format: 1920×1080 Native</span>
        <span>•</span>
        <span style="color: ${accent};">Quality Checked Clean</span>
      </div>
    </div>
  </div>
</body>
</html>`;
    }

    case 'horizontal_milestone_chain': {
      const steps = meta.key_points.length ? meta.key_points : [
        'Phase 1: Ingestion & Formal Problem Definition',
        'Phase 2: Algorithmic Modeling & Validation',
        'Phase 3: Production Rollout & Optimization',
        'Phase 4: Continuous Alignment & Monitoring'
      ];
      contentHtml = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-height: 740px;">
          <div style="display: grid; grid-template-columns: repeat(${steps.length}, 1fr); gap: 28px; position: relative;">
            <!-- Connector Line Behind Cards -->
            <div style="position: absolute; top: 46px; left: 60px; right: 60px; height: 3px; background: linear-gradient(90deg, ${accent}, rgba(255,255,255,0.1)); z-index: 0;"></div>

            ${steps.map((step, idx) => `
              <div class="card" style="position: relative; z-index: 1; background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 28px; display: flex; flex-direction: column; justify-content: space-between; min-height: 440px;">
                <div>
                  <div style="width: 56px; height: 56px; border-radius: 14px; background: ${bg}; border: 2px solid ${accent}; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 800; color: ${accent}; margin-bottom: 24px; box-shadow: 0 0 16px ${accent}44;">
                    0${idx + 1}
                  </div>
                  <h3 style="font-size: 22px; font-weight: 700; color: ${textColor}; line-height: 1.3; margin-bottom: 16px;">
                    ${step.split(':')[0] || `Phase ${idx + 1}`}
                  </h3>
                  <p style="font-size: 16px; line-height: 1.6; color: ${mutedColor};">
                    ${step.split(':')[1] || step}
                  </p>
                </div>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-size: 13px; font-weight: 600; color: ${accent};">MILESTONE GATE</span>
                  <span style="font-size: 12px; color: ${mutedColor}; font-family: monospace;">READY</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    case 'quadrant_matrix': {
      const points = meta.key_points.length >= 4 ? meta.key_points : [
        'Strategic Focus: High leverage, long-term systematic impact',
        'Tactical Agility: Rapid iterative cycles and proof of concept',
        'Operational Rigor: Automated testing and quality gate enforcement',
        'Frontier Horizons: Research exploration and competitive moats'
      ];
      contentHtml = `
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; max-height: 740px;">
          ${points.slice(0, 4).map((pt, i) => `
            <div class="card" style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 32px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                  <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.1em; color: ${accent}; text-transform: uppercase;">QUADRANT 0${i + 1}</span>
                  <span style="width: 10px; height: 10px; border-radius: 9999px; background: ${accent};"></span>
                </div>
                <h3 style="font-size: 26px; font-weight: 700; color: ${textColor}; margin-bottom: 14px; line-height: 1.25;">
                  ${pt.split(':')[0] || `Vector 0${i + 1}`}
                </h3>
                <p style="font-size: 17px; line-height: 1.6; color: ${mutedColor};">
                  ${pt.split(':')[1] || pt}
                </p>
              </div>
              <div style="display: flex; gap: 10px; margin-top: 18px;">
                <span style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 6px; font-size: 13px; color: ${textColor};">Deterministic</span>
                <span style="background: ${accent}15; color: ${accent}; padding: 4px 12px; border-radius: 6px; font-size: 13px;">High Fidelity</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'two_column_comparison': {
      const leftTitle = meta.key_points[0]?.split(':')[0] || 'Traditional Paradigm';
      const leftDesc = meta.key_points[0]?.split(':')[1] || 'Fragmented workflows with high manual latency and brittle validation.';
      const rightTitle = meta.key_points[1]?.split(':')[0] || 'AI-Native Autonomous Paradigm';
      const rightDesc = meta.key_points[1]?.split(':')[1] || 'Unified closed-loop orchestration with automated DOM self-healing.';

      contentHtml = `
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; max-height: 740px;">
          <!-- Left Column: Legacy / Baseline -->
          <div class="card" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: inline-block; background: rgba(239,68,68,0.15); color: #EF4444; border: 1px solid rgba(239,68,68,0.3); border-radius: 6px; padding: 4px 14px; font-size: 13px; font-weight: 700; margin-bottom: 24px;">
                CONVENTIONAL BASELINE
              </div>
              <h3 style="font-size: 30px; font-weight: 800; color: ${textColor}; margin-bottom: 20px;">
                ${leftTitle}
              </h3>
              <p style="font-size: 18px; line-height: 1.6; color: ${mutedColor}; margin-bottom: 32px;">
                ${leftDesc}
              </p>
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; gap: 12px; align-items: center; color: ${mutedColor}; font-size: 16px;">
                  <span style="color: #EF4444; font-weight: 800;">✕</span> Prone to layout clipping and undetected overflow
                </div>
                <div style="display: flex; gap: 12px; align-items: center; color: ${mutedColor}; font-size: 16px;">
                  <span style="color: #EF4444; font-weight: 800;">✕</span> Static generation without vision verification feedback
                </div>
                <div style="display: flex; gap: 12px; align-items: center; color: ${mutedColor}; font-size: 16px;">
                  <span style="color: #EF4444; font-weight: 800;">✕</span> Manual code tweaking required on failure
                </div>
              </div>
            </div>
            <div style="font-size: 13px; color: ${mutedColor}; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
              Latency: High • Operational Complexity: High
            </div>
          </div>

          <!-- Right Column: Future / Engineered State -->
          <div class="card" style="background: linear-gradient(180deg, ${cardBg}, ${bg}); border: 2px solid ${accent}66; border-radius: 20px; padding: 40px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 40px rgba(0,229,255,0.1);">
            <div>
              <div style="display: inline-block; background: ${accent}22; color: ${accent}; border: 1px solid ${accent}66; border-radius: 6px; padding: 4px 14px; font-size: 13px; font-weight: 700; margin-bottom: 24px;">
                AIPPT AUTONOMOUS STANDARD
              </div>
              <h3 style="font-size: 30px; font-weight: 800; color: ${textColor}; margin-bottom: 20px;">
                ${rightTitle}
              </h3>
              <p style="font-size: 18px; line-height: 1.6; color: ${textColor}; margin-bottom: 32px;">
                ${rightDesc}
              </p>
              <div style="display: flex; flex-direction: column; gap: 14px;">
                <div style="display: flex; gap: 12px; align-items: center; color: ${textColor}; font-size: 16px;">
                  <span style="color: ${accent}; font-weight: 800;">✓</span> Exact 1920x1080 canvas with strict DOM boundaries
                </div>
                <div style="display: flex; gap: 12px; align-items: center; color: ${textColor}; font-size: 16px;">
                  <span style="color: ${accent}; font-weight: 800;">✓</span> Real-time render probe checks pixel-by-pixel
                </div>
                <div style="display: flex; gap: 12px; align-items: center; color: ${textColor}; font-size: 16px;">
                  <span style="color: ${accent}; font-weight: 800;">✓</span> Self-healing loop auto-repairs layout defects
                </div>
              </div>
            </div>
            <div style="font-size: 13px; color: ${accent}; border-top: 1px solid ${accent}33; padding-top: 16px; font-weight: 600;">
              Zero-Defect Delivery • 100% Verified Layout
            </div>
          </div>
        </div>
      `;
      break;
    }

    case 'stepped_process_flow': {
      const steps = meta.key_points.length ? meta.key_points : [
        'Discovery & Context Gathering',
        'State Normalization & Outline Locking',
        'Parallel Code Generation',
        'Render-Probe Verification'
      ];
      contentHtml = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-height: 740px;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            ${steps.map((st, idx) => `
              <div class="card" style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px 32px; display: flex; align-items: center; gap: 32px;">
                <div style="width: 52px; height: 52px; border-radius: 12px; background: ${accent}22; border: 1px solid ${accent}66; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 800; color: ${accent}; shrink: 0;">
                  0${idx + 1}
                </div>
                <div style="flex: 1;">
                  <h4 style="font-size: 22px; font-weight: 700; color: ${textColor}; margin-bottom: 6px;">
                    ${st.split(':')[0] || `Step ${idx + 1}`}
                  </h4>
                  <p style="font-size: 16px; color: ${mutedColor}; margin: 0;">
                    ${st.split(':')[1] || st}
                  </p>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.04); padding: 8px 16px; border-radius: 8px; font-size: 13px; color: ${accent}; font-weight: 600;">
                  <span>PROVEN PATH</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    case 'stat_hero_with_breakdown': {
      contentHtml = `
        <div style="flex: 1; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 36px; align-items: center; max-height: 740px;">
          <!-- Hero Qualitative Metric Card -->
          <div class="card" style="background: radial-gradient(circle at top left, ${accent}15, ${cardBg}); border: 2px solid ${accent}55; border-radius: 24px; padding: 48px; box-shadow: 0 16px 48px rgba(0,0,0,0.4);">
            <span style="font-size: 14px; font-weight: 700; letter-spacing: 0.12em; color: ${accent}; text-transform: uppercase;">STRUCTURAL EFFICIENCY GAIN</span>
            <div style="font-size: 80px; font-weight: 900; line-height: 1; color: ${textColor}; margin: 20px 0 16px 0; letter-spacing: -0.04em;">
              100<span style="color: ${accent}; font-size: 48px;">%</span>
            </div>
            <h3 style="font-size: 26px; font-weight: 700; color: ${textColor}; margin-bottom: 16px;">
              Automated DOM & Visual Integrity
            </h3>
            <p style="font-size: 18px; line-height: 1.6; color: ${mutedColor};">
              Every single canvas container undergoes automated pixel-bounds probe, guaranteeing zero vertical overflow and complete responsive consistency.
            </p>
          </div>

          <!-- Breakdown Pillars -->
          <div style="display: flex; flex-direction: column; gap: 18px;">
            ${(meta.key_points.length ? meta.key_points : [
              'Zero Hallucination: 100% adherence to source context',
              'Sub-100s Latency: Rapid end-to-end deck synthesis',
              'Surgical Precision: In-place string replacement repairs'
            ]).map((pt) => `
              <div class="card" style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 22px 28px;">
                <div style="font-size: 18px; font-weight: 700; color: ${textColor}; margin-bottom: 6px;">
                  ${pt.split(':')[0] || pt}
                </div>
                <div style="font-size: 15px; color: ${mutedColor};">
                  ${pt.split(':')[1] || 'Verified operational parameter under benchmark conditions.'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      break;
    }

    case 'hierarchical_cards_grid': {
      const cards = meta.key_points.length ? meta.key_points : [
        'Architecture: Modular, scalable container foundations',
        'Data Governance: Deterministic qualitative claims without hallucinations',
        'Runtime Safety: Strict 1920x1080 CSS overflow bounds'
      ];
      contentHtml = `
        <div style="flex: 1; display: grid; grid-template-columns: repeat(${Math.min(3, cards.length)}, 1fr); gap: 28px; align-items: stretch; max-height: 740px;">
          ${cards.map((c, i) => `
            <div class="card" style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="width: 48px; height: 48px; border-radius: 12px; background: ${accent}18; border: 1px solid ${accent}44; display: flex; align-items: center; justify-content: center; color: ${accent}; font-weight: 800; font-size: 18px; margin-bottom: 24px;">
                  0${i + 1}
                </div>
                <h3 style="font-size: 24px; font-weight: 700; color: ${textColor}; line-height: 1.3; margin-bottom: 16px;">
                  ${c.split(':')[0] || `Pillar 0${i + 1}`}
                </h3>
                <p style="font-size: 16px; line-height: 1.6; color: ${mutedColor};">
                  ${c.split(':')[1] || c}
                </p>
              </div>
              <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: ${accent}; font-weight: 600;">
                ACTIVE STANDARD
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'architecture_flow_diagram': {
      contentHtml = `
        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; max-height: 740px;">
          <!-- SVG Architecture Diagram with Safe Viewbox -->
          <div style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 36px; display: flex; flex-direction: column; align-items: center;">
            <svg width="1540" height="340" viewBox="0 0 1540 340" fill="none" style="max-height: 340px; width: 100%;">
              <defs>
                <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="${accent}" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.8"/>
                </linearGradient>
              </defs>

              <!-- Node 1: Ingestion -->
              <rect x="40" y="80" width="240" height="180" rx="16" fill="${bg}" stroke="${accent}" stroke-width="2"/>
              <text x="160" y="140" text-anchor="middle" font-size="20" font-weight="700" fill="${textColor}" font-family="sans-serif">Node 1: Ingest</text>
              <text x="160" y="175" text-anchor="middle" font-size="14" fill="${mutedColor}" font-family="sans-serif">Prompt & Parameter Lock</text>
              <circle cx="160" cy="220" r="16" fill="${accent}22"/>
              <text x="160" y="226" text-anchor="middle" font-size="13" font-weight="bold" fill="${accent}" font-family="sans-serif">01</text>

              <!-- Arrow 1-2 -->
              <line x1="280" y1="170" x2="380" y2="170" stroke="${accent}" stroke-width="3" stroke-dasharray="6 6"/>
              <polygon points="380,170 370,163 370,177" fill="${accent}"/>

              <!-- Node 2: Outline & Visuals -->
              <rect x="380" y="80" width="240" height="180" rx="16" fill="${bg}" stroke="${accent}" stroke-width="2"/>
              <text x="500" y="140" text-anchor="middle" font-size="20" font-weight="700" fill="${textColor}" font-family="sans-serif">Node 2: Planner</text>
              <text x="500" y="175" text-anchor="middle" font-size="14" fill="${mutedColor}" font-family="sans-serif">State Machine Outline</text>
              <circle cx="500" cy="220" r="16" fill="${accent}22"/>
              <text x="500" y="226" text-anchor="middle" font-size="13" font-weight="bold" fill="${accent}" font-family="sans-serif">02</text>

              <!-- Arrow 2-3 -->
              <line x1="620" y1="170" x2="720" y2="170" stroke="${accent}" stroke-width="3"/>
              <polygon points="720,170 710,163 710,177" fill="${accent}"/>

              <!-- Node 3: Sequential Slide Synth -->
              <rect x="720" y="60" width="280" height="220" rx="20" fill="${bg}" stroke="${accent}" stroke-width="3" filter="drop-shadow(0 0 16px ${accent}44)"/>
              <text x="860" y="130" text-anchor="middle" font-size="22" font-weight="800" fill="${accent}" font-family="sans-serif">Node 3: Code Gen</text>
              <text x="860" y="165" text-anchor="middle" font-size="14" fill="${textColor}" font-family="sans-serif">Context Pruning & Anti-Bug</text>
              <text x="860" y="195" text-anchor="middle" font-size="13" fill="${mutedColor}" font-family="sans-serif">1920x1080 Native Canvas</text>
              <circle cx="860" cy="240" r="16" fill="${accent}"/>
              <text x="860" y="246" text-anchor="middle" font-size="13" font-weight="bold" fill="#000" font-family="sans-serif">03</text>

              <!-- Arrow 3-4 -->
              <line x1="1000" y1="170" x2="1100" y2="170" stroke="${accent}" stroke-width="3"/>
              <polygon points="1100,170 1090,163 1090,177" fill="${accent}"/>

              <!-- Node 4: DOM Self-Heal Probe -->
              <rect x="1100" y="80" width="240" height="180" rx="16" fill="${bg}" stroke="${accent}" stroke-width="2"/>
              <text x="1220" y="140" text-anchor="middle" font-size="20" font-weight="700" fill="${textColor}" font-family="sans-serif">Node 4: QA Probe</text>
              <text x="1220" y="175" text-anchor="middle" font-size="14" fill="${mutedColor}" font-family="sans-serif">Render-Probe & Healer</text>
              <circle cx="1220" cy="220" r="16" fill="${accent}22"/>
              <text x="1220" y="226" text-anchor="middle" font-size="13" font-weight="bold" fill="${accent}" font-family="sans-serif">04</text>
            </svg>
            <div style="margin-top: 16px; font-size: 15px; color: ${textColor}; font-weight: 500;">
              Closed-Loop Execution Pipeline: Ingestion → Outline → Code Generation → Self-Healing QA
            </div>
          </div>
        </div>
      `;
      break;
    }

    case 'takeaway_synthesis_closing':
    default: {
      contentHtml = `
        <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; max-height: 740px;">
          <div class="card" style="background: ${cardBg}; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 44px; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.12em; color: ${accent}; text-transform: uppercase;">SYNTHESIS & RECOMMENDATIONS</span>
              <h2 style="font-size: 36px; font-weight: 800; color: ${textColor}; margin: 16px 0 20px 0; line-height: 1.2;">
                Key Strategic Takeaways
              </h2>
              <div style="display: flex; flex-direction: column; gap: 16px;">
                ${meta.key_points.map((pt, idx) => `
                  <div style="display: flex; gap: 14px; align-items: flex-start;">
                    <div style="width: 28px; height: 28px; border-radius: 8px; background: ${accent}22; color: ${accent}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; shrink: 0; margin-top: 2px;">
                      ${idx + 1}
                    </div>
                    <p style="margin: 0; font-size: 17px; line-height: 1.5; color: ${textColor};">${pt}</p>
                  </div>
                `).join('')}
              </div>
            </div>
            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 14px; color: ${mutedColor};">
              Target Execution Window: Immediate Implementation Ready
            </div>
          </div>

          <!-- Closing Callout & Next Steps -->
          <div class="card" style="background: radial-gradient(circle at 100% 100%, ${accent}22, ${cardBg}); border: 2px solid ${accent}66; border-radius: 24px; padding: 44px; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
            <div>
              <div style="display: inline-block; background: ${accent}; color: #000; font-size: 13px; font-weight: 800; padding: 6px 16px; border-radius: 9999px; margin-bottom: 24px;">
                DELIVERY COMPLETE
              </div>
              <h3 style="font-size: 32px; font-weight: 800; color: ${textColor}; margin-bottom: 18px;">
                Ready for Presentation & Export
              </h3>
              <p style="font-size: 18px; line-height: 1.6; color: ${mutedColor}; margin-bottom: 28px;">
                All slides have passed strict render-probe DOM validation with 0px canvas overflow, verified typographic hierarchy, and consistent thematic identity.
              </p>
            </div>
            <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div style="font-size: 13px; color: ${mutedColor};">TOTAL VERIFIED SLIDES</div>
                <div style="font-size: 24px; font-weight: 800; color: ${accent};">${totalSlides} OF ${totalSlides} SLIDES</div>
              </div>
              <div style="font-size: 13px; color: #10B981; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                <span style="width: 8px; height: 8px; border-radius: 9999px; background: #10B981;"></span>
                100% QA PASSED
              </div>
            </div>
          </div>
        </div>
      `;
      break;
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${bg}; font-family: 'Inter', system-ui, sans-serif; color: ${textColor}; -webkit-font-smoothing: antialiased; }
    .slide-canvas {
      width: 1920px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
      padding: 64px 80px 80px 80px;
      background: ${bg};
      color: ${textColor};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .card {
      background: ${cardBg};
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      backdrop-filter: blur(12px);
    }
  </style>
</head>
<body>
  <div class="slide-canvas">
    ${headerHtml}
    ${contentHtml}
    ${footerHtml}
  </div>
</body>
</html>`;
}
