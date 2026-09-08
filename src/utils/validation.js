/**
 * Foundation for validation rules for numerical inputs.
 * These will be expanded in later phases.
 */

export const isNotEmpty = (value) => {
    return value !== undefined && value !== null && value !== '';
};

export const isNumeric = (value) => {
    if (!isNotEmpty(value)) return false;
    return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isValidInterval = (lower, upper) => {
    if (!isNumeric(lower) || !isNumeric(upper)) return false;
    return parseFloat(lower) < parseFloat(upper);
};

export const isValidTolerance = (tol) => {
    if (!isNumeric(tol)) return false;
    const num = parseFloat(tol);
    return num > 0 && num < 1;
};

export const isValidIterationCount = (count) => {
    if (!isNumeric(count)) return false;
    const num = parseInt(count, 10);
    return num > 0 && num <= 10000;
};

/**
 * Validates a bracketing interval for methods like Bisection and Regula Falsi.
 * @returns {object} { isValid: boolean, message: string }
 */
export const validateBracket = (fA, fB) => {
    if (!Number.isFinite(fA) || !Number.isFinite(fB)) {
        return { isValid: false, message: 'Interval boundaries evaluate to non-finite values.' };
    }
    if (fA === 0 || fB === 0) {
        return { isValid: true, message: 'An interval endpoint is already an exact root.' };
    }
    if (fA * fB > 0) {
        return { isValid: false, message: 'The interval does not bracket a root (f(a) and f(b) have the same sign).' };
    }
    return { isValid: true, message: 'Valid bracket.' };
};
