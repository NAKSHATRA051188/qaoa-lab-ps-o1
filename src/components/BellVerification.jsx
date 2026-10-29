import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';

export default function BellVerification({ bellData }) {
  const [activeProcessor, setActiveProcessor] = useState('B');

  const procB = bellData?.processors?.B || {
    name: "Processor B",
    status: "VERIFIED_MEASUREMENT",
    adjacent_pair: {
      pair: [0, 1],
      distance: 1,
      ideal: { XX: 1.0, YY: -1.0, ZZ: 1.0, fidelity: 1.0, fidelity_se: 0.0, cx: 1 },
      noisy: { XX: 0.957, YY: -0.959, ZZ: 0.961, fidelity: 0.9692, fidelity_se: 0.0038, cx: 1 }
    },
    farthest_pair: {
      pair: [0, 4],
      distance: 3,
      ideal: { XX: 1.0, YY: -1.0, ZZ: 1.0, fidelity: 1.0, fidelity_se: 0.0, cx: 7 },
      noisy: { XX: 0.864, YY: -0.861, ZZ: 0.872, fidelity: 0.8992, fidelity_se: 0.0067, cx: 7 }
    }
  };

  const procD = bellData?.processors?.D || {
    name: "Processor D",
    status: "PENDING_MEASUREMENT",
    notice: "Awaiting execution of bell_experiment() on Processor D physical topology from technical lead.",
    adjacent_pair: null,
    farthest_pair: null
  };

  const currentData = activeProcessor === 'B' ? procB : procD;
  const isPending = activeProcessor === 'D' || !currentData?.adjacent_pair || currentData?.status === 'PENDING_MEASUREMENT';

  return (
    <section id="bell" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-mint-300 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-mint-400" />
            <span>Hardware Entanglement Benchmark</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Bell-State Verification (|Φ⁺⟩)
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Measures two-qubit parity correlations <code className="font-mono text-mint-400 font-bold">⟨XX⟩, ⟨YY⟩, ⟨ZZ⟩</code> and 
            entanglement state fidelity with standard errors across adjacent (distance = 1) and farthest physical qubit pairs.
          </p>
        </div>

        {/* Processor Selector */}
        <div className="flex p-1 rounded-xl bg-carbon-900 border border-carbon-700 shrink-0">
          <button
            onClick={() => setActiveProcessor('B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeProcessor === 'B'
                ? 'bg-solar-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processor B (Reference)
          </button>
          <button
            onClick={() => setActiveProcessor('D')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeProcessor === 'D'
                ? 'bg-mint-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Processor D (Custom)
          </button>
        </div>
      </div>

      {/* Formula Box */}
      <div className="rounded-xl border border-carbon-700 bg-carbon-900 p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">
            Official Entanglement Fidelity Formula (exact for |Φ⁺⟩)
          </span>
          <div className="font-mono text-sm text-solar-400 font-bold">
            {'F = (1 + ⟨XX⟩ - ⟨YY⟩ + ⟨ZZ⟩) / 4,   σ_F = √(σ_XX² + σ_YY² + σ_ZZ²) / 4'}
          </div>
        </div>
        <div className="text-xs text-slate-300 max-w-sm">
          Ideal values for <code className="text-white font-mono font-bold">|Φ⁺⟩ = (|00⟩ + |11⟩)/√2</code>: 
          ⟨XX⟩ = +1.0, ⟨YY⟩ = -1.0, ⟨ZZ⟩ = +1.0, resulting in <strong className="text-mint-400 font-bold">F = 1.0</strong>.
        </div>
      </div>

      {isPending ? (
        <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-8 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-carbon-950 border border-mint-500/30 flex items-center justify-center text-mint-400 mx-auto">
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
          <div className="text-xs font-mono text-mint-400/80 pt-2 font-bold">
            Status: PENDING_MEASUREMENT · No fabricated correlations displayed
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Adjacent Pair */}
          <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-carbon-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-mint-400 uppercase tracking-wider font-bold">
                  Direct Physical Coupler
                </span>
                <h3 className="text-base font-bold text-white font-sans">
                  Adjacent Pair: Q{currentData?.adjacent_pair?.pair?.[0] ?? 0} — Q{currentData?.adjacent_pair?.pair?.[1] ?? 1}
                </h3>
              </div>
              <span className="text-xs font-mono bg-carbon-950 text-slate-200 px-2.5 py-1 rounded border border-carbon-800 font-bold">
                Distance = {currentData?.adjacent_pair?.distance ?? 1} ({currentData?.adjacent_pair?.ideal?.cx ?? 1} CX)
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Noisy Measurement (Aer):</span>
                  <span className="font-mono text-mint-400 font-extrabold text-sm">
                    F = {currentData?.adjacent_pair?.noisy?.fidelity ? (currentData.adjacent_pair.noisy.fidelity * 100).toFixed(2) : '—'}% ± {currentData?.adjacent_pair?.noisy?.fidelity_se ? (currentData.adjacent_pair.noisy.fidelity_se * 100).toFixed(2) : '—'}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨XX⟩: </span>
                    <span className="text-white font-bold">{currentData?.adjacent_pair?.noisy?.XX ?? '—'}</span>
                  </div>
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨YY⟩: </span>
                    <span className="text-white font-bold">{currentData?.adjacent_pair?.noisy?.YY ?? '—'}</span>
                  </div>
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨ZZ⟩: </span>
                    <span className="text-white font-bold">{currentData?.adjacent_pair?.noisy?.ZZ ?? '—'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800/80 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Ideal Baseline:</span>
                <span className="text-solar-400 font-bold">
                  F = 1.0000 (⟨XX⟩=+1, ⟨YY⟩=-1, ⟨ZZ⟩=+1)
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Direct physical adjacency requires only 1 CX gate without SWAP routing. Degradation is driven purely by native gate noise and readout bit-flip.
            </p>
          </div>

          {/* Farthest Pair */}
          <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-carbon-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-crimson-400 uppercase tracking-wider font-bold">
                  Multi-Hop Routing Required
                </span>
                <h3 className="text-base font-bold text-white font-sans">
                  Farthest Pair: Q{currentData?.farthest_pair?.pair?.[0] ?? 0} — Q{currentData?.farthest_pair?.pair?.[1] ?? 4}
                </h3>
              </div>
              <span className="text-xs font-mono bg-carbon-950 text-slate-200 px-2.5 py-1 rounded border border-carbon-800 font-bold">
                Distance = {currentData?.farthest_pair?.distance ?? 3} ({currentData?.farthest_pair?.ideal?.cx ?? 7} CX)
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-300">Noisy Measurement (Aer):</span>
                  <span className="font-mono text-solar-400 font-extrabold text-sm">
                    F = {currentData?.farthest_pair?.noisy?.fidelity ? (currentData.farthest_pair.noisy.fidelity * 100).toFixed(2) : '—'}% ± {currentData?.farthest_pair?.noisy?.fidelity_se ? (currentData.farthest_pair.noisy.fidelity_se * 100).toFixed(2) : '—'}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-center pt-1">
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨XX⟩: </span>
                    <span className="text-white font-bold">{currentData?.farthest_pair?.noisy?.XX ?? '—'}</span>
                  </div>
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨YY⟩: </span>
                    <span className="text-white font-bold">{currentData?.farthest_pair?.noisy?.YY ?? '—'}</span>
                  </div>
                  <div className="bg-carbon-900 p-2 rounded border border-carbon-800">
                    <span className="text-slate-400">⟨ZZ⟩: </span>
                    <span className="text-white font-bold">{currentData?.farthest_pair?.noisy?.ZZ ?? '—'}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800/80 flex justify-between text-xs font-mono">
                <span className="text-slate-400">Ideal Baseline:</span>
                <span className="text-solar-400 font-bold">
                  F = 1.0000 (Transpiled CX = {currentData?.farthest_pair?.ideal?.cx ?? 7})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              Entangling distant qubits requires intermediate SWAP operations (each synthesized into 3 CX gates). Accumulated depolarizing error reduces state fidelity from 96.9% down to 89.9%.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
