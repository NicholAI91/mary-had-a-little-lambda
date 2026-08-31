import React from 'react';
import { DomainMetrics } from '../types';
import { Flame, Clock, Zap, Percent, Activity, ShieldCheck, TrendingUp } from 'lucide-react';

interface KPIGridProps {
  metrics: {
    totalLambda: number;
    totalPotentialDrop: number;
    peakDissipationRate: number;
    memoryHalfLife: number;
    ratio: number;
    memoryEfficiency: number;
    peakIntegrand: number;
  };
  domain: DomainMetrics;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ metrics, domain }) => {
  return (
    <div id="kpi-metrics-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Ratio (Highlighted Primary Focus) */}
      <div className="bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950/90 border border-amber-500/50 rounded-xl p-3.5 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-amber-400">
          <span>Peak Rate / T_1/2</span>
          <Zap className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
            {metrics.ratio.toFixed(2)}
          </div>
          <span className="text-[10px] font-mono text-amber-200/70">s⁻² (Intensity/Time)</span>
        </div>
        <div className="text-[10px] font-mono text-amber-400/90 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/40 truncate">
          {metrics.ratio > 60 ? '⚡ Ultra-Fast STDP' : '⏳ Viscous Continuum'}
        </div>
      </div>

      {/* 2. Peak Dissipation Rate */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-emerald-400">
          <span>Peak Dissipation</span>
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
            {metrics.peakDissipationRate.toFixed(3)}
          </div>
          <span className="text-[10px] font-mono text-slate-400">s⁻¹ (Max -dU/dt)</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          Initial spike discharge
        </div>
      </div>

      {/* 3. Memory Half-Life (T_1/2) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-cyan-400">
          <span>Memory Half-Life</span>
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-300">
            {metrics.memoryHalfLife.toFixed(2)}
          </div>
          <span className="text-[10px] font-mono text-slate-400">seconds (T₁/₂)</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          γ = {(Math.LN2 / Math.max(0.01, metrics.memoryHalfLife)).toFixed(2)} s⁻¹
        </div>
      </div>

      {/* 4. Memory Efficiency Ratio */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-purple-400">
          <span>Memory Efficiency</span>
          <Percent className="w-3.5 h-3.5 text-purple-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300">
            {metrics.memoryEfficiency.toFixed(1)}%
          </div>
          <span className="text-[10px] font-mono text-slate-400">(Accumulated Λ / ΔU)</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          {metrics.memoryEfficiency < 20 ? 'Anti-Saturation' : 'Hysteretic Memory'}
        </div>
      </div>

      {/* 5. Total Accumulated Lambda */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-pink-400">
          <span>Accumulated Λ</span>
          <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-pink-300">
            {metrics.totalLambda.toFixed(3)}
          </div>
          <span className="text-[10px] font-mono text-slate-400">{domain.unitLambda}</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          Continuous Integral
        </div>
      </div>

      {/* 6. Total Potential Drop (Delta U) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-blue-400">
          <span>Potential Drop</span>
          <Flame className="w-3.5 h-3.5 text-blue-400" />
        </div>
        <div className="my-2">
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-300">
            {metrics.totalPotentialDrop.toFixed(1)}
          </div>
          <span className="text-[10px] font-mono text-slate-400">{domain.unitU} (ΔU)</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 truncate">
          System discharge baseline
        </div>
      </div>
    </div>
  );
};
