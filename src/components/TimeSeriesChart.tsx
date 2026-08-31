import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { GeneratedCurvePoint } from '../utils/physicsEngine';
import { TrendingUp, Eye, EyeOff, Info } from 'lucide-react';

interface TimeSeriesChartProps {
  data: GeneratedCurvePoint[];
  unitU: string;
  unitLambda: string;
  domainName: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  unitU,
  unitLambda,
  domainName
}) => {
  const [visibleSeries, setVisibleSeries] = useState<{ [key: string]: boolean }>({
    potential: true,
    dissipationRate: true,
    memoryWeight: true,
    integrand: true,
    accumulatedLambda: true
  });

  const toggleSeries = (key: string) => {
    setVisibleSeries(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div id="time-series-chart-card" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-cyan-300 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            TIME-SERIES DYNAMICS & DISSIPATION INTEGRATION
          </h3>
          <p className="text-xs text-slate-400">
            Evolution of <span className="text-cyan-200 font-mono">U(t)</span>, <span className="text-emerald-300 font-mono">-dU/dt</span>, <span className="text-amber-300 font-mono">Φ(t)</span>, <span className="text-violet-300 font-mono">Integrand</span> & <span className="text-pink-300 font-mono">Λ(t)</span> for {domainName}
          </p>
        </div>

        {/* Visibility Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            id="toggle-potential"
            onClick={() => toggleSeries('potential')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
              visibleSeries.potential
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            U(t) Potential
          </button>

          <button
            id="toggle-rate"
            onClick={() => toggleSeries('dissipationRate')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
              visibleSeries.dissipationRate
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            -dU/dt Rate
          </button>

          <button
            id="toggle-memory"
            onClick={() => toggleSeries('memoryWeight')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
              visibleSeries.memoryWeight
                ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Φ(t) Memory
          </button>

          <button
            id="toggle-integrand"
            onClick={() => toggleSeries('integrand')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
              visibleSeries.integrand
                ? 'bg-purple-950/80 border-purple-500/60 text-purple-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            Φ·(-dU/dt)
          </button>

          <button
            id="toggle-lambda"
            onClick={() => toggleSeries('accumulatedLambda')}
            className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
              visibleSeries.accumulatedLambda
                ? 'bg-pink-950/80 border-pink-500/60 text-pink-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-pink-400"></span>
            Λ(t) Accumulated
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tickFormatter={(v) => `${v}s`}
              label={{ value: 'Time t (seconds)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
            />
            {/* Primary Left Y Axis for Potentials & Rates */}
            <YAxis
              yAxisId="left"
              stroke="#64748b"
              label={{ value: `Potential (${unitU}) / Rate (/s)`, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
            />
            {/* Secondary Right Y Axis for Memory Weight [0, 1] & Accumulated Lambda */}
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#64748b"
              label={{ value: `Memory Φ(t) / Λ (${unitLambda})`, angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-950/95 border border-slate-700 p-3 rounded-lg shadow-2xl text-xs font-mono space-y-1.5 z-50">
                      <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1 flex justify-between">
                        <span>Time:</span>
                        <span>{label} s</span>
                      </div>
                      {payload.map((entry, idx) => (
                        <div key={idx} className="flex justify-between gap-4" style={{ color: entry.color }}>
                          <span>{entry.name}:</span>
                          <span className="font-bold">{typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />

            {visibleSeries.potential && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="potential"
                name={`Potential U(t) [${unitU}]`}
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            )}
            {visibleSeries.dissipationRate && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="dissipationRate"
                name="Rate -dU/dt [s⁻¹]"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            )}
            {visibleSeries.memoryWeight && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="memoryWeight"
                name="Memory Weight Φ(t)"
                stroke="#f59e0b"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={false}
              />
            )}
            {visibleSeries.integrand && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="integrand"
                name="Integrand Φ·(-dU/dt)"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
              />
            )}
            {visibleSeries.accumulatedLambda && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="accumulatedLambda"
                name={`Accumulated Λ(t) [${unitLambda}]`}
                stroke="#ec4899"
                strokeWidth={2.5}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-800/80">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Calculus Insight:</strong> Notice how <span className="text-purple-300 font-semibold font-mono">Integrand Φ·(-dU/dt)</span> drops to near zero as soon as <span className="text-amber-300 font-semibold font-mono">Φ(t)</span> decays past its half-life, creating a strict cutoff for further accumulation of <span className="text-pink-300 font-semibold font-mono">Λ(t)</span>.
        </span>
      </div>
    </div>
  );
};
