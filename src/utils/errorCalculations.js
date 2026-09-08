/**
 * Calculates generic absolute error between two values.
 */
export const calculateAbsoluteError = (exact, approx) => {
    return Math.abs(exact - approx);
};

/**
 * Calculates generic relative error.
 * Returns null if exact is zero to prevent division by zero.
 */
export const calculateRelativeError = (exact, approx) => {
    if (exact === 0) return null;
    return Math.abs(exact - approx) / Math.abs(exact);
};

/**
 * Calculates generic percentage error.
 */
export const calculatePercentageError = (exact, approx) => {
    const relative = calculateRelativeError(exact, approx);
    if (relative === null) return null;
    return relative * 100;
};

/**
 * Specifically calculates the iteration error (Absolute difference between latest two approximations)
 */
export const calculateIterationError = (currentApprox, previousApprox) => {
    return Math.abs(currentApprox - previousApprox);
};
