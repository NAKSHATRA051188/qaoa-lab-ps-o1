import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Sparkles, 
  RotateCcw, 
  Shuffle, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function RealWorldApplication({ applicationData }) {
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

  let avoidedInterferenceWeight = 0;
  let remainingCoChannelConflict = 0;
  let totalConflictWeight = 0;

  edges.forEach((e) => {
    totalConflictWeight += e.weight;
    if (allocation[e.source] !== allocation[e.target]) {
      avoidedInterferenceWeight += e.weight;
    } else {
      remainingCoChannelConflict += e.weight;
    }
  });

  const mitigationPercentage = totalConflictWeight > 0 
    ? ((avoidedInterferenceWeight / totalConflictWeight) * 100).toFixed(1) 
    : 0;

  return (
    <section id="application" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-carbon-800 border border-carbon-700 text-solar-300 text-xs font-mono mb-2">
            <Radio className="w-3.5 h-3.5 text-solar-400" />
            <span>Industrial Field Architecture</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
            Supplementary Cellular Sector Allocation
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Extended demonstration showing frequency channel reuse in an urban wireless network.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSetOptimal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-solar-500 hover:bg-solar-400 text-carbon-950 font-bold text-xs shadow-md transition-all cursor-pointer font-mono"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimal Reuse</span>
          </button>
          <button
            onClick={handleRandom}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-slate-200 text-xs border border-carbon-700 font-mono"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            <span>Random</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-slate-200 text-xs border border-carbon-700 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-carbon-950 rounded-2xl border border-carbon-750 p-4 flex flex-col justify-between h-[480px] shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center text-xs font-mono text-slate-300 z-10">
            <span>Urban Macrocell Network Map</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-solar-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-solar-400 inline-block" /> Band A (1800 MHz)
              </span>
              <span className="flex items-center gap-1.5 text-mint-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-mint-400 inline-block" /> Band B (2100 MHz)
              </span>
            </span>
          </div>

          <div className="relative w-full h-[400px]">
            <svg className="w-full h-full" viewBox="0 0 540 450">
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
                      strokeWidth={isAvoided ? 2.5 : 3.5}
                      strokeDasharray={isAvoided ? '4 4' : 'none'}
                      opacity={isAvoided ? 0.7 : 0.95}
                    />
                    <g transform={`translate(${midX}, ${midY})`}>
                      <circle
                        r="10"
                        fill={isAvoided ? '#042718' : '#4c0519'}
                        stroke={isAvoided ? '#10b981' : '#f43f5e'}
                        strokeWidth="1.5"
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

              {nodes.map((node) => {
                const isBand0 = allocation[node.id] === 0;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => toggleTower(node.id)}
                  >
                    <circle
                      r="32"
                      fill={isBand0 ? '#f59e0b' : '#10b981'}
                      fillOpacity="0.14"
                      stroke={isBand0 ? '#f59e0b' : '#10b981'}
                      strokeOpacity="0.4"
                      strokeWidth="1.5"
                      className="group-hover:scale-105 transition-all"
                    />

                    <circle
                      r="16"
                      fill={isBand0 ? '#291804' : '#042718'}
                      stroke={isBand0 ? '#fbbf24' : '#34d399'}
                      strokeWidth="2.5"
                      className="drop-shadow"
                    />

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

                    <text
                      textAnchor="middle"
                      dy="28"
                      fontSize="10"
                      fontFamily="sans-serif"
                      fill="#cbd5e1"
                      className="font-semibold"
                    >
                      {node.sector}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="text-[11px] text-slate-400 font-mono text-center border-t border-carbon-800 pt-1">
            Green dashed = Orthogonal frequency (no collision) · Crimson solid = Active co-channel interference
          </div>
        </div>

        {/* Diagnostics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-carbon-900 border border-carbon-750 p-5 space-y-4 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Interference Mitigation Metrics
            </h3>

            <div className="flex justify-between items-baseline border-b border-carbon-800 pb-3">
              <div>
                <div className="text-3xl font-black font-mono text-mint-400">
                  {mitigationPercentage}%
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Interference Avoidance Ratio
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Remaining Conflict</div>
                <div className="text-xl font-bold font-mono text-crimson-400">
                  {remainingCoChannelConflict} <span className="text-xs text-slate-500">/ {totalConflictWeight}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-carbon-800">
                <span className="text-slate-400">Avoided Interference (Cut):</span>
                <span className="text-mint-400 font-mono font-bold">{avoidedInterferenceWeight} units</span>
              </div>
              <div className="flex justify-between py-1 border-b border-carbon-800">
                <span className="text-slate-400">Co-Channel Overlap:</span>
                <span className="text-crimson-400 font-mono font-bold">{remainingCoChannelConflict} units</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Total Mutual Interference:</span>
                <span className="text-slate-200 font-mono">{totalConflictWeight} units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
