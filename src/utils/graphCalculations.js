/**
 * Graph calculation utilities for PS-O1 Weighted Max-Cut
 */

/**
 * Compute the cut weight for a given partition assignment
 * @param {Array<{source: number, target: number, weight: number}>} edges
 * @param {Record<number, number>} assignment - map of vertex ID to 0 or 1
 * @returns {{cutWeight: number, cutEdges: Array<any>, uncutEdges: Array<any>}}
 */
export function calculateCut(edges, assignment) {
  let cutWeight = 0;
  const cutEdges = [];
  const uncutEdges = [];

  edges.forEach((edge) => {
    const u = typeof edge.source === 'object' ? edge.source.id : edge.source;
    const v = typeof edge.target === 'object' ? edge.target.id : edge.target;
    const w = edge.weight !== undefined ? edge.weight : 1;

    const valU = assignment[u] ?? 0;
    const valV = assignment[v] ?? 0;

    // In Max-Cut, edge is cut if endpoints belong to different partitions (valU !== valV)
    if (valU !== valV) {
      cutWeight += w;
      cutEdges.push({ ...edge, source: u, target: v, weight: w });
    } else {
      uncutEdges.push({ ...edge, source: u, target: v, weight: w });
    }
  });

  return { cutWeight, cutEdges, uncutEdges };
}

/**
 * Converts a bitstring (e.g. "001011" where index 0 is x0) into an assignment object
 * @param {string} bitstring
 * @returns {Record<number, number>}
 */
export function bitstringToAssignment(bitstring) {
  const assignment = {};
  for (let i = 0; i < bitstring.length; i++) {
    assignment[i] = parseInt(bitstring[i], 10);
  }
  return assignment;
}

/**
 * Converts an assignment object to bitstring "x0x1x2x3x4x5"
 * @param {Record<number, number>} assignment
 * @param {number} numVertices
 * @returns {string}
 */
export function assignmentToBitstring(assignment, numVertices = 6) {
  let str = '';
  for (let i = 0; i < numVertices; i++) {
    str += (assignment[i] ?? 0).toString();
  }
  return str;
}

/**
 * Official validation for Processor D matching qff_phase2.py
 * @param {object} p - processor definition
 * @param {number} requiredQubits - default 6
 * @returns {Array<string>} list of violation messages
 */
export function validateProcessorD(p, requiredQubits = 6) {
  const errs = [];
  if (!p) {
    return ['Processor definition is empty or null'];
  }

  const n = p.num_qubits;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < requiredQubits || n > 12) {
    errs.push(`num_qubits must be an integer in [${requiredQubits}, 12] (found: ${n})`);
    return errs;
  }

  const requiredBasis = ['rz', 'sx', 'x', 'cx'];
  const pBasis = p.basis_gates || [];
  const basisMatches =
    requiredBasis.length === pBasis.length &&
    requiredBasis.every((g) => pBasis.includes(g));

  if (!basisMatches) {
    errs.push(`basis_gates must be exactly ['rz', 'sx', 'x', 'cx']`);
  }

  const deg = {};
  for (let q = 0; q < n; q++) deg[q] = 0;

  const seen = new Set();
  const edges = p.edges || [];

  for (const [a, b] of edges) {
    if (a === b || a < 0 || a >= n || b < 0 || b >= n) {
      errs.push(`Invalid edge (${a}, ${b}) for ${n}-qubit processor`);
      continue;
    }
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) {
      errs.push(`Duplicate edge (${a}, ${b})`);
    }
    seen.add(key);
    deg[a] = (deg[a] || 0) + 1;
    deg[b] = (deg[b] || 0) + 1;
  }

  const highDeg = Object.entries(deg)
    .filter(([_, d]) => d > 4)
    .map(([q]) => q);
  if (highDeg.length > 0) {
    errs.push(`Qubits [${highDeg.join(', ')}] exceed maximum degree 4`);
  }

  // Check graph connectivity using BFS
  const adj = {};
  for (let q = 0; q < n; q++) adj[q] = [];
  for (const [a, b] of edges) {
    if (0 <= a && a < n && 0 <= b && b < n) {
      adj[a].push(b);
      adj[b].push(a);
    }
  }

  const reached = new Set([0]);
  const queue = [0];
  while (queue.length > 0) {
    const cur = queue.shift();
    for (const nb of adj[cur] || []) {
      if (!reached.has(nb)) {
        reached.add(nb);
        queue.push(nb);
      }
    }
  }

  if (reached.size !== n) {
    errs.push(`Coupling graph is disconnected: reached only ${reached.size} of ${n} physical qubits`);
  }

  const nz = p.noise || {};
  if ((nz.p1 ?? 0.001) < 0.001 || (nz.p2 ?? 0.005) < 0.005 || (nz.p_readout ?? 0.01) < 0.01) {
    errs.push('Noise rates cannot be lower (more optimistic) than the official baseline model (p1=0.001, p2=0.005, p_readout=0.01)');
  }

  return errs;
}

