import { describe, it, expect } from 'vitest';
import { bisection, regulaFalsi, newtonRaphson, secant } from '../src/methods/rootFinding/index.js';
import { createEvaluator } from '../src/utils/evaluator.js';

const tolerance = 1e-4;
const maxIterations = 50;

describe('Root Finding Engine Tests', () => {

    describe('createEvaluator', () => {
        it('evaluates valid expressions correctly', () => {
            const f = createEvaluator('x^3 - x - 2');
            expect(f(2)).toBe(4);
            expect(f(1)).toBe(-2);
        });

        it('throws error for invalid expressions', () => {
            expect(() => createEvaluator('x^^3')).toThrow();
        });
    });

    describe('Bisection Method', () => {
        it('solves x^3 - x - 2 correctly', () => {
            const f = createEvaluator('x^3 - x - 2');
            const res = bisection(f, 1, 2, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(Math.abs(res.root - 1.5213797)).toBeLessThan(tolerance);
            expect(res.steps.length).toBeGreaterThan(0);
        });

        it('identifies exact root provided as bound', () => {
            const f = createEvaluator('x^2 - 4');
            const res = bisection(f, 2, 4, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(res.root).toBe(2);
            expect(res.iterations).toBe(0);
        });

        it('rejects invalid bracket interval', () => {
            const f = createEvaluator('x^2 + 1'); // No real roots, positive everywhere
            const res = bisection(f, -1, 1, tolerance, maxIterations);
            expect(res.converged).toBe(false);
            expect(res.message).toMatch(/bracket/);
        });
    });

    describe('Regula Falsi Method', () => {
        it('solves x^3 - x - 2 correctly', () => {
            const f = createEvaluator('x^3 - x - 2');
            const res = regulaFalsi(f, 1, 2, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(Math.abs(res.root - 1.5213797)).toBeLessThan(tolerance);
        });

        it('handles function that does not cross axis correctly with bracket error', () => {
            const f = createEvaluator('x^2 + 1');
            const res = regulaFalsi(f, -1, 1, tolerance, maxIterations);
            expect(res.converged).toBe(false);
        });
    });

    describe('Newton-Raphson Method', () => {
        it('solves x^3 - x - 2 using finite difference fallback', () => {
            const f = createEvaluator('x^3 - x - 2');
            // passing null for the derivative forces the fallback
            const res = newtonRaphson(f, null, 1.5, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(Math.abs(res.root - 1.5213797)).toBeLessThan(tolerance);
        });

        it('solves x^3 - x - 2 using provided exact derivative', () => {
            const f = createEvaluator('x^3 - x - 2');
            const df = createEvaluator('3 * x^2 - 1');
            const res = newtonRaphson(f, df, 1.5, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(Math.abs(res.root - 1.5213797)).toBeLessThan(tolerance);
        });

        it('aborts on zero derivative', () => {
            // f(x) = x^2, df = 2x, at x=0, string is zero.
            const f = createEvaluator('x^2 - 4');
            const df = createEvaluator('2*x');
            const res = newtonRaphson(f, df, 0, tolerance, maxIterations);
            expect(res.converged).toBe(false);
            expect(res.message).toMatch(/zero/i);
        });
    });

    describe('Secant Method', () => {
        it('solves x^3 - x - 2 correctly', () => {
            const f = createEvaluator('x^3 - x - 2');
            const res = secant(f, 1, 2, tolerance, maxIterations);
            expect(res.converged).toBe(true);
            expect(Math.abs(res.root - 1.5213797)).toBeLessThan(tolerance);
        });

        it('aborts if initial guesses are identical', () => {
            const f = createEvaluator('x^3 - x - 2');
            const res = secant(f, 1, 1, tolerance, maxIterations);
            expect(res.converged).toBe(false);
            expect(res.message).toMatch(/distinctly different/i);
        });

        it('gracefully handles non-converging setups', () => {
            // trying to find x^2 + 1 = 0
            const f = createEvaluator('x^2 + 1');
            const res = secant(f, -5, 5, tolerance, maxIterations);
            expect(res.converged).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        it('gracefully handles NaN returns by stopping iteration safely', () => {
            // if we feed negative number into sqrt()
            const f = createEvaluator('sqrt(x)');
            // Using Newton with initial guess going negative... 
            // fallback derivative f'(x) near 0 will push it negative
            const df = createEvaluator('1/(2*sqrt(x))');
            // Start far out, let's force something negative manually

            const badF = (x) => Math.sqrt(x - 5);
            const dfBadRes = newtonRaphson(badF, null, 1, tolerance, maxIterations); // 1-5 is negative -> NaN

            expect(dfBadRes.converged).toBe(false);
            expect(dfBadRes.message).toMatch(/Numerical Failure/i);
        });
    });
});
