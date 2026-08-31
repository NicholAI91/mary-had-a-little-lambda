import React, { useState } from 'react';
import { SimulationParams } from '../types';
import { Sliders, RefreshCw, Sparkles, Zap, Play, Calculator, Check } from 'lucide-react';

interface InteractiveSandboxProps {
  params: SimulationParams;
  onParamsChange: (newParams: SimulationParams) => void;
  onResetToPreset: (presetId: string) => void;
  calculatedRatio: number;
  calculatedEfficiency: number;
}

export const InteractiveSandbox: React.FC<InteractiveSandboxProps> = ({
  params,
  onParamsChange,
  onResetToPreset,
  calculatedRatio,
  calculatedEfficiency
}) => {
  // Custom manual ratio calculator state
  const [testRate, setTestRate] = useState<number>(47.694);
  const [testHalfLife, setTestHalfLife] = useState<number>(0.60);

  const customRatio = testHalfLife > 0 ? (testRate / testHalfLife).toFixed(2) : '0.00';

  const handleChange = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    onParamsChange({
      ...params,
      [key]: value
    });
  };

  return (
    <div id="interactive-sandbox-section" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            INTERACTIVE PHYSICAL PARAMETER SANDBOX & RATIO CALCULATOR
          </h3>
          <p className="text-xs text-slate-400">
            Dynamically recalculate integrals, spectral relaxation rates, and evaluate custom dissipation models
          </p>
        </div>

        {/* Quick preset loaders */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px] mr-1">Load Preset:</span>
          <button
            id="preset-neuro-btn"
            onClick={() => onResetToPreset('neuroscience-stdp')}
            className="px-2.5 py-1 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 rounded text-[11px] transition-colors"
          >
            STDP (79.49)
          </button>
          <button
            id="preset-rheology-btn"
            onClick={() => onResetToPreset('rheology-polymers')}
            className="px-2.5 py-1 bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 rounded text-[11px] transition-colors"
          >
            Polymers (39.53)
          </button>
          <button
            id="preset-fracture-btn"
            onClick={() => onResetToPreset('fracture-mechanics')}
            className="px-2.5 py-1 bg-purple-950/70 hover:bg-purple-900/80 text-purple-300 border border-purple-500/40 rounded text-[11px] transition-colors"
          >
            Fracture (39.69)
          </button>
          <button
            id="preset-thermal-btn"
            onClick={() => onResetToPreset('thermal-phase-change')}
            className="px-2.5 py-1 bg-pink-950/70 hover:bg-pink-900/80 text-pink-300 border border-pink-500/40 rounded text-[11px] transition-colors"
          >
            Thermal (48.20)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Parameter Sliders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Initial Potential U0 */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="input-potential-u0" className="text-cyan-300 font-semibold cursor-pointer">
                  Initial Potential ($U_0$):
                </label>
                <span className="text-cyan-400 font-bold">{params.initialPotential.toFixed(1)}</span>
              </div>
              <input
                id="input-potential-u0"
                type="range"
                min="10"
                max="300"
                step="5"
                value={params.initialPotential}
                onChange={(e) => handleChange('initialPotential', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>10 (Low)</span>
                <span>60 (Synapse)</span>
                <span>300 (Macro)</span>
              </div>
            </div>

            {/* Memory Half-Life T_1/2 */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="input-half-life" className="text-amber-300 font-semibold cursor-pointer">
                  Memory Half-Life ($T_{1/2}$):
                </label>
                <span className="text-amber-400 font-bold">{params.halfLife.toFixed(2)} s</span>
              </div>
              <input
                id="input-half-life"
                type="range"
                min="0.1"
                max="5.0"
                step="0.05"
                value={params.halfLife}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  handleChange('halfLife', val);
                  // sync derived spectral gap
                  handleChange('spectralGap', Math.LN2 / Math.max(0.01, val));
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.1s (Ultra Fast)</span>
                <span>0.60s (STDP)</span>
                <span>5.0s (Viscous)</span>
              </div>
            </div>

            {/* Coupling Constant Kc */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="input-coupling-kc" className="text-emerald-300 font-semibold cursor-pointer">
                  Coupling Factor ($K_c$):
                </label>
                <span className="text-emerald-400 font-bold">{params.couplingConstant.toFixed(2)}</span>
              </div>
              <input
                id="input-coupling-kc"
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={params.couplingConstant}
                onChange={(e) => handleChange('couplingConstant', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.1</span>
                <span>1.0 (Unitary)</span>
                <span>5.0</span>
              </div>
            </div>

            {/* Total Duration T */}
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                <label htmlFor="input-sim-duration" className="text-purple-300 font-semibold cursor-pointer">
                  Evaluation Horizon ($T$):
                </label>
                <span className="text-purple-400 font-bold">{params.duration.toFixed(1)} s</span>
              </div>
              <input
                id="input-sim-duration"
                type="range"
                min="2.0"
                max="25.0"
                step="0.5"
                value={params.duration}
                onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>2s</span>
                <span>8s (Neuro)</span>
                <span>25s</span>
              </div>
            </div>
          </div>

          {/* Stimulus & Decay Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <label htmlFor="select-stimulus-type" className="text-xs font-mono text-slate-300 font-semibold block mb-2 cursor-pointer">
                Stimulus Discharge Profile:
              </label>
              <select
                id="select-stimulus-type"
                value={params.stimulusType}
                onChange={(e) => handleChange('stimulusType', e.target.value as SimulationParams['stimulusType'])}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="step-drop">Exponential Step-Drop (Standard Report)</option>
                <option value="double-spike">STDP Pre/Post Synaptic Double Spike</option>
                <option value="pulse-train">Repetitive High-Frequency Pulse Train</option>
                <option value="linear-ramp">Constant Dissipation Linear Ramp</option>
              </select>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              <label htmlFor="select-decay-model" className="text-xs font-mono text-slate-300 font-semibold block mb-2 cursor-pointer">
                Memory Weight Model $\Phi(t)$:
              </label>
              <select
                id="select-decay-model"
                value={params.decayModel}
                onChange={(e) => handleChange('decayModel', e.target.value as SimulationParams['decayModel'])}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-2 font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value="exponential">Exponential Decay Φ(t) = 2^(-t/T_1/2) (Gapped)</option>
                <option value="stretched-exp">Stretched Exponential (Viscoelastic)</option>
                <option value="power-law">Power-Law Algebraic Tail (Gapless Continuum)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right col: Manual Testing Calculator */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Calculator className="w-4 h-4" />
              Arbitrary Ratio Tester
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Directly verify any input pair for <span className="font-mono text-amber-300">Peak Dissipation Rate / T_1/2</span>:
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="manual-peak-rate-input" className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Peak Dissipation Rate (R_peak):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="manual-peak-rate-input"
                    type="number"
                    step="0.001"
                    value={testRate}
                    onChange={(e) => setTestRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 text-emerald-300 font-mono text-xs rounded px-2.5 py-1.5 focus:border-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-mono shrink-0">s⁻¹</span>
                </div>
              </div>

              <div>
                <label htmlFor="manual-half-life-input" className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Memory Half-Life ($T_{1/2}$):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="manual-half-life-input"
                    type="number"
                    step="0.01"
                    value={testHalfLife}
                    onChange={(e) => setTestHalfLife(parseFloat(e.target.value) || 0.01)}
                    className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs rounded px-2.5 py-1.5 focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 font-mono shrink-0">s</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <div className="bg-slate-900/90 p-3 rounded border border-amber-500/40 text-center">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Calculated Ratio:</span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-0.5">
                {customRatio} <span className="text-xs text-slate-400 font-normal">s⁻²</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                Formula: {testRate} ÷ {testHalfLife} = {customRatio}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
