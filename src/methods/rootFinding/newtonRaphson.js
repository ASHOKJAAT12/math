import { calculateIterationError } from '../../utils/errorCalculations.js';
import { measureExecutionTime } from '../../utils/performance.js';

/**
 * Fallback numerical derivative if exact analytic derivative is not provided.
 * Central difference method: f'(x) ≈ (f(x + h) - f(x - h)) / 2h
 */
const numericalDerivative = (f, x, h = 1e-7) => {
    return (f(x + h) - f(x - h)) / (2 * h);
};

export const newtonRaphsonRunner = (f, fPrime, initialGuess, tolerance, maxIterations) => {
    const resultObj = measureExecutionTime(() => newtonRaphsonLogic(f, fPrime, initialGuess, tolerance, maxIterations));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const newtonRaphsonLogic = (f, fPrime, initialGuess, tolerance, maxIterations) => {
    let x = Number(initialGuess);
    const steps = [];

    // If no analytic derivative is passed, use our fallback
    const derivativeFunc = fPrime || ((val) => numericalDerivative(f, val));

    try {
        let fx, deriv, nextX;

        for (let i = 1; i <= maxIterations; i++) {
            fx = f(x);
            deriv = derivativeFunc(x);

            const isFin = Number.isFinite(fx) && Number.isFinite(deriv);
            if (!isFin) {
                return { method: 'Newton-Raphson', root: x, converged: false, iterations: i, error: null, steps, message: 'Numerical Failure: Non-finite function or derivative value.' };
            }

            if (Math.abs(deriv) < 1e-14) {
                return { method: 'Newton-Raphson', root: x, converged: false, iterations: i, error: null, steps, message: 'Numerical Failure: Derivative is essentially zero.' };
            }

            nextX = x - (fx / deriv);
            const iterationError = calculateIterationError(nextX, x);

            steps.push({
                iteration: i,
                x,
                fx,
                derivative: deriv,
                nextX,
                error: iterationError
            });

            if (!Number.isFinite(nextX)) {
                return { method: 'Newton-Raphson', root: nextX, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: x diverged to infinity.' };
            }

            if (Math.abs(fx) < tolerance || iterationError < tolerance) {
                return { method: 'Newton-Raphson', root: nextX, converged: true, iterations: i, error: iterationError, steps, message: 'Converged' };
            }

            x = nextX;
        }

        return { method: 'Newton-Raphson', root: x, converged: false, iterations: maxIterations, error: null, steps, message: 'Max Iterations Reached' };
    } catch (err) {
        return { method: 'Newton-Raphson', root: null, converged: false, iterations: 0, error: null, steps, message: `Numerical Failure: ${err.message}` };
    }
};

export default newtonRaphsonRunner;
