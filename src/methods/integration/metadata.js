export const integrationMetadata = {
    trapezoidal: {
        id: 'trapezoidal',
        name: 'Trapezoidal Rule',
        category: 'Numerical Integration',
        formula: 'h/2 * [f(x₀) + 2f(x₁) + 2f(x₂) + ... + 2f(xₙ₋₁) + f(xₙ)] where h = (b-a)/n',
        requirements: 'n must be a positive integer (≥ 1).',
        intervalConditions: 'Supports any finite interval [a, b], including reversed intervals (a > b).',
        advantages: 'Simple to understand and implement. Evaluates well for linear bounds.',
        limitations: 'Less accurate than Simpson\'s rules for non-linear curves without a significant number of subintervals.',
        accuracyNotes: 'Global error is proportional to h².'
    },
    simpson13: {
        id: 'simpson13',
        name: "Simpson's 1/3 Rule",
        category: 'Numerical Integration',
        formula: 'h/3 * [f(x₀) + 4f(x₁) + 2f(x₂) + 4f(x₃) + ... + 2f(xₙ₋₂) + 4f(xₙ₋₁) + f(xₙ)]',
        requirements: 'n must be a positive EVEN integer (n % 2 === 0).',
        intervalConditions: 'Supports finite boundaries. Reversing bounds safely returns negative counterparts.',
        advantages: 'Fits parabolas accurately. Yields exact results for polynomials up to degree 3.',
        limitations: 'Requires an even number of subintervals, making it inflexible for arbitrary step sets.',
        accuracyNotes: 'Global error is proportional to h⁴. Highly accurate for sufficiently small h.'
    },
    simpson38: {
        id: 'simpson38',
        name: "Simpson's 3/8 Rule",
        category: 'Numerical Integration',
        formula: '3h/8 * [f(x₀) + 3f(x₁) + 3f(x₂) + 2f(x₃) + ... + 3f(xₙ₋₁) + f(xₙ)]',
        requirements: 'n must be implicitly divisible by 3 (n % 3 === 0).',
        intervalConditions: 'Limits must evaluate to finite numerical constructs.',
        advantages: 'Slightly more accurate trailing error than 1/3 rule. Models cubic curves natively.',
        limitations: 'More complex weighting sequence. Subintervals constrained by modulus 3.',
        accuracyNotes: 'Global error is proportional to h⁴, equivalent in order to 1/3 rule but with a slightly wider coefficient constraint.'
    }
};

export default integrationMetadata;
