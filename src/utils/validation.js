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
