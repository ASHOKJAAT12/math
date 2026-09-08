export const diffMetadata = {
    forward: {
        id: 'forward',
        name: 'Forward Difference',
        description: 'Approximates the derivative using the function value at a point and a point slightly ahead.',
        formula: "f'(x) ≈ [f(x + h) - f(x)] / h",
        requiredPoints: ['x', 'x+h'],
        advantages: 'Simple to implement; requires only two function evaluations. Useful when function is only defined for x ≥ x_0.',
        limitations: 'First-order accurate (truncation error is proportional to h). Less accurate than central difference.',
        accuracy: 'O(h)'
    },
    backward: {
        id: 'backward',
        name: 'Backward Difference',
        description: 'Approximates the derivative using the function value at a point and a point slightly behind.',
        formula: "f'(x) ≈ [f(x) - f(x - h)] / h",
        requiredPoints: ['x', 'x-h'],
        advantages: 'Useful when the function is only defined for x ≤ x_0 (e.g. historical data processing).',
        limitations: 'First-order accurate (truncation error proportional to h). Assumes backwards continuity.',
        accuracy: 'O(h)'
    },
    central: {
        id: 'central',
        name: 'Central Difference',
        description: 'Approximates the derivative using function values slightly ahead and slightly behind the target point.',
        formula: "f'(x) ≈ [f(x + h) - f(x - h)] / (2h)",
        requiredPoints: ['x-h', 'x+h'],
        advantages: 'Second-order accurate; significantly more accurate than forward/backward differences for the same step size h.',
        limitations: 'Requires function to be defined on both sides of x. Susceptible to floating point cancellation for extremely small h.',
        accuracy: 'O(h²)'
    }
};

export default diffMetadata;
