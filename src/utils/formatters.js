/**
 * Formats a number to prevent excessive decimal digits, while maintaining 
 * precision and using scientific notation for very large/small numbers.
 * 
 * @param {number} num - The number to format
 * @param {number} precision - Max significant digits defaults to 8
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num, precision = 8) => {
    if (num === null || num === undefined || !Number.isFinite(num)) {
        return '---';
    }

    if (num === 0) return '0';

    const absNum = Math.abs(num);

    // Use scientific notation for very large or very small numbers
    if (absNum < 1e-6 || absNum >= 1e9) {
        return num.toExponential(4);
    }

    // Return fixed decimals, stripping unnecessary trailing zeros
    return parseFloat(num.toPrecision(precision)).toString();
};
