import React, { useState } from 'react';
import { MilestonePoint } from '../types';
import { Table, Copy, Check, Calculator, MessageSquarePlus, Edit3, Trash2, X, Tag, StickyNote } from 'lucide-react';

interface MilestoneTableProps {
  milestones: MilestonePoint[];
  unitU: string;
  unitLambda: string;
  domainName: string;
  onUpdateNote: (stepPercent: number, note: string) => void;
}

const NOTE_SUGGESTIONS = [
  '⚡ Peak dissipation rate onset',
  '⏱️ Memory half-life inflection threshold',
  '📉 Rapid non-linear exponential drop',
  '🔒 Hysteresis / memory preservation zone',
  '🎯 Target milestone verification point',
  '🛑 Asymptotic decay & cutoff boundary'
];

export const MilestoneTable: React.FC<MilestoneTableProps> = ({
  milestones,
  unitU,
  unitLambda,
  domainName,
  onUpdateNote
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
  // Note editing modal / inline state
  const [editingStep, setEditingStep] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const notesCount = milestones.filter(m => !!m.userNote?.trim()).length;

  const handleOpenNoteEditor = (stepPercent: number, currentNote?: string) => {
    setEditingStep(stepPercent);
    setNoteDraft(currentNote || '');
    setSelectedStep(stepPercent);
  };

  const handleSaveNote = () => {
    if (editingStep !== null) {
      onUpdateNote(editingStep, noteDraft.trim());
      setEditingStep(null);
    }
  };

  const handleDeleteNote = (stepPercent: number) => {
    onUpdateNote(stepPercent, '');
    if (editingStep === stepPercent) {
      setNoteDraft('');
      setEditingStep(null);
    }
  };

  const copyAsCsv = () => {
    const header = `Step %,Time (s),Potential U(t) [${unitU}],Rate -dU/dt [s^-1],Memory Weight Phi(t),Integrand Phi*(-dU/dt),Accumulated Lambda(t) [${unitLambda}],User Note\n`;
    const rows = milestones
      .map(
        m =>
          `${m.stepPercent}%,${m.time.toFixed(2)},${m.potential.toFixed(2)},${m.dissipationRate.toFixed(3)},${m.memoryWeight.toFixed(4)},${m.integrand.toFixed(3)},${m.accumulatedLambda.toFixed(3)},"${(m.userNote || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    navigator.clipboard.writeText(header + rows);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeMilestone = selectedStep !== null 
    ? milestones.find(m => m.stepPercent === selectedStep) 
    : milestones[1] || milestones[0];

  return (
    <div id="milestone-data-table-section" className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-400" />
            MILESTONE TIME-SERIES EVALUATION DATA POINTS
            {notesCount > 0 && (
              <span className="ml-2 text-xs px-2.5 py-0.5 bg-amber-950/80 border border-amber-500/50 text-amber-300 rounded-full font-mono font-medium flex items-center gap-1">
                <StickyNote className="w-3 h-3 text-amber-400" />
                {notesCount} custom {notesCount === 1 ? 'note' : 'notes'} attached
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400">
            Precision numerical integration steps with custom user annotations saved in the exported JSON report for <span className="text-amber-400 font-mono">{domainName}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-milestone-csv-btn"
            onClick={copyAsCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {copied ? 'Copied CSV!' : 'Copy Table CSV'}
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/90">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3.5 text-center">Step %</th>
              <th className="py-3 px-3.5">Time t (s)</th>
              <th className="py-3 px-3.5">Potential U(t) ({unitU})</th>
              <th className="py-3 px-3.5">Rate -dU/dt (s⁻¹)</th>
              <th className="py-3 px-3.5">Memory Weight Φ(t)</th>
              <th className="py-3 px-3.5">Integrand Φ·(-dU/dt)</th>
              <th className="py-3 px-3.5">Accumulated Λ(t) ({unitLambda})</th>
              <th className="py-3 px-3.5 text-right">User Notes / Annotations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {milestones.map((m) => {
              const isSelected = selectedStep === m.stepPercent;
              const hasNote = !!m.userNote?.trim();
              return (
                <tr
                  key={m.stepPercent}
                  onClick={() => setSelectedStep(m.stepPercent)}
                  className={`hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-950/30 text-amber-200' : 'text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3.5 text-center font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      m.stepPercent === 0 
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' 
                        : m.stepPercent === 100 
                        ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {m.stepPercent}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3.5 font-bold text-slate-200">{m.time.toFixed(2)}s</td>
                  <td className="py-2.5 px-3.5 text-cyan-400">{m.potential.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 text-emerald-400">{m.dissipationRate.toFixed(3)}</td>
                  <td className="py-2.5 px-3.5 text-amber-400">{m.memoryWeight.toFixed(4)}</td>
                  <td className="py-2.5 px-3.5 text-purple-400 font-bold">{m.integrand.toFixed(3)}</td>
                  <td className="py-2.5 px-3.5 text-pink-400 font-bold">{m.accumulatedLambda.toFixed(3)}</td>
                  <td className="py-2.5 px-3.5 text-right">
                    {hasNote ? (
                      <div className="inline-flex items-center gap-1.5 max-w-[220px]">
                        <span 
                          className="truncate text-[11px] font-sans text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded text-left"
                          title={m.userNote}
                        >
                          {m.userNote}
                        </span>
                        <button
                          id={`edit-note-btn-${m.stepPercent}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenNoteEditor(m.stepPercent, m.userNote);
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-300 transition-colors"
                          title="Edit Note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`delete-note-btn-${m.stepPercent}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(m.stepPercent);
                          }}
                          className="p-1 hover:bg-red-950/50 rounded text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`add-note-btn-${m.stepPercent}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenNoteEditor(m.stepPercent);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/50 text-slate-400 hover:text-amber-300 text-[11px] transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Add Note</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Note Editor Drawer / Modal */}
      {editingStep !== null && (
        <div id="milestone-note-editor-card" className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-500/60 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-950/80 border border-amber-500/50 text-amber-400">
                <Edit3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-100 font-mono">
                  CUSTOM NOTE FOR STEP {editingStep}% (t = {milestones.find(m => m.stepPercent === editingStep)?.time.toFixed(2)}s)
                </h4>
                <p className="text-[11px] text-slate-400">
                  This note will be linked to step {editingStep}% and exported in the final JSON evaluation report.
                </p>
              </div>
            </div>
            <button
              id="close-note-editor-btn"
              onClick={() => setEditingStep(null)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <textarea
                id="milestone-note-textarea"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Enter custom physical, biological, or numerical observations (e.g., 'Spike burst begins here', 'Hysteresis threshold reached')..."
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Quick Suggestion Tags */}
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                <Tag className="w-3 h-3 text-amber-400" /> Quick Suggestion Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {NOTE_SUGGESTIONS.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNoteDraft(prev => prev ? `${prev} • ${sug}` : sug)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-amber-300 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                id="cancel-note-btn"
                onClick={() => setEditingStep(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
              >
                Cancel
              </button>
              {milestones.find(m => m.stepPercent === editingStep)?.userNote && (
                <button
                  type="button"
                  id="delete-current-note-btn"
                  onClick={() => handleDeleteNote(editingStep)}
                  className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 text-xs font-mono transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete Note
                </button>
              )}
              <button
                type="button"
                id="save-note-btn"
                onClick={handleSaveNote}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Check className="w-3.5 h-3.5" /> Save Note to Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step Calculus Inspector Box */}
      {activeMilestone && (
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-950/60 border border-amber-500/40 rounded text-amber-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Inspecting Step {activeMilestone.stepPercent}% (t = {activeMilestone.time.toFixed(2)}s):</span>
                {activeMilestone.userNote ? (
                  <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/40 text-amber-300 rounded text-[10px] flex items-center gap-1">
                    <StickyNote className="w-3 h-3" /> Note: {activeMilestone.userNote}
                  </span>
                ) : (
                  <button
                    onClick={() => handleOpenNoteEditor(activeMilestone.stepPercent)}
                    className="text-[10px] text-amber-400/80 hover:text-amber-300 underline"
                  >
                    + Add note to this step
                  </button>
                )}
              </div>
              <div className="text-amber-300 font-bold mt-0.5">
                Integrand = {activeMilestone.memoryWeight.toFixed(4)} × {activeMilestone.dissipationRate.toFixed(3)} = {activeMilestone.integrand.toFixed(3)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <div>
              <span className="text-slate-500">Cumulative Λ(t): </span>
              <span className="text-pink-400 font-bold">{activeMilestone.accumulatedLambda.toFixed(3)} {unitLambda}</span>
            </div>
            <div>
              <span className="text-slate-500">Remaining U(t): </span>
              <span className="text-cyan-400 font-bold">{activeMilestone.potential.toFixed(2)} {unitU}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
