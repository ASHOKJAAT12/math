import { bisection, regulaFalsi, newtonRaphson, secant } from '../methods/rootFinding/index.js';
import { createEvaluator } from '../utils/evaluator.js';
import { calculateAbsoluteError, calculateRelativeError, calculatePercentageError } from '../utils/errorCalculations.js';

/**
 * Normalizes results from different root finding methods into a unified structure
 * for comparison display and chart rendering.
 */
export const compareRootFindingMethods = (methods, inputs) => {
    const selectedMethods = methods.filter(m => m.selected);
    if (selectedMethods.length < 2) return { error: "Select at least two methods to perform a comparison." };

    let f, fPrime;
    try {
        f = createEvaluator(inputs.func);
    } catch (e) {
        return { error: `Math Error: ${e.message}` };
    }

    // Parse derivative only if Newton-Raphson is selected and derivative string exists
    const hasNewton = selectedMethods.some(m => m.id === 'newtonRaphson');
    if (hasNewton && inputs.deriv) {
        try {
            fPrime = createEvaluator(inputs.deriv);
        } catch (e) {
            return { error: `Math Error in Derivative: ${e.message}` };
        }
    }

    const tol = parseFloat(inputs.tolerance);
    const maxIter = parseInt(inputs.maxIterations);
    const results = {};

    // Conditionally process exact root if supplied
    let exactRoot = null;
    if (inputs.exactRoot && !isNaN(parseFloat(inputs.exactRoot))) {
        exactRoot = parseFloat(inputs.exactRoot);
    }

    selectedMethods.forEach(method => {
        let result = null;

        // Safety check specific parameters
        if ((method.id === 'bisection' || method.id === 'regulaFalsi') && (isNaN(inputs.lowerBound) || isNaN(inputs.upperBound))) {
            result = { validationError: 'Invalid bounds provided.' };
        } else if (method.id === 'newtonRaphson' && isNaN(inputs.initialGuess)) {
            result = { validationError: 'Invalid initial guess provided.' };
        } else if (method.id === 'secant' && (isNaN(inputs.initialGuess) || isNaN(inputs.secondGuess))) {
            result = { validationError: 'Invalid initial guesses provided.' };
        }

        if (!result || !result.validationError) {
            try {
                switch (method.id) {
                    case 'bisection':
                        result = bisection(f, inputs.lowerBound, inputs.upperBound, tol, maxIter);
                        break;
                    case 'regulaFalsi':
                        result = regulaFalsi(f, inputs.lowerBound, inputs.upperBound, tol, maxIter);
                        break;
                    case 'newtonRaphson':
                        result = newtonRaphson(f, fPrime || null, inputs.initialGuess, tol, maxIter);
                        break;
                    case 'secant':
                        result = secant(f, inputs.initialGuess, inputs.secondGuess, tol, maxIter);
                        break;
                    default:
                        result = { validationError: 'Unknown method.' };
                }
            } catch (err) {
                result = { validationError: `Execution Error: ${err.message}` };
            }
        }

        results[method.id] = normalizeResult(method.id, method.name, result, exactRoot);
    });

    return { data: results, exactRootAvailable: exactRoot !== null };
};

const normalizeResult = (id, name, result, exactRoot) => {
    // Handle early errors due to missing params before algorithmic execution
    if (result.validationError) {
        return {
            id,
            name,
            valid: false,
            root: null,
            converged: false,
            status: 'Validation Error',
            iterations: 0,
            finalError: null,
            absoluteError: null,
            relativeError: null,
            percentageError: null,
            executionTime: 0,
            message: result.validationError,
            steps: []
        };
    }

    const { root, converged, iterations, executionTime, message, steps } = result;

    // Calculate final algorithmic iteration error
    let finalIterError = null;
    if (steps.length > 0) {
        finalIterError = steps[steps.length - 1].error;
    }

    // Calculate exact analytical error if exactRoot provided via user
    let absError = null;
    let relError = null;
    let percError = null;

    if (exactRoot !== null && root !== null) {
        absError = calculateAbsoluteError(root, exactRoot);
        relError = calculateRelativeError(root, exactRoot);
        percError = calculatePercentageError(root, exactRoot);
    }

    return {
        id,
        name,
        valid: true,
        root,
        converged,
        status: converged ? 'Converged' : (message.includes('Max Iterations') ? 'Max Iterations' : 'Numerical Failure'),
        iterations,
        finalError: finalIterError,
        absoluteError: absError,
        relativeError: relError,
        percentageError: percError,
        executionTime,
        message,
        steps
    };
};
