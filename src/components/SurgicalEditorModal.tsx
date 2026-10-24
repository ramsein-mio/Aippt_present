import React, { useState } from 'react';
import { X, Wand2, Sparkles, Send, RefreshCw, CheckCircle } from 'lucide-react';
import { GeneratedPage } from '../types/presentation';

interface SurgicalEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: GeneratedPage;
  pageIndex: number;
  onApplyEdit: (pageIndex: number, instruction: string) => Promise<void>;
}

const PRESET_EDITS = [
  'Reduce diagram SVG height by 30px to clear footer padding',
  'Change accent highlights to high-contrast cyan glow',
  'Shorten bullet points and increase card padding to 24px',
  'Replace subtitle with executive-level strategic framing'
];

export const SurgicalEditorModal: React.FC<SurgicalEditorModalProps> = ({
  isOpen,
  onClose,
  page,
  pageIndex,
  onApplyEdit
}) => {
  const [instruction, setInstruction] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen || !page) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isApplying) return;

    setIsApplying(true);
    setSuccessMessage(false);
    try {
      await onApplyEdit(pageIndex, instruction);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 900);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Surgical Slide Editor & DOM Fix
                <span className="text-[10px] bg-cyan-900/60 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  Page {pageIndex + 1}
                </span>
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">
                Targeting {page.file_path} ({page.title})
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Describe what to edit, add, or refine in this slide
            </label>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Change diagram colors to cyan, shrink SVG height by 20px, and re-probe DOM..."
              rows={3}
              required
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition resize-none"
            />
          </div>

          {/* Quick Preset Ideas */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_EDITS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setInstruction(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-left"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Surgically edited and verified clean with 0px canvas overflow!</span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isApplying || !instruction.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Patching & Re-Probing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Surgical Patch</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
