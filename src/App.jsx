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
import { Database, GitBranch, ShieldCheck } from 'lucide-react';

export default function App() {
  const [instances, setInstances] = useState(null);
  const [processorB, setProcessorB] = useState(null);
  const [processorD, setProcessorD] = useState(null);
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [bellResults, setBellResults] = useState(null);
  const [applicationNetwork, setApplicationNetwork] = useState(null);

  const [loading, setLoading] = useState(true);
  const [dataModalOpen, setDataModalOpen] = useState(false);

  // Fetch all JSON datasets on mount from public/data/
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

        if (instancesRes.status === 'fulfilled') setInstances(instancesRes.value);
        if (procBRes.status === 'fulfilled') setProcessorB(procBRes.value);
        if (procDRes.status === 'fulfilled') setProcessorD(procDRes.value);
        if (benchmarksRes.status === 'fulfilled') setBenchmarkResults(benchmarksRes.value);
        if (bellRes.status === 'fulfilled') setBellResults(bellRes.value);
        if (appRes.status === 'fulfilled') setApplicationNetwork(appRes.value);
      } catch (err) {
        console.warn('Dataset fetch warning:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllDatasets();
  }, []);

  // Update Processor D (e.g. when user pastes a custom validated JSON)
  const handleUpdateProcessorD = (newD) => {
    setProcessorD(newD);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans">
      {/* Navigation */}
      <Navbar onOpenDataModal={() => setDataModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-16">
        {/* Section A: Project Overview */}
        <ProjectOverview benchmarkData={benchmarkResults} />

        {/* Section B: Interactive Weighted Max-Cut Graph */}
        <InteractiveMaxCut instanceData={instances} />

        {/* Section C: How QAOA Works */}
        <QAOAExplainer />

        {/* Section D: Processor Explorer (A, B, D) */}
        <ProcessorExplorer
          processorBData={processorB}
          processorDData={processorD}
          onUpdateProcessorD={handleUpdateProcessorD}
        />

        {/* Section E: Performance Comparison Dashboard */}
        <PerformanceDashboard benchmarkData={benchmarkResults} />

        {/* Section F: Bell-State Verification */}
        <BellVerification bellData={bellResults} />

        {/* Section G: Real-World Application */}
        <RealWorldApplication applicationData={applicationNetwork} />

        {/* Section H: Methodology & Limitations */}
        <MethodologyAndLimitations />
      </main>

      {/* Lab Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b14] py-8 px-4 lg:px-8 text-xs text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-200 flex items-center justify-center md:justify-start gap-2">
              <span>QAOA Lab — Quantum-Aware Network Partitioning</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Team HACKSMITHS
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Qiskit Fall Fest 2026 Phase 2 · Problem Statement PS-O1 (Weighted Max-Cut with QAOA)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setDataModalOpen(true)}
              className="hover:text-cyan-400 flex items-center gap-1 font-mono transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Data Files Inspector</span>
            </button>
            <a
              href="https://github.com/Abheek-07/qff-2026-ps-o1"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 flex items-center gap-1 font-medium transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Data Files Inspector Modal */}
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

