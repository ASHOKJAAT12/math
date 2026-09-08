export const integrationPresets = [
    {
        name: 'Polynomial: x²',
        func: 'x^2',
        lowerBound: '0',
        upperBound: '1',
        n: '6',
        exactValue: '0.3333333333333333'
    },
    {
        name: 'Polynomial: x³ + 2x + 1',
        func: 'x^3 + 2*x + 1',
        lowerBound: '0',
        upperBound: '2',
        n: '6',
        exactValue: '10'
    },
    {
        name: 'Trigonometric: sin(x)',
        func: 'sin(x)',
        lowerBound: '0',
        upperBound: '3.141592653589793',
        n: '12',
        exactValue: '2'
    },
    {
        name: 'Inverse Quadratic: 1/(1+x²)',
        func: '1/(1+x^2)',
        lowerBound: '0',
        upperBound: '1',
        n: '12',
        exactValue: '0.7853981633974483' // Pi / 4
    },
    {
        name: 'Constant Function: 5',
        func: '5',
        lowerBound: '0',
        upperBound: '10',
        n: '6',
        exactValue: '50'
    }
];

export default integrationPresets;
