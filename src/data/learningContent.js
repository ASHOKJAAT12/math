export const learningContent = {
    // Method configurations
    methods: {
        'bisection': {
            id: 'bisection',
            title: 'Bisection Method',
            category: 'Root Finding',
            purpose: 'To unconditionally find the root of a continuous function given an interval where the sign changes.',
            formula: 'c = (a + b) / 2',
            inputs: ['Function f(x)', 'Lower bound (a)', 'Upper bound (b)', 'Tolerance'],
            requirements: ['The function must be continuous.', 'f(a) and f(b) must have opposite signs.'],
            algorithmSteps: [
                'Check if f(a) * f(b) < 0. If not, the method cannot proceed.',
                'Calculate midpoint c = (a + b) / 2.',
                'Evaluate f(c). If f(c) == 0 or error < tolerance, c is the root.',
                'If f(a) * f(c) < 0, the root is between a and c. Set b = c.',
                'Else, the root is between c and b. Set a = c.',
                'Repeat until convergence.'
            ],
            advantages: ['Guaranteed to converge if the initial bracket is valid.', 'Simple to implement.'],
            limitations: ['Slow linear convergence.', 'Cannot find roots where the function touches the axis without crossing (e.g. x^2 = 0).'],
            mistakes: [
                'Using an interval where f(a) and f(b) possess the same sign.',
                'Miscalculating the relative iteration error.',
                'Setting maximum iterations too low for the required tolerance.'
            ],
            useCases: 'Useful when a trustworthy interval is known and when reliability is prioritized over speed.',
            exampleObj: {
                method: 'Bisection',
                func: 'x^3 - x - 2',
                a: 1,
                b: 2,
                tolerance: 0.1
            }
        },
        'regula-falsi': {
            id: 'regula-falsi',
            title: 'Regula Falsi Method',
            category: 'Root Finding',
            purpose: 'To find a root within a bracket by interpolating a straight line between the interval bounds.',
            formula: 'c = (a * f(b) - b * f(a)) / (f(b) - f(a))',
            inputs: ['Function f(x)', 'Lower bound (a)', 'Upper bound (b)', 'Tolerance'],
            requirements: ['The function must be continuous.', 'f(a) and f(b) must have opposite signs.'],
            algorithmSteps: [
                'Check if f(a) * f(b) < 0.',
                'Calculate the false position: c = (a * f(b) - b * f(a)) / (f(b) - f(a)).',
                'Evaluate f(c). If f(c) meets tolerance, c is the root.',
                'If f(a) * f(c) < 0, set b = c. Else set a = c.',
                'Repeat until convergence.'
            ],
            advantages: ['Generally faster than Bisection for smooth curves.', 'Guaranteed to bracket the root.'],
            limitations: ['Can stall heavily on functions with significant convexity (e.g., sticking to one side).'],
            mistakes: [
                'Assuming Regula Falsi is ALWAYS faster than Bisection (it is extremely slow on certain convex curves).'
            ],
            useCases: 'Useful when you want bounded bracketing security but potentially faster convergence than simple halving.',
            exampleObj: {
                method: 'Regula Falsi',
                func: 'x^3 - x - 2',
                a: 1,
                b: 2,
                tolerance: 0.1
            }
        },
        'newton-raphson': {
            id: 'newton-raphson',
            title: 'Newton-Raphson Method',
            category: 'Root Finding',
            purpose: 'To rapidly find a root using the analytical derivative and tangent lines.',
            formula: 'x_{n+1} = x_n - f(x_n) / f\'(x_n)',
            inputs: ['Function f(x)', 'Derivative f\'(x)', 'Initial guess x_0', 'Tolerance'],
            requirements: ['Function must be differentiable.', 'f\'(x) must not be zero at any evaluated point.'],
            algorithmSteps: [
                'Start at initial guess x0.',
                'Evaluate f(x0) and f\'(x0).',
                'If f\'(x0) == 0, abort (division by zero).',
                'Calculate next point: x1 = x0 - (f(x0)/f\'(x0)).',
                'Calculate error. If error < tolerance, terminate.',
                'Set x0 = x1 and repeat.'
            ],
            advantages: ['Extremely rapid quadratic convergence near the root.'],
            limitations: [
                'Can diverge completely if the initial guess is poor.',
                'Fails immediately if the derivative evaluates to zero.',
                'Requires an analytically determinable derivative formula.'
            ],
            mistakes: [
                'Providing an initial guess exactly at a local minimum/maximum.',
                'Providing the wrong mathematical formula for the derivative.',
                'Assuming global convergence.'
            ],
            useCases: 'Useful when a very good initial guess is known and an explicit derivative is easily codable.',
            exampleObj: {
                method: 'Newton-Raphson',
                func: 'x^3 - x - 2',
                guess: 1.5,
                tolerance: 0.1
            }
        },
        'secant': {
            id: 'secant',
            title: 'Secant Method',
            category: 'Root Finding',
            purpose: 'To find a root with superlinear speed without providing an explicit analytical derivative.',
            formula: 'x_{n+1} = x_n - f(x_n) * ((x_n - x_{n-1}) / (f(x_n) - f(x_{n-1})))',
            inputs: ['Function f(x)', 'Two Initial Guesses (x0, x1)', 'Tolerance'],
            requirements: ['Two distinct initial guesses.'],
            algorithmSteps: [
                'Evaluate f(x0) and f(x1).',
                'If they are identical, abort (division by zero).',
                'Calculate the next point by projecting the secant line intersecting the x-axis.',
                'Calculate error.',
                'Set x0 = x1 and x1 = new_point. Repeat.'
            ],
            advantages: [
                'Superlinear convergence (faster than linear, slightly slower than quadratic).',
                'Does NOT require an analytical derivative formula.'
            ],
            limitations: [
                'Not strictly bracketed, so it can diverge.',
                'Fails if f(x_n) == f(x_{n-1}) (secant line becomes horizontal).'
            ],
            mistakes: [
                'Choosing two initial guesses too far apart causing wild divergence.',
                'Choosing initial guesses where f(x0) = f(x1).'
            ],
            useCases: 'Useful when evaluating the explicitly written derivative is mathematically inconvenient or excessively computationally expensive.',
            exampleObj: {
                method: 'Secant',
                func: 'x^3 - x - 2',
                x0: 1,
                x1: 2,
                tolerance: 0.1
            }
        },
        'trapezoidal': {
            id: 'trapezoidal',
            title: 'Trapezoidal Rule',
            category: 'Integration',
            purpose: 'To approximate a definite integral by splitting the area into multiple trapezoids.',
            formula: 'I ≈ (h/2) * [ f(a) + 2*Σf(x_i) + f(b) ]',
            inputs: ['Function f(x)', 'Lower bound (a)', 'Upper bound (b)', 'Subintervals (n)'],
            requirements: ['n must be positive.'],
            algorithmSteps: [
                'Calculate the step size h: (b - a) / n.',
                'Evaluate f(a) and f(b) and multiply them by 1.',
                'Evaluate all interior points f(a + i*h) and multiply them by 2.',
                'Sum components and scale by h/2.'
            ],
            advantages: [
                'Extremely conceptually simple.',
                'Works for literally any positive number of partitions (n).'
            ],
            limitations: [
                'Has high Truncation Error for highly curved polynomials. Effectively models local segments linearly.'
            ],
            mistakes: [
                'Using too few partitions (n) for highly volatile curves.'
            ],
            useCases: 'Useful when standard stability is required and exact polynomial adherence is not critical.',
            exampleObj: {
                method: 'Trapezoidal',
                func: 'x^2',
                a: 0,
                b: 1,
                n: 2
            }
        },
        'simpson-13': {
            id: 'simpson-13',
            title: 'Simpson\'s 1/3 Rule',
            category: 'Integration',
            purpose: 'To approximate a definite integral by fitting local parabolas to groups of three points.',
            formula: 'I ≈ (h/3) * [ f(x_0) + 4*Σf(x_odd) + 2*Σf(x_even) + f(x_n) ]',
            inputs: ['Function f(x)', 'Lower bound (a)', 'Upper bound (b)', 'Subintervals (n)'],
            requirements: ['n MUST be an strictly EVEN integer greater than 0.'],
            algorithmSteps: [
                'Calculate h = (b - a) / n.',
                'Sum endpoints f(a) + f(b).',
                'Add 4 * sum of odd-indexed interior evaluations.',
                'Add 2 * sum of even-indexed interior evaluations.',
                'Scale entire sum by h/3.'
            ],
            advantages: [
                'Exact for polynomials up to degree 3.',
                'Vastly more accurate than Trapezoidal for smooth curved functions.'
            ],
            limitations: [
                'Strictly mathematically invalid arrays if n is an odd number.'
            ],
            mistakes: [
                'Providing n = 3 or n = 5.',
                'Mixing up the 4 (odd) and 2 (even) coefficient groupings.'
            ],
            useCases: 'The primary general-purpose workhorse for numerical integration due to excellent accuracy/cost ratio, provided n is even.',
            exampleObj: {
                method: 'Simpson 1/3',
                func: 'x^2',
                a: 0,
                b: 1,
                n: 2
            }
        },
        'simpson-38': {
            id: 'simpson-38',
            title: 'Simpson\'s 3/8 Rule',
            category: 'Integration',
            purpose: 'To approximate a definite integral by fitting local cubic polynomials across groups of four points.',
            formula: 'I ≈ (3h/8) * [ f(x_0) + 3*Σf(x_{1,2,empty_mod3}) + 2*Σf(x_{mod3}) + f(x_n) ]',
            inputs: ['Function f(x)', 'Lower bound (a)', 'Upper bound (b)', 'Subintervals (n)'],
            requirements: ['n MUST be a multiple of 3 (e.g. 3, 6, 9).'],
            algorithmSteps: [
                'Calculate h = (b - a) / n.',
                'Endpoints get multiplied by 1.',
                'Indices that are multiples of 3 (i=3,6,9...) get multiplied by 2.',
                'All other interior points get multiplied by 3.',
                'Scale the sum by 3h/8.'
            ],
            advantages: [
                'Exact for cubic polynomial boundaries.',
                'Sometimes used as a closing segment if a dataset leaves an odd block at the end of a composite 1/3 evaluation.'
            ],
            limitations: [
                'Strictly requires grouping by mod 3.',
                'Actually slightly less computationally efficient than 1/3 for standard usage.'
            ],
            mistakes: [
                'Attempting to use n=4 or n=5.'
            ],
            useCases: 'Useful specifically when a data array happens to possess partition numbers intrinsically divisible by 3.',
            exampleObj: {
                method: 'Simpson 3/8',
                func: 'x^2',
                a: 0,
                b: 1,
                n: 3
            }
        },
        'forward-diff': {
            id: 'forward-diff',
            title: 'Forward Difference',
            category: 'Differentiation',
            purpose: 'To approximate the first derivative using a positive step size.',
            formula: 'f\'(x) ≈ (f(x + h) - f(x)) / h',
            inputs: ['Function f(x)', 'Evaluation point (x)', 'Step Size (h)'],
            requirements: ['Function is evaluable at x + h.'],
            algorithmSteps: [
                'Evaluate the function exactly at x.',
                'Evaluate the function at x + h (a slight forward jump).',
                'Subtract the former from the latter.',
                'Divide by the geometric step distance h.'
            ],
            advantages: [
                'Can be used when data strictly does not exist before time x (boundary condition).'
            ],
            limitations: [
                'First order accuracy: O(h). Slower accuracy scaling than central difference.'
            ],
            mistakes: [
                'Using a massive h value and expecting perfect tangent alignments.'
            ],
            useCases: 'Required when taking initial bounds of a finite difference array or boundary value problems.',
            exampleObj: {
                method: 'Forward Difference',
                func: 'x^2',
                x: 2,
                h: 0.1
            }
        },
        'backward-diff': {
            id: 'backward-diff',
            title: 'Backward Difference',
            category: 'Differentiation',
            purpose: 'To approximate the first derivative using a negative step sample.',
            formula: 'f\'(x) ≈ (f(x) - f(x - h)) / h',
            inputs: ['Function f(x)', 'Evaluation point (x)', 'Step Size (h)'],
            requirements: ['Function is evaluable at x - h.'],
            algorithmSteps: [
                'Evaluate function at x.',
                'Evaluate function at x - h.',
                'Subtract the backward sample from the central sample.',
                'Divide by h.'
            ],
            advantages: [
                'Can be used at the absolute terminating edge of a dataset.'
            ],
            limitations: [
                'First order accuracy: O(h).'
            ],
            mistakes: [
                'Reversing the numerator subtraction order, thereby flipping the algebraic sign of the derivative.'
            ],
            useCases: 'Required when observing "current" endpoints in real-time signals without looking into the future.',
            exampleObj: {
                method: 'Backward Difference',
                func: 'x^2',
                x: 2,
                h: 0.1
            }
        },
        'central-diff': {
            id: 'central-diff',
            title: 'Central Difference',
            category: 'Differentiation',
            purpose: 'To highly accurately approximate the first derivative by bridging symmetrically across evaluate x.',
            formula: 'f\'(x) ≈ (f(x + h) - f(x - h)) / (2h)',
            inputs: ['Function f(x)', 'Evaluation point (x)', 'Step Size (h)'],
            requirements: ['Function is evaluable at both boundaries (x+h and x-h).'],
            algorithmSteps: [
                'Evaluate function at (x + h).',
                'Evaluate function at (x - h).',
                'Subtract backward sample from forward sample.',
                'Divide by the total bridging width: 2h.'
            ],
            advantages: [
                'Second order accuracy: O(h^2). Structurally cancels out major truncation error elements leading to high precision.'
            ],
            limitations: [
                'Absolutely unusable at boundary edges where dataset boundaries block evaluating x-h or x+h.'
            ],
            mistakes: [
                'Forgetting to divide by 2 * h (using just h creates massive scaling errors).',
                'Lowering h to atomic sizes (1e-15) thinking it provides absolute perfection (triggers catastrophic IEEE 754 subtraction cancellation).'
            ],
            useCases: 'The gold standard for standard numerical differentiation within interior boundaries.',
            exampleObj: {
                method: 'Central Difference',
                func: 'x^2',
                x: 2,
                h: 0.1
            }
        }
    }
};
