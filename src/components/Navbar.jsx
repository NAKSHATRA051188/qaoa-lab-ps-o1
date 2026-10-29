import React from 'react';
import { Radio, Database, ExternalLink, GitBranch, ShieldCheck, Wifi, Signal } from 'lucide-react';

export default function Navbar({ onOpenDataModal }) {
  return (
    <header className="sticky top-0 z-50 bg-[#090d15]/95 backdrop-blur-md border-b border-carbon-750/90 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-solar-500/20 via-mint-500/15 to-electric-500/20 border border-solar-500/40 flex items-center justify-center text-solar-400 shadow-lg shadow-solar-500/10">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
                Spectrum QAOA <span className="text-solar-400 font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-solar-950/80 border border-solar-500/40">PS-O1</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-carbon-800 text-slate-200 border border-carbon-700 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3 h-3 text-mint-400" /> Locked Benchmark
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Transmitter Co-Channel Optimization · <span className="text-solar-300 font-bold">Team HACKSMITHS</span> · Qiskit Fall Fest 2026
            </p>
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <a
            href="#overview"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            Mission & Model
          </a>
          <a
            href="#interactive-graph"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium flex items-center gap-1"
          >
            <Signal className="w-3.5 h-3.5 text-solar-400" />
            <span>Transmitter Graph</span>
          </a>
          <a
            href="#qaoa-explainer"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            QAOA Algorithm
          </a>
          <a
            href="#processors"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            Processors A/B/D
          </a>
          <a
            href="#performance"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            Performance
          </a>
          <a
            href="#bell"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            Bell Fidelity
          </a>
          <a
            href="#methodology"
            className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-solar-300 hover:bg-carbon-800 transition-colors font-medium"
          >
            Limitations
          </a>

          <div className="h-4 w-px bg-carbon-700 mx-1 hidden sm:block" />

          {/* Data integration drawer trigger */}
          <button
            onClick={onOpenDataModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-850 hover:bg-carbon-800 text-solar-300 border border-solar-500/30 transition-all font-mono font-semibold"
            title="Inspect official JSON datasets and status"
          >
            <Database className="w-3.5 h-3.5 text-solar-400" />
            <span>Data Files</span>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/NAKSHATRA051188/qaoa-lab-ps-o1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-slate-100 border border-carbon-700 transition-all font-semibold"
          >
            <GitBranch className="w-3.5 h-3.5 text-mint-400" />
            <span>Repo</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
}
