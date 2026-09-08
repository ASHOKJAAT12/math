import { calculateIterationError } from '../../utils/errorCalculations.js';
import { measureExecutionTime } from '../../utils/performance.js';
import { validateBracket } from '../../utils/validation.js';

/**
 * Executes the Bisection method to find the root of a function.
 * @param {function} f - The function evaluator
 * @param {number} lower - Lower bound of the interval (a)
 * @param {number} upper - Upper bound of the interval (b)
 * @param {number} tolerance - The maximum allowed error
 * @param {number} maxIterations - The maximum number of allowed iterations
 * @returns {object} Standardized result object
 */
export const bisection = (f, lower, upper, tolerance, maxIterations) => {
    return measureExecutionTime(() => {
        let a = Number(lower);
        let b = Number(upper);
        const steps = [];

        try {
            let fA = f(a);
            let fB = f(b);

            const bracketCheck = validateBracket(fA, fB);
            if (!bracketCheck.isValid) {
                return {
                    method: 'Bisection',
                    root: null,
                    converged: false,
                    iterations: 0,
                    error: null,
                    steps,
                    message: `Invalid Input: ${bracketCheck.message}`
                };
            }

            // Check for exact roots at endpoints
            if (fA === 0) return { method: 'Bisection', root: a, converged: true, iterations: 0, error: 0, steps, message: 'Lower bound is an exact root.' };
            if (fB === 0) return { method: 'Bisection', root: b, converged: true, iterations: 0, error: 0, steps, message: 'Upper bound is an exact root.' };

            let c = a;
            let fC;
            let prevC = a;

            for (let i = 1; i <= maxIterations; i++) {
                c = (a + b) / 2;
                fC = f(c);

                const width = Math.abs(b - a);
                const iterationError = calculateIterationError(c, prevC);

                steps.push({
                    iteration: i,
                    a,
                    b,
                    c,
                    fA,
                    fB,
                    fC,
                    intervalWidth: width,
                    error: i === 1 ? null : iterationError
                });

                if (!Number.isFinite(fC)) {
                    return { method: 'Bisection', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: f(c) evaluated to a non-finite value.' };
                }

                if (Math.abs(fC) <= tolerance || (width / 2) <= tolerance) {
                    return { method: 'Bisection', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Converged.' };
                }

                // Prepare next iteration
                if (fA * fC < 0) {
                    b = c;
                    fB = fC;
                } else if (fB * fC < 0) {
                    a = c;
                    fA = fC;
                } else if (fC === 0) {
                    return { method: 'Bisection', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Exact root found.' };
                } else {
                    return { method: 'Bisection', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: Sign change lost due to precision.' };
                }

                prevC = c;
            }

            return { method: 'Bisection', root: c, converged: false, iterations: maxIterations, error: calculateIterationError(c, prevC), steps, message: 'Max Iterations Reached.' };

        } catch (err) {
            return { method: 'Bisection', root: null, converged: false, iterations: 0, error: null, steps, message: `Numerical Failure: ${err.message}` };
        }
    }).result; // Note: wrapping with measureExecutionTime, but we need to inject executionTimeMs into the returned object.
};

// Slightly refactor to inject execution time correctly:
export const bisectionRunner = (f, lower, upper, tolerance, maxIterations) => {
    const resultObj = measureExecutionTime(() => bisectionLogic(f, lower, upper, tolerance, maxIterations));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const bisectionLogic = (f, lower, upper, tolerance, maxIterations) => {
    let a = Number(lower);
    let b = Number(upper);
    const steps = [];

    try {
        let fA = f(a);
        let fB = f(b);

        const bracketCheck = validateBracket(fA, fB);
        if (!bracketCheck.isValid) {
            return {
                method: 'Bisection',
                root: null,
                converged: false,
                iterations: 0,
                error: null,
                steps,
                message: `Invalid Input: ${bracketCheck.message}`
            };
        }

        if (fA === 0) return { method: 'Bisection', root: a, converged: true, iterations: 0, error: 0, steps, message: 'Lower bound is an exact root.' };
        if (fB === 0) return { method: 'Bisection', root: b, converged: true, iterations: 0, error: 0, steps, message: 'Upper bound is an exact root.' };

        let c = a;
        let fC;
        let prevC = a;

        for (let i = 1; i <= maxIterations; i++) {
            c = (a + b) / 2;
            fC = f(c);

            const width = Math.abs(b - a);
            const iterationError = calculateIterationError(c, prevC);

            steps.push({
                iteration: i,
                a,
                b,
                c,
                fA,
                fB,
                fC,
                intervalWidth: width,
                error: i === 1 ? null : iterationError
            });

            if (!Number.isFinite(fC)) {
                return { method: 'Bisection', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: f(c) evaluated to a non-finite value.' };
            }

            if (Math.abs(fC) < tolerance || (width / 2) < tolerance) {
                return { method: 'Bisection', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Converged' };
            }

            if (fA * fC < 0) {
                b = c;
                fB = fC;
            } else if (fB * fC < 0) {
                a = c;
                fA = fC;
            } else if (fC === 0) {
                return { method: 'Bisection', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Exact root found' };
            } else {
                return { method: 'Bisection', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: Sign change lost' };
            }

            prevC = c;
        }

        return { method: 'Bisection', root: c, converged: false, iterations: maxIterations, error: calculateIterationError(c, prevC), steps, message: 'Max Iterations Reached' };

    } catch (err) {
        return { method: 'Bisection', root: null, converged: false, iterations: 0, error: null, steps, message: `Numerical Failure: ${err.message}` };
    }
};

export default bisectionRunner;
