import { trapezoidal, simpson13, simpson38 } from '../methods/integration/index.js';
import { createEvaluator } from '../utils/evaluator.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../utils/errorCalculations.js';

export const compareIntegrationMethods = (methods, inputs) => {
    const selectedMethods = methods.filter(m => m.selected);
    if (selectedMethods.length < 1) return { error: "Select at least one method to perform a comparison." };

    let f;
    try {
        f = createEvaluator(inputs.func);
    } catch (e) {
        return { error: `Math Error: ${e.message}` };
    }

    const a = parseFloat(inputs.a);
    const b = parseFloat(inputs.b);
    const n = parseInt(inputs.n);

    if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0) {
        return { error: "Invalid integral bounds or subintervals provided." };
    }

    const results = {};
    let exactValue = null;
    if (inputs.exactValue && !isNaN(parseFloat(inputs.exactValue))) {
        exactValue = parseFloat(inputs.exactValue);
    }

    selectedMethods.forEach(method => {
        let result = null;

        if (method.id === 'simpson13' && n % 2 !== 0) {
            result = { validationError: "Simpson's 1/3 Rule requires n to be even." };
        } else if (method.id === 'simpson38' && n % 3 !== 0) {
            result = { validationError: "Simpson's 3/8 Rule requires n to be a multiple of 3." };
        }

        if (!result || !result.validationError) {
            try {
                switch (method.id) {
                    case 'trapezoidal':
                        result = trapezoidal(f, a, b, n);
                        break;
                    case 'simpson13':
                        result = simpson13(f, a, b, n);
                        break;
                    case 'simpson38':
                        result = simpson38(f, a, b, n);
                        break;
                    default:
                        result = { validationError: 'Unknown method.' };
                }
            } catch (err) {
                result = { validationError: `Execution Error: ${err.message}` };
            }
        }

        results[method.id] = normalizeResult(method.id, method.name, result, exactValue, n);
    });

    return { data: results, hasExactReference: exactValue !== null };
};

const normalizeResult = (id, name, result, exactValue, n) => {
    if (result.validationError) {
        return {
            id, name, valid: false,
            resultValue: null,
            status: 'Validation Error',
            resultParam: null, // Subintervals
            absoluteError: null,
            relativeError: null,
            percentageError: null,
            executionTime: 0,
            message: result.validationError
        };
    }

    const { result: integralValue, status, executionTime, message } = result;

    let absError = null;
    let relError = null;
    let percError = null;

    if (exactValue !== null && integralValue !== null && typeof integralValue === 'number' && !isNaN(integralValue)) {
        absError = calculateAbsoluteError(integralValue, exactValue);
        relError = calculateRelativeError(integralValue, exactValue);
        percError = calculatePercentageError(integralValue, exactValue);
    }

    // Default error for ErrorChart when no exact value provided (e.g. use arbitrary to avoid chart breaking or leave null)
    // Actually ErrorChart expects absoluteError.

    return {
        id, name, valid: true,
        resultValue: integralValue,
        status: status,
        resultParam: n, // subintervals
        absoluteError: absError,
        relativeError: relError,
        percentageError: percError,
        executionTime,
        message
    };
};
