import React, { useState } from 'react';
import { 
  Atom, 
  Rotate3d, 
  Sliders, 
  Zap, 
  Layers, 
  Sparkles,
  HelpCircle,
  Binary,
  Radio,
  Signal
} from 'lucide-react';

export default function QAOAExplainer() {
  const [activeStage, setActiveStage] = useState(0);
  const [gamma, setGamma] = useState(1.93);
  const [beta, setBeta] = useState(0.39);

  const stages = [
    {
      step: 1,
      title: 'Superposition of Channel Plans',
      math: '|ψ₀⟩ = H^{\\otimes 6} |0⟩^{\\otimes 6} = \\frac{1}{\\sqrt{64}} \\sum_{x \\in \\{0,1\\}^6} |x⟩',
      desc: 'All 6 transmitter qubits initialize in state |0⟩. Applying a Hadamard gate creates an equal superposition across all 2⁶ = 64 candidate frequency channel configurations simultaneously.',
      sub: 'Initial probability: 1/64 (1.56%) for each channel allocation plan.',
      badge: 'Equal Superposition',
      color: 'solar',
    },
    {
      step: 2,
      title: 'Interference Cost Unitary',
      math: 'U_C(γ) = e^{-i γ H_C} = \\prod_{(u,v) \\in E} e^{-i γ w_{uv} (I - Z_u Z_v)/2}',
      desc: 'For each of the 9 interference links, a 2-qubit phase rotation R_ZZ(2γ w_uv) is applied. Allocations that cleanly separate high-conflict transmitters accumulate constructive quantum phase interference.',
      sub: 'Encodes 9 conflict weights (1–5) via CX - RZ - CX sequences.',
      badge: 'Problem Hamiltonian',
      color: 'mint',
    },
    {
      step: 3,
      title: 'Channel-Switching Mixer',
      math: 'U_M(β) = e^{-i β H_M} = \\prod_{u=0}^5 e^{-i β X_u} = \\prod_{u=0}^5 R_X(2 β)',
      desc: 'Applies transverse-field rotations around the X-axis by angle 2β on every transmitter qubit. This mixes channel assignments, driving transitions between states to escape sub-optimal frequency plans.',
      sub: 'Single-qubit rotation gates (RZ and SX in native basis).',
      badge: 'Transverse Driver',
      color: 'electric',
    },
    {
      step: 4,
      title: 'Measurement & Optimizer Loop',
      math: '(\\gamma^*, \\beta^*) = \\arg\\max_{\\gamma, \\beta} \\langle \\psi(\\gamma, \\beta) | H_C | \\psi(\\gamma, \\beta) \\rangle',
      desc: 'The circuit is measured across 4,096 shots. A classical optimizer (e.g. COBYLA or Nelder-Mead) computes the average avoided interference ⟨C⟩ and updates γ and β iteratively until convergence.',
      sub: '5 randomized restarts (seeds 0–4) protect against local minima.',
      badge: 'Hybrid Variational Loop',
      color: 'solar',
    },
  ];

  return (
    <section id="qaoa-explainer" className="space-y-6 pt-4">
      {/* Section Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-solar-300 text-xs font-mono mb-2">
          <Binary className="w-3.5 h-3.5 text-solar-400" />
          <span>Algorithmic Optimization Mechanics</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
          How QAOA Solves Transmitter Channel Allocation
        </h2>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          The <strong>Quantum Approximate Optimization Algorithm</strong> translates the transmitter conflict matrix into 
          an Ising Hamiltonian, alternating problem phase shifts with transverse mixer rotations at depth <span className="text-solar-400 font-mono font-bold">p = 1</span>.
        </p>
      </div>

      {/* 4-Stage High-Contrast Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {stages.map((stage, idx) => {
          const isActive = activeStage === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-carbon-850 border-solar-500 shadow-lg shadow-solar-500/10'
                  : 'bg-carbon-900 border-carbon-750 hover:border-carbon-600'
              }`}
            >
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-solar-500 via-solar-400 to-mint-500" />
              )}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-carbon-950 text-slate-200 border border-carbon-800">
                    Stage {stage.step}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-solar-400' : 'text-slate-400'}`}>
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
      <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-6 shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-solar-500/20 border border-solar-500/40 flex items-center justify-center font-mono font-bold text-solar-300">
              {stages[activeStage].step}
            </span>
            <h3 className="text-xl font-bold text-white font-sans">{stages[activeStage].title}</h3>
          </div>

          <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800 font-mono text-sm text-solar-300 overflow-x-auto">
            {stages[activeStage].math}
          </div>

          <p className="text-slate-200 text-sm leading-relaxed">
            {stages[activeStage].desc}
          </p>
        </div>
      </div>

      {/* Conceptual Circuit Diagram */}
      <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-carbon-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-solar-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Conceptual Quantum Circuit (p = 1 QAOA)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-solar-300 bg-solar-950/60 border border-solar-500/40 px-2.5 py-1 rounded">
            Conceptual Illustration · Not transpiled hardware layout
          </span>
        </div>

        {/* High-Contrast Circuit Schematic */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] h-64 bg-carbon-950 rounded-xl border border-carbon-800 p-4 relative font-mono text-xs">
            {[0, 1, 2, 3, 4, 5].map((q) => (
              <div key={q} className="relative flex items-center h-8">
                <span className="w-14 text-slate-300 font-bold shrink-0">Tx_{q}: |0⟩</span>
                <div className="flex-1 h-0.5 bg-carbon-700 relative flex items-center">
                  {/* H Gate */}
                  <div className="absolute left-8 -top-3 w-7 h-7 rounded bg-carbon-900 border border-solar-400 text-solar-300 flex items-center justify-center font-bold text-xs shadow-sm">
                    H
                  </div>

                  {/* Cost Operator Block */}
                  {q === 2 && (
                    <div className="absolute left-24 -top-[70px] w-60 h-[200px] rounded-lg bg-carbon-900/90 border border-dashed border-solar-500/50 flex flex-col items-center justify-center pointer-events-none p-2 text-center shadow-lg">
                      <span className="text-solar-300 font-bold text-xs">U_C(γ) = e^{'-i γ H_C'}</span>
                      <span className="text-[10px] text-slate-400 mt-1">9 ZZ interaction rotations for RF conflict links</span>
                    </div>
                  )}

                  {/* Mixer Gate */}
                  <div className="absolute left-[370px] -top-3.5 w-14 h-7 rounded bg-carbon-900 border border-mint-400 text-mint-300 flex items-center justify-center font-bold text-[11px] shadow-sm">
                    Rx(2β)
                  </div>

                  {/* Measurement */}
                  <div className="absolute left-[460px] -top-3 w-9 h-7 rounded bg-carbon-800 border border-carbon-600 text-slate-200 flex items-center justify-center font-bold text-xs">
                    [Z]
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Parameter Intuition Tool */}
      <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-solar-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            Interactive Variational Angles (γ and β sliders)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Gamma slider */}
          <div className="space-y-2 bg-carbon-950 p-4 rounded-xl border border-carbon-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">Interference Phase Angle (γ)</span>
              <span className="text-solar-400 font-bold">{gamma.toFixed(2)} rad ({((gamma / Math.PI) * 180).toFixed(0)}°)</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI}
              step="0.01"
              value={gamma}
              onChange={(e) => setGamma(parseFloat(e.target.value))}
              className="w-full accent-solar-400 bg-carbon-800 h-2 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Multiplies conflict link weight w_ij by 2γ, phasing mutually interfering channels.
            </p>
          </div>

          {/* Beta slider */}
          <div className="space-y-2 bg-carbon-950 p-4 rounded-xl border border-carbon-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">Channel-Switching Angle (β)</span>
              <span className="text-mint-400 font-bold">{beta.toFixed(2)} rad ({((beta / Math.PI) * 180).toFixed(0)}°)</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.PI}
              step="0.01"
              value={beta}
              onChange={(e) => setBeta(parseFloat(e.target.value))}
              className="w-full accent-mint-400 bg-carbon-800 h-2 rounded cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Controls quantum tunnel rate between Channel Alpha and Channel Beta.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
