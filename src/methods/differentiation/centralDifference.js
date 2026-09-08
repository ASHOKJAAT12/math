import { measureExecutionTime } from '../../utils/performance.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../../utils/errorCalculations.js';

export const centralDifferenceRunner = (f, xInput, hInput, exactDerivative = null) => {
    const resultObj = measureExecutionTime(() => centralDifferenceLogic(f, xInput, hInput, exactDerivative));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const centralDifferenceLogic = (f, xInput, hInput, exactDerivative) => {
    const x = Number(xInput);
    const h = Number(hInput);
    const steps = [];

    // Basic Validation
    if (!Number.isFinite(x)) {
        return { method: 'Central Difference', result: null, status: 'invalid-input', point: x, h, error: null, steps, message: 'Evaluation point (x) must be a finite number.' };
    }
    if (!Number.isFinite(h) || h <= 0) {
        return { method: 'Central Difference', result: null, status: 'invalid-input', point: x, h, error: null, steps, message: 'Step size (h) must be a positive number (>0).' };
    }

    try {
        const xPlusH = x + h;
        const xMinusH = x - h;
        const fxPlusH = f(xPlusH);
        const fxMinusH = f(xMinusH);

        if (!Number.isFinite(fxPlusH) || !Number.isFinite(fxMinusH)) {
            return { method: 'Central Difference', result: null, status: 'numerical-failure', point: x, h, error: null, steps, message: `Function evaluation non-finite at boundaries. f(x+h)=${fxPlusH}, f(x-h)=${fxMinusH}.` };
        }

        const derivative = (fxPlusH - fxMinusH) / (2 * h);

        steps.push({ x, h, xPlusH, xMinusH, fxPlusH, fxMinusH, derivative });

        let errors = { absoluteError: null, relativeError: null, percentageError: null };

        if (!Number.isFinite(derivative)) {
            return { method: 'Central Difference', result: null, status: 'numerical-failure', point: x, h, ...errors, steps, message: 'Generated non-finite derivative approximation.' };
        }

        if (exactDerivative !== null && !isNaN(Number(exactDerivative))) {
            const exact = Number(exactDerivative);
            errors.absoluteError = calculateAbsoluteError(exact, derivative);
            errors.relativeError = calculateRelativeError(exact, derivative);
            errors.percentageError = calculatePercentageError(exact, derivative);
        }

        return {
            method: 'Central Difference',
            result: derivative,
            status: 'success',
            point: x,
            h,
            ...errors,
            steps,
            message: 'Successfully evaluated derivative.'
        };

    } catch (err) {
        return { method: 'Central Difference', result: null, status: 'numerical-failure', point: x, h, absoluteError: null, relativeError: null, percentageError: null, steps: [], message: `Execution Error: ${err.message}` };
    }
};

export default centralDifferenceRunner;
