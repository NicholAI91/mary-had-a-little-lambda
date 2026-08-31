import { MilestonePoint, SimulationParams } from '../types';

export interface GeneratedCurvePoint {
  time: number;
  timeFormatted: string;
  potential: number;
  dissipationRate: number;
  memoryWeight: number;
  integrand: number;
  accumulatedLambda: number;
}

export interface SimulationResult {
  curves: GeneratedCurvePoint[];
  milestones: MilestonePoint[];
  totalLambda: number;
  totalPotentialDrop: number;
  peakDissipationRate: number;
  memoryHalfLife: number;
  ratio: number;
  memoryEfficiency: number;
  peakIntegrand: number;
  relaxationRateGamma: number;
  spectralGapDerived: number;
}

export function calculateMemoryWeight(t: number, halfLife: number, model: SimulationParams['decayModel'] = 'exponential'): number {
  if (t <= 0) return 1.0;
  if (halfLife <= 0.0001) return 0.0;

  switch (model) {
    case 'exponential':
      // Phi(t) = 2^(-t / T_1/2) = e^(-gamma * t) where gamma = ln(2)/T_1/2
      return Math.pow(2, -t / halfLife);
    case 'power-law':
      // Phi(t) = (1 + t / T_1/2)^(-1.5)
      return Math.pow(1 + t / halfLife, -1.5);
    case 'stretched-exp':
      // Phi(t) = exp( - (t / T_1/2)^0.6 * ln(2) )
      return Math.exp(-Math.pow(t / halfLife, 0.6) * Math.LN2);
    default:
      return Math.pow(2, -t / halfLife);
  }
}

export function calculatePotential(
  t: number,
  totalT: number,
  u0: number,
  stimulus: SimulationParams['stimulusType']
): number {
  if (t <= 0) return u0;
  if (t >= totalT) return 0;

  const tau = totalT / 3.5; // characteristic discharge rate

  switch (stimulus) {
    case 'step-drop':
      // Exponential decay of potential: U(t) = U0 * exp(-t / tau)
      return u0 * Math.exp(-t / tau);

    case 'pulse-train': {
      // Periodic burst spikes that dissipate
      const cycle = totalT / 4;
      const localT = t % cycle;
      const baseline = u0 * Math.exp(-t / (totalT / 2));
      const spike = (u0 * 0.4) * Math.sin((localT / cycle) * Math.PI);
      return Math.max(0, baseline + spike);
    }

    case 'double-spike': {
      // Classic STDP pre/post synaptic double spike
      const spike1 = u0 * Math.exp(-Math.pow((t - totalT * 0.15) / (totalT * 0.06), 2));
      const spike2 = (u0 * 0.7) * Math.exp(-Math.pow((t - totalT * 0.45) / (totalT * 0.08), 2));
      const base = u0 * Math.exp(-t / tau) * 0.6;
      return Math.min(u0, base + spike1 + spike2);
    }

    case 'linear-ramp':
    default:
      return Math.max(0, u0 * (1 - t / totalT));
  }
}

export function runPhysicsSimulation(params: SimulationParams): SimulationResult {
  const { initialPotential, halfLife, couplingConstant, duration, steps, decayModel, stimulusType } = params;
  const numSteps = Math.max(steps, 60);
  const dt = duration / (numSteps - 1);

  const rawTimes: number[] = [];
  const rawPotentials: number[] = [];

  for (let i = 0; i < numSteps; i++) {
    const t = i * dt;
    rawTimes.push(t);
    rawPotentials.push(calculatePotential(t, duration, initialPotential, stimulusType));
  }

  // Calculate derivatives -dU/dt
  const rawRates: number[] = [];
  for (let i = 0; i < numSteps; i++) {
    if (i === 0) {
      const du = rawPotentials[0] - rawPotentials[1];
      rawRates.push(Math.max(0, du / dt));
    } else if (i === numSteps - 1) {
      const du = rawPotentials[numSteps - 2] - rawPotentials[numSteps - 1];
      rawRates.push(Math.max(0, du / dt));
    } else {
      const du = rawPotentials[i - 1] - rawPotentials[i + 1];
      rawRates.push(Math.max(0, du / (2 * dt)));
    }
  }

  // Smooth / enforce peak rate alignment if step-drop
  if (stimulusType === 'step-drop' && rawRates[0] < rawRates[1]) {
    rawRates[0] = rawRates[1] * 1.2;
  }

  // Numerical Integration for Lambda(t)
  const curves: GeneratedCurvePoint[] = [];
  let accumulatedLambda = 0;
  let peakDissipationRate = 0;
  let peakIntegrand = 0;

  for (let i = 0; i < numSteps; i++) {
    const t = rawTimes[i];
    const u = rawPotentials[i];
    const rate = rawRates[i];
    const phi = calculateMemoryWeight(t, halfLife, decayModel);
    const integrand = phi * rate;

    if (rate > peakDissipationRate) peakDissipationRate = rate;
    if (integrand > peakIntegrand) peakIntegrand = integrand;

    if (i > 0) {
      const prevPhi = calculateMemoryWeight(rawTimes[i - 1], halfLife, decayModel);
      const prevIntegrand = prevPhi * rawRates[i - 1];
      // Trapezoidal rule integration
      const trap = 0.5 * (prevIntegrand + integrand) * dt;
      accumulatedLambda += couplingConstant * trap;
    }

    curves.push({
      time: Number(t.toFixed(3)),
      timeFormatted: `${t.toFixed(2)}s`,
      potential: Number(u.toFixed(3)),
      dissipationRate: Number(rate.toFixed(3)),
      memoryWeight: Number(phi.toFixed(4)),
      integrand: Number(integrand.toFixed(3)),
      accumulatedLambda: Number(accumulatedLambda.toFixed(4))
    });
  }

  // Milestones at 0%, 20%, 40%, 60%, 80%, 100%
  const milestones: MilestonePoint[] = [0, 20, 40, 60, 80, 100].map(pct => {
    const targetIdx = Math.min(
      Math.round((pct / 100) * (numSteps - 1)),
      numSteps - 1
    );
    const pt = curves[targetIdx];
    return {
      stepPercent: pct,
      time: pt.time,
      potential: pt.potential,
      dissipationRate: pt.dissipationRate,
      memoryWeight: pt.memoryWeight,
      integrand: pt.integrand,
      accumulatedLambda: pt.accumulatedLambda
    };
  });

  const totalPotentialDrop = Math.max(0.001, initialPotential - curves[curves.length - 1].potential);
  const ratio = halfLife > 0 ? peakDissipationRate / halfLife : 0;
  const memoryEfficiency = (accumulatedLambda / totalPotentialDrop) * 100;
  const relaxationRateGamma = halfLife > 0 ? Math.LN2 / halfLife : 0;
  const spectralGapDerived = relaxationRateGamma; // in quantum units where hbar = 1

  return {
    curves,
    milestones,
    totalLambda: accumulatedLambda,
    totalPotentialDrop,
    peakDissipationRate,
    memoryHalfLife: halfLife,
    ratio,
    memoryEfficiency,
    peakIntegrand,
    relaxationRateGamma,
    spectralGapDerived
  };
}
