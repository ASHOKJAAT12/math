export const quizBank = [
    {
        id: 'q1',
        topic: 'RootFinding',
        question: 'Which method unconditionally guarantees convergence if the initial bracket strictly contains a single root?',
        options: ['Newton-Raphson', 'Secant', 'Bisection', 'All of the above'],
        correctAnswer: 2,
        explanation: 'Bisection strictly bounds the root and halves the interval natively, guaranteeing eventual location.'
    },
    {
        id: 'q2',
        topic: 'Integration',
        question: 'Simpson\'s 3/8 Rule REQUIRES that the number of subintervals (n) is:',
        options: ['Even', 'Divisible by 3', 'Divisible by 4', 'Any positive integer'],
        correctAnswer: 1,
        explanation: 'Each cubic block fitted by Simpson\'s 3/8 covers exactly 3 intervals, meaning whole arrays must be divisible by 3.'
    },
    {
        id: 'q3',
        topic: 'Differentiation',
        question: 'What makes Central Difference more accurate than Forward Difference across the same standard dataset?',
        options: ['It uses a larger h', 'It inherently structurally cancels the largest first-order truncation error term', 'It uses absolute value brackets', 'It calculates faster'],
        correctAnswer: 1,
        explanation: 'By subtracting geometrically balanced forward and backward Taylor expansions, the largest O(h) truncation variables physically eliminate each other.'
    },
    {
        id: 'q4',
        topic: 'RootFinding',
        question: 'If Newton-Raphson evaluates an f\'(x) of completely exactly 0, what natively occurs mathematically?',
        options: ['The computer divides by zero and the simulation explodes or fails', 'The root is instantly found', 'It falls back to Bisection', 'It skips to the next iteration'],
        correctAnswer: 0,
        explanation: 'Newton-Raphson relies on division by the explicit derivative. If the derivative is zero (horizontal tangent), division by zero stalls the mathematical cycle.'
    },
    {
        id: 'q5',
        topic: 'Errors',
        question: 'True or False: Floating-point Round-Off error is caused entirely by faulty formulas typed into the JS file.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'Round-off error is highly tied to IEEE 754 physical structural limitations representing arbitrary decimals in memory, not necessarily faulty typed equations.'
    }
];
