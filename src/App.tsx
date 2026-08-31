import React, { useState, useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { BENCHMARK_DOMAINS } from './data/domains';
import { SimulationParams, DomainMetrics } from './types';
import { runPhysicsSimulation } from './utils/physicsEngine';
import { Header } from './components/Header';
import { KPIGrid } from './components/KPIGrid';
import { MathFormulaCard } from './components/MathFormulaCard';
import { SpectralGapVisualizer } from './components/SpectralGapVisualizer';
import { TimeSeriesChart } from './components/TimeSeriesChart';
import { DomainComparison } from './components/DomainComparison';
import { MilestoneTable } from './components/MilestoneTable';
import { InteractiveSandbox } from './components/InteractiveSandbox';
import { ImplicationsGuide } from './components/ImplicationsGuide';

export default function App() {
  const [activeDomainId, setActiveDomainId] = useState<string>('neuroscience-stdp');
  // Store custom notes keyed by domainId and stepPercent
  const [milestoneNotes, setMilestoneNotes] = useState<Record<string, Record<number, string>>>({});

  // Find active domain definition
  const activeDomain = useMemo(() => {
    return BENCHMARK_DOMAINS.find(d => d.id === activeDomainId) || BENCHMARK_DOMAINS[0];
  }, [activeDomainId]);

  // Simulation Parameters state
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    initialPotential: activeDomain.totalPotentialDrop,
    halfLife: activeDomain.memoryHalfLife,
    couplingConstant: activeDomain.couplingConstantKc,
    spectralGap: activeDomain.spectralGapMgap,
    duration: 8.0,
    steps: 80,
    decayModel: 'exponential',
    stimulusType: 'step-drop'
  });

  // Switch domain handler
  const handleSelectDomain = (domainId: string) => {
    setActiveDomainId(domainId);
    const target = BENCHMARK_DOMAINS.find(d => d.id === domainId);
    if (target) {
      setSimulationParams({
        initialPotential: target.totalPotentialDrop,
        halfLife: target.memoryHalfLife,
        couplingConstant: target.couplingConstantKc,
        spectralGap: target.spectralGapMgap,
        duration: domainId === 'neuroscience-stdp' ? 8.0 : domainId === 'fracture-mechanics' ? 15.0 : 12.0,
        steps: 80,
        decayModel: 'exponential',
        stimulusType: 'step-drop'
      });
    }
  };

  // Spectral gap tuning handler
  const handleGapChange = (newGap: number) => {
    const derivedHalfLife = Number((Math.LN2 / Math.max(0.05, newGap)).toFixed(2));
    setSimulationParams(prev => ({
      ...prev,
      spectralGap: newGap,
      halfLife: derivedHalfLife
    }));
  };

  // Live simulation execution
  const simulationResult = useMemo(() => {
    return runPhysicsSimulation(simulationParams);
  }, [simulationParams]);

  // Display metrics (use benchmark values for exact consistency with report when on default domain params, or live sim values if tweaked)
  const currentMetrics = useMemo(() => {
    const isDefault = 
      Math.abs(simulationParams.halfLife - activeDomain.memoryHalfLife) < 0.001 &&
      Math.abs(simulationParams.initialPotential - activeDomain.totalPotentialDrop) < 0.001 &&
      Math.abs(simulationParams.couplingConstant - activeDomain.couplingConstantKc) < 0.001;

    if (isDefault) {
      return {
        totalLambda: activeDomain.totalAccumulatedLambda,
        totalPotentialDrop: activeDomain.totalPotentialDrop,
        peakDissipationRate: activeDomain.peakDissipationRate,
        memoryHalfLife: activeDomain.memoryHalfLife,
        ratio: activeDomain.ratioRateToHalfLife,
        memoryEfficiency: activeDomain.memoryEfficiencyRatio,
        peakIntegrand: activeDomain.peakIntegrandValue
      };
    }

    return {
      totalLambda: simulationResult.totalLambda,
      totalPotentialDrop: simulationResult.totalPotentialDrop,
      peakDissipationRate: simulationResult.peakDissipationRate,
      memoryHalfLife: simulationResult.memoryHalfLife,
      ratio: simulationResult.ratio,
      memoryEfficiency: simulationResult.memoryEfficiency,
      peakIntegrand: simulationResult.peakIntegrand
    };
  }, [activeDomain, simulationParams, simulationResult]);

  // Update note for a specific milestone
  const handleUpdateNote = (stepPercent: number, note: string) => {
    setMilestoneNotes(prev => ({
      ...prev,
      [activeDomainId]: {
        ...(prev[activeDomainId] || {}),
        [stepPercent]: note
      }
    }));
  };

  // Milestone points (benchmark or simulation) with custom attached user notes
  const activeMilestones = useMemo(() => {
    const isDefault = 
      Math.abs(simulationParams.halfLife - activeDomain.memoryHalfLife) < 0.001 &&
      Math.abs(simulationParams.initialPotential - activeDomain.totalPotentialDrop) < 0.001;

    const baseMilestones = isDefault ? activeDomain.milestones : simulationResult.milestones;
    const domainNotes = milestoneNotes[activeDomainId] || {};

    return baseMilestones.map(m => ({
      ...m,
      userNote: domainNotes[m.stepPercent] || ''
    }));
  }, [activeDomain, simulationParams, simulationResult, milestoneNotes, activeDomainId]);

  // Export JSON Report
  const handleExportJson = () => {
    const annotatedNotes = activeMilestones
      .filter(m => !!m.userNote?.trim())
      .map(m => ({ stepPercent: m.stepPercent, time: m.time, note: m.userNote }));

    const reportData = {
      title: 'LAMBDA DISSIPATION MODEL EVALUATION REPORT',
      domain: activeDomain.name,
      exportTimestamp: new Date().toISOString(),
      masterFormula: 'Lambda(t) = Kc * Integral_0^T [ Phi(t) * (-dU/dt) ] dt',
      spectralGapTheorem: 'Delta = inf{E > 0 : H|Psi> = E|Psi>, P|Psi> = 0} >= m_gap > 0',
      keyMetrics: {
        peakDissipationRate: `${currentMetrics.peakDissipationRate.toFixed(3)} /s`,
        memoryHalfLife: `${currentMetrics.memoryHalfLife.toFixed(2)} s`,
        peakRateToHalfLifeRatio: `${currentMetrics.ratio.toFixed(2)} s^-2`,
        totalAccumulatedLambda: `${currentMetrics.totalLambda.toFixed(3)} ${activeDomain.unitLambda}`,
        totalPotentialDrop: `${currentMetrics.totalPotentialDrop.toFixed(2)} ${activeDomain.unitU}`,
        memoryEfficiencyRatio: `${currentMetrics.memoryEfficiency.toFixed(1)}%`
      },
      userAnnotationsSummary: {
        totalAnnotatedMilestones: annotatedNotes.length,
        notes: annotatedNotes
      },
      milestoneDataPoints: activeMilestones.map(m => ({
        stepPercent: m.stepPercent,
        timeSeconds: m.time,
        potential_U: m.potential,
        dissipationRate_minus_dU_dt: m.dissipationRate,
        memoryWeight_Phi: m.memoryWeight,
        integrand_Phi_times_rate: m.integrand,
        accumulatedLambda: m.accumulatedLambda,
        userNote: m.userNote || null
      })),
      simulationParameters: simulationParams
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lambda-dissipation-report-${activeDomain.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Header */}
      <Header
        domains={BENCHMARK_DOMAINS}
        activeDomain={activeDomain}
        onSelectDomain={handleSelectDomain}
        onExportReport={handleExportJson}
        onPrint={handlePrint}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Metrics Summary Grid */}
        <KPIGrid metrics={currentMetrics} domain={activeDomain} />

        {/* Master Formula & Mathematical Foundations */}
        <MathFormulaCard
          currentDomainName={activeDomain.name}
          halfLife={currentMetrics.memoryHalfLife}
          peakRate={currentMetrics.peakDissipationRate}
          ratio={currentMetrics.ratio}
          couplingConstantKc={simulationParams.couplingConstant}
        />

        {/* Main Simulation View: Time Series Chart & Quantum Spectral Gap Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TimeSeriesChart
              data={simulationResult.curves}
              unitU={activeDomain.unitU}
              unitLambda={activeDomain.unitLambda}
              domainName={activeDomain.name}
            />
          </div>
          <div className="lg:col-span-1">
            <SpectralGapVisualizer
              spectralGap={simulationParams.spectralGap}
              halfLife={simulationParams.halfLife}
              onGapChange={handleGapChange}
              domainName={activeDomain.name.split('—')[0].trim()}
            />
          </div>
        </div>

        {/* Cross-Domain Comparative Benchmark */}
        <DomainComparison
          domains={BENCHMARK_DOMAINS}
          activeDomainId={activeDomainId}
          onSelectDomain={handleSelectDomain}
        />

        {/* Milestone Time-Series Data Points Table */}
        <MilestoneTable
          milestones={activeMilestones}
          unitU={activeDomain.unitU}
          unitLambda={activeDomain.unitLambda}
          domainName={activeDomain.name}
          onUpdateNote={handleUpdateNote}
        />

        {/* Interactive Physical Parameter Sandbox & Testing Calculator */}
        <InteractiveSandbox
          params={simulationParams}
          onParamsChange={setSimulationParams}
          onResetToPreset={handleSelectDomain}
          calculatedRatio={currentMetrics.ratio}
          calculatedEfficiency={currentMetrics.memoryEfficiency}
        />

        {/* Scientific Implications & Architectural Guide */}
        <ImplicationsGuide />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lambda Dissipation Model & Quantum Spectral Gap Analytics Engine</span>
          <span>Continuous Memory-Weighted Dissipation Calculus • Δ ≥ m_gap &gt; 0</span>
        </div>
      </footer>
    </div>
  );
}
