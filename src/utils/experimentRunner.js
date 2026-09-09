// src/utils/experimentRunner.js
import { bisection, regulaFalsi, newtonRaphson, secant } from '../methods/rootFinding';
import { trapezoidal, simpson13, simpson38 } from '../methods/integration';
import { forwardDifference, backwardDifference, centralDifference } from '../methods/differentiation';
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const EXPERIMENT_LIMIT_MAX_RUNS = 50;

/**
 * Validates the number of runs to prevent infinite loops or frozen browsers
 */
const validateExperimentSize = (runCount) => {
    if (runCount > EXPERIMENT_LIMIT_MAX_RUNS) {
        throw new Error(`Experiment too large. Reduce the parameter range (max ${EXPERIMENT_LIMIT_MAX_RUNS} runs).`);
    }
};

/**
 * Root Finding Experiment (Tolerance / Guess sweep)
 */
export const runRootFindingExperiment = (expression, type, parameterValues, config) => {
    validateExperimentSize(parameterValues.length);

    const results = [];
    parameterValues.forEach(val => {
        let currentConfig = { ...config };
        let runValue = val;

        if (type === 'tolerance') currentConfig.baseTolerance = val;
        if (type === 'guess') currentConfig.baseGuess = val;

        let res;
        try {
            switch (config.methodName) {
                case 'Bisection': res = bisection(expression, config.a, config.b, currentConfig.baseTolerance, config.maxIters); break;
                case 'Regula Falsi': res = regulaFalsi(expression, config.a, config.b, currentConfig.baseTolerance, config.maxIters); break;
                case 'Newton-Raphson': res = newtonRaphson(expression, currentConfig.baseGuess, currentConfig.baseTolerance, config.maxIters); break;
                case 'Secant': res = secant(expression, config.x0, config.x1, currentConfig.baseTolerance, config.maxIters); break;
                default: throw new Error("Method not supported for experiment");
            }
        } catch (err) {
            res = { error: err.message, iterations: 0, status: 'Failed' };
        }

        results.push({
            parameterValue: runValue,
            result: res.result || null,
            iterations: res.iterations || 0,
            status: res.error ? 'Failed' : 'Converged',
            errorLog: res.error || null,
            executionTime: res.executionTime || 0
        });
    });

    return {
        id: generateId(),
        category: 'Root Finding',
        experimentType: type,
        expression,
        method: config.methodName,
        timestamp: new Date().toISOString(),
        results,
        metrics: {
            parameterName: type === 'tolerance' ? 'Tolerance' : 'Initial Guess',
            averageIterations: results.reduce((acc, curr) => acc + curr.iterations, 0) / results.length
        }
    };
};

/**
 * Integration Experiment (n sweep)
 */
export const runIntegrationExperiment = (expression, a, b, nValues, methodName, exactValue = null) => {
    validateExperimentSize(nValues.length);

    const results = [];
    nValues.forEach(n => {
        let res;
        try {
            switch (methodName) {
                case 'Trapezoidal': res = trapezoidal(expression, a, b, n); break;
                case 'Simpson 1/3':
                    if (n % 2 !== 0) throw new Error("Simpson 1/3 requires even n");
                    res = simpson13(expression, a, b, n); break;
                case 'Simpson 3/8':
                    if (n % 3 !== 0) throw new Error("Simpson 3/8 requires n divisible by 3");
                    res = simpson38(expression, a, b, n); break;
                default: throw new Error("Method not supported");
            }

            let absoluteError = null;
            if (exactValue !== null && !res.error && res.result !== null) {
                absoluteError = Math.abs(exactValue - res.result);
            }

            results.push({
                parameterValue: n,
                result: res.result,
                error: absoluteError,
                executionTime: res.executionTime,
                status: 'Success'
            });
        } catch (err) {
            results.push({
                parameterValue: n,
                result: null,
                error: null,
                executionTime: 0,
                status: 'Failed',
                errorLog: err.message
            });
        }
    });

    return {
        id: generateId(),
        category: 'Numerical Integration',
        experimentType: 'n_study',
        expression,
        method: methodName,
        timestamp: new Date().toISOString(),
        results,
        metrics: { parameterName: 'n ' }
    };
};

/**
 * Differentiation Experiment (h sweep)
 */
export const runDifferentiationExperiment = (expression, x, hValues, methodName, exactDerivative = null) => {
    validateExperimentSize(hValues.length);

    const results = [];
    hValues.forEach(h => {
        let res;
        try {
            if (h <= 0) throw new Error("h must be greater than 0");

            switch (methodName) {
                case 'Forward': res = forwardDifference(expression, x, h); break;
                case 'Backward': res = backwardDifference(expression, x, h); break;
                case 'Central': res = centralDifference(expression, x, h); break;
                default: throw new Error("Method not supported");
            }

            let absoluteError = null;
            if (exactDerivative !== null && !res.error && res.result !== null) {
                absoluteError = Math.abs(exactDerivative - res.result);
            }

            results.push({
                parameterValue: h,
                result: res.result,
                error: absoluteError,
                executionTime: res.executionTime,
                status: 'Success'
            });
        } catch (err) {
            results.push({
                parameterValue: h,
                result: null,
                error: null,
                executionTime: 0,
                status: 'Failed',
                errorLog: err.message
            });
        }
    });

    return {
        id: generateId(),
        category: 'Numerical Differentiation',
        experimentType: 'h_study',
        expression,
        method: methodName,
        timestamp: new Date().toISOString(),
        results,
        metrics: { parameterName: 'h' }
    };
};
