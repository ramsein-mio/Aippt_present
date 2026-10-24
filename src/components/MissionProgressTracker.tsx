import React from 'react';
import { CheckCircle2, Circle, Loader2, Compass } from 'lucide-react';
import { MissionStep } from '../types/presentation';

interface MissionProgressTrackerProps {
  steps: MissionStep[];
  currentStatus: string;
}

export const MissionProgressTracker: React.FC<MissionProgressTrackerProps> = ({ steps, currentStatus }) => {
  const completedCount = steps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Mission Progress ({completedCount}/{steps.length})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400">{progressPercent}%</span>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-1">
        {steps.map((st) => {
          const isDone = st.completed;
          const isActive = st.active;

          return (
            <div
              key={st.step}
              className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-200'
                  : isActive
                  ? 'bg-cyan-950/30 border-cyan-800/80 text-cyan-200 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-950/40 border-slate-850/60 text-slate-500'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono font-bold tracking-wider opacity-75">
                  STEP 0{st.step}
                </div>
                <div className="text-xs font-semibold leading-tight truncate">
                  {st.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
