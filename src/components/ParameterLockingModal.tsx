import React, { useState } from 'react';
import { X, Sparkles, Sliders, Check, Layers } from 'lucide-react';
import { LockedParams } from '../types/presentation';
import { THEME_PRESETS } from '../services/templates';

interface ParameterLockingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentParams: LockedParams;
  currentTheme: string;
  topic: string;
  onConfirm: (topic: string, params: LockedParams, theme: string) => void;
}

const PRESET_TOPICS = [
  'Artificial Intelligence: Foundations, History and Frontiers',
  'Quantum Computing & Cryptographic Resilience',
  'Global Renewable Energy Transition 2030',
  'Biotechnology & CRISPR Genetic Engineering Horizons'
];

export const ParameterLockingModal: React.FC<ParameterLockingModalProps> = ({
  isOpen,
  onClose,
  currentParams,
  currentTheme,
  topic: initialTopic,
  onConfirm
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [pageCount, setPageCount] = useState<number>(currentParams.page_count || 12);
  const [language, setLanguage] = useState(currentParams.language || 'en');
  const [audience, setAudience] = useState(currentParams.audience || 'general');
  const [tone, setTone] = useState(currentParams.tone || 'informative');
  const [theme, setTheme] = useState(currentTheme || 'scholarly-deep-blue');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(topic, { page_count: pageCount, language, audience, tone }, theme);
  };

  const handleSkip = () => {
    onConfirm(
      initialTopic || 'Artificial Intelligence: Foundations, History and Frontiers',
      { page_count: 12, language: 'en', audience: 'general', tone: 'informative' },
      'scholarly-deep-blue'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AIPPT Parameter Locking Widget
                <span className="text-[10px] bg-cyan-900/60 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full font-mono font-bold">
                  Node 1
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure deterministic bounds before state machine synthesis
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Topic / Source Material */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Subject Matter / Presentation Topic
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={2}
              required
              placeholder="e.g. Artificial Intelligence: Foundations, History and Frontiers"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 transition resize-none"
            />
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_TOPICS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTopic(p)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition truncate max-w-xs"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Page Count */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Page Count
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 8, 12, 16].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setPageCount(cnt)}
                    className={`py-2 rounded-xl text-xs font-bold transition border ${
                      pageCount === cnt
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cnt} Slides
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Output Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500"
              >
                <option value="en">English (US)</option>
                <option value="fa">فارسی (Persian)</option>
                <option value="es">Español (Spanish)</option>
                <option value="fr">Français (French)</option>
                <option value="de">Deutsch (German)</option>
              </select>
            </div>

            {/* Audience */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500"
              >
                <option value="general">General Professional Audience</option>
                <option value="engineering">Technical / Engineering Leads</option>
                <option value="executive">Executive & C-Suite Leadership</option>
                <option value="academic">Academic & Research Peers</option>
              </select>
            </div>

            {/* Tone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Rhetorical Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:border-cyan-500"
              >
                <option value="informative">Informative & Evidence-Based</option>
                <option value="analytical">Rigorous & Analytical</option>
                <option value="visionary">Frontier & Strategic</option>
                <option value="concise">Concise & Action-Oriented</option>
              </select>
            </div>
          </div>

          {/* Visual System Theme */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Visual System Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.values(THEME_PRESETS).map((t) => (
                <button
                  key={t.theme_name}
                  type="button"
                  onClick={() => setTheme(t.theme_name)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between h-20 ${
                    theme === t.theme_name
                      ? 'border-cyan-400 ring-1 ring-cyan-400/50 bg-slate-800'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: t.accent_color }}
                    />
                    {theme === t.theme_name && (
                      <Check className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 capitalize truncate">
                    {t.theme_name.split('-').join(' ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              Skip (Use Default 12 Slides)
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Lock Parameters & Start Synthesis
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
