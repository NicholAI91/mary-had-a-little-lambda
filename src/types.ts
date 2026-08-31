export interface MilestonePoint {
  stepPercent: number; // 0 to 100
  time: number; // seconds
  potential: number; // U(t)
  dissipationRate: number; // -dU/dt
  memoryWeight: number; // Phi(t)
  integrand: number; // Phi(t) * (-dU/dt)
  accumulatedLambda: number; // Lambda(t)
  userNote?: string; // Custom user annotation / note
}

export interface DomainMetrics {
  id: string;
  name: string;
  category: 'Neuroscience' | 'Materials' | 'Thermal' | 'Custom';
  tagline: string;
  generatedDate: string;
  unitU: string;
  unitLambda: string;
  totalAccumulatedLambda: number;
  totalPotentialDrop: number;
  peakDissipationRate: number; // /s
  memoryHalfLife: number; // s (T_1/2)
  memoryEfficiencyRatio: number; // %
  peakIntegrandValue: number;
  ratioRateToHalfLife: number; // Peak Dissipation Rate / T_1/2
  couplingConstantKc: number;
  spectralGapMgap: number; // meV or arbitrary quantum units
  description: string;
  biologicalPhysicalImplication: string;
  milestones: MilestonePoint[];
}

export interface SimulationParams {
  initialPotential: number;
  halfLife: number; // s
  couplingConstant: number;
  spectralGap: number; // normalized units
  duration: number; // total time s
  steps: number; // number of evaluation slices
  decayModel: 'exponential' | 'power-law' | 'stretched-exp';
  stimulusType: 'step-drop' | 'pulse-train' | 'linear-ramp' | 'double-spike';
}
