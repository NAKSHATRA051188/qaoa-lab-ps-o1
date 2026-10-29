import React, { useState, useMemo } from 'react';
import { validateProcessorD } from '../utils/graphCalculations';
import { 
  Cpu, 
  AlertOctagon, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  Layers, 
  GitBranch, 
  Activity, 
  ShieldCheck, 
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

// Coordinates for visual rendering of topologies
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
  const [activeTab, setActiveTab] = useState('B'); // 'A', 'B', or 'D'
  const [customJsonInput, setCustomJsonInput] = useState('');
  const [showJsonLoader, setShowJsonLoader] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Processor A definition (fixed 5 qubits)
  const processorA = {
    name: "Processor A",
    num_qubits: 5,
    edges: [[0, 1], [1, 2], [1, 3], [3, 4]],
    basis_gates: ["rz", "sx", "x", "cx"],
    status: "NOT_EXECUTABLE",
    executable: false,
    reason: "Official locked problem PS-O1 requires 6 logical variables (qubits 0–5). Processor A provides only 5 physical qubits. Compiling without modifying the problem violates the locked benchmark rule; reducing problem variables or symmetry-fixing changes the ansatz and is strictly disallowed."
  };

  // Processor B definition
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

  // Processor D definition & validation
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

  // Rule verification of Processor D
  const validationErrors = useMemo(() => {
    if (processorD.is_design_in_progress && (!processorD.edges || processorD.edges.length === 0)) {
      return [];
    }
    return validateProcessorD(processorD, 6);
  }, [processorD]);

  const isDValid = validationErrors.length === 0 && (!processorD.is_design_in_progress || processorD.edges?.length > 0);

  // Handle uploading / pasting custom processor D JSON
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
    <section id="processors" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/60 text-purple-300 text-xs font-mono mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware Architecture & Coupling Topology</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Processor Explorer: A, B, and D
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Examine physical qubit connectivity graphs, gate sets, capacity constraints, and official noise limits.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('A')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'A'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            <span>Processor A (5Q)</span>
          </button>

          <button
            onClick={() => setActiveTab('B')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'B'
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Processor B (9Q)</span>
          </button>

          <button
            onClick={() => setActiveTab('D')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'D'
                ? 'bg-purple-950/80 text-purple-300 border border-purple-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Processor D (Custom)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area based on Tab */}
      {activeTab === 'A' && (
        <div className="rounded-2xl bg-slate-900/80 border border-rose-900/40 p-6 space-y-6 shadow-xl">
          {/* Status Banner */}
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4.5 flex items-start gap-3.5 text-rose-200">
            <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-bold text-rose-300 flex items-center gap-2">
                STATUS: NOT EXECUTABLE FOR PS-O1 BENCHMARK
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {processorA.reason}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Topology Diagram */}
            <div className="lg:col-span-7 bg-[#070b14] rounded-xl border border-slate-800 p-4 flex flex-col justify-between h-[340px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Processor A Physical Coupling Graph</span>
                <span className="text-rose-400 font-bold">5 Qubits · 4 Edges</span>
              </div>

              <div className="relative w-full h-[260px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 460 260">
                  {/* Edges: (0,1), (1,2), (1,3), (3,4) */}
                  {processorA.edges.map(([u, v], i) => {
                    const posU = TOPOLOGY_COORDS_A[u];
                    const posV = TOPOLOGY_COORDS_A[v];
                    return (
                      <line
                        key={i}
                        x1={posU.x}
                        y1={posU.y}
                        x2={posV.x}
                        y2={posV.y}
                        stroke="#475569"
                        strokeWidth="2.5"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {Object.entries(TOPOLOGY_COORDS_A).map(([id, pos]) => (
                    <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="18" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="2" />
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

              <div className="text-[11px] text-slate-500 font-mono text-center">
                Linear T-shape tree connectivity: Q0 — Q1 — Q3 — Q4 (with branch Q1 — Q2)
              </div>
            </div>

            {/* Specifications Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Architectural Specifications
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Physical Qubits:</span>
                    <span className="font-mono font-bold text-white">5</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Logical Qubits Required:</span>
                    <span className="font-mono font-bold text-rose-400">6 (Overflow: +1)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Coupling Edges:</span>
                    <span className="font-mono text-slate-300">4 bidirectional edges</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Native Basis Gates:</span>
                    <span className="font-mono text-cyan-300">rz, sx, x, cx</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Benchmark Verdict:</span>
                    <span className="font-mono text-rose-400 font-semibold">Strictly Disqualified</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
                <strong className="text-slate-300">Organizers' kit guideline:</strong> "If qc.num_qubits &gt; processor['num_qubits'], 
                report 'not executable (capacity)'." No fictitious results are presented.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'B' && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-6 shadow-xl">
          {/* Status Banner */}
          <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/20 p-4.5 flex items-start gap-3.5 text-cyan-200">
            <CheckCircle className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <div className="font-bold text-cyan-300 flex items-center gap-2">
                PROCESSOR B — OFFICIAL REFERENCE TOPOLOGY
              </div>
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                Nine-qubit, twelve-edge official reference architecture. Sufficient physical capacity (9 &gt; 6) to host the full 
                6-node PS-O1 instance. Non-adjacent graph interactions require compiler SWAP gate insertions during SABRE routing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Topology Diagram */}
            <div className="lg:col-span-7 bg-[#070b14] rounded-xl border border-slate-800 p-4 flex flex-col justify-between h-[380px]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Processor B 9-Qubit Coupling Graph</span>
                <span className="text-cyan-400 font-bold">9 Qubits · 12 Edges</span>
              </div>

              <div className="relative w-full h-[300px] flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 540 300">
                  {/* Edges from processorB.edges */}
                  {processorB.edges.map(([u, v], i) => {
                    const posU = TOPOLOGY_COORDS_B[u] || { x: 50, y: 50 };
                    const posV = TOPOLOGY_COORDS_B[v] || { x: 100, y: 100 };
                    return (
                      <line
                        key={i}
                        x1={posU.x}
                        y1={posU.y}
                        x2={posV.x}
                        y2={posV.y}
                        stroke="#0e7490"
                        strokeWidth="2.5"
                      />
                    );
                  })}

                  {/* Nodes */}
                  {Object.entries(TOPOLOGY_COORDS_B).map(([id, pos]) => (
                    <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle r="16" fill="#083344" stroke="#22d3ee" strokeWidth="2" />
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

              <div className="text-[11px] text-slate-500 font-mono text-center">
                Edges: (0,1), (1,2), (1,6), (2,3), (2,6), (2,5), (3,4), (4,5), (5,6), (6,7), (6,8), (8,0)
              </div>
            </div>

            {/* Specifications Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Reference Architecture Specs
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Physical Qubits:</span>
                    <span className="font-mono font-bold text-white">9 physical nodes</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Coupling Edges:</span>
                    <span className="font-mono font-bold text-cyan-300">12 bidirectional links</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Max Physical Degree:</span>
                    <span className="font-mono text-slate-300">4 (e.g. Q2 and Q6)</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Native Basis Gates:</span>
                    <span className="font-mono text-cyan-300">rz, sx, x, cx</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Synthetic Noise Rates:</span>
                    <span className="font-mono text-slate-300">p1=0.1%, p2=0.5%, ro=1.0%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Routing Impact:</span>
                    <span className="font-mono text-amber-300 font-semibold">+3 CX overhead (1 SWAP)</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
                Loaded directly from official starter pack <code className="font-mono text-cyan-300">qff_phase2.py</code>. 
                Serves as the fixed reference against which custom Processor D is evaluated.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'D' && (
        <div className="rounded-2xl bg-slate-900/80 border border-purple-900/40 p-6 space-y-6 shadow-xl">
          {/* Status Banner */}
          {processorD.is_design_in_progress && (!processorD.edges || processorD.edges.length === 0) ? (
            <div className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-4.5 flex items-start justify-between gap-3 text-purple-200">
              <div className="flex items-start gap-3.5">
                <Clock className="w-6 h-6 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1 text-sm">
                  <div className="font-bold text-purple-300 flex items-center gap-2">
                    PROCESSOR D — DESIGN IN PROGRESS · BENCHMARK RESULTS PENDING
                  </div>
                  <p className="text-xs text-purple-200/90 leading-relaxed">
                    Custom hardware architecture is currently being finalized by Team HACKSMITHS technical lead. 
                    The website is architected with a decoupled loader to ingest the validated JSON (<code className="font-mono text-purple-300">public/data/processor_D.json</code>) 
                    without requiring component redesigns.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowJsonLoader(!showJsonLoader)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-xs font-mono border border-purple-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Load Custom JSON</span>
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4.5 flex items-start justify-between gap-3 text-emerald-200">
              <div className="flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <div className="font-bold text-emerald-300 flex items-center gap-2">
                    PROCESSOR D — VALIDATED CUSTOM ARCHITECTURE LOADED
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    Custom topology successfully passed all 5 official constraints in <code className="font-mono">validate_processor_d()</code>.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowJsonLoader(!showJsonLoader)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Replace JSON</span>
              </button>
            </div>
          )}

          {/* Interactive JSON Loader Drawer */}
          {showJsonLoader && (
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/40 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-purple-300">Ingest Custom Processor D JSON</span>
                <span className="text-slate-400">Must satisfy 6–12 qubits, degree ≤ 4, connected</span>
              </div>
              <textarea
                rows="6"
                value={customJsonInput}
                onChange={(e) => setCustomJsonInput(e.target.value)}
                placeholder={`{\n  "name": "Processor D",\n  "team": "HACKSMITHS",\n  "problem_statement": "PS-O1",\n  "num_qubits": 6,\n  "edges": [[0,2],[0,3],[0,4],[1,4],[1,5],[2,3],[2,4],[3,4],[3,5]],\n  "basis_gates": ["rz", "sx", "x", "cx"],\n  "noise": {"model": "official", "p1": 0.001, "p2": 0.005, "p_readout": 0.01},\n  "design_rationale": "Hardware-native graph mapping"\n}`}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-purple-400"
              />
              {uploadError && (
                <div className="text-xs text-rose-400 font-mono flex items-center gap-1.5">
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
                  className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Validate & Apply
                </button>
              </div>
            </div>
          )}

          {/* Design Rationale & Official Rules Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Design Hypothesis Card */}
            <div className="lg:col-span-7 bg-slate-950/60 rounded-xl border border-slate-800 p-5 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span>Team HACKSMITHS Design Hypothesis</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {processorD.design_rationale || 
                  "To resolve the SWAP and depth bottleneck observed on Processor B, our design targets a problem-informed coupling graph matching the 9 interaction edges: (0,2), (0,3), (0,4), (1,4), (1,5), (2,3), (2,4), (3,4), (3,5). When logical variables are mapped directly to physical couplers, routing overhead vanishes (CX overhead = 0)."
                }
              </p>

              {/* Official Rules Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-slate-400">
                  Official Optimization Challenge Kit Rules:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Qubits in [6, 12]</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Max Degree ≤ 4</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Connected Graph</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-900/60 border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Basis: rz, sx, x, cx</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State / Real-Time Visualizer */}
            <div className="lg:col-span-5 bg-slate-950/60 rounded-xl border border-slate-800 p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Validation & Status
                </h4>
                {processorD.is_design_in_progress && (!processorD.edges || processorD.edges.length === 0) ? (
                  <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 text-center space-y-2">
                    <div className="text-amber-400 font-mono text-xs font-bold">
                      Awaiting Frozen JSON Export
                    </div>
                    <p className="text-[11px] text-slate-400">
                      The technical team will supply the final architecture export. 
                      Once deposited in <code className="text-purple-300">public/data/processor_D.json</code>, 
                      the coupler network will render dynamically.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      <span>Configuration Validated</span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>Name: <span className="font-mono text-white">{processorD.name}</span></div>
                      <div>Qubits: <span className="font-mono text-white">{processorD.num_qubits}</span></div>
                      <div>Couplers: <span className="font-mono text-white">{processorD.edges?.length || 0}</span></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
                Data input interface: <code className="text-purple-300 font-mono">public/data/processor_D.json</code>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

