import { measureExecutionTime } from '../../utils/performance.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../../utils/errorCalculations.js';

export const trapezoidalRunner = (f, lowerLimit, upperLimit, n, exactValue = null) => {
    const resultObj = measureExecutionTime(() => trapezoidalLogic(f, lowerLimit, upperLimit, n, exactValue));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const trapezoidalLogic = (f, lowerLimit, upperLimit, n, exactValue) => {
    const a = Number(lowerLimit);
    const b = Number(upperLimit);
    const intervals = parseInt(n, 10);
    const steps = [];

    // Basic Validation
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return { method: 'Trapezoidal', result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: 'Limits must be finite numbers.' };
    }
    if (isNaN(intervals) || intervals < 1) {
        return { method: 'Trapezoidal', result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: 'Subintervals (n) must be a positive integer (≥1).' };
    }
    if (intervals > 1000000) {
        return { method: 'Trapezoidal', result: null, converged: false, status: 'invalid-input', subintervals: intervals, error: null, steps, message: 'Subintervals (n) must not exceed 1,000,000 for browser performance safety.' };
    }
    if (a === b) {
        return { method: 'Trapezoidal', result: 0, converged: true, status: 'converged', subintervals: intervals, error: null, steps, message: 'Zero-length interval evaluates exactly as 0.' };
    }

    try {
        const h = (b - a) / intervals;
        let sum = 0;

        for (let i = 0; i <= intervals; i++) {
            const x = a + i * h;
            const fx = f(x);

            if (!Number.isFinite(fx)) {
                return { method: 'Trapezoidal', result: null, converged: false, status: 'numerical-failure', subintervals: intervals, error: null, steps, message: `Function evaluated to non-finite value at x = ${x}` };
            }

            const weight = (i === 0 || i === intervals) ? 1 : 2;
            const contribution = weight * fx;
            sum += contribution;

            // Keep structural sizes down if n > 1000 to prevent browser massive allocations freezing UI
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

        const integral = (h / 2) * sum;
        let errors = { absoluteError: null, relativeError: null, percentageError: null };

        if (exactValue !== null && !isNaN(Number(exactValue))) {
            const exact = Number(exactValue);
            errors.absoluteError = calculateAbsoluteError(integral, exact);
            errors.relativeError = calculateRelativeError(integral, exact);
            errors.percentageError = calculatePercentageError(integral, exact);
        }

        return {
            method: 'Trapezoidal',
            result: integral,
            converged: true,
            status: 'converged',
            subintervals: intervals,
            ...errors,
            steps,
            message: 'Converged successfully.'
        };

    } catch (err) {
        return { method: 'Trapezoidal', result: null, converged: false, status: 'numerical-failure', subintervals: intervals, error: null, steps: [], message: `Execution Error: ${err.message}` };
    }
};

export default trapezoidalRunner;
