import React from 'react';
import { DomainMetrics } from '../types';
import { Activity, Download, Printer, RefreshCw, Zap, Layers, Cpu } from 'lucide-react';

interface HeaderProps {
  domains: DomainMetrics[];
  activeDomain: DomainMetrics;
  onSelectDomain: (id: string) => void;
  onExportReport: () => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  domains,
  activeDomain,
  onSelectDomain,
  onExportReport,
  onPrint
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/40 rounded-xl text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
                LAMBDA DISSIPATION MODEL
                <span className="text-cyan-400 font-mono text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30">
                  v3.4 EVAL
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <span>Continuous Dissipation Calculus & Quantum Spectral Gap Dynamics</span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-purple-400 font-mono hidden sm:inline">Δ ≥ m_gap &gt; 0</span>
            </p>
          </div>
        </div>

        {/* Right: Domain Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Domain Dropdown */}
          <div className="relative">
            <label htmlFor="header-domain-select" className="sr-only">Select Evaluation Domain</label>
            <select
              id="header-domain-select"
              value={activeDomain.id}
              onChange={(e) => onSelectDomain(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-3 py-2 pr-8 focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer"
            >
              {domains.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          {/* Export JSON Button */}
          <button
            id="export-report-json-btn"
            onClick={onExportReport}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Download Evaluation Report JSON"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Export</span> JSON
          </button>

          {/* Print Report Button */}
          <button
            id="print-report-btn"
            onClick={onPrint}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Print or Save PDF Report"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Print /</span> PDF
          </button>
        </div>
      </div>
    </header>
  );
};
