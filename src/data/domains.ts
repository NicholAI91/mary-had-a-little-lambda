import { DomainMetrics } from '../types';

export const BENCHMARK_DOMAINS: DomainMetrics[] = [
  {
    id: 'neuroscience-stdp',
    name: 'Neuroscience — Synaptic Plasticity (STDP)',
    category: 'Neuroscience',
    tagline: 'Spike-Timing-Dependent Plasticity with rapid memory decay & high temporal sensitivity',
    generatedDate: '7/28/2026 7:48:20 AM',
    unitU: 'mV',
    unitLambda: 'mV·s',
    totalAccumulatedLambda: 0.344,
    totalPotentialDrop: 60.000,
    peakDissipationRate: 47.694,
    memoryHalfLife: 0.60,
    memoryEfficiencyRatio: 7.2,
    peakIntegrandValue: 47.694,
    ratioRateToHalfLife: 79.49,
    couplingConstantKc: 1.0,
    spectralGapMgap: 1.155, // gamma = ln(2)/0.60 = 1.155 s^-1
    description: 'Models biological neurotransmitter release and postsynaptic membrane voltage drop under high-frequency stimulation pulses.',
    biologicalPhysicalImplication: 'High ratio (79.49 s⁻²) and low memory efficiency (7.2%) enable ultra-fast synaptic adaptation without cumulative history saturation. Prevents synapses from permanently locking at maximum weight.',
    milestones: [
      { stepPercent: 0, time: 0.0, potential: 60.00, dissipationRate: 47.694, memoryWeight: 1.0000, integrand: 47.694, accumulatedLambda: 0.000 },
      { stepPercent: 20, time: 1.6, potential: 43.44, dissipationRate: 12.350, memoryWeight: 0.1575, integrand: 1.945, accumulatedLambda: 0.255 },
      { stepPercent: 40, time: 3.2, potential: 35.97, dissipationRate: 4.820, memoryWeight: 0.0248, integrand: 0.120, accumulatedLambda: 0.329 },
      { stepPercent: 60, time: 4.8, potential: 15.04, dissipationRate: 1.250, memoryWeight: 0.0039, integrand: 0.005, accumulatedLambda: 0.342 },
      { stepPercent: 80, time: 6.4, potential: 10.35, dissipationRate: 0.380, memoryWeight: 0.0006, integrand: 0.000, accumulatedLambda: 0.344 },
      { stepPercent: 100, time: 8.0, potential: 0.00, dissipationRate: 0.001, memoryWeight: 0.0001, integrand: 0.000, accumulatedLambda: 0.344 }
    ]
  },
  {
    id: 'rheology-polymers',
    name: 'Rheology & Polymer Viscoelasticity',
    category: 'Materials',
    tagline: 'Maxwell-Boltzmann stress relaxation in entangled macromolecular networks',
    generatedDate: '7/29/2026 11:20:14 AM',
    unitU: 'MPa',
    unitLambda: 'MPa·s',
    totalAccumulatedLambda: 45.990,
    totalPotentialDrop: 70.000,
    peakDissipationRate: 69.170,
    memoryHalfLife: 1.75,
    memoryEfficiencyRatio: 65.7,
    peakIntegrandValue: 43.200,
    ratioRateToHalfLife: 39.53,
    couplingConstantKc: 1.0,
    spectralGapMgap: 0.396, // gamma = ln(2)/1.75 = 0.396 s^-1
    description: 'Describes entropic spring recovery and reptation diffusion in cross-linked polymer melt under shear stress.',
    biologicalPhysicalImplication: 'Moderate ratio (39.53 s⁻²) and high efficiency (65.7%) reflect sustained viscoelastic hysteresis where chain entanglements store and release strain over long durations.',
    milestones: [
      { stepPercent: 0, time: 0.0, potential: 70.00, dissipationRate: 69.170, memoryWeight: 1.0000, integrand: 69.170, accumulatedLambda: 0.000 },
      { stepPercent: 20, time: 2.0, potential: 45.10, dissipationRate: 28.300, memoryWeight: 0.4530, integrand: 12.820, accumulatedLambda: 18.400 },
      { stepPercent: 40, time: 4.0, potential: 27.80, dissipationRate: 12.100, memoryWeight: 0.2052, integrand: 2.483, accumulatedLambda: 34.200 },
      { stepPercent: 60, time: 6.0, potential: 14.50, dissipationRate: 5.400, memoryWeight: 0.0930, integrand: 0.502, accumulatedLambda: 42.100 },
      { stepPercent: 80, time: 8.0, potential: 5.20, dissipationRate: 1.800, memoryWeight: 0.0421, integrand: 0.076, accumulatedLambda: 45.300 },
      { stepPercent: 100, time: 10.0, potential: 0.00, dissipationRate: 0.050, memoryWeight: 0.0191, integrand: 0.001, accumulatedLambda: 45.990 }
    ]
  },
  {
    id: 'fracture-mechanics',
    name: 'Fracture Mechanics & Dynamic Fatigue',
    category: 'Materials',
    tagline: 'Griffith energy release rate and microcrack tip plastic zone dissipation',
    generatedDate: '7/26/2026 3:14:02 PM',
    unitU: 'kJ/m²',
    unitLambda: 'kJ·s/m²',
    totalAccumulatedLambda: 289.255,
    totalPotentialDrop: 85.000,
    peakDissipationRate: 119.070,
    memoryHalfLife: 3.00,
    memoryEfficiencyRatio: 340.3,
    peakIntegrandValue: 119.070,
    ratioRateToHalfLife: 39.69,
    couplingConstantKc: 3.4,
    spectralGapMgap: 0.231, // gamma = ln(2)/3.00 = 0.231 s^-1
    description: 'Continuum damage mechanics evaluating strain energy release during micro-void coalescence and crack propagation.',
    biologicalPhysicalImplication: 'Extremely high memory efficiency (340.3%) due to structural hysteresis where plastic deformative work remains permanently integrated into the lattice microstructure.',
    milestones: [
      { stepPercent: 0, time: 0.0, potential: 85.00, dissipationRate: 119.070, memoryWeight: 1.0000, integrand: 119.070, accumulatedLambda: 0.000 },
      { stepPercent: 20, time: 3.0, potential: 52.30, dissipationRate: 46.500, memoryWeight: 0.5000, integrand: 23.250, accumulatedLambda: 115.600 },
      { stepPercent: 40, time: 6.0, potential: 28.90, dissipationRate: 19.800, memoryWeight: 0.2500, integrand: 4.950, accumulatedLambda: 218.400 },
      { stepPercent: 60, time: 9.0, potential: 12.40, dissipationRate: 7.200, memoryWeight: 0.1250, integrand: 0.900, accumulatedLambda: 268.100 },
      { stepPercent: 80, time: 12.0, potential: 3.10, dissipationRate: 1.900, memoryWeight: 0.0625, integrand: 0.119, accumulatedLambda: 284.900 },
      { stepPercent: 100, time: 15.0, potential: 0.00, dissipationRate: 0.020, memoryWeight: 0.0313, integrand: 0.001, accumulatedLambda: 289.255 }
    ]
  },
  {
    id: 'thermal-phase-change',
    name: 'Thermal Physics — Phase Change Memory',
    category: 'Thermal',
    tagline: 'Latent heat absorption and non-equilibrium thermal boundary layer memory',
    generatedDate: '8/15/2026 10:15:30 AM',
    unitU: 'J',
    unitLambda: 'J·s/K',
    totalAccumulatedLambda: 12.450,
    totalPotentialDrop: 150.000,
    peakDissipationRate: 120.500,
    memoryHalfLife: 2.50,
    memoryEfficiencyRatio: 8.3,
    peakIntegrandValue: 30.125,
    ratioRateToHalfLife: 48.20,
    couplingConstantKc: 0.25,
    spectralGapMgap: 0.277, // gamma = ln(2)/2.50 = 0.277 s^-1
    description: 'Enthalpy dissipation during solid-liquid phase transitions in phase-change materials (PCMs) with thermal hysteresis.',
    biologicalPhysicalImplication: 'Shows intermediate ratio (48.20 s⁻²) and low efficiency (8.3%), capturing rapid initial heat absorption followed by isothermal transition plateaus.',
    milestones: [
      { stepPercent: 0, time: 0.0, potential: 150.00, dissipationRate: 120.500, memoryWeight: 1.0000, integrand: 120.500, accumulatedLambda: 0.000 },
      { stepPercent: 20, time: 2.5, potential: 85.20, dissipationRate: 25.400, memoryWeight: 0.5000, integrand: 12.700, accumulatedLambda: 8.350 },
      { stepPercent: 40, time: 5.0, potential: 42.10, dissipationRate: 8.100, memoryWeight: 0.2500, integrand: 2.025, accumulatedLambda: 11.100 },
      { stepPercent: 60, time: 7.5, potential: 18.50, dissipationRate: 2.200, memoryWeight: 0.1250, integrand: 0.275, accumulatedLambda: 12.150 },
      { stepPercent: 80, time: 10.0, potential: 5.20, dissipationRate: 0.450, memoryWeight: 0.0625, integrand: 0.028, accumulatedLambda: 12.410 },
      { stepPercent: 100, time: 12.5, potential: 0.00, dissipationRate: 0.001, memoryWeight: 0.0313, integrand: 0.000, accumulatedLambda: 12.450 }
    ]
  }
];
