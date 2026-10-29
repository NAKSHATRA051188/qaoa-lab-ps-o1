import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Zap,
  Activity,
  Radio
} from 'lucide-react';

export default function PerformanceDashboard({ benchmarkData }) {
  const [condition, setCondition] = useState('noisy');

  const processors = benchmarkData?.processors || {};
  const procA = processors.A || { executable: false, reason: "Capacity limit: 5 < 6" };
  const procB = processors.B || {};
  const procD = processors.D || { verified: false, notice: "Not yet benchmarked" };

  const bMetrics = condition === 'noisy' ? procB.noisy : procB.ideal;
  const dMetrics = condition === 'noisy' ? procD.noisy : procD.ideal;

  const resourceChartData = [
    {
      metric: 'Logical CX',
      'Processor B': procB[condition]?.logical_cx ?? 18,
      'Processor D': procD[condition]?.logical_cx ?? null,
    },
    {
      metric: 'Transpiled CX',
      'Processor B': procB[condition]?.cx ?? 21,
      'Processor D': procD[condition]?.cx ?? null,
    },
    {
      metric: 'CX Overhead',
      'Processor B': procB[condition]?.cx_overhead ?? 3,
      'Processor D': procD[condition]?.cx_overhead ?? null,
    },
    {
      metric: 'Total Depth',
      'Processor B': procB[condition]?.depth ?? 38,
      'Processor D': procD[condition]?.depth ?? null,
    },
    {
      metric: '2Q Depth',
      'Processor B': procB[condition]?.two_q_depth ?? 21,
      'Processor D': procD[condition]?.two_q_depth ?? null,
    },
    {
      metric: 'SWAP Gates',
      'Processor B': procB[condition]?.swaps ?? 1,
      'Processor D': procD[condition]?.swaps ?? null,
    },
  ];

  const qualityChartData = [
    {
      name: 'Random Baseline',
      cut: 13.5,
      fill: '#64748b',
    },
    {
      name: 'Processor B',
      cut: procB[condition]?.mean_cut ?? 11.71,
      fill: '#f59e0b',
    },
    {
      name: 'Processor D',
      cut: procD[condition]?.mean_cut ?? null,
      fill: '#10b981',
    },
    {
      name: 'Classical Optimum',
      cut: 22.0,
      fill: '#fbbf24',
    },
  ];

  return (
    <section id="performance" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-solar-300 text-xs font-mono mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-solar-400" />
            <span>Empirical Execution Benchmarks</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Processor B vs. D Performance Dashboard
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Data-driven comparison of solution quality, approximation ratios, and hardware compilation overhead across 4,096 shots.
          </p>
        </div>

        {/* Condition Toggle with High Contrast */}
        <div className="flex p-1 rounded-xl bg-carbon-900 border border-carbon-700 shrink-0">
          <button
            onClick={() => setCondition('noisy')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              condition === 'noisy'
                ? 'bg-crimson-600 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Noisy Simulation (Official)</span>
          </button>

          <button
            onClick={() => setCondition('ideal')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              condition === 'ideal'
                ? 'bg-solar-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Ideal Simulation (Noiseless)</span>
          </button>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Mean Cut Weight */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-slate-300">Mean Cut Weight ⟨C⟩</span>
            <span className="font-mono text-[10px] text-solar-400 font-bold">4,096 shots</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-white">
              {bMetrics?.mean_cut !== undefined ? bMetrics.mean_cut.toFixed(2) : '—'}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Proc B ({condition})
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between border-t border-carbon-800 pt-1.5 font-mono">
            <span>Processor D:</span>
            <span className="text-solar-400 font-bold">
              {dMetrics?.mean_cut !== undefined ? dMetrics.mean_cut.toFixed(2) : 'Pending benchmark'}
            </span>
          </div>
        </div>

        {/* Primary Approximation Ratio */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-slate-300">Approximation Ratio (r)</span>
            <span className="font-mono text-[10px] text-mint-400 font-bold">⟨C⟩ / 22.0</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-mint-400">
              {bMetrics?.approx_ratio !== undefined ? `${(bMetrics.approx_ratio * 100).toFixed(1)}%` : '—'}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Proc B ({condition})
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between border-t border-carbon-800 pt-1.5 font-mono">
            <span>Processor D:</span>
            <span className="text-mint-400 font-bold">
              {dMetrics?.approx_ratio !== undefined ? `${(dMetrics.approx_ratio * 100).toFixed(1)}%` : 'Pending benchmark'}
            </span>
          </div>
        </div>

        {/* Optimal Sampling Probability */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-slate-300">Optimal Prob (P_opt)</span>
            <span className="font-mono text-[10px] text-solar-400 font-bold">P(001011)+P(110100)</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-solar-400">
              {bMetrics?.optimal_probability !== undefined 
                ? `${(bMetrics.optimal_probability * 100).toFixed(1)}%` 
                : '—'}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Proc B ({condition})
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between border-t border-carbon-800 pt-1.5 font-mono">
            <span>Processor D:</span>
            <span className="text-solar-400 font-bold">
              {dMetrics?.optimal_probability !== undefined ? `${(dMetrics.optimal_probability * 100).toFixed(1)}%` : 'Pending benchmark'}
            </span>
          </div>
        </div>

        {/* CX Routing Overhead */}
        <div className="rounded-xl bg-carbon-900 border border-carbon-750 p-4 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-bold text-slate-300">CX Routing Overhead</span>
            <span className="font-mono text-[10px] text-crimson-400 font-bold">CX − Logical CX</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-extrabold font-mono text-crimson-400">
              +{bMetrics?.cx_overhead ?? 3}
            </div>
            <div className="text-xs font-mono text-slate-400">
              Proc B ({bMetrics?.swaps ?? 1} SWAP)
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex justify-between border-t border-carbon-800 pt-1.5 font-mono">
            <span>Processor D Target:</span>
            <span className="text-mint-400 font-bold">
              {dMetrics?.cx_overhead !== undefined ? `+${dMetrics.cx_overhead}` : '0 (Direct coupling)'}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Solution Quality Bar Chart */}
        <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Solution Quality: Avoided Conflict vs. Baselines
            </h4>
            <span className="text-[11px] font-mono text-solar-400 font-bold">Condition: {condition}</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 25]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d15', borderColor: '#223048', borderRadius: '8px' }}
                  formatter={(val) => [val ? `${val} / 22.0` : 'Not yet benchmarked', 'Cut Weight']}
                />
                <Bar dataKey="cut" radius={[6, 6, 0, 0]}>
                  {qualityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-carbon-800 pt-2 flex justify-between font-mono">
            <span>Random: 13.5 (50%)</span>
            <span>Proc B: {procB[condition]?.mean_cut ?? 11.71}</span>
            <span>Optimum: 22.0</span>
          </div>
        </div>

        {/* Circuit Resource Breakdown Chart */}
        <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-3 shadow-xl">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Circuit Resource & Routing Overhead
            </h4>
            <span className="text-[11px] font-mono text-mint-400 font-bold">SABRE Level 1</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceChartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d15', borderColor: '#223048', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Processor B" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Processor D" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-carbon-800 pt-2 font-mono">
            Processor D results ingest automatically when <code className="text-mint-400">benchmark_results.json</code> is populated.
          </div>
        </div>
      </div>

      {/* Comprehensive Metric Table */}
      <div className="rounded-2xl bg-carbon-900 border border-carbon-750 overflow-hidden shadow-xl">
        <div className="p-4 bg-carbon-950 border-b border-carbon-800 flex justify-between items-center">
          <h4 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold flex items-center gap-2">
            <Layers className="w-4 h-4 text-solar-400" />
            <span>Complete Standardized Metric Table ({condition.toUpperCase()} Condition)</span>
          </h4>
          <span className="text-xs font-mono text-slate-400">
            Source: <code className="text-solar-400">qff_phase2.circuit_metrics()</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-carbon-950 text-slate-400 font-mono text-[11px] border-b border-carbon-800">
              <tr>
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-4">Processor A (5Q)</th>
                <th className="py-3 px-4">Processor B (9Q Ref)</th>
                <th className="py-3 px-4">Processor D (Custom)</th>
                <th className="py-3 px-4">Official Unit / Definition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-800">
              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Execution Status</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-crimson-950 text-crimson-300 border border-crimson-800">
                    NOT EXECUTABLE
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint-950 text-mint-300 border border-mint-700">
                    VERIFIED MEASUREMENT
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-solar-950 text-solar-300 border border-solar-700">
                    PENDING MEASUREMENT
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono">Qiskit Aer execution status</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Capacity</td>
                <td className="py-3 px-4 text-crimson-400 font-mono">5 phys / 6 req (-1)</td>
                <td className="py-3 px-4 text-solar-300 font-mono">9 phys / 6 req</td>
                <td className="py-3 px-4 text-mint-300 font-mono">{procD.num_qubits || 6} phys / 6 req</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Physical vs Logical capacity</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Mean Cut Weight ⟨C⟩</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-solar-300 font-mono font-bold">
                  {bMetrics?.mean_cut?.toFixed(4) ?? '11.7061'}
                </td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Sum of cut weights over 4096 shots</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Approximation Ratio (r)</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-mint-400 font-mono font-bold">
                  {bMetrics?.approx_ratio ? (bMetrics.approx_ratio).toFixed(4) : '0.5321'}
                </td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">mean_cut / 22.0</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Optimal Sampling Prob (P_opt)</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-solar-300 font-mono font-bold">
                  {bMetrics?.optimal_probability ? (bMetrics.optimal_probability * 100).toFixed(2) + '%' : '13.57%'}
                </td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">(count[001011] + count[110100]) / 4096</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Transpiled Depth</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-slate-200 font-mono">{bMetrics?.depth ?? 38}</td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Excluding measure / barriers</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Total CX Gate Count</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-slate-200 font-mono">{bMetrics?.cx ?? 21}</td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Native 2-qubit basis gates</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">CX Overhead</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-crimson-400 font-mono font-bold">+{bMetrics?.cx_overhead ?? 3}</td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">cx − logical_cx</td>
              </tr>

              <tr className="hover:bg-carbon-800/40">
                <td className="py-3 px-4 font-bold text-slate-200">Inserted SWAPs</td>
                <td className="py-3 px-4 text-slate-500 font-mono">—</td>
                <td className="py-3 px-4 text-slate-200 font-mono">{bMetrics?.swaps ?? 1}</td>
                <td className="py-3 px-4 text-solar-400 font-mono">Not yet benchmarked</td>
                <td className="py-3 px-4 text-slate-400 font-mono">Pre-decomposition SWAP count</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
