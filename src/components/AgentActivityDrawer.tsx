import React, { useState } from 'react';
import {
  Terminal,
  Zap,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Code2
} from 'lucide-react';
import { ToolExecution } from '../types/presentation';

interface AgentActivityDrawerProps {
  toolCalls: ToolExecution[];
  logs: string[];
  currentStatus: string;
}

export const AgentActivityDrawer: React.FC<AgentActivityDrawerProps> = ({
  toolCalls,
  logs,
  currentStatus
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolExecution | null>(null);

  const latestTool = toolCalls[toolCalls.length - 1];

  return (
    <div className="relative">
      {/* Capsule bar (as seen in video / spec Task 4.1) */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-3 min-w-0">
          {/* Pulsing indicator */}
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative" />
          </div>

          <div className="flex items-center gap-2 truncate">
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 shrink-0">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Use tool
            </span>
            <span className="text-xs font-mono font-semibold text-cyan-300 truncate">
              {latestTool ? `⚡ ${latestTool.name} - ${latestTool.detailMessage || 'Executing'}` : 'System Idle'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition shrink-0 ml-3"
        >
          <span>Check</span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Drawer / Inspection Panel */}
      {isOpen && (
        <div className="mt-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl space-y-4 max-h-80 overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Agent State Machine & Tool Execution Trace</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {toolCalls.length} tool calls executed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tool Calls List */}
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {toolCalls.slice().reverse().map((tool, index) => (
                <div
                  key={`${tool.id}-${index}`}
                  onClick={() => setSelectedTool(tool)}
                  className={`p-2 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                    selectedTool?.id === tool.id
                      ? 'bg-cyan-950/40 border-cyan-800 text-cyan-200'
                      : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-cyan-400 font-mono font-bold">⚡ {tool.name}</span>
                    <span className="text-slate-500 truncate text-[11px]">
                      {tool.detailMessage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[10px] font-mono text-slate-500">{tool.timestamp}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Tool Details / JSON inspector */}
            <div className="bg-slate-900 rounded-xl p-3 border border-slate-800/80 text-xs font-mono max-h-56 overflow-y-auto">
              <div className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tool Arguments & Result Inspection</span>
              </div>
              {selectedTool || latestTool ? (
                <pre className="text-[11px] text-cyan-200/90 whitespace-pre-wrap break-all leading-relaxed">
                  {JSON.stringify((selectedTool || latestTool), null, 2)}
                </pre>
              ) : (
                <div className="text-slate-500 italic">No tool execution selected</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
