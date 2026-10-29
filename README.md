# QAOA Lab — Quantum-Aware Network Partitioning
**Team HACKSMITHS | Qiskit Fall Fest 2026 Phase 2 — Optimization Track, Problem Statement PS-O1**

An interactive, judge-ready research lab and benchmarking dashboard evaluating **Weighted Max-Cut using QAOA ($p=1$)** across standard reference and custom hardware topologies.

---

## 1. Project Overview & Confirmed Benchmark Properties

This interactive web application accompanies Team HACKSMITHS' official algorithmic submission for **Qiskit Fall Fest 2026 Phase 2 (Optimization Track: PS-O1)**.

### Locked Official Properties (from `instances.json` and Challenge Kit):
- **Graph Topology:** 6 vertices ($v_0 \dots v_5$), 9 weighted edges:
  - $(0, 2): 1$, $(0, 3): 4$, $(0, 4): 4$
  - $(1, 4): 3$, $(1, 5): 3$
  - $(2, 3): 5$, $(2, 4): 1$
  - $(3, 4): 4$, $(3, 5): 2$
- **Total Edge Weight:** 27
- **Exact Classical Maximum Cut:** 22
- **Complementary Optimal Partitions:** `001011` and `110100` (in agreed $x_0 \dots x_5$ vertex-order convention)
- **Random-Assignment Expected Cut:** 13.5 (50% partition baseline)
- **QAOA Depth:** $p = 1$ (required)
- **Multi-Start Seeds:** 5 initialization seeds (0, 1, 2, 3, 4) with starting angles $\gamma, \beta \sim \mathcal{U}[0, \pi]$
- **Measurement Shots:** 4,096 shots per processor evaluation
- **Processor A:** 5 physical qubits $\rightarrow$ **NOT EXECUTABLE** for this 6-qubit problem
- **Processor B:** 9 physical qubits, 12 coupling edges (official reference architecture)
- **Processor D:** Custom hardware architecture designed by Team HACKSMITHS to eliminate routing SWAP overhead

> **Scientific Integrity Statement:** No quantum advantage is claimed. A 6-vertex graph has $2^6 = 64$ states, easily evaluated classically in under a millisecond. The project's objective is to benchmark variational convergence, compilation depth, and hardware routing overhead on constrained NISQ topologies.

---

## 2. Interactive Features

- **Section A — Project Overview:** Mathematical definition of weighted Max-Cut, QUBO formulation, QAOA mechanics, processor roles, ideal vs. noisy simulation, and benchmark scope.
- **Section B — Interactive Weighted Max-Cut Graph:** 
  - Draggable 6-vertex SVG canvas with dynamic real-time cut evaluation in JavaScript.
  - Live highlighting of cut edges (glowing dashed line with weight badges) vs uncut edges.
  - Buttons: **Show Optimal Partition** (toggles `001011` and `110100`), **Random Partition**, and **Reset**.
  - Educational callout explaining complementary partition symmetry.
- **Section C — How QAOA Works:** 
  - 4-stage pipeline: State Initialization ($H^{\otimes 6}$), Cost Hamiltonian ($e^{-i \gamma H_C}$), Transverse Mixer ($e^{-i \beta H_M}$), and Classical Optimization Loop.
  - Interactive $\gamma$ and $\beta$ parameter sliders.
  - Conceptual quantum circuit schematic diagram.
- **Section D — Processor Explorer (A, B, and D):**
  - **Processor A:** Shows 5-qubit topology and official disqualification badge (`Capacity: 5 < 6`).
  - **Processor B:** Interactive 9-qubit, 12-edge reference coupling graph and noise specifications.
  - **Processor D:** Decoupled JSON loader (`public/data/processor_D.json`) with client-side rule validation matching `validate_processor_d()` from `qff_phase2.py`. Displays *"Design in progress. Benchmark results pending."* until frozen outputs are supplied. Includes live JSON importer for judges.
- **Section E — Performance Dashboard:**
  - Toggle between **Ideal Simulation** and **Noisy Simulation** (depolarizing + readout bit-flip).
  - Recharts bar charts for Solution Quality and Circuit Resources (depth, 2Q depth, CX count, logical CX, CX overhead, SWAP count).
  - Standardized metric comparison table with honest empty states for unbenchmarked data.
- **Section F — Bell-State Verification ($|\Phi^+\rangle$):**
  - Evaluates adjacent (distance = 1) vs. farthest physical qubit pairs.
  - XX, YY, ZZ correlation displays and official entanglement fidelity: $F = (1 + \langle XX \rangle - \langle YY \rangle + \langle ZZ \rangle)/4$.
- **Section G — Real-World Application:**
  - *Wireless Interference-Aware Channel Allocation*: Maps cell towers and co-channel overlap to graph Max-Cut.
  - Interactive 6-tower frequency reuse optimizer (Band A 1800 MHz vs. Band B 2100 MHz).
- **Section H — Methodology & Limitations:**
  - Classical brute-force verification, multi-start seeding, SABRE routing passes, synthetic noise limitations, and GitHub repository link.
- **Data Integration Inspector Modal:**
  - Direct live inspection and clipboard export of all 6 data contracts.

---

## 3. Technology Stack

- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS (Dark research-lab aesthetic)
- **Data Visualization:** Recharts
- **Iconography:** Lucide React
- **Graph & Circuit Visuals:** Responsive HTML5 SVG
- **Static Hosting:** Zero backend required; 100% Vercel / Netlify / GitHub Pages compatible.

---

## 4. Quickstart & Local Execution

### Prerequisites:
- Node.js $\ge 18.0.0$ (Tested on Node v24.20.0)
- npm $\ge 9.0.0$

### Installation:
```bash
npm install
```

### Run Local Development Server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Compile Production Build:
```bash
npm run build
```
Production assets will compile into the `dist/` directory.

### Preview Production Build:
```bash
npm run preview
```

---

## 5. Deployment Guide (Vercel)

The project is designed for static deployment without any server-side dependencies:

1. **Option A: Vercel CLI**
   ```bash
   npm i -g vercel
   vercel
   ```
2. **Option B: Vercel Web Dashboard**
   - Connect GitHub repository `https://github.com/Abheek-07/qff-2026-ps-o1`.
   - Set Build Command: `npm run build`
   - Set Output Directory: `dist`
   - Deploy.

---

## 6. Data Architecture & Integration

All experimental outputs are ingested from `public/data/`. Please consult **[`DATA_INTEGRATION.md`](file:///c:/Users/ssdkr/Desktop/W/DATA_INTEGRATION.md)** for full JSON schemas, validation rules, and instructions for exporting Qiskit Aer simulation metrics.

---

## 7. Team & Attribution

**Team HACKSMITHS**
- **Track:** Optimization Track (PS-O1)
- **Event:** Qiskit Fall Fest 2026 Phase 2
- **Repository:** [https://github.com/Abheek-07/qff-2026-ps-o1](https://github.com/Abheek-07/qff-2026-ps-o1)

