# DATA_INTEGRATION.md — QAOA Lab Data Integration Guide
**Team HACKSMITHS | Qiskit Fall Fest 2026 Phase 2 — Optimization Track (PS-O1)**

---

## 1. Architectural Philosophy

The QAOA Lab website is architected with a **strict decoupled data-driven contract**. No quantum simulation or transpilation is computed inside the browser. Instead, the frontend consumes standardized JSON artifacts located in:

```
public/data/
├── instances.json              # Locked problem graph and benchmark configuration
├── processor_B.json            # Official 9-qubit reference topology
├── processor_D.json            # Custom hardware architecture definition
├── benchmark_results.json      # Executed QAOA metrics across Processors A, B, and D
├── bell_results.json           # Objective 1 Bell-state verification correlations
└── application_network.json    # Supplementary cellular tower conflict dataset
```

When new experimental runs are completed in Qiskit Aer by the technical team, **simply replace or update these JSON files**; the user interface, diagrams, topology viewers, and metric comparisons will dynamically update without modifying any React code.

---

## 2. File Specifications & Schemas

### A. `instances.json` (Locked Official Instance)
- **Status:** `LOCKED_OFFICIAL`
- **Location:** `public/data/instances.json`
- **Purpose:** Source of truth for graph topology and global benchmark settings.

```json
{
  "_note": "QFF 2026 Phase 2 Optimization Track - Locked PS-O1 instance",
  "problem_statement": "PS-O1",
  "title": "Weighted Max-Cut using QAOA",
  "num_vertices": 6,
  "weighted_edges": [
    {"source": 0, "target": 2, "weight": 1},
    {"source": 0, "target": 3, "weight": 4},
    {"source": 0, "target": 4, "weight": 4},
    {"source": 1, "target": 4, "weight": 3},
    {"source": 1, "target": 5, "weight": 3},
    {"source": 2, "target": 3, "weight": 5},
    {"source": 2, "target": 4, "weight": 1},
    {"source": 3, "target": 4, "weight": 4},
    {"source": 3, "target": 5, "weight": 2}
  ],
  "total_weight": 27,
  "classical_optimum": 22,
  "random_expected_cut": 13.5,
  "optimal_assignments": ["001011", "110100"],
  "qaoa_depth": "p=1 required; p=2 optional",
  "min_initializations": 5,
  "initialization_seeds": [0, 1, 2, 3, 4],
  "shots": 4096,
  "benchmark_settings": {
    "basis_gates": ["rz", "sx", "x", "cx"],
    "optimization_level": 1,
    "layout_routing": "SABRE",
    "seed_transpiler": 42,
    "seed_simulator": 42,
    "noise": {
      "p1_depolarizing": 0.001,
      "p2_depolarizing_cx": 0.005,
      "readout_bitflip": 0.01
    }
  }
}
```

---

### B. `processor_B.json` (Official Reference Architecture)
- **Status:** `OFFICIAL_REFERENCE`
- **Location:** `public/data/processor_B.json`
- **Purpose:** Fixed reference hardware coupling graph.

```json
{
  "name": "Processor B",
  "status": "OFFICIAL_REFERENCE",
  "num_qubits": 9,
  "edges": [
    [0, 1], [1, 2], [1, 6], [2, 3], [2, 6], [2, 5],
    [3, 4], [4, 5], [5, 6], [6, 7], [6, 8], [8, 0]
  ],
  "basis_gates": ["rz", "sx", "x", "cx"],
  "noise": {
    "model": "official",
    "p1": 0.001,
    "p2": 0.005,
    "p_readout": 0.01
  }
}
```

---

### C. `processor_D.json` (Custom Architecture Definition)
- **Status:** `DESIGN_IN_PROGRESS` or `VALIDATED`
- **Location:** `public/data/processor_D.json`
- **Validation Rules (from `qff_phase2.py`):**
  1. `num_qubits`: Integer between 6 and 12 (`6 <= n <= 12`).
  2. `edges`: Undirected pair list. Max degree of any physical qubit must be `<= 4`.
  3. Connectivity: Coupling graph must form a single connected component.
  4. `basis_gates`: Must equal `["rz", "sx", "x", "cx"]`.
  5. `noise`: Rates cannot be more optimistic than official baseline (`p1 >= 0.001`, `p2 >= 0.005`, `p_readout >= 0.01`).

```json
{
  "name": "Processor D",
  "team": "HACKSMITHS",
  "problem_statement": "PS-O1",
  "status": "VALIDATED",
  "num_qubits": 6,
  "edges": [
    [0, 2], [0, 3], [0, 4],
    [1, 4], [1, 5],
    [2, 3], [2, 4],
    [3, 4], [3, 5]
  ],
  "basis_gates": ["rz", "sx", "x", "cx"],
  "noise": {
    "model": "official",
    "p1": 0.001,
    "p2": 0.005,
    "p_readout": 0.01
  },
  "design_rationale": "Direct hardware coupling matching the 9 interaction pairs of PS-O1, eliminating routing SWAPs and CX depth inflation."
}
```

---

### D. `benchmark_results.json` (Simulation & Hardware Metrics)
- **Status:** `PARTIALLY_VERIFIED` (Processor B verified; Processor D pending)
- **Location:** `public/data/benchmark_results.json`
- **Required Metric Fields:**
  - `mean_cut`: Mean cut across 4,096 shots.
  - `approx_ratio`: `mean_cut / 22.0`.
  - `best_cut`: Best cut observed in shots.
  - `best_cut_approx_ratio`: `best_cut / 22.0`.
  - `optimal_probability`: Fraction of shots yielding `001011` or `110100`.
  - `depth`: Transpiled circuit depth (excluding measurements/barriers).
  - `two_q_depth`: Depth counting CX gates only.
  - `cx`: Final transpiled CX count.
  - `logical_cx`: CX count transpiled without connectivity constraints (18 for PS-O1).
  - `cx_overhead`: `cx - logical_cx`.
  - `swaps`: Routing SWAPs inserted by SABRE before decomposition.
  - `execution_time_ms`: Wall-clock execution time on AerSimulator.

```json
{
  "_schema_version": "1.0.0",
  "problem_statement": "PS-O1",
  "problem_optimum": 22,
  "random_baseline_cut": 13.5,
  "shots": 4096,
  "processors": {
    "A": {
      "name": "Processor A",
      "executable": false,
      "status": "NOT_EXECUTABLE",
      "physical_qubits": 5,
      "logical_qubits_required": 6,
      "reason": "Capacity limit: PS-O1 requires 6 logical qubits, but Processor A provides only 5 physical qubits."
    },
    "B": {
      "name": "Processor B",
      "executable": true,
      "status": "VERIFIED_MEASUREMENT",
      "verified": true,
      "physical_qubits": 9,
      "logical_qubits": 6,
      "coupling_edges_count": 12,
      "ideal": {
        "mean_cut": 11.9789,
        "approx_ratio": 0.544495,
        "best_cut": 16,
        "best_cut_approx_ratio": 0.72727,
        "optimal_probability": 0.14667,
        "depth": 38,
        "two_q_depth": 21,
        "cx": 21,
        "logical_cx": 18,
        "cx_overhead": 3,
        "swaps": 1,
        "execution_time_ms": 142
      },
      "noisy": {
        "mean_cut": 11.7061,
        "approx_ratio": 0.532095,
        "best_cut": 16,
        "best_cut_approx_ratio": 0.72727,
        "optimal_probability": 0.13574,
        "depth": 38,
        "two_q_depth": 21,
        "cx": 21,
        "logical_cx": 18,
        "cx_overhead": 3,
        "swaps": 1,
        "execution_time_ms": 189
      }
    },
    "D": {
      "name": "Processor D",
      "executable": true,
      "status": "PENDING_MEASUREMENT",
      "verified": false,
      "physical_qubits": null,
      "logical_qubits": 6,
      "notice": "Not yet benchmarked",
      "ideal": null,
      "noisy": null
    }
  }
}
```

---

### E. `bell_results.json` (Bell-State Entanglement)
- **Status:** `PARTIALLY_VERIFIED`
- **Location:** `public/data/bell_results.json`
- **Official Entanglement Fidelity Formula:**
  $$F = \frac{1 + \langle XX \rangle - \langle YY \rangle + \langle ZZ \rangle}{4}$$
  $$\sigma_F = \frac{\sqrt{\sigma_{XX}^2 + \sigma_{YY}^2 + \sigma_{ZZ}^2}}{4}$$

---

### F. `application_network.json` (Real-World Conflict Graph)
- **Status:** `ILLUSTRATIVE_SYNTHETIC`
- **Location:** `public/data/application_network.json`
- **Nodes:** Base station towers / sectors.
- **Edges:** Co-channel interference conflicts with severity weights.

---

## 3. Checklist of Pending Results from Technical Team

| Objective | Required File | Key Fields Needed | Current Status |
|---|---|---|---|
| **Objective 1: Bell Verification** | `bell_results.json` | `processors.D.adjacent_pair`, `processors.D.farthest_pair` with XX, YY, ZZ correlations and fidelity | **Pending Qiskit Run** |
| **Objective 2: Processor D Design** | `processor_D.json` | Final frozen `edges`, `num_qubits`, `design_rationale` | **Validated Proposal Ready** |
| **Objective 3: Benchmarking** | `benchmark_results.json` | `processors.D.ideal` and `processors.D.noisy` (mean cut, r, depth, CX, SWAP, P_opt) | **Pending Qiskit Run** |
| **Objective 3: Phase 2 Locked Weights** | `benchmark_results.json` | Re-run Processor B on integer weights 1–5 (total weight 27, opt 22) across 5 seeds | **In Progress** |
| **Objective 4: Supplementary Application** | `application_network.json` | Optional updated cellular conflict topologies | **Illustrative Fallback Active** |

