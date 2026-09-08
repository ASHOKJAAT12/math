import { calculateIterationError } from '../../utils/errorCalculations.js';
import { measureExecutionTime } from '../../utils/performance.js';

export const secantRunner = (f, initialGuess0, initialGuess1, tolerance, maxIterations) => {
    const resultObj = measureExecutionTime(() => secantLogic(f, initialGuess0, initialGuess1, tolerance, maxIterations));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const secantLogic = (f, initialGuess0, initialGuess1, tolerance, maxIterations) => {
    let x0 = Number(initialGuess0);
    let x1 = Number(initialGuess1);
    const steps = [];

    if (x0 === x1) {
        return { method: 'Secant', root: null, converged: false, iterations: 0, error: null, steps, message: 'Invalid Input: Initial guesses must be distinctly different.' };
    }

    try {
        let f0 = f(x0);
        let f1;
        let nextX;

        for (let i = 1; i <= maxIterations; i++) {
            f1 = f(x1);

            if (!Number.isFinite(f0) || !Number.isFinite(f1)) {
                return { method: 'Secant', root: x1, converged: false, iterations: i, error: null, steps, message: 'Numerical Failure: Non-finite function value.' };
            }

            const denominator = f1 - f0;
            if (Math.abs(denominator) < 1e-14) {
                return { method: 'Secant', root: x1, converged: false, iterations: i, error: null, steps, message: 'Numerical Failure: Divisor extremely close to zero.' };
            }

            nextX = x1 - f1 * (x1 - x0) / denominator;
            const iterationError = calculateIterationError(nextX, x1);

            steps.push({
                iteration: i,
                x0,
                x1,
                nextX,
                f0,
                f1,
                error: iterationError
            });

            if (!Number.isFinite(nextX)) {
                return { method: 'Secant', root: nextX, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: value diverged.' };
            }

            if (Math.abs(f(nextX)) < tolerance || iterationError < tolerance) {
                return { method: 'Secant', root: nextX, converged: true, iterations: i, error: iterationError, steps, message: 'Converged' };
            }

            x0 = x1;
            f0 = f1;
            x1 = nextX;
        }

        return { method: 'Secant', root: x1, converged: false, iterations: maxIterations, error: null, steps, message: 'Max Iterations Reached' };

    } catch (err) {
        return { method: 'Secant', root: null, converged: false, iterations: 0, error: null, steps, message: `Numerical Failure: ${err.message}` };
    }
};

export default secantRunner;
