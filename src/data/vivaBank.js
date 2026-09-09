export const vivaBank = [
    // root finding
    {
        id: 'r1',
        category: 'Root Finding',
        difficulty: 'Beginner',
        question: 'What is the Bisection Method mathematically?',
        answer: 'It is a bracketing numerical method that repeatedly halves an interval [a, b] containing a root (where f(a) and f(b) have opposite signs) until the interval length approaches the desired error tolerance.',
        keyPoints: ['Bracketing method', 'Opposite signs', 'Halving the interval']
    },
    {
        id: 'r2',
        category: 'Root Finding',
        difficulty: 'Intermediate',
        question: 'Why must f(a) and f(b) have opposite signs for Bisection?',
        answer: 'According to Bolzano\'s Theorem (Intermediate Value Theorem), if a continuous function has opposite signs at points a and b, it must cross the x-axis at least once within that interval, guaranteeing the existence of a root.',
        keyPoints: ['Intermediate Value Theorem', 'Guarantees a root']
    },
    {
        id: 'r3',
        category: 'Root Finding',
        difficulty: 'Advanced',
        question: 'Why can Newton-Raphson converge rapidly but still fail for some initial guesses?',
        answer: 'Newton-Raphson depends on tangent lines (local derivatives). If you guess a point where the curve is highly horizontal (derivative approaches 0), the tangent line projects the next guess out to infinity, causing explosive divergence.',
        keyPoints: ['Relies on derivatives', 'Horizontal tangents cause divergence', 'Local convergence only']
    },
    {
        id: 'r4',
        category: 'Root Finding',
        difficulty: 'Beginner',
        question: 'What makes the Secant method different from Newton-Raphson?',
        answer: 'Secant does not require the exact formula for the derivative. It approximates the tangent geometry using a secant line connecting two previous points geometrically.',
        keyPoints: ['No analytical derivative needed', 'Uses two past points']
    },

    // integration
    {
        id: 'i1',
        category: 'Integration',
        difficulty: 'Beginner',
        question: 'What is the Trapezoidal Rule fundamentally doing?',
        answer: 'It is breaking the area under a curve into a series of literal trapezoids and summing their areas to approximate the total definite integral.',
        keyPoints: ['Linear approximations', 'Sum of trapezoid areas']
    },
    {
        id: 'i2',
        category: 'Intermediate',
        difficulty: 'Intermediate',
        question: 'Why does Simpson\'s 1/3 Rule require an EVEN number of subintervals (n)?',
        answer: 'The structural premise of Simpson\'s 1/3 relies on fitting a single parabola across three points (which spans exactly two subintervals). Thus, the total array of subintervals must be completely divisible by 2.',
        keyPoints: ['Fits parabolas across 3 points', 'Spans 2 intervals per block']
    },

    // differentiation
    {
        id: 'd1',
        category: 'Differentiation',
        difficulty: 'Beginner',
        question: 'What is "h" in Numerical Differentiation?',
        answer: 'It represents the step size or physical distance between the discrete x-values being evaluated along the function curve.',
        keyPoints: ['Step size', 'Distance between samples']
    },
    {
        id: 'd2',
        category: 'Differentiation',
        difficulty: 'Advanced',
        question: 'Wait: If a smaller "h" reduces truncation error, why shouldn\'t I set h = 0.000000000000001 to get the perfect derivative?',
        answer: 'Because of Floaing-Point Round-Off Error. Computers hold numbers natively in IEEE 754 precision. If h is incredibly small, subtracting f(x+h) from f(x) causes catastrophic subtraction cancellation at the furthest decimal limits, radically blowing up the error output.',
        keyPoints: ['Round-off error', 'Catastrophic cancellation', 'Optimal h balance']
    },

    // error
    {
        id: 'e1',
        category: 'Error Analysis',
        difficulty: 'Intermediate',
        question: 'What is the difference between Truncation Error and Round-Off Error?',
        answer: 'Truncation Error is caused by mathematical approximation logic (like stopping a Taylor Series). Round-Off error is the physical computer science limitation of natively storing irrational decimal arrays in limited ram memory.',
        keyPoints: ['Truncation = Math approximation limit', 'Round-off = Physical computer storage limit']
    }
];
