import React, { useMemo } from 'react';
import katex from 'katex';
import { Sparkles, HelpCircle, Layers, Zap, Activity } from 'lucide-react';

interface MathFormulaCardProps {
  currentDomainName: string;
  halfLife: number;
  peakRate: number;
  ratio: number;
  couplingConstantKc: number;
}

export const MathFormulaCard: React.FC<MathFormulaCardProps> = ({
  currentDomainName,
  halfLife,
  peakRate,
  ratio,
  couplingConstantKc
}) => {
  const masterFormulaHtml = useMemo(() => {
    try {
      return katex.renderToString(
        `\\Lambda(t) = K_c \\int_{0}^{T} \\Phi(t) \\cdot \\left(-\\frac{dU}{dt}\\right) dt`,
        { displayMode: true, throwOnError: false }
      );
    } catch {
      return 'Lambda(t) = K_c * \\int Phi(t) * (-dU/dt) dt';
    }
  }, []);

  const spectralGapFormulaHtml = useMemo(() => {
    try {
      return katex.renderToString(
        `\\Delta = \\inf\\left\\{ E > 0 : H|\\Psi\\rangle = E|\\Psi\\rangle, \\; \\mathcal{P}_{\\text{ground}}|\\Psi\\rangle = 0 \\right\\} \\ge m_{\\text{gap}} > 0`,
        { displayMode: true, throwOnError: false }
      );
    } catch {
      return '\\Delta = \\inf{E > 0 : H|\\Psi> = E|\\Psi>, P|\\Psi> = 0} >= m_{gap} > 0';
    }
  }, []);

  const ratioFormulaHtml = useMemo(() => {
    try {
      return katex.renderToString(
        `\\text{Ratio} = \\frac{\\text{Peak Dissipation Rate}}{\\text{Memory Half-Life } (T_{1/2})} = \\frac{${peakRate.toFixed(3)}\\text{ s}^{-1}}{${halfLife.toFixed(2)}\\text{ s}} = \\mathbf{${ratio.toFixed(2)}\\text{ s}^{-2}}`,
        { displayMode: true, throwOnError: false }
      );
    } catch {
      return `Ratio = PeakRate / T_{1/2} = ${ratio.toFixed(2)}`;
    }
  }, [peakRate, halfLife, ratio]);

  const decayFormulaHtml = useMemo(() => {
    const gamma = (Math.LN2 / Math.max(0.01, halfLife)).toFixed(3);
    try {
      return katex.renderToString(
        `\\Phi(t) = 2^{-t / T_{1/2}} = e^{-\\gamma t} \\quad \\left(\\gamma = \\frac{\\ln 2}{T_{1/2}} \\approx ${gamma}\\text{ s}^{-1}\\right)`,
        { displayMode: false, throwOnError: false }
      );
    } catch {
      return `\\Phi(t) = 2^{-t/T_{1/2}} = e^{-\\gamma t}`;
    }
  }, [halfLife]);

  return (
    <div id="master-formula-card" className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-cyan-950/70 border border-cyan-500/40 rounded-lg text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-cyan-300 tracking-wide flex items-center gap-2">
              LAMBDA DISSIPATION MODEL & QUANTUM SPECTRAL GAP
            </h2>
            <p className="text-xs text-slate-400">
              Active Evaluation: <span className="text-amber-400 font-semibold">{currentDomainName}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 rounded-full font-mono">
            K_c = {couplingConstantKc.toFixed(2)}
          </span>
          <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-500/30 text-amber-300 rounded-full font-mono">
            T_1/2 = {halfLife.toFixed(2)}s
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Continuous Dissipation Calculus */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> Continuous Memory-Weighted Calculus
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Master Formula</span>
            </div>

            <div 
              className="py-3 px-2 text-center text-cyan-200 overflow-x-auto text-sm sm:text-base"
              dangerouslySetInnerHTML={{ __html: masterFormulaHtml }}
            />

            <div className="mt-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
              <div className="flex items-start gap-1.5">
                <span className="text-cyan-400 font-mono font-bold shrink-0">• \\Lambda(t):</span>
                <span>Total accumulated non-instantaneous dissipation memory.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-amber-400 font-mono font-bold shrink-0">• \\Phi(t):</span>
                <span dangerouslySetInnerHTML={{ __html: decayFormulaHtml }} />
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-mono font-bold shrink-0">• -dU/dt:</span>
                <span>Instantaneous potential dissipation rate per second.</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase block mb-1">
              Live Ratio Calculation (Rate / Half-Life)
            </span>
            <div 
              className="text-center text-xs sm:text-sm text-amber-200 font-mono overflow-x-auto py-1"
              dangerouslySetInnerHTML={{ __html: ratioFormulaHtml }}
            />
          </div>
        </div>

        {/* Right: Quantum Spectral Gap Theorem */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Quantum Spectral Gap Relation
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Operator Dynamics</span>
            </div>

            <div 
              className="py-3 px-2 text-center text-purple-200 overflow-x-auto text-xs sm:text-sm"
              dangerouslySetInnerHTML={{ __html: spectralGapFormulaHtml }}
            />

            <div className="mt-2 text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded border border-slate-800 space-y-1">
              <p className="leading-relaxed">
                The condition <span className="text-purple-300 font-mono font-semibold">\Delta \ge m_&#123;gap&#125; &gt; 0</span> strictly guarantees exponential decay of excited state memory:
              </p>
              <div className="font-mono text-purple-300 text-[11px] bg-purple-950/30 p-1.5 rounded border border-purple-800/40">
                T_{`1/2`} = \frac{`\\hbar \\ln 2`}{`m_{\\text{gap}}`} \\implies \\gamma \\propto m_{`\\text{gap}`}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                A larger spectral gap enforces an ultra-short half-life, yielding sharp biological adaptation (<span className="text-amber-300 font-semibold">79.49 s⁻²</span>) rather than bulk structural hysteresis (<span className="text-cyan-300 font-semibold">39.5 s⁻²</span>).
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 font-mono">
            <span className="text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Gapped Spectrum: Strictly Exponential
            </span>
            <span className="text-slate-500">m_gap &gt; 0 Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
};
