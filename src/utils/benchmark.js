
import { evaluate } from "./evaluate";
import { topologicalOrderAndReindex } from "./topologicalSort";
import * as CONSTANTS from "../constants/constants";

function countPrimitiveNodes(graph) {
  let count = 0;
  for (const node of graph) {
    // If it's a custom component, recursively count what's inside it
    if (node.type === "CUSTOM" && Array.isArray(node.ref_graph)) {
      count += countPrimitiveNodes(node.ref_graph);
    } else {
      // Otherwise, it's a primitive gate or wire
      count += 1;
    }
  }
  return count;
}
// Runs the evaluator repeatedly and measures performance.
export function benchmarkCircuit(
  originalGraph,
  options = {}
) {
  const {
    warmupRuns = 10,
    benchmarkRuns = 1000,
    evaluateIterations = CONSTANTS.MAX_EVALUATION_ITERATIONS
  } = options;

  if (!originalGraph || originalGraph.length === 0) {
    return {
      success: false,
      error: "Circuit is empty."
    };
  }

  // ------------------------------------------------------------
  // WARMUP
  // ------------------------------------------------------------

  for (let i = 0; i < warmupRuns; i++) {
    const graph = structuredClone(originalGraph);

    for (let j = 0; j < evaluateIterations; j++) {
      evaluate(graph);
    }
  }

  // ------------------------------------------------------------
  // EVALUATION BENCHMARK
  // ------------------------------------------------------------

  const evaluationTimes = [];

  let totalEvaluationTime = 0;

  for (let i = 0; i < benchmarkRuns; i++) {
    const graph = structuredClone(originalGraph);

    const start = performance.now();

    for (let j = 0; j < evaluateIterations; j++) {
      evaluate(graph);
    }

    const end = performance.now();

    const elapsed = end - start;

    evaluationTimes.push(elapsed);
    totalEvaluationTime += elapsed;
  }

  const averageEvaluationTime =
    totalEvaluationTime / benchmarkRuns;

  const minimumEvaluationTime =
    Math.min(...evaluationTimes);

  const maximumEvaluationTime =
    Math.max(...evaluationTimes);

  // ------------------------------------------------------------
  // TOPOLOGICAL SORT BENCHMARK
  // ------------------------------------------------------------

  const sortingTimes = [];

  for (let i = 0; i < benchmarkRuns; i++) {
    const graph = structuredClone(originalGraph);

    const start = performance.now();

    topologicalOrderAndReindex(graph);

    const end = performance.now();

    sortingTimes.push(end - start);
  }

  const averageSortingTime =
    sortingTimes.reduce((sum, value) => sum + value, 0) /
    sortingTimes.length;

  // ------------------------------------------------------------
  // RESULTS
  // ------------------------------------------------------------

  const totalEvaluations =
    benchmarkRuns * evaluateIterations;

  const evaluationsPerSecond =
    averageEvaluationTime > 0
      ? (1000 * evaluateIterations) / averageEvaluationTime
      : Infinity;

  return {
    success: true,

    nodeCount: countPrimitiveNodes(originalGraph),

    warmupRuns,
    benchmarkRuns,
    evaluateIterations,

    averageEvaluationTime,
    minimumEvaluationTime,
    maximumEvaluationTime,

    averageSortingTime,

    totalEvaluations,
    evaluationsPerSecond,

    totalBenchmarkTime:
      totalEvaluationTime +
      sortingTimes.reduce((sum, value) => sum + value, 0)
  };
}