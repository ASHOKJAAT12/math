export const differentiationPresets = [
    {
        name: 'Polynomial: x³',
        func: 'x^3',
        x: '2',
        h: '0.01',
        exactDerivative: '3*x^2'
    },
    {
        name: 'Polynomial: x²',
        func: 'x^2',
        x: '3',
        h: '0.01',
        exactDerivative: '2*x'
    },
    {
        name: 'Trigonometric: sin(x)',
        func: 'sin(x)',
        x: '1',
        h: '0.01',
        exactDerivative: 'cos(x)'
    },
    {
        name: 'Exponential: exp(x)',
        func: 'exp(x)',
        x: '0',
        h: '0.01',
        exactDerivative: 'exp(x)'
    }
];
