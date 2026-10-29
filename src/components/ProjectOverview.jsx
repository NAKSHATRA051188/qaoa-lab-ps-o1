import React from 'react';
import { 
  Radio, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Binary, 
  Activity, 
  Layers, 
  Share2, 
  Sparkles,
  Info,
  ShieldCheck,
  Signal,
  WifiOff
} from 'lucide-react';

export default function ProjectOverview({ benchmarkData }) {
  const verifiedStats = [
    { label: 'Transmitters', value: '6 Nodes', sub: 'Tx0 – Tx5 (Qubits q0–q5)' },
    { label: 'Conflict Edges', value: '9 Links', sub: 'Interference severity 1–5' },
    { label: 'Total Conflict', value: '27.0', sub: 'Worst-case overlap weight' },
    { label: 'Max Isolated Cut', value: '22.0', sub: 'Optimal channel separation' },
    { label: 'Random Expectation', value: '13.5', sub: '50% baseline cut' },
    { label: 'QAOA Circuit Depth', value: 'p = 1', sub: 'Required by PS-O1' },
    { label: 'Parameter Seeds', value: '5 Seeds (0–4)', sub: 'Uniform [0, π]' },
    { label: 'Measurement Shots', value: '4,096', sub: 'Per execution run' },
  ];

  return (
    <section id="overview" className="space-y-6 pt-2">
      {/* Executive Hero Banner with the Wireless Transmitter Narrative */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-carbon-900 via-carbon-850 to-carbon-950 border border-carbon-700/80 p-6 md:p-9 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-solar-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-96 h-96 bg-mint-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-950/80 border border-solar-500/40 text-solar-300 text-xs font-mono font-semibold">
            <Radio className="w-3.5 h-3.5 text-solar-400 animate-pulse" />
            <span>Wireless Transmitter Co-Channel Optimization · QFF 2026 PS-O1</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight font-sans">
            Optimizing Transmitter Channels <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-solar-400 via-solar-300 to-mint-400">
              using Weighted Max-Cut & QAOA
            </span>
          </h1>

          {/* User's Exact Core Narrative */}
          <div className="p-5 rounded-xl bg-carbon-950/90 border border-carbon-700 text-slate-200 text-sm md:text-base leading-relaxed space-y-3">
            <p className="text-slate-100 font-medium leading-relaxed">
              <strong className="text-solar-300 font-bold">The Problem:</strong> Imagine a wireless network where nearby transmitters interfere with each other. If two heavily interfering transmitters use the same channel, network performance can suffer.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our project explores this problem using <strong className="text-white">weighted Max-Cut</strong> and the <strong className="text-white">Quantum Approximate Optimization Algorithm (QAOA)</strong>. We represent each transmitter as a vertex, each potential interference relationship as an edge, and the severity of that conflict as an edge weight. The goal is to divide the vertices into two groups so that the total weight of edges crossing between the groups is maximized. These groups represent two candidate channels: <span className="text-solar-400 font-semibold font-mono">Channel Alpha</span> and <span className="text-mint-400 font-semibold font-mono">Channel Beta</span>.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              We encode this objective as a QUBO and cost Hamiltonian, run QAOA at the required depth ($p=1$), and compare the sampled solutions against an exact classical optimum (22.0). We also evaluate how processor connectivity and simulated noise affect circuit depth, gate overhead, and solution quality.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-200 bg-carbon-800/90 px-3.5 py-1.5 rounded-lg border border-carbon-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-mint-400" />
              <span>Locked: 6 Transmitters, 9 Conflict Edges</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200 bg-carbon-800/90 px-3.5 py-1.5 rounded-lg border border-carbon-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-solar-400" />
              <span>Exact Classical Optimum = 22.0 / 27.0</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200 bg-carbon-800/90 px-3.5 py-1.5 rounded-lg border border-carbon-700 font-mono">
              <span className="w-2 h-2 rounded-full bg-crimson-400" />
              <span>Official Noise: 0.1% 1Q, 0.5% 2Q CX, 1% Readout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Benchmark Metrics High-Contrast Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {verifiedStats.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-carbon-900 border border-carbon-750 p-3 flex flex-col justify-between hover:border-carbon-600 transition-colors"
          >
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{item.label}</span>
            <div className="my-1.5 text-xl font-extrabold font-mono text-solar-400 tracking-tight">{item.value}</div>
            <span className="text-[10px] text-slate-400 font-mono truncate">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Research Objective & Scientific Integrity Callout */}
      <div className="rounded-xl border border-solar-500/40 bg-solar-950/20 p-4.5 flex items-start gap-3.5 text-solar-200">
        <AlertTriangle className="w-5 h-5 text-solar-400 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1.5">
          <div className="font-bold text-solar-300 flex items-center gap-2 font-mono">
            RESEARCH OBJECTIVE & SCIENTIFIC REALISM
          </div>
          <p className="text-xs text-solar-100/90 leading-relaxed">
            Our goal is <strong>not</strong> to claim that a small quantum simulation already outperforms classical optimization in real networks. 
            Instead, we demonstrate a rigorous optimization workflow, measure its limitations, and investigate whether quantum algorithms could become useful 
            for structured network optimization as the hardware improves.
          </p>
        </div>
      </div>

      {/* 4 Pillars Grid with High Contrast */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Conflict Graph to Max-Cut */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 flex flex-col justify-between hover:border-carbon-600 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-solar-500/15 border border-solar-500/30 flex items-center justify-center text-solar-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">1. Conflict Graph Formulation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Nearby transmitters sharing frequencies generate mutual RF interference. We model interference relationships as weighted edges $w_{ij}$, mapping frequency assignment to binary graph partitioning.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-carbon-950 border border-carbon-800 font-mono text-[11px] text-solar-300">
            C(x) = ∑ w_ij (x_i + x_j - 2 x_i x_j)
          </div>
        </div>

        {/* Card 2: Two Candidate Channels */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 flex flex-col justify-between hover:border-carbon-600 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-mint-500/15 border border-mint-500/30 flex items-center justify-center text-mint-400">
              <Radio className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">2. Two Candidate Channels</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vertices assigned to <strong className="text-solar-400">Channel Alpha (0)</strong> and <strong className="text-mint-400">Channel Beta (1)</strong> isolate adjacent transmitters. Edges crossing channels represent resolved interference.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-carbon-800 pt-2 flex items-center gap-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-mint-400 shrink-0" />
            <span>Avoided interference = Cut weight</span>
          </div>
        </div>

        {/* Card 3: QAOA Variational Ansatz */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 flex flex-col justify-between hover:border-carbon-600 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-electric-500/15 border border-electric-500/30 flex items-center justify-center text-electric-400">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">3. QAOA Optimization ($p=1$)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We encode the objective into an Ising Hamiltonian $H_C = \sum w_{ij} Z_i Z_j$, applying 2-qubit phase rotations and transverse mixer pulses $R_X(2\beta)$, tuned by a classical optimizer.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-carbon-800 pt-2 font-mono">
            {'Ansatz: |ψ(γ,β)⟩ = e^{-iβ H_M} e^{-iγ H_C} |+⟩^⊗6'}
          </div>
        </div>

        {/* Card 4: Hardware Constraints & Noise */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 flex flex-col justify-between hover:border-carbon-600 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-crimson-500/15 border border-crimson-500/30 flex items-center justify-center text-crimson-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">4. Topology & Noise Impact</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We measure how hardware connectivity on Processor B forces routing SWAPs and CX gate overhead, and test our proposed custom Processor D to eliminate compilation penalties.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-carbon-800 pt-2 font-mono">
            Metrics: CX overhead, depth, fidelity, $P_{opt}$
          </div>
        </div>
      </div>
    </section>
  );
}
