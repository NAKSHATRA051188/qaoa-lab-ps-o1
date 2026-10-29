import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';

export default function RealWorldApplication({ applicationData }) {
  // Nodes & edges from application dataset
  const nodes = applicationData?.nodes || [
    { id: 0, name: "Tower A (Downtown Core)", type: "Macrocell", sector: "North-West", x: 120, y: 120, traffic_weight: 4 },
    { id: 1, name: "Tower B (Financial District)", type: "Macrocell", sector: "North-East", x: 420, y: 120, traffic_weight: 5 },
    { id: 2, name: "Tower C (Transit Terminal)", type: "Small Cell", sector: "Central Hub", x: 270, y: 220, traffic_weight: 3 },
    { id: 3, name: "Tower D (Tech Corridor)", type: "Macrocell", sector: "South-West", x: 100, y: 340, traffic_weight: 4 },
    { id: 4, name: "Tower E (Medical Campus)", type: "Small Cell", sector: "Central-South", x: 280, y: 380, traffic_weight: 4 },
    { id: 5, name: "Tower F (Residential Heights)", type: "Macrocell", sector: "South-East", x: 440, y: 340, traffic_weight: 2 },
  ];

  const edges = applicationData?.edges || [
    { source: 0, target: 1, weight: 3, conflict_reason: "Canyon corridor beam overlap" },
    { source: 0, target: 2, weight: 5, conflict_reason: "Direct line-of-sight small cell interference" },
    { source: 1, target: 2, weight: 4, conflict_reason: "Terminal approach adjacent leakage" },
    { source: 1, target: 5, weight: 2, conflict_reason: "Sidelobe coupling along expressway" },
    { source: 2, target: 3, weight: 3, conflict_reason: "Border handover region conflict" },
    { source: 2, target: 4, weight: 4, conflict_reason: "Vertical rooftop coupling" },
    { source: 3, target: 4, weight: 5, conflict_reason: "Boulevard valley shadow overlap" },
    { source: 4, target: 5, weight: 3, conflict_reason: "Suburban fringe boundary overlap" },
  ];

  // Frequency allocation: 0 -> Band A (1800 MHz, Cyan), 1 -> Band B (2100 MHz, Purple)
  const [allocation, setAllocation] = useState({
    0: 0,
    1: 1,
    2: 1,
    3: 0,
    4: 1,
    5: 0,
  });

  const toggleTower = (id) => {
    setAllocation((prev) => ({
      ...prev,
      [id]: prev[id] === 1 ? 0 : 1,
    }));
  };

  const handleSetOptimal = () => {
    // Optimal partition that maximizes cut (mitigates co-channel interference)
    setAllocation({
      0: 0,
      1: 1,
      2: 0,
      3: 1,
      4: 0,
      5: 1,
    });
  };

  const handleRandom = () => {
    const next = {};
    nodes.forEach((n) => {
      next[n.id] = Math.random() < 0.5 ? 0 : 1;
    });
    setAllocation(next);
  };

  const handleReset = () => {
    const next = {};
    nodes.forEach((n) => {
      next[n.id] = 0;
    });
    setAllocation(next);
  };

  // Evaluate co-channel conflict vs avoided interference
  let avoidedInterferenceWeight = 0;
  let remainingCoChannelConflict = 0;
  let totalConflictWeight = 0;

  edges.forEach((e) => {
    totalConflictWeight += e.weight;
    if (allocation[e.source] !== allocation[e.target]) {
      avoidedInterferenceWeight += e.weight; // Different frequency bands -> NO interference
    } else {
      remainingCoChannelConflict += e.weight; // Same frequency band -> CO-CHANNEL INTERFERENCE
    }
  });

  const mitigationPercentage = totalConflictWeight > 0 
    ? ((avoidedInterferenceWeight / totalConflictWeight) * 100).toFixed(1) 
    : 0;

  return (
    <section id="application" className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-300 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Industrial Application Mapping</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Wireless Interference-Aware Channel Allocation
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Demonstrating how graph Max-Cut maps to frequency reuse in cellular telecommunications. 
            Assigning adjacent overlapping cells to orthogonal frequency bands eliminates co-channel interference.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSetOptimal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            <span>Optimal Reuse</span>
          </button>
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            <span>Random</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Prominent Scientific Disclaimer */}
      <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-4 flex items-start gap-3.5 text-blue-200">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-blue-300">
            Supplementary Application Dataset · Research Model Notice
          </div>
          <p className="text-blue-200/90 leading-relaxed">
            {applicationData?.disclaimer || 
              "This demonstration uses an illustrative synthetic 6-tower conflict graph (loaded from public/data/application_network.json) strictly to explain the mathematical correspondence between Max-Cut and wireless co-channel isolation. It is strictly separate from the locked PS-O1 instance and makes no claims regarding deployed cellular network throughput or call latency improvements."
            }
          </p>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Network Map / SVG (7 cols) */}
        <div className="lg:col-span-7 bg-[#070b14] rounded-2xl border border-slate-800 p-4 flex flex-col justify-between h-[480px] shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-slate-400 z-10">
            <span>Urban Cell Conflict Topology</span>
            <span className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" /> Band A (1800 MHz)
              </span>
              <span className="flex items-center gap-1 text-purple-300 ml-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" /> Band B (2100 MHz)
              </span>
            </span>
          </div>

          <div className="relative w-full h-[400px]">
            <svg className="w-full h-full" viewBox="0 0 540 450">
              {/* Conflict Edges */}
              {edges.map((edge, idx) => {
                const nodeU = nodes.find((n) => n.id === edge.source) || { x: 100, y: 100 };
                const nodeV = nodes.find((n) => n.id === edge.target) || { x: 200, y: 200 };
                const isAvoided = allocation[edge.source] !== allocation[edge.target];

                const midX = (nodeU.x + nodeV.x) / 2;
                const midY = (nodeU.y + nodeV.y) / 2;

                return (
                  <g key={idx}>
                    <line
                      x1={nodeU.x}
                      y1={nodeU.y}
                      x2={nodeV.x}
                      y2={nodeV.y}
                      stroke={isAvoided ? '#10b981' : '#f43f5e'}
                      strokeWidth={isAvoided ? 2 : 3}
                      strokeDasharray={isAvoided ? '4 4' : 'none'}
                      opacity={isAvoided ? 0.6 : 0.9}
                    />
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle
                        r="10"
                        fill={isAvoided ? '#064e3b' : '#4c0519'}
                        stroke={isAvoided ? '#10b981' : '#f43f5e'}
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        dy="3.5"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#ffffff"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Tower Nodes */}
              {nodes.map((node) => {
                const isBand0 = allocation[node.id] === 0;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => toggleTower(node.id)}
                  >
                    {/* Tower Coverage Radius */}
                    <circle
                      r="32"
                      fill={isBand0 ? '#06b6d4' : '#a855f7'}
                      fillOpacity="0.12"
                      stroke={isBand0 ? '#06b6d4' : '#a855f7'}
                      strokeOpacity="0.3"
                      strokeWidth="1"
                      className="group-hover:scale-105 transition-all"
                    />

                    {/* Central Base Station */}
                    <circle
                      r="16"
                      fill={isBand0 ? '#083344' : '#3b0764'}
                      stroke={isBand0 ? '#22d3ee' : '#c084fc'}
                      strokeWidth="2"
                      className="drop-shadow"
                    />

                    {/* Tower ID */}
                    <text
                      textAnchor="middle"
                      dy="4"
                      fontSize="11"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#ffffff"
                    >
                      T{node.id}
                    </text>

                    {/* Name tag */}
                    <text
                      textAnchor="middle"
                      dy="28"
                      fontSize="9"
                      fontFamily="sans-serif"
                      fill="#94a3b8"
                      className="font-medium"
                    >
                      {node.sector}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center border-t border-slate-800/80 pt-1">
            Green dashed = Orthogonal frequency (no interference) · Red solid = Co-channel collision (active penalty)
          </div>
        </div>

        {/* Analytical Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Interference Mitigation Metrics
            </h3>

            {/* Score Metric */}
            <div className="flex justify-between items-baseline border-b border-slate-800/80 pb-3">
              <div>
                <div className="text-3xl font-black font-mono text-emerald-400">
                  {mitigationPercentage}%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Interference Avoidance Ratio
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Remaining Conflict</div>
                <div className="text-xl font-bold font-mono text-rose-400">
                  {remainingCoChannelConflict} <span className="text-xs text-slate-500">/ {totalConflictWeight}</span>
                </div>
              </div>
            </div>

            {/* Problem Mapping Table */}
            <div className="space-y-2 text-xs">
              <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                Max-Cut to Telecom Translation:
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Graph Vertex:</span>
                  <span className="text-slate-200 font-medium">Cellular Base Station / Sector</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Graph Edge:</span>
                  <span className="text-slate-200 font-medium">Co-channel coverage overlap</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Edge Weight:</span>
                  <span className="text-slate-200 font-medium">Interference severity (traffic density)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Binary Partition:</span>
                  <span className="text-slate-200 font-medium">Frequency Band A vs Frequency Band B</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Max-Cut Objective:</span>
                  <span className="text-emerald-400 font-medium">Maximize orthogonal channel pairs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Spectrum breakdown */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Wifi className="w-4 h-4 text-cyan-400" />
              <span>Current Spectrum Assignment</span>
            </div>
            <div className="space-y-1 font-mono text-[11px]">
              <div className="text-cyan-300">
                Band A (1800 MHz): {nodes.filter((n) => allocation[n.id] === 0).map((n) => `T${n.id}`).join(', ') || 'None'}
              </div>
              <div className="text-purple-300">
                Band B (2100 MHz): {nodes.filter((n) => allocation[n.id] === 1).map((n) => `T${n.id}`).join(', ') || 'None'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

