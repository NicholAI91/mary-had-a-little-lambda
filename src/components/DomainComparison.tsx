import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { DomainMetrics } from '../types';
import { BarChart3, Brain, Wrench, Flame, Sparkles, CheckCircle2 } from 'lucide-react';

interface DomainComparisonProps {
  domains: DomainMetrics[];
  activeDomainId: string;
  onSelectDomain: (id: string) => void;
}

export const DomainComparison: React.FC<DomainComparisonProps> = ({
  domains,
  activeDomainId,
  onSelectDomain
}) => {
  const chartData = domains.map(d => ({
    id: d.id,
    name: d.name.split('—')[0].trim(),
    fullName: d.name,
    ratio: d.ratioRateToHalfLife,
    efficiency: d.memoryEfficiencyRatio,
    halfLife: d.memoryHalfLife,
    peakRate: d.peakDissipationRate,
    color: d.id === 'neuroscience-stdp' ? '#f59e0b' : d.id === 'rheology-polymers' ? '#06b6d4' : d.id === 'fracture-mechanics' ? '#a855f7' : '#ec4899'
  }));

  const getDomainIcon = (id: string) => {
    switch (id) {
      case 'neuroscience-stdp':
        return <Brain className="w-4 h-4 text-amber-400" />;
      case 'rheology-polymers':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'fracture-mechanics':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'thermal-phase-change':
      default:
        return <Flame className="w-4 h-4 text-pink-400" />;
    }
  };

  return (
    <div id="domain-comparison-section" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            CROSS-DOMAIN MULTI-METRIC COMPARATIVE BENCHMARK
          </h3>
          <p className="text-xs text-slate-400">
            Evaluating the <strong className="text-amber-400">2x Divergence</strong> between Neuromorphic Plasticity and Structural Continuum Materials
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded-full">
          STDP Peak Ratio: 79.49 s⁻²
        </span>
      </div>

      {/* Domain Selection Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {domains.map((dom) => {
          const isSelected = dom.id === activeDomainId;
          return (
            <button
              key={dom.id}
              id={`select-domain-${dom.id}`}
              onClick={() => onSelectDomain(dom.id)}
              className={`p-3.5 rounded-lg border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-700">
                    {getDomainIcon(dom.id)}
                  </div>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">{dom.name}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">{dom.tagline}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div>
                  <span className="text-slate-500 block">Ratio (R/T):</span>
                  <span className="text-xs font-bold text-amber-400">{dom.ratioRateToHalfLife.toFixed(2)} s⁻²</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Efficiency:</span>
                  <span className="text-xs font-bold text-emerald-400">{dom.memoryEfficiencyRatio.toFixed(1)}%</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Dual Comparative Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Peak Rate / Half-Life Ratio */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Ratio: Peak Dissipation Rate / T_1/2 (s⁻²)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Higher = Rapid Adaptation</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
                          <div className="font-bold text-slate-200">{data.fullName}</div>
                          <div className="text-amber-400 mt-1">Ratio: {data.ratio.toFixed(2)} s⁻²</div>
                          <div className="text-slate-400">Peak Rate: {data.peakRate.toFixed(3)} s⁻¹</div>
                          <div className="text-slate-400">Half-life: {data.halfLife.toFixed(2)} s</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="ratio" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-ratio-${index}`} 
                      fill={entry.id === activeDomainId ? '#f59e0b' : '#334155'}
                      stroke={entry.id === activeDomainId ? '#fbbf24' : '#475569'}
                      strokeWidth={1.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
            <span className="text-amber-300">Neuroscience STDP leads with 79.49 s⁻²</span>
            <span>2.01x higher than materials</span>
          </div>
        </div>

        {/* Right: Memory Efficiency Ratio (%) */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Memory Efficiency Ratio (Accumulated Λ / ΔU %)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Higher = Structural Hysteresis</span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} interval={0} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
                          <div className="font-bold text-slate-200">{data.fullName}</div>
                          <div className="text-emerald-400 mt-1">Memory Efficiency: {data.efficiency.toFixed(1)}%</div>
                          <div className="text-slate-400">Half-life: {data.halfLife.toFixed(2)} s</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="efficiency" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-eff-${index}`} 
                      fill={entry.id === activeDomainId ? '#10b981' : '#1e293b'}
                      stroke={entry.id === activeDomainId ? '#34d399' : '#334155'}
                      strokeWidth={1.5}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2 rounded border border-slate-800 flex justify-between">
            <span className="text-emerald-300">Fracture mechanics retains 340.3% efficiency</span>
            <span>Biological STDP prevents saturation at 7.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
