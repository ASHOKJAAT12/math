import { createEvaluator } from './evaluator.js';
import bisectionRunner from '../methods/rootFinding/bisection.js';
import regulaFalsiRunner from '../methods/rootFinding/regulaFalsi.js';
import newtonRaphsonRunner from '../methods/rootFinding/newtonRaphson.js';
import secantRunner from '../methods/rootFinding/secant.js';
import trapezoidalRunner from '../methods/integration/trapezoidal.js';
import simpson13Runner from '../methods/integration/simpson13.js';
import simpson38Runner from '../methods/integration/simpson38.js';
import forwardDifferenceRunner from '../methods/differentiation/forwardDifference.js';
import backwardDifferenceRunner from '../methods/differentiation/backwardDifference.js';
import centralDifferenceRunner from '../methods/differentiation/centralDifference.js';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

export const LAB_LIMIT_MAX_RUNS = 200;

const validateExperimentSize = (runCount) => {
    if (runCount > LAB_LIMIT_MAX_RUNS) {
        throw new Error(`Experiment too large. Reduce the parameter range (max ${LAB_LIMIT_MAX_RUNS} total runs).`);
    }
};

export const generateLinearSpace = (start, end, count) => {
    if (count <= 1) return [start];
    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, i) => start + (step * i));
};

export const generateLogSpace = (startPow, endPow, count) => {
    if (count <= 1) return [Math.pow(10, startPow)];
    const step = (endPow - startPow) / (count - 1);
    return Array.from({ length: count }, (_, i) => Math.pow(10, startPow + (step * i)));
};

const runSingleMethod = (method, f, df, inputs) => {
    switch (method) {
        case 'Bisection': return bisectionRunner(f, inputs.a, inputs.b, inputs.tolerance, inputs.maxIters);
        case 'Regula Falsi': return regulaFalsiRunner(f, inputs.a, inputs.b, inputs.tolerance, inputs.maxIters);
        case 'Newton-Raphson': return newtonRaphsonRunner(f, df, inputs.guess, inputs.tolerance, inputs.maxIters);
        case 'Secant': return secantRunner(f, inputs.x0, inputs.x1, inputs.tolerance, inputs.maxIters);

        case 'Trapezoidal': return trapezoidalRunner(f, inputs.a, inputs.b, inputs.n, inputs.exact);
        case 'Simpson 1/3': return simpson13Runner(f, inputs.a, inputs.b, inputs.n, inputs.exact);
        case 'Simpson 3/8': return simpson38Runner(f, inputs.a, inputs.b, inputs.n, inputs.exact);

        case 'Forward Difference': return forwardDifferenceRunner(f, inputs.x, inputs.h, inputs.exact);
        case 'Backward Difference': return backwardDifferenceRunner(f, inputs.x, inputs.h, inputs.exact);
        case 'Central Difference': return centralDifferenceRunner(f, inputs.x, inputs.h, inputs.exact);

        default: throw new Error(`Unknown method: ${method}`);
    }
};

const mapResultToStandard = (runRes, category) => {
    // Normalizes different method outputs into a standard format for the lab table/chart
    const isFail = runRes.status && runRes.status !== 'success' && runRes.status !== 'converged';
    const isConv = runRes.converged; // for roots

    let standardOutput = {
        result: null,
        error: null,
        iterations: null,
        executionTime: runRes.executionTime || 0,
        status: isFail ? 'Failed' : (isConv === false ? 'Failed' : 'Success'),
        message: runRes.message
    };

    if (category === 'Root Finding') {
        standardOutput.result = runRes.root !== undefined ? runRes.root : runRes.result;
        standardOutput.error = runRes.error; // internal iteration error or residual
        standardOutput.iterations = runRes.iterations;
        standardOutput.status = runRes.converged ? 'Converged' : 'Failed';
    } else if (category === 'Numerical Integration') {
        standardOutput.result = runRes.result;
        standardOutput.error = runRes.absoluteError;
    } else if (category === 'Numerical Differentiation') {
        standardOutput.result = runRes.result;
        standardOutput.error = runRes.absoluteError;
    }

    return standardOutput;
};

export const runExperiment = ({
    category,
    methods,
    baseInput,
    parameter,
    values
}) => {
    validateExperimentSize(values.length * methods.length);

    let f, df = null;
    try {
        f = createEvaluator(baseInput.func);
        if (baseInput.derivativeFunc) df = createEvaluator(baseInput.derivativeFunc);
    } catch (e) {
        throw new Error("Invalid function provided for evaluation.");
    }

    const runs = [];

    // Outer loop by method, inner by parameter value handles structured plotting easily
    methods.forEach(method => {
        values.forEach(val => {
            let activeInputs = { ...baseInput };

            // Inject parameter override safely
            if (parameter === 'tolerance') activeInputs.tolerance = val;
            if (parameter === 'guess') activeInputs.guess = val;
            if (parameter === 'bracket') {
                activeInputs.a = val[0];
                activeInputs.b = val[1];
            }
            if (parameter === 'maxIters') activeInputs.maxIters = val;

            if (parameter === 'n') activeInputs.n = val;
            if (parameter === 'interval') {
                activeInputs.a = val[0];
                activeInputs.b = val[1];
            }
            if (parameter === 'h') activeInputs.h = val;
            if (parameter === 'x') activeInputs.x = val;

            let res;
            try {
                res = runSingleMethod(method, f, df, activeInputs);
            } catch (err) {
                // Failsafe catch
                res = { status: 'fatal-failure', message: err.message, executionTime: 0 };
            }

            const standardRes = mapResultToStandard(res, category);

            runs.push({
                method,
                parameterValue: val,
                ...standardRes
            });
        });
    });

    const isMixed = runs.some(r => r.status === 'Success' || r.status === 'Converged') && runs.some(r => r.status === 'Failed');
    const isAllSuccess = runs.every(r => r.status === 'Success' || r.status === 'Converged');

    let overallStatus = 'Failed';
    if (isAllSuccess) overallStatus = 'Success';
    else if (isMixed) overallStatus = 'Mixed';

    return {
        id: `lab_exp_${generateId()}`,
        timestamp: new Date().toISOString(),
        category,
        parameterStudied: parameter,
        methodsTested: methods,
        baseConfiguration: baseInput,
        parameterValues: values,
        totalRuns: runs.length,
        status: overallStatus,
        results: runs // Flatted array of { method, parameterValue, result, error, ... }
    };
};

export const runBenchmark = ({
    category,
    methods,
    baseInput,
    repetitions = 10,
    warmupRuns = 2
}) => {
    let f, df = null;
    try {
        f = createEvaluator(baseInput.func);
        if (baseInput.derivativeFunc) df = createEvaluator(baseInput.derivativeFunc);
    } catch (e) {
        throw new Error("Invalid function provided for evaluation.");
    }

    const benchmarkResults = [];

    methods.forEach(method => {
        // Warmup
        for (let i = 0; i < warmupRuns; i++) {
            try { runSingleMethod(method, f, df, baseInput); } catch (e) { }
        }

        const times = [];
        let finalResult = null;
        let success = true;

        for (let i = 0; i < repetitions; i++) {
            try {
                const res = runSingleMethod(method, f, df, baseInput);
                const std = mapResultToStandard(res, category);

                if (std.status === 'Failed') success = false;
                if (i === 0) finalResult = std.result;

                times.push(std.executionTime);
            } catch (e) {
                success = false;
                times.push(0);
            }
        }

        times.sort((a, b) => a - b);
        const minTime = times[0];
        const maxTime = times[times.length - 1];
        const avgTime = times.reduce((sum, val) => sum + val, 0) / times.length;
        const medTime = times[Math.floor(times.length / 2)];

        benchmarkResults.push({
            method,
            success,
            result: finalResult,
            metrics: {
                min: minTime,
                max: maxTime,
                average: avgTime,
                median: medTime,
                raw: times
            }
        });
    });

    return {
        id: `lab_benchmark_${generateId()}`,
        timestamp: new Date().toISOString(),
        category,
        experimentType: 'Benchmark',
        methodsTested: methods,
        baseConfiguration: baseInput,
        repetitions,
        warmupRuns,
        results: benchmarkResults
    };
};
