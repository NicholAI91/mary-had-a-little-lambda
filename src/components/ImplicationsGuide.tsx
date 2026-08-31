import React from 'react';
import { Brain, Cpu, Clock, ShieldAlert, Sparkles, Network, ArrowRight } from 'lucide-react';

export const ImplicationsGuide: React.FC = () => {
  return (
    <div id="implications-guide-section" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-5">
        <div className="p-2 bg-amber-950/70 border border-amber-500/40 rounded-lg text-amber-400">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-200">
            SCIENTIFIC IMPLICATIONS & ARCHITECTURAL COMPARISON
          </h3>
          <p className="text-xs text-slate-400">
            Why Spike-Timing-Dependent Plasticity (STDP) exhibits 79.49 s⁻² while structural materials exhibit ~39.5 s⁻²
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Fast Adaptation */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400 mb-3">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wide mb-1.5">
              1. Rapid Memory Reset
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              In neuroscience, STDP needs synapses to respond quickly to incoming action potentials. The <strong>high ratio (79.49 s⁻²)</strong> means potential drops rapidly while memory shuts down fast (<strong>T_{`1/2`} = 0.60s</strong>), enabling high-frequency agility without lag.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-amber-400 font-mono">
            Ratio: 79.49 s⁻² vs 39.5 s⁻²
          </div>
        </div>

        {/* Card 2: Anti-Saturation */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wide mb-1.5">
              2. Anti-Saturation (7.2%)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Unlike fracture mechanics (<strong>340.3% efficiency</strong>) where strain damage builds up permanently, biological synapses maintain a <strong>7.2% efficiency</strong> to prevent weights from permanently locking at maximum capacity.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
            Low Historical Burden
          </div>
        </div>

        {/* Card 3: Millisecond Precision */}
        <div className="bg-slate-950/80 border border-cyan-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400 mb-3">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-mono text-cyan-300 uppercase tracking-wide mb-1.5">
              3. Temporal Resolution
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Because the memory trace <span className="font-mono text-amber-300">Φ(t)</span> drops steeply within milliseconds, the neural network can distinguish whether two spikes occurred 10ms apart vs 50ms apart with extreme fidelity.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-cyan-400 font-mono">
            Phase-Coded Spike Timing
          </div>
        </div>

        {/* Card 4: Neuromorphic Hardware */}
        <div className="bg-slate-950/80 border border-purple-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-500/50 flex items-center justify-center text-purple-400 mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-mono text-purple-300 uppercase tracking-wide mb-1.5">
              4. Neuromorphic Chips
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              On neuromorphic hardware (Intel Loihi, SpiNNaker), short memory kernels mean continuous history integration buffers can be truncated early, drastically cutting silicon area and power consumption.
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-purple-400 font-mono">
            Low Buffer Memory Footprint
          </div>
        </div>
      </div>
    </div>
  );
};
