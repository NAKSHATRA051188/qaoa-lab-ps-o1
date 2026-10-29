import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProjectOverview from './components/ProjectOverview';
import InteractiveMaxCut from './components/InteractiveMaxCut';
import QAOAExplainer from './components/QAOAExplainer';
import ProcessorExplorer from './components/ProcessorExplorer';
import PerformanceDashboard from './components/PerformanceDashboard';
import BellVerification from './components/BellVerification';
import RealWorldApplication from './components/RealWorldApplication';
import MethodologyAndLimitations from './components/MethodologyAndLimitations';
import DataIntegrationModal from './components/DataIntegrationModal';
import { Database, GitBranch, Radio } from 'lucide-react';

const DEFAULT_INSTANCES = {
  num_vertices: 6,
  classical_optimum: 22,
  random_expected_cut: 13.5,
  total_weight: 27,
  weighted_edges: [
    { source: 0, target: 2, weight: 1 },
    { source: 0, target: 3, weight: 4 },
    { source: 0, target: 4, weight: 4 },
    { source: 1, target: 4, weight: 3 },
    { source: 1, target: 5, weight: 3 },
    { source: 2, target: 3, weight: 5 },
    { source: 2, target: 4, weight: 1 },
    { source: 3, target: 4, weight: 4 },
    { source: 3, target: 5, weight: 2 },
  ]
};

const DEFAULT_BENCHMARKS = {
  problem_optimum: 22,
  random_baseline_cut: 13.5,
  total_weight: 27,
  shots: 4096,
  processors: {
    A: {
      name: "Processor A",
      executable: false,
      status: "NOT_EXECUTABLE",
      physical_qubits: 5,
      logical_qubits_required: 6,
      reason: "Capacity limit: PS-O1 requires 6 logical variables (Transmitters Tx0–Tx5), but Processor A provides only 5 physical qubits."
    },
    B: {
      name: "Processor B",
      executable: true,
      status: "VERIFIED_MEASUREMENT",
      verified: true,
      physical_qubits: 9,
      logical_qubits: 6,
      ideal: {
        mean_cut: 11.9789,
        approx_ratio: 0.5445,
        best_cut: 16,
        optimal_probability: 0.1467,
        depth: 38,
        two_q_depth: 21,
        cx: 21,
        logical_cx: 18,
        cx_overhead: 3,
        swaps: 1,
        execution_time_ms: 142
      },
      noisy: {
        mean_cut: 11.7061,
        approx_ratio: 0.5321,
        best_cut: 16,
        optimal_probability: 0.1357,
        depth: 38,
        two_q_depth: 21,
        cx: 21,
        logical_cx: 18,
        cx_overhead: 3,
        swaps: 1,
        execution_time_ms: 189
      }
    },
    D: {
      name: "Processor D",
      executable: true,
      status: "PENDING_MEASUREMENT",
      verified: false,
      notice: "Not yet benchmarked",
      ideal: null,
      noisy: null
    }
  }
};

const DEFAULT_BELL = {
  processors: {
    B: {
      name: "Processor B",
      status: "VERIFIED_MEASUREMENT",
      adjacent_pair: {
        pair: [0, 1],
        distance: 1,
        ideal: { XX: 1.0, YY: -1.0, ZZ: 1.0, fidelity: 1.0, fidelity_se: 0.0, cx: 1 },
        noisy: { XX: 0.957, YY: -0.959, ZZ: 0.961, fidelity: 0.9692, fidelity_se: 0.0038, cx: 1 }
      },
      farthest_pair: {
        pair: [0, 4],
        distance: 3,
        ideal: { XX: 1.0, YY: -1.0, ZZ: 1.0, fidelity: 1.0, fidelity_se: 0.0, cx: 7 },
        noisy: { XX: 0.864, YY: -0.861, ZZ: 0.872, fidelity: 0.8992, fidelity_se: 0.0067, cx: 7 }
      }
    },
    D: {
      name: "Processor D",
      status: "PENDING_MEASUREMENT",
      notice: "Awaiting execution of bell_experiment() on Processor D physical topology from technical lead.",
      adjacent_pair: null,
      farthest_pair: null
    }
  }
};

export default function App() {
  const [instances, setInstances] = useState(DEFAULT_INSTANCES);
  const [processorB, setProcessorB] = useState(null);
  const [processorD, setProcessorD] = useState(null);
  const [benchmarkResults, setBenchmarkResults] = useState(DEFAULT_BENCHMARKS);
  const [bellResults, setBellResults] = useState(DEFAULT_BELL);
  const [applicationNetwork, setApplicationNetwork] = useState(null);

  const [dataModalOpen, setDataModalOpen] = useState(false);

  useEffect(() => {
    async function loadAllDatasets() {
      try {
        const [
          instancesRes,
          procBRes,
          procDRes,
          benchmarksRes,
          bellRes,
          appRes,
        ] = await Promise.allSettled([
          fetch('/data/instances.json').then((r) => r.json()),
          fetch('/data/processor_B.json').then((r) => r.json()),
          fetch('/data/processor_D.json').then((r) => r.json()),
          fetch('/data/benchmark_results.json').then((r) => r.json()),
          fetch('/data/bell_results.json').then((r) => r.json()),
          fetch('/data/application_network.json').then((r) => r.json()),
        ]);

        if (instancesRes.status === 'fulfilled' && instancesRes.value) setInstances(instancesRes.value);
        if (procBRes.status === 'fulfilled' && procBRes.value) setProcessorB(procBRes.value);
        if (procDRes.status === 'fulfilled' && procDRes.value) setProcessorD(procDRes.value);
        if (benchmarksRes.status === 'fulfilled' && benchmarksRes.value) setBenchmarkResults(benchmarksRes.value);
        if (bellRes.status === 'fulfilled' && bellRes.value) setBellResults(bellRes.value);
        if (appRes.status === 'fulfilled' && appRes.value) setApplicationNetwork(appRes.value);
      } catch (err) {
        console.warn('Dataset fetch note:', err);
      }
    }

    loadAllDatasets();
  }, []);

  const handleUpdateProcessorD = (newD) => {
    setProcessorD(newD);
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col font-sans">
      <Navbar onOpenDataModal={() => setDataModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-16">
        <ProjectOverview benchmarkData={benchmarkResults} />
        <InteractiveMaxCut instanceData={instances} />
        <QAOAExplainer />
        <ProcessorExplorer
          processorBData={processorB}
          processorDData={processorD}
          onUpdateProcessorD={handleUpdateProcessorD}
        />
        <PerformanceDashboard benchmarkData={benchmarkResults} />
        <BellVerification bellData={bellResults} />
        <RealWorldApplication applicationData={applicationNetwork} />
        <MethodologyAndLimitations />
      </main>

      <footer className="border-t border-carbon-750 bg-[#090d15] py-8 px-4 lg:px-8 text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-100 flex items-center justify-center md:justify-start gap-2">
              <Radio className="w-4 h-4 text-solar-400" />
              <span>Spectrum QAOA — Transmitter Co-Channel Optimization</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-solar-950 text-solar-300 border border-solar-700 font-bold">
                Team HACKSMITHS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Qiskit Fall Fest 2026 Phase 2 · Problem Statement PS-O1 (Weighted Max-Cut with QAOA)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDataModalOpen(true)}
              className="hover:text-solar-400 flex items-center gap-1 font-mono font-semibold transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-solar-400" />
              <span>Data Files Inspector</span>
            </button>
            <a
              href="https://github.com/NAKSHATRA051188/qaoa-lab-ps-o1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mint-400 flex items-center gap-1 font-semibold transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-mint-400" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>

      <DataIntegrationModal
        isOpen={dataModalOpen}
        onClose={() => setDataModalOpen(false)}
        allDatasets={{
          instances,
          processorB,
          processorD,
          benchmarkResults,
          bellResults,
          applicationNetwork,
        }}
      />
    </div>
  );
}
