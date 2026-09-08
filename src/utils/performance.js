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
