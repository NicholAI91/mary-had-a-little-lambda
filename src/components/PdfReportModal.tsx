import React, { useState } from 'react';
import { DomainMetrics, MilestonePoint, SimulationParameters } from '../types';
import { generatePdfSummaryReport, PdfReportOptions } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  X,
  Printer,
  CheckCircle2,
  Sliders,
  TrendingUp,
  Table,
  BarChart3,
  Sparkles,
  Layers,
  Loader2,
  StickyNote,
  User,
  Check
} from 'lucide-react';

interface PdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: DomainMetrics;
  metrics: {
    peakDissipationRate: number;
    memoryHalfLife: number;
    ratio: number;
    totalLambda: number;
    totalPotentialDrop: number;
    memoryEfficiency: number;
  };
  milestones: MilestonePoint[];
  simulationParams: SimulationParameters;
  allDomains: DomainMetrics[];
}

export const PdfReportModal: React.FC<PdfReportModalProps> = ({
  isOpen,
  onClose,
  domain,
  metrics,
  milestones,
  simulationParams,
  allDomains
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [evaluatorName, setEvaluatorName] = useState('Research Scientist / Neuromorphic Lab');
  const [options, setOptions] = useState<PdfReportOptions>({
    includeTimeSeriesChart: true,
    includeComparisonChart: true,
    includeSpectralGap: true,
    includeMilestoneTable: true,
    includeDomainBenchmarks: true,
    includeNeuromorphicGuide: true
  });

  if (!isOpen) return null;

  const notesCount進 = milestones.filter(m => !!m.userNote?.trim()).length;

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      const { doc, filename } = await generatePdfSummaryReport(
        domain,
        metrics,
        milestones,
        simulationParams,
        allDomains,
        {
          ...options,
          evaluatorName
        }
      );
      doc.save(filename);
      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrintPdf = async () => {
    try {
      setIsGenerating(true);
      const { doc } = await generatePdfSummaryReport(
        domain,
        metrics,
        milestones,
        simulationParams,
        allDomains,
        {
          ...options,
          evaluatorName
        }
      );
      doc.autoPrint();
      const blobUrl = doc.output('bloburl');
      window.open(blobUrl, '_blank');
    } catch (err) {
      console.error('Error printing PDF report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100 font-sans">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500/30 to-amber-500/20 border border-cyan-500/40 rounded-xl text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                PROFESSIONAL PDF SUMMARY REPORT GENERATOR
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700 font-mono">
                  VECTOR + CHARTS
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formatted scientific summary report with rendered time-series charts, calculus bounds, and annotated milestones for <span className="text-amber-300 font-medium">{domain.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Report Configuration */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Config Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Evaluator / Research Lab Name:
              </label>
              <input
                type="text"
                value={evaluatorName}
                onChange={(e) => setEvaluatorName(e.target.value)}
                placeholder="e.g. Neuromorphic Computing Group / Stanford Bio-X"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                This name and the current timestamp will appear on the document header and footer.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">Attached User Notes</span>
                <div className="text-xl font-extrabold text-amber-300 font-mono flex items-center gap-2 mt-1">
                  <StickyNote className="w-4 h-4 text-amber-400" />
                  {notesCount進} {notesCount進 === 1 ? 'Annotation' : 'Annotations'}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                All customized milestone notes are embedded into the PDF table and dedicated findings box.
              </p>
            </div>
          </div>

          {/* Section Inclusions Checkboxes */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Report Sections & Visual Modules To Include:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeTimeSeriesChart}
                  onChange={(e) => setOptions({ ...options, includeTimeSeriesChart: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Rendered Time-Series Chart</div>
                    <div className="text-[10px] text-slate-400">High-DPI capture of active U(t), rate, memory curves</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeMilestoneTable}
                  onChange={(e) => setOptions({ ...options, includeMilestoneTable: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Milestone Table & User Notes</div>
                    <div className="text-[10px] text-slate-400">0% to 100% calculus step table + attached notes</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeDomainBenchmarks}
                  onChange={(e) => setOptions({ ...options, includeDomainBenchmarks: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Cross-Domain Benchmark Comparison</div>
                    <div className="text-[10px] text-slate-400">Side-by-side ratios for 4 physical & neural domains</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeNeuromorphicGuide}
                  onChange={(e) => setOptions({ ...options, includeNeuromorphicGuide: e.target.checked })}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-semibold text-slate-200">Neuromorphic Hardware Implications</div>
                    <div className="text-[10px] text-slate-400">Loihi / SpiNNaker memory trace minimization</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Document Preview Blueprint Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-mono font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Report Structure Preview
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-cyan-400 font-bold">Page 1: Overview</div>
                <div className="text-slate-400 mt-1">• Executive Title & Meta</div>
                <div className="text-slate-400">• 6 Core Physics KPIs</div>
                <div className="text-slate-400">• Continuous Calculus Box</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-emerald-400 font-bold">Chart Section</div>
                <div className="text-slate-400 mt-1">• Rendered Recharts Visual</div>
                <div className="text-slate-400">• Multi-Series Curves</div>
                <div className="text-slate-400">• Spectral Bound: Δ ≥ {simulationParams.spectralGap.toFixed(2)}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-amber-400 font-bold">Milestones & Notes</div>
                <div className="text-slate-400 mt-1">• Step 0% → 100% Table</div>
                <div className="text-slate-400">• Integrand Φ·(-dU/dt)</div>
                <div className="text-slate-400 font-semibold text-amber-300">• {notesCount進} Custom Notes</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="text-purple-400 font-bold">Cross-Domain & Guide</div>
                <div className="text-slate-400 mt-1">• 4-Domain Ratios</div>
                <div className="text-slate-400">• Neuromorphic Architecture</div>
                <div className="text-slate-400">• Watermark & Page No.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            {generationSuccess ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> PDF Report Generated & Downloaded!
              </span>
            ) : (
              <span>Standard A4 Multi-Page Printable PDF</span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-mono transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrintPdf}
              disabled={isGenerating}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
              title="Open Printable PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Direct Print
            </button>
            <button
              id="download-pdf-summary-btn"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
