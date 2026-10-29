import React from 'react';
import { 
  GitBranch, 
  ExternalLink, 
  ShieldAlert, 
  FileCode, 
  CheckCircle2, 
  Layers, 
  HelpCircle,
  Binary,
  Radio
} from 'lucide-react';

export default function MethodologyAndLimitations() {
  return (
    <section id="methodology" className="space-y-6 pt-4">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-solar-300 text-xs font-mono mb-2">
          <FileCode className="w-3.5 h-3.5 text-solar-400" />
          <span>Scientific Methodology & NISQ Realities</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
          Methodology, Reproducibility & Limitations
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Full disclosure of experimental protocols, parameter controls, compiler choices, and honest scientific limitations.
        </p>
      </div>

      {/* Grid of Key Methodological Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Exact Classical Baseline */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-solar-400 text-xs font-mono font-bold">
            <Binary className="w-4 h-4" />
            <span>1. Exact Classical Baseline</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">Exhaustive Brute-Force Certificate</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because |V| = 6, the solution space contains exactly 2^6 = 64 discrete configurations. 
            We evaluated all 64 bitstrings classically. Exactly two complementary bitstrings (<code className="font-mono text-solar-400 font-bold">001011</code> and <code className="font-mono text-mint-400 font-bold">110100</code>) 
            achieve the maximum cut of <strong>22.0</strong>. The random partition expectation is 13.5 (50% of 27.0).
          </p>
        </div>

        {/* Card 2: 5 Seeded Initializations */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-mint-400 text-xs font-mono font-bold">
            <Radio className="w-4 h-4" />
            <span>2. Parameter Restarts</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">5 Seeded Multi-Starts (Seeds 0–4)</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Non-convex optimization landscapes frequently trap classical optimizers in sub-optimal local minima. 
            Per official rules, initial variational angles (γ, β) were initialized with NumPy's 
            <code className="font-mono text-mint-400">default_rng(seed)</code> for seeds 0, 1, 2, 3, and 4 uniformly drawn from [0, π].
          </p>
        </div>

        {/* Card 3: Controlled Comparisons */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-electric-400 text-xs font-mono font-bold">
            <Layers className="w-4 h-4" />
            <span>3. Controlled Comparison Protocol</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">Isolating Hardware Topology</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            To strictly evaluate the architectural impact of Processor B vs. Processor D, we hold 
            all algorithmic hyperparameters constant: identical problem graph, identical bound QAOA angles (γ*, β*), 
            identical transpilation optimization level 1, and identical synthetic noise rates.
          </p>
        </div>

        {/* Card 4: Compilation & SABRE Routing */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-mint-400 text-xs font-mono font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>4. Transpilation & Routing</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">SABRE Layout & Basis Translation</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All circuits are transpiled to native basis gates <code className="font-mono text-solar-300">rz, sx, x, cx</code> with 
            Qiskit's SABRE (SWAP-Aware Bidirectional Heuristic) routing pass (seed 42). Non-adjacent two-qubit terms trigger 
            diagnostic SWAP insertions decomposed into 3 physical CX gates.
          </p>
        </div>

        {/* Card 5: Synthetic Noise Model */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-crimson-400 text-xs font-mono font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>5. Synthetic Noise Limits</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">Uniform Depolarizing vs. Physical QPU</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The benchmark uses synthetic depolarizing noise (p1 = 0.001, p2 = 0.005) and symmetric readout bit-flip error (1.0%). 
            While standard for fair comparisons, synthetic noise does not capture device drift, crosstalk, coherent errors, or non-Markovian phase damping.
          </p>
        </div>

        {/* Card 6: Why No Quantum Advantage */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-solar-400 text-xs font-mono font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>6. Scientific Honesty</span>
          </div>
          <h3 className="font-bold text-white text-sm font-sans">Why This Does Not Prove Advantage</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            A classical computer solves this 6-node instance instantaneously. The purpose of this benchmark is 
            to study algorithmic behavior, compile-time resource inflation, and routing mitigation on NISQ hardware, 
            not to claim quantum supremacy on a tractable problem.
          </p>
        </div>
      </div>

      {/* GitHub Repository Card */}
      <div className="rounded-2xl bg-gradient-to-r from-carbon-900 via-carbon-850 to-carbon-950 border border-carbon-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-solar-500/15 border border-solar-500/30 flex items-center justify-center text-solar-400 shrink-0">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-sans">Team HACKSMITHS Official Repository</h3>
            <p className="text-xs text-slate-300">
              Complete source code, Qiskit Jupyter notebooks, reproducible validation scripts, and evidence logs.
            </p>
          </div>
        </div>

        <a
          href="https://github.com/NAKSHATRA051188/qaoa-lab-ps-o1"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-solar-500 hover:bg-solar-400 text-carbon-950 font-extrabold text-xs shadow-lg shadow-solar-500/20 transition-all shrink-0 font-mono"
        >
          <span>View on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </section>
  );
}
