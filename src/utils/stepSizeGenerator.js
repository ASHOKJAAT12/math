/**
 * Generates an array of logarithmically spaced step sizes (h).
 * Useful for error-vs-h differentiation analysis.
 * 
 * @param {number} startPower - The starting power of 10 (e.g. -1 for 10^-1 = 0.1)
 * @param {number} endPower - The ending power of 10 (e.g. -6 for 10^-6 = 0.000001)
 * @returns {number[]} Array of step sizes
 */
export const generateLogarithmicStepSizes = (startPower = -1, endPower = -6) => {
    // Validate inputs
    if (typeof startPower !== 'number' || typeof endPower !== 'number') {
        throw new Error('startPower and endPower must be numbers.');
    }

    const step = startPower > endPower ? -1 : 1;
    const hValues = [];

    // Create inclusive list
    let current = startPower;
    while ((step < 0 && current >= endPower) || (step > 0 && current <= endPower)) {
        hValues.push(Math.pow(10, current));
        current += step;
    }

    return hValues;
};

export default generateLogarithmicStepSizes;
