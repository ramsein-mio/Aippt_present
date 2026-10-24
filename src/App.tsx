import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { MissionProgressTracker } from './components/MissionProgressTracker';
import { AgentActivityDrawer } from './components/AgentActivityDrawer';
import { SlidePreviewViewer } from './components/SlidePreviewViewer';
import { SlideCarousel } from './components/SlideCarousel';
import { ParameterLockingModal } from './components/ParameterLockingModal';
import { SurgicalEditorModal } from './components/SurgicalEditorModal';
import { PresentationMode } from './components/PresentationMode';
import { DeliveryReportModal } from './components/DeliveryReportModal';
import {
  PresentationState,
  ToolExecution,
  VisualSystem,
  LockedParams
} from './types/presentation';
import {
  createInitialState,
  PresentationOrchestrator
} from './services/orchestrator';
import { THEME_PRESETS, renderSlideHtml } from './services/templates';
import { inspectSlideDom } from './services/renderProbe';

export function App() {
  const [state, setState] = useState<PresentationState>(() =>
    createInitialState('Artificial Intelligence: Foundations, History & Frontiers')
  );
  const [toolCalls, setToolCalls] = useState<ToolExecution[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // Modals state
  const [isParamsOpen, setIsParamsOpen] = useState(false);
  const [isSurgicalOpen, setIsSurgicalOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const orchestratorRef = useRef<PresentationOrchestrator | null>(null);

  // Initialize and run orchestrator on mount
  useEffect(() => {
    const orchestrator = new PresentationOrchestrator(state, {
      onStateChange: (newState) => setState(newState),
      onToolCall: (tool) =>
        setToolCalls((prev) => {
          const idx = prev.findIndex((t) => t.id === tool.id);
          if (idx >= 0) {
            const next = [...prev];
            next[idx] = { ...tool };
            return next;
          }
          return [...prev, tool];
        }),
      onLog: (msg) => setLogs((prev) => [...prev.slice(-40), msg])
    });

    orchestratorRef.current = orchestrator;
    orchestrator.runFullPipeline();

    return () => {
      orchestrator.cancel();
    };
  }, []);

  // Keyboard navigation for active slide
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPresentationOpen || isParamsOpen || isSurgicalOpen || isReportOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight') {
        setState((prev) => ({
          ...prev,
          active_page_index: Math.min(prev.locked_params.page_count - 1, prev.active_page_index + 1)
        }));
      } else if (e.key === 'ArrowLeft') {
        setState((prev) => ({
          ...prev,
          active_page_index: Math.max(0, prev.active_page_index - 1)
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationOpen, isParamsOpen, isSurgicalOpen, isReportOpen]);

  // Restart pipeline with new parameters
  const handleConfirmParams = useCallback((topic: string, params: LockedParams, themeKey: string) => {
    setIsParamsOpen(false);
    const chosenTheme = THEME_PRESETS[themeKey] || THEME_PRESETS['scholarly-deep-blue'];

    setState((prev) => ({
      ...prev,
      topic,
      locked_params: params,
      visual_system: chosenTheme,
      outline: [],
      generated_pages: {},
      status: 'INITIALIZING',
      active_page_index: 0
    }));

    setToolCalls([]);
    setLogs([]);

    if (orchestratorRef.current) {
      orchestratorRef.current.cancel();
    }

    const newOrchestrator = new PresentationOrchestrator(
      {
        ...createInitialState(topic),
        locked_params: params,
        visual_system: chosenTheme
      },
      {
        onStateChange: (newState) => setState(newState),
        onToolCall: (tool) =>
          setToolCalls((prev) => {
            const idx = prev.findIndex((t) => t.id === tool.id);
            if (idx >= 0) {
              const next = [...prev];
              next[idx] = { ...tool };
              return next;
            }
            return [...prev, tool];
          }),
        onLog: (msg) => setLogs((prev) => [...prev.slice(-40), msg])
      }
    );

    orchestratorRef.current = newOrchestrator;
    newOrchestrator.runFullPipeline(topic, { ...params, theme: themeKey });
  }, []);

  // Theme change
  const handleThemeChange = (newTheme: VisualSystem) => {
    setState((prev) => {
      const updatedPages: Record<number, any> = {};
      Object.entries(prev.generated_pages).forEach(([k, page]) => {
        const meta = prev.outline[parseInt(k, 10)];
        if (meta) {
          const newHtml = renderSlideHtml(meta, newTheme, prev.locked_params.page_count, prev.topic);
          updatedPages[parseInt(k, 10)] = { ...page, html: newHtml };
        } else {
          updatedPages[parseInt(k, 10)] = page;
        }
      });
      return {
        ...prev,
        visual_system: newTheme,
        generated_pages: updatedPages
      };
    });
  };

  // Surgical edit on active slide
  const handleApplySurgicalEdit = async (pageIndex: number, instruction: string) => {
    if (orchestratorRef.current) {
      await orchestratorRef.current.performSurgicalEdit(pageIndex, instruction);
    }
  };

  // Re-run DOM render-probe
  const handleReProbe = () => {
    const page = state.generated_pages[state.active_page_index];
    if (!page || !page.html) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(page.html, 'text/html');
    const result = inspectSlideDom(doc, page.page_number, page.file_path);

    setState((prev) => ({
      ...prev,
      generated_pages: {
        ...prev.generated_pages,
        [prev.active_page_index]: {
          ...page,
          probe_result: result
        }
      }
    }));
  };

  // Export 1: Standalone HTML presentation package
  const handleDownloadHtmlDeck = () => {
    const slidesData = Object.values(state.generated_pages).map((p) => p.html);
    if (!slidesData.length) return;

    const fullPackage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${state.topic} - AIPPT Presentation</title>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: sans-serif; }
    .slide-viewer { width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; }
    .slide-frame { width: 1920px; height: 1080px; transform-origin: center center; position: absolute; }
    .controls { position: fixed; bottom: 20px; right: 20px; z-index: 100; display: flex; gap: 8px; background: rgba(0,0,0,0.7); padding: 8px 16px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.2); color: white; }
    button { background: transparent; border: none; color: white; font-size: 16px; cursor: pointer; padding: 4px 8px; }
  </style>
</head>
<body>
  <div class="slide-viewer" id="viewer"></div>
  <div class="controls">
    <button onclick="prev()">❮ Prev</button>
    <span id="counter" style="line-height: 28px; font-weight: bold; font-family: monospace;">1 / ${slidesData.length}</span>
    <button onclick="next()">Next ❯</button>
  </div>
  <script>
    const slides = ${JSON.stringify(slidesData)};
    let current = 0;
    const viewer = document.getElementById('viewer');
    const counter = document.getElementById('counter');

    function render() {
      viewer.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.className = 'slide-frame';
      iframe.style.border = 'none';
      iframe.srcdoc = slides[current];
      viewer.appendChild(iframe);
      scaleIframe(iframe);
      counter.innerText = (current + 1) + ' / ' + slides.length;
    }

    function scaleIframe(iframe) {
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      iframe.style.transform = 'scale(' + s + ')';
    }

    function next() { if (current < slides.length - 1) { current++; render(); } }
    function prev() { if (current > 0) { current--; render(); } }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') next();
      if (e.key === 'ArrowLeft') prev();
    });
    window.addEventListener('resize', () => {
      const iframe = viewer.querySelector('iframe');
      if (iframe) scaleIframe(iframe);
    });
    render();
  </script>
</body>
</html>`;

    const blob = new Blob([fullPackage], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIPPT_${state.topic.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export 2: Print PDF
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const slidesHtml = Object.values(state.generated_pages)
      .map(
        (p) =>
          `<div class="print-slide" style="width: 1920px; height: 1080px; page-break-after: always; position: relative;">${p.html}</div>`
      )
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${state.topic} - Printable Monograph</title>
          <style>
            @page { size: 16in 9in landscape; margin: 0; }
            body { margin: 0; background: #000; }
            .print-slide { width: 100vw; height: 100vh; page-break-after: always; display: flex; align-items: center; justify-content: center; overflow: hidden; }
            iframe { width: 1920px; height: 1080px; border: none; }
          </style>
        </head>
        <body>
          ${Object.values(state.generated_pages)
            .map(
              (p) => `
            <div class="print-slide">
              <iframe srcdoc="${p.html.replace(/"/g, '&quot;')}"></iframe>
            </div>
          `
            )
            .join('')}
          <script>
            setTimeout(() => { window.print(); }, 1200);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Export 3: Export PresentationState JSON
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AIPPT_State_${state.job_id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = state.locked_params.page_count;
  const currentPage = state.generated_pages[state.active_page_index];

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <Navbar
        topic={state.topic}
        theme={state.visual_system}
        onThemeChange={handleThemeChange}
        onStartPresentation={() => setIsPresentationOpen(true)}
        onOpenSettings={() => setIsParamsOpen(true)}
        onOpenDeliveryReport={() => setIsReportOpen(true)}
        onDownloadHtmlDeck={handleDownloadHtmlDeck}
        onPrintPdf={handlePrintPdf}
        onExportJson={handleExportJson}
        totalSlides={totalPages}
        isCompleted={state.status === 'COMPLETED'}
      />

      {/* Main Workspace Grid */}
      <main className="flex-1 flex flex-col p-3 lg:p-4 gap-3 overflow-hidden min-h-0">
        {/* Step 1-5 Mission Progress Tracker */}
        <MissionProgressTracker
          steps={state.mission_progress}
          currentStatus={state.status}
        />

        {/* Central Viewport & Agent Activity Capsule */}
        <div className="flex-1 flex flex-col gap-2 min-h-0">
          {/* Agent Activity Capsule / Tool Output Drawer */}
          <AgentActivityDrawer
            toolCalls={toolCalls}
            logs={logs}
            currentStatus={state.status}
          />

          {/* 1920x1080 Interactive Slide Viewport */}
          <SlidePreviewViewer
            currentPage={currentPage}
            pageIndex={state.active_page_index}
            totalSlides={totalPages}
            onPrev={() =>
              setState((p) => ({
                ...p,
                active_page_index: Math.max(0, p.active_page_index - 1)
              }))
            }
            onNext={() =>
              setState((p) => ({
                ...p,
                active_page_index: Math.min(
                  totalPages - 1,
                  p.active_page_index + 1
                )
              }))
            }
            onOpenSurgicalEditor={() => setIsSurgicalOpen(true)}
            onReProbe={handleReProbe}
            onStartPresentation={() => setIsPresentationOpen(true)}
          />
        </div>

        {/* Scaled 160x90 Iframe Thumbnail Carousel */}
        <SlideCarousel
          pages={state.generated_pages}
          totalCount={totalPages}
          activeIndex={state.active_page_index}
          onSelect={(idx) => setState((p) => ({ ...p, active_page_index: idx }))}
          onOpenPresentation={(idx) => {
            setState((p) => ({ ...p, active_page_index: idx }));
            setIsPresentationOpen(true);
          }}
        />
      </main>

      {/* Modals */}
      <ParameterLockingModal
        isOpen={isParamsOpen}
        onClose={() => setIsParamsOpen(false)}
        currentParams={state.locked_params}
        currentTheme={state.visual_system.theme_name}
        topic={state.topic}
        onConfirm={handleConfirmParams}
      />

      <SurgicalEditorModal
        isOpen={isSurgicalOpen}
        onClose={() => setIsSurgicalOpen(false)}
        page={currentPage}
        pageIndex={state.active_page_index}
        onApplyEdit={handleApplySurgicalEdit}
      />

      <PresentationMode
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        pages={state.generated_pages}
        totalCount={totalPages}
        initialIndex={state.active_page_index}
        onExportPdf={handlePrintPdf}
      />

      <DeliveryReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        state={state}
        onDownloadHtml={handleDownloadHtmlDeck}
        onPrintPdf={handlePrintPdf}
      />
    </div>
  );
}

export default App;
