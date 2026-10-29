# MISSING_RESULTS_CHECKLIST.md — Action Items for Quantum Lead
**Team HACKSMITHS | Qiskit Fall Fest 2026 Phase 2 (PS-O1)**

This checklist summarizes the exact experimental outputs required from the quantum algorithm lead to transition the website from **"Benchmark in progress"** to **"Fully Populated Judge-Ready"**.

---

## 📋 Priority Checklist

### 1. Finalize Processor D Architecture
- [ ] Choose the final physical qubit count ($6 \le n \le 12$) and undirected coupling edge list.
- [ ] Confirm no vertex degree exceeds 4.
- [ ] Verify coupling graph is a single connected component.
- [ ] Save the frozen configuration into `public/data/processor_D.json`.
- [ ] Verify with starter pack: `validate_processor_d(load_processor("public/data/processor_D.json"), required_qubits=6)`.

---

### 2. Run Objective 1: Bell-State Verification on Processor D
- [ ] Pick one adjacent physical pair (distance = 1) and one farthest physical pair (maximum shortest-path distance).
- [ ] Run `bell_experiment(processor_D, physical_pair, noisy=False)` for ideal baseline.
- [ ] Run `bell_experiment(processor_D, physical_pair, noisy=True)` for noisy condition.
- [ ] Record $\langle XX \rangle, \langle YY \rangle, \langle ZZ \rangle$, fidelity $F$, and fidelity standard error $\sigma_F$.
- [ ] Export the JSON object into `public/data/bell_results.json` under `processors.D`.

---

### 3. Re-run Phase 2 Locked Max-Cut on Processor B
- [ ] Use locked integer weights:
  `[[0,2,1], [0,3,4], [0,4,4], [1,4,3], [1,5,3], [2,3,5], [2,4,1], [3,4,4], [3,5,2]]` (total weight: 27, classical optimum: 22).
- [ ] Transpile with official settings: basis `rz, sx, x, cx`, `optimization_level=1`, `seed_transpiler=42`.
- [ ] Execute 5-seed restarts (seeds 0, 1, 2, 3, 4) with starting angles drawn uniformly from $[0, \pi]$.
- [ ] Sample 4,096 shots on AerSimulator under noiseless (`noisy=False`) and noisy (`noisy=True`) conditions.
- [ ] Calculate:
  - Mean cut $\langle C \rangle = \frac{1}{4096} \sum C(x)$
  - Approximation ratio $r = \frac{\langle C \rangle}{22.0}$
  - Optimal solution probability $P_{opt} = \frac{N(001011) + N(110100)}{4096}$
  - Best observed cut and best-cut ratio $\frac{\text{best}}{22.0}$
- [ ] Record circuit resources from `circuit_metrics()`: `depth`, `two_q_depth`, `cx`, `logical_cx`, `cx_overhead`, `swaps`.
- [ ] Update `public/data/benchmark_results.json` under `processors.B`.

---

### 4. Execute Phase 2 Locked Max-Cut on Custom Processor D
- [ ] Transpile the same bound QAOA circuit for Processor D with identical transpiler settings.
- [ ] Run 4,096 shots under ideal and noisy conditions.
- [ ] Compute the identical metrics ($\langle C \rangle$, $r$, $P_{opt}$, best cut, `cx`, `depth`, `cx_overhead`, `swaps`).
- [ ] Update `public/data/benchmark_results.json` under `processors.D`:
  - Set `status: "VERIFIED_MEASUREMENT"`
  - Set `verified: true`
  - Populate `ideal` and `noisy` metric dictionaries.

---

### 5. Final Verification
- [ ] Run `npm run build` to verify clean compilation.
- [ ] Check that Processor D charts and tables update automatically upon page refresh.

