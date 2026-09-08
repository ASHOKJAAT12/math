export const rootFindingPresets = [
    {
        name: 'Polynomial: x³ - x - 2',
        func: 'x^3 - x - 2',
        deriv: '3*x^2 - 1',
        lowerBound: '1',
        upperBound: '2',
        initialGuess: '1.5',
        secondGuess: '2',
        tolerance: '1e-6',
        maxIterations: '50'
    },
    {
        name: 'Simple Quadratic: x² - 4',
        func: 'x^2 - 4',
        deriv: '2*x',
        lowerBound: '0',
        upperBound: '3',
        initialGuess: '1',
        secondGuess: '3',
        tolerance: '1e-6',
        maxIterations: '50'
    },
    {
        name: 'Transcendental: cos(x) - x',
        func: 'cos(x) - x',
        deriv: '-sin(x) - 1',
        lowerBound: '0.5',
        upperBound: '1.5',
        initialGuess: '0.5',
        secondGuess: '1.0',
        tolerance: '1e-6',
        maxIterations: '50'
    },
    {
        name: 'Exponential: e^x - 3',
        func: 'exp(x) - 3',
        deriv: 'exp(x)',
        lowerBound: '0',
        upperBound: '2',
        initialGuess: '1',
        secondGuess: '1.5',
        tolerance: '1e-6',
        maxIterations: '50'
    }
];
