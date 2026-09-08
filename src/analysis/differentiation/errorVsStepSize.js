import { forwardDifference, backwardDifference, centralDifference } from '../../methods/differentiation/index.js';

/**
 * Executes a step-size analysis running Forward, Backward, and Central Difference routines
 * across an array of 'h' bounds to construct analytical error-chart mappings.
 *
 * @param {Function} f - function taking x and returning a number
 * @param {number} x - Target evaluation point
 * @param {number[]} hValues - Array of strictly positive numbers representing step sizes
 * @param {number|null} exactDerivative - Known exact derivative for absoluteError plotting
 * @returns {Array} Structured analysis dataset mapped optimally for presentation/charting layers
 */
export const analyzeStepSizes = (f, x, hValues, exactDerivative = null) => {
    if (!Array.isArray(hValues)) {
        throw new Error('hValues must be an array of numbers representing step sizes.');
    }

    const dataset = [];

    for (let h of hValues) {
        let fwd = forwardDifference(f, x, h, exactDerivative);
        let bwd = backwardDifference(f, x, h, exactDerivative);
        let cen = centralDifference(f, x, h, exactDerivative);

        const row = {
            h,
            // Forward Data
            forwardDerivative: fwd.result,
            forwardError: fwd.absoluteError !== null && fwd.absoluteError > 0 ? fwd.absoluteError : null,
            forwardExecutionTime: fwd.executionTime,
            forwardStatus: fwd.status,
            // Backward Data
            backwardDerivative: bwd.result,
            backwardError: bwd.absoluteError !== null && bwd.absoluteError > 0 ? bwd.absoluteError : null,
            backwardExecutionTime: bwd.executionTime,
            backwardStatus: bwd.status,
            // Central Data
            centralDerivative: cen.result,
            centralError: cen.absoluteError !== null && cen.absoluteError > 0 ? cen.absoluteError : null,
            centralExecutionTime: cen.executionTime,
            centralStatus: cen.status
        };

        dataset.push(row);
    }

    return dataset;
};

export default analyzeStepSizes;
