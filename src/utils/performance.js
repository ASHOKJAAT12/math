/**
 * Measures the execution time of a synchronous function.
 * @param {function} fn - The function to execute and measure.
 * @returns {object} { result, executionTimeMs }
 */
export const measureExecutionTime = (fn) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    return {
        result,
        executionTimeMs: end - start
    };
};

/**
 * Benchmarks a numerical method by executing it multiple times and measuring duration metrics.
 * 
 * @param {function} fn - The function execution wrapper to run.
 * @param {number} repetitions - The number of iterations to run for benchmarking.
 * @returns {object} An object containing the primary result and timing statistics.
 */
export const benchmarkMethod = (fn, repetitions = 1) => {
    // If only 1 rep, just run standard measurement
    if (repetitions <= 1) {
        const { result, executionTimeMs } = measureExecutionTime(fn);
        return {
            result,
            metrics: {
                min: executionTimeMs,
                max: executionTimeMs,
                avg: executionTimeMs,
                median: executionTimeMs,
                runs: 1
            }
        };
    }

    const times = [];
    let initialResult = null;

    // Warm-up run (optional, but helps jitter if environment heavily jits)
    // For now we just strictly run the requested reps
    for (let i = 0; i < repetitions; i++) {
        const start = performance.now();
        const res = fn();
        const end = performance.now();

        times.push(end - start);

        if (i === 0) {
            initialResult = res; // Return the first mapped result to maintain math stability
        }
    }

    // Sort to calculate median
    times.sort((a, b) => a - b);

    const min = times[0];
    const max = times[times.length - 1];
    const avg = times.reduce((a, b) => a + b, 0) / times.length;

    // Median
    const mid = Math.floor(times.length / 2);
    const median = times.length % 2 !== 0 ? times[mid] : (times[mid - 1] + times[mid]) / 2.0;

    return {
        result: initialResult,
        metrics: {
            min,
            max,
            avg,
            median,
            runs: repetitions
        }
    };
};

