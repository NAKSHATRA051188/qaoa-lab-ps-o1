import React, { useState, useRef, useEffect } from 'react';
import { 
  calculateCut, 
  bitstringToAssignment, 
  assignmentToBitstring 
} from '../utils/graphCalculations';
import { 
  Sparkles, 
  Shuffle, 
  RotateCcw, 
  Award, 
  Check, 
  Info, 
  Move,
  Scissors,
  Layers
} from 'lucide-react';

// Default initial coordinates for the 6 vertices (organized for clear visibility)
const INITIAL_NODE_POSITIONS = {
  0: { x: 120, y: 140 },
  1: { x: 520, y: 140 },
  2: { x: 220, y: 300 },
  3: { x: 420, y: 300 },
  4: { x: 200, y: 460 },
  5: { x: 440, y: 460 },
};

export default function InteractiveMaxCut({ instanceData }) {
  // Official locked edges from instance data or fallback
  const edges = instanceData?.weighted_edges?.map((e) => {
    if (Array.isArray(e)) {
      return { source: e[0], target: e[1], weight: e[2] };
    }
    return e;
  }) || [
    { source: 0, target: 2, weight: 1 },
    { source: 0, target: 3, weight: 4 },
    { source: 0, target: 4, weight: 4 },
    { source: 1, target: 4, weight: 3 },
    { source: 1, target: 5, weight: 3 },
    { source: 2, target: 3, weight: 5 },
    { source: 2, target: 4, weight: 1 },
    { source: 3, target: 4, weight: 4 },
    { source: 3, target: 5, weight: 2 },
  ];

  const numVertices = instanceData?.num_vertices || 6;
  const classicalOptimum = instanceData?.classical_optimum || 22;
  const randomExpectedCut = instanceData?.random_expected_cut || 13.5;
  const totalWeight = instanceData?.total_weight || 27;

  // Node partition assignment: 0 -> Cyan group, 1 -> Purple group
  // Initial default partition: start with optimal "001011"
  const [assignment, setAssignment] = useState(() => bitstringToAssignment("001011"));
  const [nodePositions, setNodePositions] = useState(INITIAL_NODE_POSITIONS);
  const [activeOptimalIndex, setActiveOptimalIndex] = useState(0); // 0 -> "001011", 1 -> "110100"

  // Dragging state
  const [draggingNode, setDraggingNode] = useState(null);
  const svgRef = useRef(null);

  // Compute cut live in JavaScript from current graph edges and assignment
  const { cutWeight, cutEdges, uncutEdges } = calculateCut(edges, assignment);
  const currentBitstring = assignmentToBitstring(assignment, numVertices);

  const isOptimal = cutWeight === classicalOptimum;
  const isComplementaryOptimalA = currentBitstring === "001011";
  const isComplementaryOptimalB = currentBitstring === "110100";

  // Toggle a single vertex's partition
  const toggleNode = (nodeId) => {
    setAssignment((prev) => ({
      ...prev,
      [nodeId]: prev[nodeId] === 1 ? 0 : 1,
    }));
  };

  // Set to official optimal partition (toggles between the two complementary optimal bitstrings)
  const handleShowOptimal = () => {
    const nextOptimal = activeOptimalIndex === 0 ? "110100" : "001011";
    setAssignment(bitstringToAssignment(nextOptimal));
    setActiveOptimalIndex(activeOptimalIndex === 0 ? 1 : 0);
  };

  // Generate random partition
  const handleRandomPartition = () => {
    const nextAssignment = {};
    for (let i = 0; i < numVertices; i++) {
      nextAssignment[i] = Math.random() < 0.5 ? 0 : 1;
    }
    setAssignment(nextAssignment);
  };

  // Reset all to group 0
  const handleReset = () => {
    const resetAssignment = {};
    for (let i = 0; i < numVertices; i++) {
      resetAssignment[i] = 0;
    }
    setAssignment(resetAssignment);
  };

  // Reset positions to default
  const handleResetPositions = () => {
    setNodePositions(INITIAL_NODE_POSITIONS);
  };

  // Drag handlers
  const handleMouseDown = (nodeId, e) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggingNode === null || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = Math.max(40, Math.min(600, e.clientX - svgRect.left));
    const y = Math.max(40, Math.min(560, e.clientY - svgRect.top));

    setNodePositions((prev) => ({
      ...prev,
      [draggingNode]: { x, y },
    }));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  useEffect(() => {
    const onGlobalMouseUp = () => setDraggingNode(null);
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);

  return (
    <section id="interactive-graph" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-300 text-xs font-mono mb-2">
            <Scissors className="w-3.5 h-3.5" />
            <span>Official PS-O1 Locked Graph Benchmark</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Interactive Weighted Max-Cut Graph
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Click nodes to partition the network into <span className="text-cyan-400 font-semibold">Group 0</span> and{' '}
            <span className="text-purple-400 font-semibold">Group 1</span>. Cut weights are dynamically evaluated 
            in real time. Drag nodes to explore graph geometry.
          </p>
        </div>

        {/* Global Optimum Callout Badge */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl shrink-0">
          <div className={`p-2.5 rounded-lg ${isOptimal ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'}`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Exact Global Optimum</div>
            <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
              <span>22.0</span>
              <span className="text-xs font-normal text-slate-400">/ 27 total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center: Interactive SVG Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/80 rounded-2xl border border-slate-800 p-4 md:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                <Move className="w-3 h-3 text-cyan-400" />
                <span>Draggable Vertices</span>
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                Bitstring: <code className="text-cyan-300 font-bold">{currentBitstring}</code>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShowOptimal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
                title="Toggle between optimal partitions 001011 and 110100"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Show Optimal ({activeOptimalIndex === 0 ? '001011' : '110100'})</span>
              </button>

              <button
                onClick={handleRandomPartition}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer border border-slate-700"
                title="Randomly assign 0 or 1 to all vertices"
              >
                <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                <span>Random</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors cursor-pointer border border-slate-700"
                title="Reset all vertices to Group 0"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-[480px] bg-[#070b14]/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            {/* Background grid markings */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

            <svg
              ref={svgRef}
              className="w-full h-full select-none cursor-default"
              viewBox="0 0 640 540"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                {/* Glow filter for cut edges */}
                <filter id="cutGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="cutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Render edges */}
              <g className="edges">
                {edges.map((edge, idx) => {
                  const u = edge.source;
                  const v = edge.target;
                  const posU = nodePositions[u] || { x: 100, y: 100 };
                  const posV = nodePositions[v] || { x: 200, y: 200 };
                  const isCut = assignment[u] !== assignment[v];

                  // Midpoint for weight badge
                  const midX = (posU.x + posV.x) / 2;
                  const midY = (posU.y + posV.y) / 2;

                  return (
                    <g key={idx} className="transition-all duration-300">
                      {/* Edge line */}
                      <line
                        x1={posU.x}
                        y1={posU.y}
                        x2={posV.x}
                        y2={posV.y}
                        stroke={isCut ? 'url(#cutGradient)' : '#1e293b'}
                        strokeWidth={isCut ? 3.5 : 1.5}
                        strokeDasharray={isCut ? '6 4' : 'none'}
                        filter={isCut ? 'url(#cutGlow)' : 'none'}
                        className="transition-all duration-200"
                      />

                      {/* Weight pill badge */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <circle
                          r="12"
                          fill={isCut ? '#1e1b4b' : '#0f172a'}
                          stroke={isCut ? '#fbbf24' : '#334155'}
                          strokeWidth={isCut ? '1.5' : '1'}
                          className="transition-colors duration-200"
                        />
                        <text
                          textAnchor="middle"
                          dy="4"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill={isCut ? '#fef08a' : '#64748b'}
                        >
                          {edge.weight}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Render vertices / nodes */}
              <g className="nodes">
                {Array.from({ length: numVertices }).map((_, id) => {
                  const pos = nodePositions[id] || { x: 100, y: 100 };
                  const group = assignment[id] ?? 0;
                  const isGroup0 = group === 0;

                  return (
                    <g
                      key={id}
                      transform={`translate(${pos.x}, ${pos.y})`}
                      className="cursor-pointer group"
                      onMouseDown={(e) => handleMouseDown(id, e)}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNode(id);
                      }}
                    >
                      {/* Outer pulse indicator */}
                      <circle
                        r="28"
                        fill={isGroup0 ? '#06b6d4' : '#a855f7'}
                        fillOpacity="0.15"
                        stroke={isGroup0 ? '#06b6d4' : '#a855f7'}
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:scale-110"
                      />

                      {/* Main Node circle */}
                      <circle
                        r="20"
                        fill={isGroup0 ? '#083344' : '#3b0764'}
                        stroke={isGroup0 ? '#22d3ee' : '#c084fc'}
                        strokeWidth="2.5"
                        className="transition-all duration-300 drop-shadow-md"
                      />

                      {/* Vertex label */}
                      <text
                        textAnchor="middle"
                        dy="-2"
                        fontSize="13"
                        fontWeight="800"
                        fontFamily="sans-serif"
                        fill="#ffffff"
                      >
                        v{id}
                      </text>

                      {/* Qubit / Group tag */}
                      <text
                        textAnchor="middle"
                        dy="12"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={isGroup0 ? '#67e8f9' : '#e9d5ff'}
                      >
                        x{id}={group}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom canvas hint */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Group 0 (x_i = 0)
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block ml-3" /> Group 1 (x_i = 1)
              </span>
              <button
                onClick={handleResetPositions}
                className="pointer-events-auto text-xs text-slate-500 hover:text-slate-300 underline"
              >
                Reset layout
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Calculation & Partition Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Cut Summary Card */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Live Partition Weight</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isOptimal 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {isOptimal ? 'OPTIMAL PARTITION' : 'SUB-OPTIMAL'}
              </span>
            </h3>

            {/* Large Score Metric */}
            <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-4xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                  <span className={isOptimal ? 'text-amber-300' : 'text-cyan-400'}>{cutWeight}</span>
                  <span className="text-lg font-normal text-slate-500">/ 22</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Cut ratio: <span className="font-mono text-slate-200">{((cutWeight / classicalOptimum) * 100).toFixed(1)}%</span> of optimum
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Cut Edges</div>
                <div className="text-xl font-bold font-mono text-purple-300">
                  {cutEdges.length} <span className="text-xs text-slate-500">/ {edges.length}</span>
                </div>
              </div>
            </div>

            {/* Progress bar vs Optimum & Random Baseline */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>0</span>
                <span className="text-blue-400">Random (13.5)</span>
                <span className="text-amber-400">Opt (22)</span>
              </div>
              <div className="relative h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                {/* Random expectation marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-blue-400 z-10" 
                  style={{ left: `${(randomExpectedCut / 27) * 100}%` }}
                  title="Random expected cut: 13.5"
                />
                {/* Optimum marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10" 
                  style={{ left: `${(classicalOptimum / 27) * 100}%` }}
                  title="Global maximum cut: 22"
                />
                {/* Current cut fill */}
                <div
                  className={`h-full transition-all duration-300 ${
                    isOptimal
                      ? 'bg-gradient-to-r from-cyan-500 via-amber-400 to-purple-500'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600'
                  }`}
                  style={{ width: `${(cutWeight / 27) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Assignment Details */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Bitstring Order (x0..x5):</span>
                <span className="font-mono font-bold text-cyan-300 tracking-widest">{currentBitstring}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                <span className="text-slate-400">Group 0 Vertices:</span>
                <span className="font-mono text-cyan-400">
                  {Object.entries(assignment)
                    .filter(([_, v]) => v === 0)
                    .map(([k]) => `v${k}`)
                    .join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Group 1 Vertices:</span>
                <span className="font-mono text-purple-400">
                  {Object.entries(assignment)
                    .filter(([_, v]) => v === 1)
                    .map(([k]) => `v${k}`)
                    .join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Callout: Complementary Partition Symmetry */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold font-mono">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Bitstring Inversion Symmetry</span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              In Max-Cut, global bit inversion <span className="font-mono font-semibold text-purple-300">x ↦ 1 - x</span> preserves 
              exact edge boundaries. Complementary assignments:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className={`p-2 rounded border text-center transition-all ${
                isComplementaryOptimalA 
                  ? 'bg-purple-900/60 border-purple-400 text-purple-100 font-bold shadow-sm' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                001011 (Cut = 22)
              </div>
              <div className={`p-2 rounded border text-center transition-all ${
                isComplementaryOptimalB 
                  ? 'bg-purple-900/60 border-purple-400 text-purple-100 font-bold shadow-sm' 
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}>
                110100 (Cut = 22)
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Both states are degenerate global optima. QAOA measurements distribute sampling probabilities 
              symmetrically across both complementary bitstrings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

