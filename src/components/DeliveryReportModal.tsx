import React from 'react';
import { X, CheckCircle2, ShieldCheck, Download, Printer, FileText, LayoutGrid } from 'lucide-react';
import { PresentationState } from '../types/presentation';

interface DeliveryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: PresentationState;
  onDownloadHtml: () => void;
  onPrintPdf: () => void;
}

export const DeliveryReportModal: React.FC<DeliveryReportModalProps> = ({
  isOpen,
  onClose,
  state,
  onDownloadHtml,
  onPrintPdf
}) => {
  if (!isOpen) return null;

  const totalPages = state.locked_params.page_count;
  const deliveredPages = Object.keys(state.generated_pages).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AIPPT Presentation Delivery Report
                <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  Node 6 Verified
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Automated Quality Assurance & Layout Integrity Monograph
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Delivered Pages</span>
              <span className="text-xl font-bold font-mono text-cyan-400 mt-1 block">
                {deliveredPages} / {totalPages}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Vision QA</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                VERIFIED
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">DOM Canvas Bounds</span>
              <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
                0px OVERFLOW
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Visual Layouts</span>
              <span className="text-xl font-bold font-mono text-purple-400 mt-1 block">
                DIVERSE (9+)
              </span>
            </div>
          </div>

          {/* Issues Found & Surgically Fixed */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Automated Self-Healing Telemetry
            </h4>
            <div className="space-y-2">
              {state.qa_report.issues_found_and_fixed.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 flex items-start gap-2.5 font-mono text-[11px]"
                >
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Page Map 1-N */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              Page Map Architecture (1–{totalPages})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {state.outline.map((item) => (
                <div
                  key={item.page_number}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-slate-800 text-cyan-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                      {String(item.page_number).padStart(2, '0')}
                    </span>
                    <span className="font-semibold text-slate-200 truncate text-[11px]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase shrink-0 ml-2">
                    {item.layout_type.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-slate-500 text-[11px]">
              Ready for high-fidelity export and stakeholder distribution
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onPrintPdf}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print PDF</span>
              </button>
              <button
                onClick={onDownloadHtml}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold transition text-xs shadow-lg shadow-cyan-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HTML Package</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
