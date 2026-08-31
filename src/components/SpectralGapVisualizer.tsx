import React from 'react';
import { ShieldCheck, ArrowDown, Activity, Cpu, Disc } from 'lucide-react';

interface SpectralGapVisualizerProps {
  spectralGap: number; // in s^-1 or meV
  halfLife: number; // s
  onGapChange?: (newGap: number) => void;
  domainName: string;
}

export const SpectralGapVisualizer: React.FC<SpectralGapVisualizerProps> = ({
  spectralGap,
  halfLife,
  onGapChange,
  domainName
}) => {
  // Height representation of the gap
  const normalizedGap = Math.min(Math.max(spectralGap, 0.1), 3.0);
  const gapHeightPct = Math.min(65, Math.max(15, (normalizedGap / 3.0) * 60));

  return (
    <div id="spectral-gap-visualizer" className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-950/70 border border-purple-500/40 rounded-lg text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-purple-300">
                QUANTUM SPECTRAL GAP OPERATOR DIAGRAM
              </h3>
              <p className="text-xs text-slate-400">
                Relaxation Dynamics for <span className="text-amber-400 font-mono">{domainName}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-700/50">
              Δ ≥ m_gap &gt; 0
            </span>
          </div>
        </div>

        {/* Diagram canvas / visual */}
        <div className="relative bg-slate-950 rounded-lg p-4 border border-slate-800 h-56 flex">
          {/* Energy Y Axis */}
          <div className="w-12 border-r border-slate-700 flex flex-col justify-between items-center py-2 text-[10px] font-mono text-slate-400 shrink-0">
            <span className="text-purple-400 font-bold">E &gt; 0</span>
            <span className="text-slate-500">Continuum</span>
            <span className="text-amber-400 font-semibold">E = Δ</span>
            <span className="text-emerald-400 font-bold">E = 0</span>
          </div>

          {/* Energy Level Ladder */}
          <div className="flex-1 relative flex flex-col justify-between pl-4 pr-2">
            {/* Excited states continuum */}
            <div className="h-16 bg-gradient-to-b from-purple-900/40 via-purple-950/20 to-transparent border-t-2 border-dashed border-purple-400/80 rounded-t p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                <span>Excited Subspace P_excited</span>
                <span className="text-slate-400">H |Ψ⟩ = E |Ψ⟩</span>
              </div>
              <div className="flex gap-2">
                <div className="h-0.5 flex-1 bg-purple-400/40"></div>
                <div className="h-0.5 flex-1 bg-purple-400/60"></div>
                <div className="h-0.5 flex-1 bg-purple-400/30"></div>
              </div>
            </div>

            {/* Gap Region */}
            <div 
              className="relative my-auto flex items-center justify-center border-l-2 border-r-2 border-amber-500/40 bg-amber-950/20 rounded mx-4 py-2 transition-all duration-300"
              style={{ minHeight: `${Math.max(40, gapHeightPct)}px` }}
            >
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-amber-300 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Spectral Gap Δ = {spectralGap.toFixed(3)} s⁻¹</span>
                </div>
                <div className="text-[10px] text-amber-200/70 font-mono">
                  Forbidden Transition Band (m_gap &gt; 0)
                </div>
              </div>
              
              {/* Decay arrow indicator */}
              <div className="absolute right-2 flex items-center gap-1 text-[10px] font-mono text-cyan-400 animate-pulse">
                <span>Decay γ ∝ m_gap</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Ground State Level */}
            <div className="h-9 bg-emerald-950/60 border-t-2 border-emerald-500 rounded-b px-3 flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold">
                <Disc className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Ground State |Ψ_0⟩ (E = 0)</span>
              </div>
              <span className="text-[11px] text-emerald-400/80">P_ground Subspace</span>
            </div>
          </div>
        </div>
      </div>

      {/* Physics Insights & Controls */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Relaxation Rate (γ):</span>
            <span className="text-sm font-bold text-cyan-300">
              {(Math.LN2 / Math.max(0.01, halfLife)).toFixed(3)} s⁻¹
            </span>
          </div>
          <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800">
            <span className="text-slate-400 text-[10px] uppercase block">Memory Half-Life (T_1/2):</span>
            <span className="text-sm font-bold text-amber-300">
              {halfLife.toFixed(2)} s
            </span>
          </div>
        </div>

        {onGapChange && (
          <div className="bg-slate-950/60 p-2.5 rounded border border-purple-900/30">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <label htmlFor="spectral-gap-slider" className="text-purple-300 font-semibold cursor-pointer">
                Tune Spectral Gap (m_gap):
              </label>
              <span className="text-amber-400 font-bold">{spectralGap.toFixed(2)} s⁻¹</span>
            </div>
            <input
              id="spectral-gap-slider"
              type="range"
              min="0.1"
              max="2.5"
              step="0.05"
              value={spectralGap}
              onChange={(e) => onGapChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0.1 (Slow / Materials)</span>
              <span>1.155 (Fast / STDP)</span>
              <span>2.5 (Extreme Ultra-Fast)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
