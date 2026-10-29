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
  Move,
  Radio,
  Wifi,
  WifiOff,
  Signal,
  AlertOctagon,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

const INITIAL_NODE_POSITIONS = {
  0: { x: 120, y: 130 },
  1: { x: 520, y: 130 },
  2: { x: 210, y: 290 },
  3: { x: 430, y: 290 },
  4: { x: 190, y: 460 },
  5: { x: 450, y: 460 },
};

const TRANSMITTER_LABELS = {
  0: { name: 'Tx0 (North Core)', band: '46 dBm', sector: 'Downtown' },
  1: { name: 'Tx1 (East Metro)', band: '43 dBm', sector: 'Financial' },
  2: { name: 'Tx2 (Central Hub)', band: '33 dBm', sector: 'Transit' },
  3: { name: 'Tx3 (West Sector)', band: '43 dBm', sector: 'Corridor' },
  4: { name: 'Tx4 (South Center)', band: '30 dBm', sector: 'Campus' },
  5: { name: 'Tx5 (Harbor Relay)', band: '46 dBm', sector: 'Heights' },
};

export default function InteractiveMaxCut({ instanceData }) {
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
  const totalWeight = instanceData?.total_weight || 27;

  // View mode: 'transmitter' (Wireless Network Mode) or 'quantum' (Mathematical Graph Mode)
  const [viewMode, setViewMode] = useState('transmitter');

  // Node partition assignment: 0 -> Channel Alpha (Solar Gold), 1 -> Channel Beta (Mint Jade)
  const [assignment, setAssignment] = useState(() => bitstringToAssignment("001011"));
  const [nodePositions, setNodePositions] = useState(INITIAL_NODE_POSITIONS);
  const [activeOptimalIndex, setActiveOptimalIndex] = useState(0);

  // Dragging state
  const [draggingNode, setDraggingNode] = useState(null);
  const svgRef = useRef(null);

  // Live computation
  const { cutWeight, cutEdges, uncutEdges } = calculateCut(edges, assignment);
  const currentBitstring = assignmentToBitstring(assignment, numVertices);

  const isOptimal = cutWeight === classicalOptimum;
  const remainingCollisionWeight = totalWeight - cutWeight;
  const isolationRatio = ((cutWeight / totalWeight) * 100).toFixed(1);

  // Toggle a transmitter channel
  const toggleNode = (nodeId) => {
    setAssignment((prev) => ({
      ...prev,
      [nodeId]: prev[nodeId] === 1 ? 0 : 1,
    }));
  };

  // Toggle between optimal partitions
  const handleShowOptimal = () => {
    const nextOptimal = activeOptimalIndex === 0 ? "110100" : "001011";
    setAssignment(bitstringToAssignment(nextOptimal));
    setActiveOptimalIndex(activeOptimalIndex === 0 ? 1 : 0);
  };

  // Random assignment
  const handleRandomPartition = () => {
    const next = {};
    for (let i = 0; i < numVertices; i++) {
      next[i] = Math.random() < 0.5 ? 0 : 1;
    }
    setAssignment(next);
  };

  // Worst-case collision: all on Channel Alpha
  const handleWorstCase = () => {
    const reset = {};
    for (let i = 0; i < numVertices; i++) reset[i] = 0;
    setAssignment(reset);
  };

  // Drag Handlers
  const handleMouseDown = (nodeId, e) => {
    e.stopPropagation();
    setDraggingNode(nodeId);
  };

  const handleMouseMove = (e) => {
    if (draggingNode === null || !svgRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const x = Math.max(50, Math.min(590, e.clientX - svgRect.left));
    const y = Math.max(50, Math.min(540, e.clientY - svgRect.top));

    setNodePositions((prev) => ({
      ...prev,
      [draggingNode]: { x, y },
    }));
  };

  const handleMouseUp = () => setDraggingNode(null);

  useEffect(() => {
    const onGlobalMouseUp = () => setDraggingNode(null);
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);

  return (
    <section id="interactive-graph" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-solar-950/80 border border-solar-500/40 text-solar-300 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-solar-400" />
            <span>Interactive Transmitter Optimization Canvas</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Transmitter Interference & Channel Partitioning
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Assign each transmitter to <strong className="text-solar-400">Channel Alpha</strong> or <strong className="text-mint-400">Channel Beta</strong>. 
            Cross-channel links resolve mutual RF interference. Co-channel links trigger destructive collision penalties.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex p-1 rounded-xl bg-carbon-900 border border-carbon-700 shrink-0">
          <button
            onClick={() => setViewMode('transmitter')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'transmitter'
                ? 'bg-solar-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Transmitter View</span>
          </button>
          <button
            onClick={() => setViewMode('quantum')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              viewMode === 'quantum'
                ? 'bg-mint-500 text-carbon-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Graph View (v0–v5)</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-carbon-900 rounded-2xl border border-carbon-750 p-4 md:p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Top toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300 flex items-center gap-1 bg-carbon-950 px-2.5 py-1 rounded-md border border-carbon-800">
                <Move className="w-3 h-3 text-solar-400" />
                <span>Draggable Nodes</span>
              </span>
              <span className="text-xs font-mono text-slate-300 bg-carbon-950 px-2.5 py-1 rounded-md border border-carbon-800">
                Partition: <code className="text-solar-400 font-bold">{currentBitstring}</code>
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleShowOptimal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-solar-500 to-mint-500 hover:from-solar-400 hover:to-mint-400 text-carbon-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                title="Toggle optimal assignments 001011 and 110100"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Show Optimal ({activeOptimalIndex === 0 ? '001011' : '110100'})</span>
              </button>

              <button
                onClick={handleRandomPartition}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-slate-200 text-xs transition-colors cursor-pointer border border-carbon-700"
                title="Randomly assign channels"
              >
                <Shuffle className="w-3.5 h-3.5 text-slate-400" />
                <span>Random</span>
              </button>

              <button
                onClick={handleWorstCase}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-crimson-300 text-xs transition-colors cursor-pointer border border-crimson-900/50"
                title="Put all transmitters on same channel"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-crimson-400" />
                <span>All Collision</span>
              </button>
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="relative w-full h-[500px] bg-carbon-950 rounded-xl border border-carbon-800 overflow-hidden flex items-center justify-center">
            {/* High-contrast signal grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

            <svg
              ref={svgRef}
              className="w-full h-full select-none cursor-default"
              viewBox="0 0 640 550"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                {/* Glow filter for cut edges */}
                <filter id="solarGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="resolvedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Conflict Links / Edges */}
              <g className="edges">
                {edges.map((edge, idx) => {
                  const u = edge.source;
                  const v = edge.target;
                  const posU = nodePositions[u] || { x: 100, y: 100 };
                  const posV = nodePositions[v] || { x: 200, y: 200 };
                  const isResolved = assignment[u] !== assignment[v];

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
                        stroke={isResolved ? 'url(#resolvedGradient)' : '#f43f5e'}
                        strokeWidth={isResolved ? 3.5 : 2}
                        strokeDasharray={isResolved ? '6 4' : '2 2'}
                        strokeOpacity={isResolved ? 0.95 : 0.6}
                        filter={isResolved ? 'url(#solarGlow)' : 'none'}
                      />

                      {/* Weight pill badge */}
                      <g transform={`translate(${midX}, ${midY})`}>
                        <circle
                          r="12"
                          fill={isResolved ? '#0f172a' : '#4c0519'}
                          stroke={isResolved ? '#10b981' : '#f43f5e'}
                          strokeWidth="1.5"
                        />
                        <text
                          textAnchor="middle"
                          dy="4"
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="monospace"
                          fill={isResolved ? '#34d399' : '#fda4af'}
                        >
                          {edge.weight}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Transmitters / Nodes */}
              <g className="nodes">
                {Array.from({ length: numVertices }).map((_, id) => {
                  const pos = nodePositions[id] || { x: 100, y: 100 };
                  const channel = assignment[id] ?? 0;
                  const isChannelAlpha = channel === 0;
                  const tMeta = TRANSMITTER_LABELS[id];

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
                      {/* Outer pulse signal aura */}
                      <circle
                        r="30"
                        fill={isChannelAlpha ? '#f59e0b' : '#10b981'}
                        fillOpacity="0.14"
                        stroke={isChannelAlpha ? '#f59e0b' : '#10b981'}
                        strokeOpacity="0.4"
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:scale-110"
                      />

                      {/* Main Node circle */}
                      <circle
                        r="21"
                        fill={isChannelAlpha ? '#291804' : '#042718'}
                        stroke={isChannelAlpha ? '#fbbf24' : '#34d399'}
                        strokeWidth="2.5"
                        className="transition-all duration-300 drop-shadow-lg"
                      />

                      {/* Vertex label */}
                      <text
                        textAnchor="middle"
                        dy="-2"
                        fontSize="12"
                        fontWeight="800"
                        fontFamily="monospace"
                        fill="#ffffff"
                      >
                        {viewMode === 'transmitter' ? `Tx${id}` : `v${id}`}
                      </text>

                      {/* Sub-label */}
                      <text
                        textAnchor="middle"
                        dy="12"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill={isChannelAlpha ? '#fde68a' : '#a7f3d0'}
                      >
                        {isChannelAlpha ? 'Ch α' : 'Ch β'}
                      </text>

                      {/* Sector Tag in transmitter view */}
                      {viewMode === 'transmitter' && (
                        <text
                          textAnchor="middle"
                          dy="32"
                          fontSize="10"
                          fontFamily="sans-serif"
                          fontWeight="600"
                          fill="#94a3b8"
                        >
                          {tMeta.sector}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Bottom canvas legend */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300 pointer-events-none bg-carbon-900/90 backdrop-blur-md p-2 rounded-lg border border-carbon-800">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-solar-300 font-semibold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-solar-400 inline-block" /> Channel Alpha (0)
                </span>
                <span className="flex items-center gap-1.5 text-mint-300 font-semibold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-mint-400 inline-block" /> Channel Beta (1)
                </span>
                <span className="flex items-center gap-1.5 text-crimson-400 font-semibold font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-crimson-500 inline-block" /> Same-Channel Collision
                </span>
              </span>
              <span className="text-[11px] text-slate-400">Click node to toggle channel</span>
            </div>
          </div>
        </div>

        {/* Right Diagnostics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Spectrum Performance Card */}
          <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Channel Optimization Metric</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isOptimal 
                  ? 'bg-mint-950 text-mint-300 border border-mint-700' 
                  : 'bg-carbon-800 text-slate-300 border border-carbon-700'
              }`}>
                {isOptimal ? 'MAXIMUM RF ISOLATION' : 'SUB-OPTIMAL REUSE'}
              </span>
            </h3>

            {/* Large Score Metric */}
            <div className="flex items-baseline justify-between border-b border-carbon-800 pb-3">
              <div>
                <div className="text-4xl font-black font-mono tracking-tight text-white flex items-center gap-2">
                  <span className={isOptimal ? 'text-solar-400' : 'text-slate-100'}>{cutWeight}</span>
                  <span className="text-lg font-normal text-slate-500">/ 22.0</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Avoided interference: <strong className="text-mint-400 font-mono">{isolationRatio}%</strong> of total RF conflict
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Isolated Links</div>
                <div className="text-xl font-bold font-mono text-mint-400">
                  {cutEdges.length} <span className="text-xs text-slate-500">/ {edges.length}</span>
                </div>
              </div>
            </div>

            {/* Remaining Collision Penalty Warning */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              remainingCollisionWeight > 5
                ? 'bg-crimson-950/40 border-crimson-800/80 text-crimson-200'
                : 'bg-carbon-950 border-carbon-800 text-slate-300'
            }`}>
              <div className="flex items-center gap-2">
                <WifiOff className={`w-4 h-4 ${remainingCollisionWeight > 5 ? 'text-crimson-400' : 'text-slate-400'}`} />
                <span>Co-Channel Conflict Penalty:</span>
              </div>
              <span className="font-mono font-bold text-sm text-crimson-400">
                {remainingCollisionWeight} / 27.0
              </span>
            </div>

            {/* Channel Membership List */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between py-1.5 border-b border-carbon-800">
                <span className="text-slate-400">Binary Bitstring:</span>
                <span className="font-mono font-bold text-solar-400 tracking-widest">{currentBitstring}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-carbon-800">
                <span className="text-slate-400">Channel Alpha (Tx):</span>
                <span className="font-mono text-solar-300">
                  {Object.entries(assignment)
                    .filter(([_, v]) => v === 0)
                    .map(([k]) => `Tx${k}`)
                    .join(', ') || 'None'}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Channel Beta (Tx):</span>
                <span className="font-mono text-mint-300">
                  {Object.entries(assignment)
                    .filter(([_, v]) => v === 1)
                    .map(([k]) => `Tx${k}`)
                    .join(', ') || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Complementary Symmetry Note */}
          <div className="rounded-xl border border-carbon-700 bg-carbon-900 p-4 space-y-2">
            <div className="flex items-center gap-2 text-solar-400 text-xs font-bold font-mono">
              <ArrowRightLeft className="w-4 h-4 text-solar-400" />
              <span>Channel Inversion Symmetry</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Swapping all assignments between Channel Alpha and Beta (<code className="text-solar-400 font-mono">001011</code> ↔ <code className="text-mint-400 font-mono">110100</code>) preserves all crossing boundaries. Both configurations achieve the identical maximum cut of <strong>22.0</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
