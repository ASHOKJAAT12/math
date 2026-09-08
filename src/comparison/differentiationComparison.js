import { forwardDifference, backwardDifference, centralDifference } from '../methods/differentiation/index.js';
import { createEvaluator } from '../utils/evaluator.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../utils/errorCalculations.js';
import { analyzeStepSizes } from '../analysis/differentiation/errorVsStepSize.js';

export const compareDifferentiationMethods = (methods, inputs) => {
    const selectedMethods = methods.filter(m => m.selected);
    if (selectedMethods.length < 1) return { error: "Select at least one method to perform a comparison." };

    let f;
    try {
        f = createEvaluator(inputs.func);
    } catch (e) {
        return { error: `Math Error: ${e.message}` };
    }

    const x = parseFloat(inputs.x);
    let h = parseFloat(inputs.h);

    if (isNaN(x) || isNaN(h) || h <= 0) {
        return { error: "Invalid evaluation point or step size provided." };
    }

    let exactDerivative = null;
    if (inputs.exactDerivative && !isNaN(parseFloat(inputs.exactDerivative))) {
        exactDerivative = parseFloat(inputs.exactDerivative);
    }

    // Checking if we are running multi-h or standard execution
    // Actually compare module maps the exact output to comparison graphs.
    // Let's just generate the single result for the unified table.

    const results = {};

    selectedMethods.forEach(method => {
        let result = null;
        try {
            switch (method.id) {
                case 'forward':
                    result = forwardDifference(f, x, h);
                    break;
                case 'backward':
                    result = backwardDifference(f, x, h);
                    break;
                case 'central':
                    result = centralDifference(f, x, h);
                    break;
                default:
                    result = { validationError: 'Unknown method.' };
            }
        } catch (err) {
            result = { validationError: `Execution Error: ${err.message}` };
        }

        results[method.id] = normalizeResult(method.id, method.name, result, exactDerivative, h);
    });

    return { data: results, hasExactReference: exactDerivative !== null };
};

const normalizeResult = (id, name, result, exactValue, h) => {
    if (result.validationError) {
        return {
            id, name, valid: false,
            resultValue: null,
            status: 'Validation Error',
            resultParam: null, // step size
            absoluteError: null,
            relativeError: null,
            percentageError: null,
            executionTime: 0,
            message: result.validationError
        };
    }

    const { result: diffValue, status, executionTime } = result;

    let absError = null;
    let relError = null;
    let percError = null;

    if (exactValue !== null && diffValue !== null) {
        absError = calculateAbsoluteError(diffValue, exactValue);
        relError = calculateRelativeError(diffValue, exactValue);
        percError = calculatePercentageError(diffValue, exactValue);
    }

    let msg = result.absoluteError ? `Error: ${result.absoluteError}` : 'Success';

    return {
        id, name, valid: true,
        resultValue: diffValue,
        status: status,
        resultParam: h,
        absoluteError: absError,
        relativeError: relError,
        percentageError: percError,
        executionTime,
        message: msg
    };
};
