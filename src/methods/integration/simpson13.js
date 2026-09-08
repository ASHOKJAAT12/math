import { measureExecutionTime } from '../../utils/performance.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../../utils/errorCalculations.js';

export const simpson13Runner = (f, lowerLimit, upperLimit, n, exactValue = null) => {
    const resultObj = measureExecutionTime(() => simpson13Logic(f, lowerLimit, upperLimit, n, exactValue));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const simpson13Logic = (f, lowerLimit, upperLimit, n, exactValue) => {
    const a = Number(lowerLimit);
    const b = Number(upperLimit);
    const intervals = parseInt(n, 10);
    const steps = [];

    // Validation
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return { method: "Simpson's 1/3", result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: 'Limits must be finite numbers.' };
    }
    if (isNaN(intervals) || intervals < 2) {
        return { method: "Simpson's 1/3", result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: 'Subintervals must be a positive integer.' };
    }
    if (intervals > 1000000) {
        return { method: "Simpson's 1/3", result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: "Subintervals (n) must not exceed 1,000,000 for browser performance safety." };
    }
    if (intervals % 2 !== 0) {
        return { method: "Simpson's 1/3", result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: "Simpson's 1/3 Rule requires an even number of subintervals." };
    }
    if (a === b) {
        return { method: "Simpson's 1/3", result: 0, converged: true, status: 'converged', subintervals: intervals, error: null, steps, message: 'Zero-length interval.' };
    }

    try {
        const h = (b - a) / intervals;
        let sum = 0;

        for (let i = 0; i <= intervals; i++) {
            const x = a + i * h;
            const fx = f(x);

            if (!Number.isFinite(fx)) {
                return { method: "Simpson's 1/3", result: null, converged: false, status: 'numerical-failure', subintervals: intervals, error: null, steps, message: `Function evaluated to non-finite value at x = ${x}` };
            }

            let weight = 1;
            if (i > 0 && i < intervals) {
                weight = (i % 2 === 0) ? 2 : 4;
            }

            const contribution = weight * fx;
            sum += contribution;

            if (intervals <= 1000 || i < 50 || i > intervals - 50) {
                steps.push({
                    index: i,
                    x,
                    fx,
                    weight,
                    contribution
                });
            }
        }

        const integral = (h / 3) * sum;

        let errors = { absoluteError: null, relativeError: null, percentageError: null };
        if (exactValue !== null && !isNaN(Number(exactValue))) {
            const exact = Number(exactValue);
            errors.absoluteError = calculateAbsoluteError(integral, exact);
            errors.relativeError = calculateRelativeError(integral, exact);
            errors.percentageError = calculatePercentageError(integral, exact);
        }

        return {
            method: "Simpson's 1/3",
            result: integral,
            converged: true,
            status: 'converged',
            subintervals: intervals,
            ...errors,
            steps,
            message: 'Converged successfully.'
        };

    } catch (err) {
        return { method: "Simpson's 1/3", result: null, converged: false, status: 'numerical-failure', subintervals: intervals, error: null, steps: [], message: `Execution Error: ${err.message}` };
    }
};

export default simpson13Runner;
