import { calculateIterationError } from '../../utils/errorCalculations.js';
import { measureExecutionTime } from '../../utils/performance.js';
import { validateBracket } from '../../utils/validation.js';

export const regulaFalsiRunner = (f, lower, upper, tolerance, maxIterations) => {
    const resultObj = measureExecutionTime(() => regulaFalsiLogic(f, lower, upper, tolerance, maxIterations));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const regulaFalsiLogic = (f, lower, upper, tolerance, maxIterations) => {
    let a = Number(lower);
    let b = Number(upper);
    const steps = [];

    try {
        let fA = f(a);
        let fB = f(b);

        const bracketCheck = validateBracket(fA, fB);
        if (!bracketCheck.isValid) {
            return { method: 'Regula Falsi', root: null, converged: false, iterations: 0, error: null, steps, message: `Invalid Input: ${bracketCheck.message}` };
        }

        if (fA === 0) return { method: 'Regula Falsi', root: a, converged: true, iterations: 0, error: 0, steps, message: 'Lower bound is an exact root.' };
        if (fB === 0) return { method: 'Regula Falsi', root: b, converged: true, iterations: 0, error: 0, steps, message: 'Upper bound is an exact root.' };

        let c = a;
        let fC;
        let prevC = a;

        for (let i = 1; i <= maxIterations; i++) {

            // Numerical stable formulation for False Position
            const denominator = fB - fA;
            if (Math.abs(denominator) === 0) {
                return { method: 'Regula Falsi', root: c, converged: false, iterations: i, error: null, steps, message: 'Numerical Failure: f(b) - f(a) is zero.' };
            }

            c = (a * fB - b * fA) / denominator;
            fC = f(c);

            const iterationError = calculateIterationError(c, prevC);

            steps.push({
                iteration: i,
                a,
                b,
                c,
                fA,
                fB,
                fC,
                error: i === 1 ? null : iterationError
            });

            if (!Number.isFinite(fC) || !Number.isFinite(c)) {
                return { method: 'Regula Falsi', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: Generated a non-finite value.' };
            }

            if (Math.abs(fC) < tolerance || (i > 1 && iterationError < tolerance)) {
                return { method: 'Regula Falsi', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Converged' };
            }

            if (fA * fC < 0) {
                b = c;
                fB = fC;
            } else if (fB * fC < 0) {
                a = c;
                fA = fC;
            } else if (fC === 0) {
                return { method: 'Regula Falsi', root: c, converged: true, iterations: i, error: iterationError, steps, message: 'Exact root found' };
            } else {
                return { method: 'Regula Falsi', root: c, converged: false, iterations: i, error: iterationError, steps, message: 'Numerical Failure: Sign change lost' };
            }

            prevC = c;
        }

        return { method: 'Regula Falsi', root: c, converged: false, iterations: maxIterations, error: calculateIterationError(c, prevC), steps, message: 'Max Iterations Reached' };

    } catch (err) {
        return { method: 'Regula Falsi', root: null, converged: false, iterations: 0, error: null, steps, message: `Numerical Failure: ${err.message}` };
    }
};

export default regulaFalsiRunner;
