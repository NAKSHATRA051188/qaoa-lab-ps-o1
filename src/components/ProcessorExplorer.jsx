import React, { useState, useMemo } from 'react';
import { validateProcessorD } from '../utils/graphCalculations';
import { 
  Cpu, 
  AlertOctagon, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  GitBranch, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';

const TOPOLOGY_COORDS_A = {
  0: { x: 80, y: 150 },
  1: { x: 180, y: 150 },
  2: { x: 280, y: 100 },
  3: { x: 280, y: 200 },
  4: { x: 380, y: 200 },
};

const TOPOLOGY_COORDS_B = {
  0: { x: 80, y: 160 },
  1: { x: 180, y: 160 },
  2: { x: 280, y: 160 },
  3: { x: 380, y: 100 },
  4: { x: 480, y: 160 },
  5: { x: 380, y: 220 },
  6: { x: 180, y: 260 },
  7: { x: 80, y: 260 },
  8: { x: 80, y: 80 },
};

export default function ProcessorExplorer({ 
  processorBData, 
  processorDData, 
  onUpdateProcessorD 
}) {
  const [activeTab, setActiveTab] = useState('B');
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [showJsonLoader, setShowJsonLoader] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const processorA = {
    name: "Processor A",
    num_qubits: 5,
    edges: [[0, 1], [1, 2], [1, 3], [3, 4]],
    basis_gates: ["rz", "sx", "x", "cx"],
    status: "NOT_EXECUTABLE",
    executable: false,
    reason: "Official locked problem PS-O1 requires 6 logical variables (Transmitters Tx0–Tx5). Processor A provides only 5 physical qubits. Compiling without modifying the problem violates the locked benchmark rule; reducing problem variables or symmetry-fixing changes the ansatz and is strictly disallowed."
  };

  const processorB = processorBData || {
    name: "Processor B",
    num_qubits: 9,
    edges: [
      [0, 1], [1, 2], [1, 6], [2, 3], [2, 6], [2, 5],
      [3, 4], [4, 5], [5, 6], [6, 7], [6, 8], [8, 0]
    ],
    basis_gates: ["rz", "sx", "x", "cx"],
    noise: { model: "official", p1: 0.001, p2: 0.005, p_readout: 0.01 },
    status: "OFFICIAL_REFERENCE"
  };

  const processorD = processorDData || {
    name: "Processor D",
    team: "HACKSMITHS",
    problem_statement: "PS-O1",
    status: "DESIGN_IN_PROGRESS",
    is_design_in_progress: true,
    num_qubits: 6,
    edges: [],
    basis_gates: ["rz", "sx", "x", "cx"],
    noise: { model: "official", p1: 0.001, p2: 0.005, p_readout: 0.01 },
  };

  const validationErrors = useMemo(() => {
    if (processorD.is_design_in_progress && (!processorD.edges || processorD.edges.length === 0)) {
      return [];
    }
    return validateProcessorD(processorD, 6);
  }, [processorD]);

  const handleApplyCustomD = () => {
    try {
      setUploadError(null);
      const parsed = JSON.parse(customJsonInput);
      const errs = validateProcessorD(parsed, 6);
      if (errs.length > 0) {
        setUploadError(`Validation failed: ${errs.join('; ')}`);
        return;
      }
      onUpdateProcessorD(parsed);
      setShowJsonLoader(false);
      setCustomJsonInput('');
    } catch (e) {
      setUploadError(`Invalid JSON format: ${e.message}`);
    }
  };

  return (
    <section id="processors" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-solar-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5 text-solar-400" />
            <span>Hardware Architecture & Coupling Topology</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Processor Explorer: A, B, and D
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Examine physical qubit connectivity graphs, gate sets, capacity constraints, and official noise limits.
          </p>
        </div>

        {/* Tab Selector with High Contrast */}
        <div className="flex p-1 rounded-xl bg-carbon-900 border border-carbon-700 shrink-0">
          <button
            onClick={() => setActiveTab('A')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'A'
                ? 'bg-crimson-950 text-crimson-300 border border-crimson-700 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-crimson-400" />
            <span>Processor A (5Q)</span>
          </button>

          <button
            onClick={() => setActiveTab('B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'B'
                ? 'bg-solar-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Processor B (9Q Ref)</span>
          </button>

          <button
            onClick={() => setActiveTab('D')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'D'
                ? 'bg-mint-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Processor D (Custom)</span>
          </button>
        </div>
      </div>

      {/* Tab A Content */}
      {activeTab === 'A' && (
        <div className="rounded-2xl bg-carbon-900 border border-crimson-900/60 p-6 space-y-6 shadow-xl">
          <div className="rounded-xl border border-crimson-500/50 bg-crimson-950/30 p-4.5 flex items-start gap-3.5 text-crimson-200">
            <AlertOctagon className="w-6 h-6 text-crimson-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-bold text-crimson-300 flex items-center gap-2 font-mono">
                STATUS: NOT EXECUTABLE FOR PS-O1 BENCHMARK
              </div>
              <p className="text-xs text-crimson-100/90 leading-relaxed">
                {processorA.reason}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-carbon-950 rounded-xl border border-carbon-800 p-4 flex flex-col justify-between h-[340px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Processor A Physical Coupling Graph</span>
                <span className="text-crimson-400 font-bold">5 Qubits · 4 Edges</span>
              </div>

              <div className="relative w-full h-[260px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 460 260">
                  {processorA.edges.map(([u, v], i) => (
                    <line
                      key={i}
                      x1={TOPOLOGY_COORDS_A[u].x}
                      y1={TOPOLOGY_COORDS_A[u].y}
                      x2={TOPOLOGY_COORDS_A[v].x}
                      y2={TOPOLOGY_COORDS_A[v].y}
                      stroke="#475569"
                      strokeWidth="2.5"
                    />
                  ))}
                  {Object.entries(TOPOLOGY_COORDS_A).map(([id, pos]) => (
                    <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="18" fill="#1c1917" stroke="#f43f5e" strokeWidth="2.5" />
                      <text
                        textAnchor="middle"
                        dy="5"
                        fill="#ffffff"
                        fontSize="12"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Q{id}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="text-[11px] text-slate-400 font-mono text-center">
                T-shape topology: Q0 — Q1 — Q3 — Q4 (branch Q1 — Q2)
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-carbon-950 border border-carbon-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Capacity Specifications
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Physical Qubits:</span>
                    <span className="font-mono font-bold text-white">5</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Transmitters Required:</span>
                    <span className="font-mono font-bold text-crimson-400">6 (Deficit: -1)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Coupling Edges:</span>
                    <span className="font-mono text-slate-300">4 bidirectional links</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Basis Gates:</span>
                    <span className="font-mono text-solar-300">rz, sx, x, cx</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Benchmark Verdict:</span>
                    <span className="font-mono text-crimson-400 font-semibold">Capacity Disqualified</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-carbon-950 border border-carbon-800/80 text-xs text-slate-300 leading-relaxed font-mono">
                Organizers rule: "Report not executable (capacity)". No fabricated runs are shown.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab B Content */}
      {activeTab === 'B' && (
        <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-6 space-y-6 shadow-xl">
          <div className="rounded-xl border border-solar-500/40 bg-solar-950/20 p-4.5 flex items-start gap-3.5 text-solar-200">
            <CheckCircle2 className="w-6 h-6 text-solar-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-bold text-solar-300 flex items-center gap-2 font-mono">
                PROCESSOR B — OFFICIAL REFERENCE TOPOLOGY
              </div>
              <p className="text-xs text-solar-100/90 leading-relaxed">
                Nine-qubit, twelve-edge official reference architecture. Sufficient physical capacity (9 &gt; 6). 
                Non-adjacent transmitter interactions require compiler SWAP gate insertions during SABRE routing, generating +3 CX overhead.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-carbon-950 rounded-xl border border-carbon-800 p-4 flex flex-col justify-between h-[380px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Processor B 9-Qubit Coupling Graph</span>
                <span className="text-solar-400 font-bold">9 Qubits · 12 Edges</span>
              </div>

              <div className="relative w-full h-[300px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 540 300">
                  {processorB.edges.map(([u, v], i) => (
                    <line
                      key={i}
                      x1={TOPOLOGY_COORDS_B[u].x}
                      y1={TOPOLOGY_COORDS_B[u].y}
                      x2={TOPOLOGY_COORDS_B[v].x}
                      y2={TOPOLOGY_COORDS_B[v].y}
                      stroke="#d97706"
                      strokeWidth="2.5"
                      strokeOpacity="0.8"
                    />
                  ))}
                  {Object.entries(TOPOLOGY_COORDS_B).map(([id, pos]) => (
                    <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="16" fill="#1c1917" stroke="#fbbf24" strokeWidth="2.5" />
                      <text
                        textAnchor="middle"
                        dy="4"
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        Q{id}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <div className="text-[11px] text-slate-400 font-mono text-center">
                12 edges: (0,1), (1,2), (1,6), (2,3), (2,6), (2,5), (3,4), (4,5), (5,6), (6,7), (6,8), (8,0)
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-carbon-950 border border-carbon-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Reference Architecture Specs
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Physical Qubits:</span>
                    <span className="font-mono font-bold text-white">9 physical nodes</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Coupling Edges:</span>
                    <span className="font-mono font-bold text-solar-300">12 bidirectional links</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Max Degree:</span>
                    <span className="font-mono text-slate-300">4 (nodes Q2 and Q6)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Basis Gates:</span>
                    <span className="font-mono text-solar-300">rz, sx, x, cx</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-carbon-800">
                    <span className="text-slate-400">Noise Settings:</span>
                    <span className="font-mono text-slate-300">p1=0.1%, p2=0.5%, ro=1.0%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Routing Penalty:</span>
                    <span className="font-mono text-solar-400 font-bold">+3 CX overhead (1 SWAP)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab D Content */}
      {activeTab === 'D' && (
        <div className="rounded-2xl bg-carbon-900 border border-mint-900/60 p-6 space-y-6 shadow-xl">
          <div className="rounded-xl border border-mint-500/40 bg-mint-950/20 p-4.5 flex items-start justify-between gap-3 text-mint-200">
            <div className="flex items-start gap-3.5">
              <Clock className="w-6 h-6 text-mint-400 shrink-0 mt-0.5 animate-pulse" />
              <div className="space-y-1 text-sm">
                <div className="font-bold text-mint-300 flex items-center gap-2 font-mono">
                  PROCESSOR D — DESIGN IN PROGRESS · BENCHMARK RESULTS PENDING
                </div>
                <p className="text-xs text-mint-100/90 leading-relaxed">
                  Custom hardware architecture is currently being finalized by Team HACKSMITHS technical lead. 
                  The website ingests the validated JSON from <code className="font-mono text-mint-300">public/data/processor_D.json</code>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowJsonLoader(!showJsonLoader)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-mint-950 hover:bg-mint-900 text-mint-300 text-xs font-mono border border-mint-700 flex items-center gap-1.5 font-bold"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Load Custom JSON</span>
            </button>
          </div>

          {showJsonLoader && (
            <div className="p-4 rounded-xl bg-carbon-950 border border-mint-500/40 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-mint-300 font-mono">Ingest Custom Processor D JSON</span>
                <span className="text-slate-400">Must satisfy 6–12 qubits, degree ≤ 4, connected</span>
              </div>
              <textarea
                rows="6"
                value={customJsonInput}
                onChange={(e) => setCustomJsonInput(e.target.value)}
                placeholder={`{\n  "name": "Processor D",\n  "team": "HACKSMITHS",\n  "problem_statement": "PS-O1",\n  "num_qubits": 6,\n  "edges": [[0,2],[0,3],[0,4],[1,4],[1,5],[2,3],[2,4],[3,4],[3,5]],\n  "basis_gates": ["rz", "sx", "x", "cx"],\n  "noise": {"model": "official", "p1": 0.001, "p2": 0.005, "p_readout": 0.01},\n  "design_rationale": "Direct hardware coupling matching the 9 transmitter conflict pairs"\n}`}
                className="w-full bg-carbon-900 border border-carbon-700 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-mint-400"
              />
              {uploadError && (
                <div className="text-xs text-crimson-400 font-mono flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{uploadError}</span>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowJsonLoader(false)}
                  className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyCustomD}
                  className="px-4 py-1.5 rounded bg-mint-600 hover:bg-mint-500 text-carbon-950 text-xs font-bold font-mono"
                >
                  Validate & Apply
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-carbon-950 rounded-xl border border-carbon-800 p-5 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-mint-400" />
                <span>Team HACKSMITHS Topology Proposal</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {processorD.design_rationale || 
                  "To resolve the SWAP and depth bottleneck observed on Processor B, our design targets a problem-informed coupling graph matching the 9 interaction edges: (0,2), (0,3), (0,4), (1,4), (1,5), (2,3), (2,4), (3,4), (3,5). When logical variables are mapped directly to physical couplers, routing overhead vanishes (CX overhead = 0)."
                }
              </p>

              <div className="space-y-2 pt-2 border-t border-carbon-800">
                <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                  Official Optimization Challenge Kit Rules:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 p-2 rounded bg-carbon-900 border border-carbon-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint-400 shrink-0" />
                    <span>Qubits in [6, 12]</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-carbon-900 border border-carbon-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint-400 shrink-0" />
                    <span>Max Degree ≤ 4</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-carbon-900 border border-carbon-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint-400 shrink-0" />
                    <span>Connected Graph</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-carbon-900 border border-carbon-800 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-mint-400 shrink-0" />
                    <span>Basis: rz, sx, x, cx</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-carbon-950 rounded-xl border border-carbon-800 p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-2">
                  Validation Status
                </h4>
                <div className="p-4 rounded-lg bg-carbon-900 border border-carbon-800 text-center space-y-2">
                  <div className="text-solar-400 font-mono text-xs font-bold">
                    Awaiting Frozen Output
                  </div>
                  <p className="text-[11px] text-slate-400">
                    The technical team is executing the simulation on Processor D. Once exported to <code className="text-mint-300">public/data/processor_D.json</code>, the canvas populates automatically.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-carbon-800 text-[11px] text-slate-500 font-mono">
                Decoupled Contract: <code className="text-mint-400">public/data/processor_D.json</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
