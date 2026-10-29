import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Binary, 
  HelpCircle, 
  Sparkles, 
  Activity, 
  Clock, 
  Layers,
  ArrowRight
} from 'lucide-react';

export default function BellVerification({ bellData }) {
  const [activeProcessor, setActiveProcessor] = useState('B'); // 'B' or 'D'

  const procB = bellData?.processors?.B || {};
  const procD = bellData?.processors?.D || {};

  const currentData = activeProcessor === 'B' ? procB : procD;
  const isPending = activeProcessor === 'D' && (!currentData.adjacent_pair || procD.status === 'PENDING_MEASUREMENT');

  return (
    <section id="bell" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hardware Entanglement Benchmark</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Bell-State Verification (|Φ⁺⟩)
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Measures two-qubit parity correlations <code className="font-mono text-emerald-300">⟨XX⟩, ⟨YY⟩, ⟨ZZ⟩</code> and 
            entanglement state fidelity with standard errors across adjacent (distance = 1) and farthest physical qubit pairs.
          </p>
        </div>

        {/* Processor Selector */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveProcessor('B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeProcessor === 'B'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processor B (Reference)
          </button>
          <button
            onClick={() => setActiveProcessor('D')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeProcessor === 'D'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processor D (Custom)
          </button>
        </div>
      </div>

      {/* Official Bell-State Formula Box */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Official Entanglement Fidelity Formula (exact for |Φ⁺⟩)
          </span>
          <div className="font-mono text-sm text-cyan-300">
            {'F = (1 + ⟨XX⟩ - ⟨YY⟩ + ⟨ZZ⟩) / 4,   σ_F = √(σ_XX² + σ_YY² + σ_ZZ²) / 4'}
          </div>
        </div>
        <div className="text-xs text-slate-400 max-w-sm">
          Ideal values for <code className="text-white font-mono">|Φ⁺⟩ = (|00⟩ + |11⟩)/√2</code>: 
          ⟨XX⟩ = +1.0, ⟨YY⟩ = -1.0, ⟨ZZ⟩ = +1.0, resulting in <strong>F = 1.0</strong>.
        </div>
      </div>

      {isPending ? (
        /* Empty State for Processor D */
        <div className="rounded-2xl bg-slate-900/80 border border-purple-900/40 p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-700/60 flex items-center justify-center text-purple-300 mx-auto">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-white font-mono">
              Processor D Bell Verification Pending
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {procD.notice || "Awaiting execution of bell_experiment() on Processor D physical topology from technical lead. Experimental outputs will be automatically loaded from public/data/bell_results.json."}
            </p>
          </div>
          <div className="text-xs font-mono text-purple-400/80 pt-2">
            Status: PENDING_MEASUREMENT · No fabricated correlations displayed
          </div>
        </div>
      ) : (
        /* Verified Bell Data Presentation */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Adjacent Physical Pair */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                  Direct Physical Coupler
                </span>
                <h3 className="text-base font-bold text-white">
                  Adjacent Pair: Q{currentData.adjacent_pair?.pair[0]} — Q{currentData.adjacent_pair?.pair[1]}
                </h3>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                Coupler Distance = 1 (1 CX)
              </span>
            </div>

            {/* Noisy vs Ideal Comparison */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Noisy Measurement (Aer):</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    F = {(currentData.adjacent_pair?.noisy?.fidelity * 100).toFixed(2)}% ± {(currentData.adjacent_pair?.noisy?.fidelity_se * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨XX⟩: </span>
                    <span className="text-white font-bold">{currentData.adjacent_pair?.noisy?.XX}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨YY⟩: </span>
                    <span className="text-white font-bold">{currentData.adjacent_pair?.noisy?.YY}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨ZZ⟩: </span>
                    <span className="text-white font-bold">{currentData.adjacent_pair?.noisy?.ZZ}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Ideal Baseline:</span>
                <span className="text-cyan-300 font-bold">
                  F = 1.0000 (⟨XX⟩=+1, ⟨YY⟩=-1, ⟨ZZ⟩=+1)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Direct physical adjacency requires only a single CX gate with no SWAP insertion. Fidelity degradation 
              is driven strictly by native single-qubit, two-qubit depolarizing and readout errors.
            </p>
          </div>

          {/* Card 2: Farthest Physical Pair */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-bold">
                  Multi-Hop Routing Required
                </span>
                <h3 className="text-base font-bold text-white">
                  Farthest Pair: Q{currentData.farthest_pair?.pair[0]} — Q{currentData.farthest_pair?.pair[1]}
                </h3>
              </div>
              <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                Coupler Distance = {currentData.farthest_pair?.distance} ({currentData.farthest_pair?.ideal?.cx} CX)
              </span>
            </div>

            {/* Noisy vs Ideal Comparison */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Noisy Measurement (Aer):</span>
                  <span className="font-mono text-amber-300 font-bold">
                    F = {(currentData.farthest_pair?.noisy?.fidelity * 100).toFixed(2)}% ± {(currentData.farthest_pair?.noisy?.fidelity_se * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨XX⟩: </span>
                    <span className="text-white font-bold">{currentData.farthest_pair?.noisy?.XX}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨YY⟩: </span>
                    <span className="text-white font-bold">{currentData.farthest_pair?.noisy?.YY}</span>
                  </div>
                  <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                    <span className="text-slate-400">⟨ZZ⟩: </span>
                    <span className="text-white font-bold">{currentData.farthest_pair?.noisy?.ZZ}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Ideal Baseline:</span>
                <span className="text-cyan-300 font-bold">
                  F = 1.0000 (Transpiled CX = {currentData.farthest_pair?.ideal?.cx})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Entangling distant qubits requires intermediate SWAP operations (each transpiled into 3 CX gates). 
              Accumulated two-qubit depolarizing noise substantially reduces state fidelity (from 96.9% down to 89.9%).
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
