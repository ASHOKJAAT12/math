import { Parser } from 'expr-eval';

/**
 * Creates a safe math evaluator for a given expression string.
 * @param {string} expression - The math expression (e.g., 'x^3 - x - 2')
 * @returns {function} A function that takes 'x' and returns the evaluated number.
 * @throws {Error} If the expression is invalid.
 */
export const createEvaluator = (expression) => {
    if (!expression || typeof expression !== 'string' || expression.trim() === '') {
        throw new Error('Valid mathematical expression is required.');
    }

    try {
        const parser = new Parser();
        const expr = parser.parse(expression);

        return (x) => {
            const result = expr.evaluate({ x });
            if (!Number.isFinite(result)) {
                throw new Error('Evaluation resulted in a non-finite value.');
            }
            return result;
        };
    } catch (error) {
        throw new Error(`Failed to parse expression: ${error.message}`);
    }
};
