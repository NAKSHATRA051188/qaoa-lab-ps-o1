import React from 'react';
import { 
  Network, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Binary, 
  Activity, 
  Layers, 
  Share2, 
  Sparkles,
  Info
} from 'lucide-react';

export default function ProjectOverview({ benchmarkData }) {
  const verifiedStats = [
    { label: 'Graph Vertices', value: '6', sub: 'Qubits q0 – q5' },
    { label: 'Weighted Edges', value: '9', sub: 'Integer weights 1 – 5' },
    { label: 'Total Edge Weight', value: '27', sub: 'Sum of all w_ij' },
    { label: 'Classical Max-Cut', value: '22', sub: 'Exact global optimum' },
    { label: 'Random Expectation', value: '13.5', sub: '50% partition baseline' },
    { label: 'QAOA Circuit Depth', value: 'p = 1', sub: 'Required by PS-O1' },
    { label: 'Init Seeds', value: '5 (0–4)', sub: 'Uniform [0, π]' },
    { label: 'Sampling Shots', value: '4,096', sub: 'Per execution run' },
  ];

  return (
    <section id="overview" className="space-y-6 pt-4">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#0c1427] border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Qiskit Fall Fest 2026 · Phase 2 Optimization Track · PS-O1</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Quantum-Aware Network Partitioning <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              using QAOA on Constrained Processors
            </span>
          </h1>

          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Welcome to the interactive research lab for <strong className="text-white">Team HACKSMITHS</strong>. 
            We benchmark the performance, circuit synthesis, and hardware routing overhead of solving the 
            organizers' locked 6-node weighted Max-Cut problem using <span className="text-cyan-400 font-mono">p=1 QAOA</span> across 
            standard reference and custom hardware topologies.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Benchmark locked in <code className="font-mono text-cyan-300">instances.json</code></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Standardized with <code className="font-mono text-cyan-300">qff_phase2.py</code></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Official noise model: Depolarizing + Readout Bitflip</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Benchmark Facts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {verifiedStats.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-slate-900/70 border border-slate-800/90 p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <span className="text-[11px] font-medium text-slate-400">{item.label}</span>
            <div className="my-1 text-xl font-bold font-mono text-cyan-300 tracking-tight">{item.value}</div>
            <span className="text-[10px] text-slate-500 font-mono truncate">{item.sub}</span>
          </div>
        ))}
      </div>

      {/* Scientific Integrity Callout (No Quantum Advantage Claimed) */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4.5 flex items-start gap-3.5 text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-2">
            Scientific Integrity Notice — No Quantum Advantage Claimed
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            A 6-vertex weighted graph has exactly <span className="font-mono font-semibold">2⁶ = 64</span> possible partition bitstrings, which 
            a classical computer evaluates in less than one millisecond. The objective of this study is <strong>not</strong> to claim supremacy 
            or classical speedup on a toy problem. Rather, we rigorously examine the <strong>variational convergence</strong>, 
            <strong>compilation depth</strong>, and <strong>hardware routing penalty</strong> imposed by sparse physical coupler constraints 
            when targeting NISQ (Noisy Intermediate-Scale Quantum) devices.
          </p>
        </div>
      </div>

      {/* Core Conceptual Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: What is Weighted Max-Cut */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">What is Weighted Max-Cut?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Given an undirected graph G = (V, E) with edge weights w_ij, the <strong>Max-Cut</strong> problem seeks to partition vertices 
              into two disjoint sets S and V \ S such that the sum of edge weights traversing the boundary is maximized.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-[11px] text-cyan-300 space-y-1">
              <div>C(x) = ∑_(i,j) w_ij · (x_i + x_j - 2 x_i x_j)</div>
              <div className="text-slate-400 text-[10px]">where x_i ∈ {"{0, 1}"} represents set membership.</div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>NP-complete decision problem; fundamental in discrete optimization.</span>
          </div>
        </div>

        {/* Card 2: Why Network Partitioning Matters */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Why Partitioning is an Optimization Task</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Network partitioning is ubiquitous in telecommunications (co-channel interference mitigation), VLSI circuit placement, 
              distributed computing clustering, and power-grid load shedding. High-weight cut boundaries isolate conflicting resources 
              while balancing subsystem loads.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Demonstrated in our real-world 6-tower cellular allocation module.</span>
          </div>
        </div>

        {/* Card 3: What QAOA Does */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Binary className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">What QAOA Does</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The <strong>Quantum Approximate Optimization Algorithm</strong> (Farhi et al., 2014) is a hybrid quantum-classical variational routine. 
              At depth p = 1, it alternates between a problem Hamiltonian unitary U_C(γ) and a transverse mixer unitary U_M(β), 
              optimizing (γ, β) classically to steer measurement probabilities toward high-cut bitstrings.
            </p>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>QUBO mapping: x_i → (I - Z_i)/2 yields standard Ising ZZ couplings.</span>
          </div>
        </div>

        {/* Card 4: Processors A, B, and D Roles */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Processor Topologies (A, B, D)</h3>
            <ul className="text-xs text-slate-300 space-y-2">
              <li>
                <strong className="text-slate-100">Processor A (5 Qubits):</strong> <span className="text-rose-400 font-semibold">Not Executable</span> for PS-O1 because 6 logical variables cannot be mapped onto 5 physical nodes without violating the locked benchmark.
              </li>
              <li>
                <strong className="text-slate-100">Processor B (9 Qubits):</strong> Official 12-edge reference architecture; requires SABRE routing and extra CX gates for non-adjacent couplers.
              </li>
              <li>
                <strong className="text-slate-100">Processor D (Custom):</strong> Our proposed hardware topology designed to eliminate routing SWAPs.
              </li>
            </ul>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
            Rules: 6–12 qubits, max degree 4, connected, basis <code className="font-mono text-cyan-300">rz, sx, x, cx</code>.
          </div>
        </div>

        {/* Card 5: Ideal vs Noisy Simulation */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Ideal vs. Noisy Simulation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We test both conditions in Qiskit Aer to isolate algorithmic power from device degradation:
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span><strong>Ideal:</strong> Pure unitary evolution without gate errors or measurement noise.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span><strong>Noisy:</strong> Official depolarizing model (1q = 0.001, 2q CX = 0.005) + symmetric readout bit-flip error (1%).</span>
              </div>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
            Evaluates how noise dampens the approximation ratio <code className="font-mono text-cyan-300">r = ⟨C⟩ / 22</code>.
          </div>
        </div>

        {/* Card 6: What this Project Demonstrates */}
        <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div className="space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-100 text-base">Core Scientific Demonstration</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our research demonstrates the exact cost of physical processor architecture on quantum algorithms:
            </p>
            <ul className="text-xs text-slate-300 list-disc list-inside space-y-1">
              <li>How graph-to-hardware mismatch generates SWAP overhead.</li>
              <li>How compiler decomposition inflates circuit depth.</li>
              <li>How tailored topologies can improve solution fidelity under noise.</li>
            </ul>
          </div>
          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
            Rigorous experimental evidence across 4,096 shots.
          </div>
        </div>
      </div>
    </section>
  );
}
