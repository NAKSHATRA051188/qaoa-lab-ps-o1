import React from 'react';
import { Atom, Database, ExternalLink, GitBranch, Layers, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenDataModal }) {
  return (
    <header className="sticky top-0 z-50 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Atom className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                QAOA Lab <span className="text-cyan-400 font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/50">PS-O1</span>
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Locked Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Quantum-Aware Network Partitioning · <span className="text-purple-300 font-semibold">Team HACKSMITHS</span> · Qiskit Fall Fest 2026
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <a
            href="#overview"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Overview
          </a>
          <a
            href="#interactive-graph"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Max-Cut Graph
          </a>
          <a
            href="#qaoa-explainer"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            QAOA Algorithm
          </a>
          <a
            href="#processors"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Processors A/B/D
          </a>
          <a
            href="#performance"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Performance
          </a>
          <a
            href="#bell"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Bell State
          </a>
          <a
            href="#application"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            Application
          </a>

          <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Data integration drawer trigger */}
          <button
            onClick={onOpenDataModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-800/60 transition-all font-mono"
            title="Inspect official JSON datasets and status"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Files</span>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/Abheek-07/qff-2026-ps-o1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all font-medium"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Repo</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}

