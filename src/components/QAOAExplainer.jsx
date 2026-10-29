import React, { useState } from 'react';
import { 
  Atom, 
  Cpu, 
  Rotate3d, 
  Sliders, 
  Compass, 
  Zap, 
  ChevronRight, 
  HelpCircle,
  Binary,
  Layers,
  Sparkles
} from 'lucide-react';

export default function QAOAExplainer() {
  const [activeStage, setActiveStage] = useState(0);
  const [gamma, setGamma] = useState(1.93); // sample gamma
  const [beta, setBeta] = useState(0.39);  // sample beta

  const stages = [
    {
      step: 1,
      title: 'State Initialization',
      math: '|ψ₀⟩ = H^{\\otimes 6} |0⟩^{\\otimes 6}',
      desc: 'Every qubit begins in the ground state |0⟩. A Hadamard (H) gate is applied across all 6 qubits, creating an equal superposition of all 2⁶ = 64 possible partition bitstrings simultaneously.',
      sub: 'Uniform probability of 1/64 (1.56%) for each candidate configuration.',
      badge: 'Quantum Superposition',
      color: 'cyan',
    },
    {
      step: 2,
      title: 'Cost Hamiltonian Evolution',
      math: 'U_C(γ) = e^{-i γ H_C} = \\prod_{(u,v) \\in E} e^{-i γ w_{uv} (I - Z_u Z_v)/2}',
      desc: 'Encodes the weighted Max-Cut problem. For each of the 9 edges, a 2-qubit phase rotation R_ZZ(2 γ w_uv) is applied. Cuts that satisfy high-weight edges accumulate advantageous constructive phase interference.',
      sub: 'Requires 2-qubit CX gates for each graph interaction.',
      badge: 'Problem Hamiltonian',
      color: 'blue',
    },
    {
      step: 3,
      title: 'Mixer Hamiltonian Evolution',
      math: 'U_M(β) = e^{-i β H_M} = \\prod_{u=0}^5 e^{-i β X_u} = \\prod_{u=0}^5 R_X(2 β)',
      desc: 'Applies transverse-field rotations around the X-axis by angle 2β on every qubit. This drives quantum transitions between adjacent bitstrings, allowing probability amplitudes to tunnel out of local sub-optima.',
      sub: 'Single-qubit rotation gates (RZ + SX in native basis).',
      badge: 'Transverse Mixer',
      color: 'purple',
    },
    {
      step: 4,
      title: 'Measurement & Classical Loop',
      math: '(\\gamma^*, \\beta^*) = \\arg\\max_{\\gamma, \\beta} \\langle \\psi(\\gamma, \\beta) | H_C | \\psi(\\gamma, \\beta) \\rangle',
      desc: 'All 6 qubits are measured in the computational Z-basis across 4,096 shots. A classical optimizer (e.g. COBYLA or Nelder-Mead) evaluates the mean cut weight ⟨C⟩ and updates γ and β iteratively until convergence.',
      sub: '5 randomized seed starts (0–4) prevent optimizer entrapment.',
      badge: 'Hybrid Variational Loop',
      color: 'emerald',
    },
  ];

  return (
    <section id="qaoa-explainer" className="space-y-6 pt-6">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-mono mb-2">
          <Atom className="w-3.5 h-3.5" />
          <span>Variational Algorithm Mechanics</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          How QAOA Solves Weighted Max-Cut
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          The <strong>Quantum Approximate Optimization Algorithm</strong> is an algorithmic bridge between 
          continuous quantum adiabatic evolution and discrete classical heuristics. At depth <span className="text-cyan-400 font-mono">p = 1</span>, 
          it alternates one problem-phase cycle with one transverse-mixer cycle.
        </p>
      </div>

      {/* 4-Stage Interactive Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500" />
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Stage {stage.step}
                  </span>
                  <span className={`text-[10px] font-mono font-medium ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {stage.badge}
                  </span>
                </div>
                <div className="font-bold text-sm text-white">{stage.title}</div>
                <p className="text-xs text-slate-400 line-clamp-2">{stage.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-cyan-300">
              {stages[activeStage].step}
            </span>
            <h3 className="text-xl font-bold text-white">{stages[activeStage].title}</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-sm text-cyan-300 overflow-x-auto">
            {stages[activeStage].math}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed">
            {stages[activeStage].desc}
          </p>
        </div>
      </div>

      {/* Conceptual Quantum Circuit Schematic */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Simplified Conceptual Quantum Circuit (p = 1 QAOA)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded">
            Conceptual Illustration · Not transpiled hardware layout
          </span>
        </div>

        {/* Conceptual Circuit Diagram (SVG) */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] h-64 bg-[#070b14] rounded-xl border border-slate-800 p-4 relative font-mono text-xs">
            {/* 6 Qubit lines */}
            {[0, 1, 2, 3, 4, 5].map((q) => {
              const y = 30 + q * 35;
              return (
                <div key={q} className="relative flex items-center h-8">
                  {/* Qubit label */}
                  <span className="w-12 text-slate-400 font-bold shrink-0">q_{q}: |0⟩</span>
                  
                  {/* Horizontal wire */}
                  <div className="flex-1 h-0.5 bg-slate-700 relative flex items-center">
                    {/* Hadamard gate */}
                    <div className="absolute left-8 -top-3 w-7 h-7 rounded bg-cyan-950 border border-cyan-400 text-cyan-200 flex items-center justify-center font-bold text-xs shadow-sm">
                      H
                    </div>

                    {/* Cost Unitary Box */}
                    {q === 2 && (
                      <div className="absolute left-24 -top-[70px] w-56 h-[200px] rounded-lg bg-blue-950/20 border border-dashed border-blue-500/40 flex flex-col items-center justify-center pointer-events-none p-2 text-center">
                        <span className="text-blue-300 font-bold text-xs">e^{'-i γ H_C'} (Cost Operator)</span>
                        <span className="text-[10px] text-blue-400/80 mt-1">9 ZZ interaction terms across weighted edges</span>
                      </div>
                    )}

                    {/* Mixer RX Gate */}
                    <div className="absolute left-[360px] -top-3.5 w-12 h-7 rounded bg-purple-950 border border-purple-400 text-purple-200 flex items-center justify-center font-bold text-[11px] shadow-sm">
                      Rx(2β)
                    </div>

                    {/* Measurement Meter */}
                    <div className="absolute left-[440px] -top-3 w-8 h-7 rounded bg-slate-800 border border-slate-600 text-slate-300 flex items-center justify-center font-bold text-xs">
                      [Z]
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Parameter Intuition Tool (Gamma & Beta) */}
      <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Interactive Parameter Intuition (γ and β angles)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          The classical optimizer sweeps through angles in range <code className="text-cyan-300 font-mono">[0, π]</code>. 
          Adjust sliders to observe the theoretical interaction depth:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Gamma slider */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Cost Angle (γ)</span>
              <span className="text-cyan-400 font-bold">{gamma.toFixed(2)} rad ({((gamma / Math.PI) * 180).toFixed(0)}°)</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI}
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 h-2 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Controls phase shift accrued per weighted edge. Multiplies edge weight w_uv by 2γ.
            </p>
          </div>

          {/* Beta slider */}
          <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">Mixer Angle (β)</span>
              <span className="text-purple-400 font-bold">{beta.toFixed(2)} rad ({((beta / Math.PI) * 180).toFixed(0)}°)</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI}
              step="0.01"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 h-2 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Controls transverse bit-flip mixing rate. Balances search breadth vs solution collapse.
            </p>
          </div>
        </div>
      </div>

      {/* Plain-English Technical Glossary */}
      <div className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 space-y-3">
        <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Plain-English Glossary of Terms</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-cyan-300 font-mono">Cost Hamiltonian (H_C)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              An energy operator whose eigenvalues equal negative cut values. Ground state corresponds to the maximum cut.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-purple-300 font-mono">Mixer Hamiltonian (H_M)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Sum of Pauli-X operators that perturb the quantum state, avoiding premature convergence to local extrema.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-emerald-300 font-mono">Shots (4,096)</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Number of repeated quantum circuit executions and project measurements to approximate the true probability distribution.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-1">
            <span className="font-bold text-blue-300 font-mono">SABRE Routing</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              SWAP-Aware Bidirectional heuristic compiler pass that inserts minimal SWAP gates to map non-adjacent logical qubits onto hardware couplers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
