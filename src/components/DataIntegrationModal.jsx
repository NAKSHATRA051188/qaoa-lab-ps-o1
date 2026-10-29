import React, { useState } from 'react';
import { 
  X, 
  Database, 
  FileCode, 
  Check, 
  Copy,
  Radio
} from 'lucide-react';

export default function DataIntegrationModal({ 
  isOpen, 
  onClose, 
  allDatasets 
}) {
  const [selectedFile, setSelectedFile] = useState('benchmark_results.json');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fileMap = {
    'benchmark_results.json': {
      title: 'benchmark_results.json',
      status: 'PARTIALLY_VERIFIED',
      desc: 'Stores executed Qiskit Aer simulation metrics (mean cut, approximation ratio, CX counts, depth, routing SWAPs) across 4,096 shots.',
      data: allDatasets.benchmarkResults,
    },
    'processor_B.json': {
      title: 'processor_B.json',
      status: 'VERIFIED',
      desc: 'Official 9-qubit reference topology, basis gates, and noise parameters from Qiskit Fall Fest Phase 2 kit.',
      data: allDatasets.processorB,
    },
    'processor_D.json': {
      title: 'processor_D.json',
      status: allDatasets.processorD?.is_design_in_progress ? 'IN_PROGRESS' : 'VERIFIED',
      desc: 'Custom hardware architecture definition for Team HACKSMITHS with strict 5-rule validation.',
      data: allDatasets.processorD,
    },
    'instances.json': {
      title: 'instances.json',
      status: 'LOCKED',
      desc: 'Locked official 6-vertex, 9-weighted-edge problem instance for PS-O1 with classical optimum 22.0.',
      data: allDatasets.instances,
    },
    'bell_results.json': {
      title: 'bell_results.json',
      status: 'PARTIALLY_VERIFIED',
      desc: 'Objective 1 Bell-state (|Φ⁺⟩) correlation data (XX, YY, ZZ) and calculated fidelity for adjacent and farthest physical pairs.',
      data: allDatasets.bellResults,
    },
    'application_network.json': {
      title: 'application_network.json',
      status: 'ILLUSTRATIVE',
      desc: 'Hypothetical 6-sector cellular conflict graph for co-channel interference mitigation demonstration.',
      data: allDatasets.applicationNetwork,
    },
  };

  const current = fileMap[selectedFile];
  const jsonString = JSON.stringify(current?.data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-750 bg-carbon-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-solar-500/20 border border-solar-500/40 flex items-center justify-center text-solar-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>Data Architecture & File Inspector</span>
                <span className="text-[10px] text-solar-400 bg-solar-950 border border-solar-500/40 px-2 py-0.5 rounded-full font-mono">
                  public/data/
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect official input datasets, live schemas, and file integration contracts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-carbon-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* File Selector */}
          <div className="md:col-span-4 border-r border-carbon-750 p-3 space-y-1.5 overflow-y-auto bg-carbon-950">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold px-2 py-1">
              Active Input Files
            </div>
            {Object.entries(fileMap).map(([key, item]) => {
              const isSelected = selectedFile === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFile(key)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex flex-col gap-1 ${
                    isSelected
                      ? 'bg-carbon-850 border border-solar-500/80 text-solar-300 font-bold shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-carbon-900 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="truncate">{key}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      item.status === 'LOCKED'
                        ? 'bg-solar-950 text-solar-300 border border-solar-700'
                        : item.status === 'VERIFIED'
                        ? 'bg-mint-950 text-mint-300 border border-mint-700'
                        : item.status === 'IN_PROGRESS'
                        ? 'bg-crimson-950 text-crimson-300 border border-crimson-800'
                        : 'bg-carbon-800 text-slate-300 border border-carbon-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 line-clamp-1 font-sans">{item.desc}</span>
                </button>
              );
            })}
          </div>

          {/* JSON Preview */}
          <div className="md:col-span-8 p-4 flex flex-col justify-between overflow-hidden bg-carbon-950">
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-solar-300 flex items-center gap-1.5">
                  <FileCode className="w-4 h-4" />
                  <span>{current.title}</span>
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-carbon-800 hover:bg-carbon-750 text-slate-200 text-xs font-mono transition-colors border border-carbon-700 font-bold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-mint-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{current.desc}</p>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-carbon-900 border border-carbon-800 p-3 font-mono text-[11px] text-slate-200 select-all">
              <pre>{jsonString}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-carbon-750 bg-carbon-950 flex justify-between items-center text-xs text-slate-400 font-mono">
          <span>Decoupled Contract: files live in <code className="text-solar-400 font-bold">public/data/</code></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-carbon-800 hover:bg-carbon-750 text-slate-200 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
