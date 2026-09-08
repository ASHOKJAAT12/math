import { measureExecutionTime } from '../../utils/performance.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../../utils/errorCalculations.js';

export const forwardDifferenceRunner = (f, xInput, hInput, exactDerivative = null) => {
    const resultObj = measureExecutionTime(() => forwardDifferenceLogic(f, xInput, hInput, exactDerivative));
    return { ...resultObj.result, executionTime: resultObj.executionTimeMs };
};

const forwardDifferenceLogic = (f, xInput, hInput, exactDerivative) => {
    const x = Number(xInput);
    const h = Number(hInput);
    const steps = [];

    // Basic Validation
    if (!Number.isFinite(x)) {
        return { method: 'Forward Difference', result: null, status: 'invalid-input', point: x, h, error: null, steps, message: 'Evaluation point (x) must be a finite number.' };
    }
    if (!Number.isFinite(h) || h <= 0) {
        return { method: 'Forward Difference', result: null, status: 'invalid-input', point: x, h, error: null, steps, message: 'Step size (h) must be a positive number (>0).' };
    }

    try {
        const xPlusH = x + h;
        const fx = f(x);
        const fxPlusH = f(xPlusH);

        if (!Number.isFinite(fx) || !Number.isFinite(fxPlusH)) {
            return { method: 'Forward Difference', result: null, status: 'numerical-failure', point: x, h, error: null, steps, message: `Function evaluation non-finite at boundaries. f(x)=${fx}, f(x+h)=${fxPlusH}.` };
        }

        const derivative = (fxPlusH - fx) / h;

        steps.push({ x, h, xPlusH, fx, fxPlusH, derivative });

        let errors = { absoluteError: null, relativeError: null, percentageError: null };

        if (!Number.isFinite(derivative)) {
            return { method: 'Forward Difference', result: null, status: 'numerical-failure', point: x, h, ...errors, steps, message: 'Generated non-finite derivative approximation.' };
        }

        if (exactDerivative !== null && !isNaN(Number(exactDerivative))) {
            const exact = Number(exactDerivative);
            errors.absoluteError = calculateAbsoluteError(exact, derivative);
            errors.relativeError = calculateRelativeError(exact, derivative);
            errors.percentageError = calculatePercentageError(exact, derivative);
        }

        return {
            method: 'Forward Difference',
            result: derivative,
            status: 'success',
            point: x,
            h,
            ...errors,
            steps,
            message: 'Successfully evaluated derivative.'
        };

    } catch (err) {
        return { method: 'Forward Difference', result: null, status: 'numerical-failure', point: x, h, absoluteError: null, relativeError: null, percentageError: null, steps: [], message: `Execution Error: ${err.message}` };
    }
};

export default forwardDifferenceRunner;
