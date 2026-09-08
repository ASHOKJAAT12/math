import { describe, it, expect } from 'vitest';
import { trapezoidal, simpson13, simpson38 } from '../src/methods/integration/index.js';
import { createEvaluator } from '../src/utils/evaluator.js';

describe('Numerical Integration Methods', () => {

    const fQuad = createEvaluator('x^2');
    const fConst = createEvaluator('5');
    const fLinear = createEvaluator('x');
    const fPoly = createEvaluator('x^2 + 2*x + 1');
    const fTrig = createEvaluator('sin(x)');
    const fSqrt = createEvaluator('sqrt(x)');

    describe('Trapezoidal Rule', () => {
        it('calculates the integral of x^2 from 0 to 1', () => {
            const result = trapezoidal(fQuad, 0, 1, 100);
            expect(result.converged).toBe(true);
            expect(result.result).toBeCloseTo(1 / 3, 3);
        });

        it('handles n=1 correctly', () => {
            const result = trapezoidal(fQuad, 0, 1, 1);
            expect(result.converged).toBe(true);
            expect(result.result).toBe(0.5); // (1-0)*[f(0)/2 + f(1)/2] = 0.5
        });

        it('rejects invalid n inputs', () => {
            const result = trapezoidal(fQuad, 0, 1, 0);
            expect(result.converged).toBe(false);
            expect(result.status).toBe('invalid-input');
        });
    });

    describe('Simpson\'s 1/3 Rule', () => {
        it('calculates the integral of x^2 exactly with varied valid n', () => {
            [2, 4, 10].forEach(n => {
                const result = simpson13(fQuad, 0, 1, n);
                expect(result.converged).toBe(true);
                expect(result.result).toBeCloseTo(1 / 3, 10); // Simpsons is exact for quadratic
            });
        });

        it('rejects odd number of subintervals (n=7, n=1)', () => {
            [1, 7, 9].forEach(n => {
                const result = simpson13(fQuad, 0, 1, n);
                expect(result.converged).toBe(false);
                expect(result.status).toBe('invalid-input');
            });
        });
    });

    describe('Simpson\'s 3/8 Rule', () => {
        it('calculates the integral of x^2 exactly with varied valid n', () => {
            [3, 6, 9].forEach(n => {
                const result = simpson38(fQuad, 0, 1, n);
                expect(result.converged).toBe(true);
                expect(result.result).toBeCloseTo(1 / 3, 10);
            });
        });

        it('rejects subintervals not divisible by 3 (n=2, n=8)', () => {
            [2, 8, 10].forEach(n => {
                const result = simpson38(fQuad, 0, 1, n);
                expect(result.converged).toBe(false);
                expect(result.status).toBe('invalid-input');
            });
        });
    });

    describe('General Exact Calculations across all methods', () => {
        it('integrates constant functions (f(x) = 5 from 0 to 10 is 50)', () => {
            expect(trapezoidal(fConst, 0, 10, 10).result).toBeCloseTo(50, 6);
            expect(simpson13(fConst, 0, 10, 10).result).toBeCloseTo(50, 6);
            expect(simpson38(fConst, 0, 10, 12).result).toBeCloseTo(50, 6);
        });

        it('integrates linear functions (f(x) = x from 0 to 2 is 2)', () => {
            expect(trapezoidal(fLinear, 0, 2, 10).result).toBeCloseTo(2, 10);
            expect(simpson13(fLinear, 0, 2, 10).result).toBeCloseTo(2, 10);
            expect(simpson38(fLinear, 0, 2, 9).result).toBeCloseTo(2, 10);
        });

        it('integrates polynomial x^2 + 2x + 1 from 0 to 2 is 26/3', () => {
            const expected = (8 / 3) + 4 + 2; // 8.666...
            expect(trapezoidal(fPoly, 0, 2, 1000).result).toBeCloseTo(expected, 4);
            expect(simpson13(fPoly, 0, 2, 8).result).toBeCloseTo(expected, 10);
            expect(simpson38(fPoly, 0, 2, 9).result).toBeCloseTo(expected, 10);
        });

        it('integrates trigonometric sin(x) from 0 to PI is 2', () => {
            const pi = Math.PI;
            expect(trapezoidal(fTrig, 0, pi, 1000).result).toBeCloseTo(2, 5);
            expect(simpson13(fTrig, 0, pi, 100).result).toBeCloseTo(2, 7);
            expect(simpson38(fTrig, 0, pi, 120).result).toBeCloseTo(2, 7);
        });
    });

    describe('Edge Cases and Numerical Robustness', () => {
        it('handles zero-length intervals seamlessly evaluating to 0', () => {
            [trapezoidal, simpson13, simpson38].forEach(method => {
                // Supply a valid n for method constraints
                const n = method === simpson38 ? 3 : 2;
                const result = method(fQuad, 2, 2, n);
                expect(result.result).toBe(0);
                expect(result.status).toBe('converged');
            });
        });

        it('preserves mathematical sign when limits are reversed (1 to 0)', () => {
            // Trapezoidal
            const tResult = trapezoidal(fQuad, 1, 0, 10);
            expect(tResult.result).toBeCloseTo(-1 / 3, 2);
            // Simpson 1/3
            const s13Result = simpson13(fQuad, 1, 0, 10);
            expect(s13Result.result).toBeCloseTo(-1 / 3, 10);
            // Simpson 3/8
            const s38Result = simpson38(fQuad, 1, 0, 12);
            expect(s38Result.result).toBeCloseTo(-1 / 3, 10);
        });

        it('detects domain failures triggering non-finite results safely', () => {
            // sqrt(x) on [-1, 1], sqrt(-1) evaluates to NaN in standard Javascript math
            const result = trapezoidal(fSqrt, -1, 1, 10);
            expect(result.converged).toBe(false);
            expect(result.status).toBe('numerical-failure');
            expect(result.message).toContain('non-finite');
        });

        it('calculates explicit errors identically when optional exactValue is provided', () => {
            const result = simpson13(fQuad, 0, 1, 2, 1 / 3); // EXACT is 1/3
            expect(result.absoluteError).toBeDefined();
            expect(result.relativeError).toBeDefined();
            expect(result.percentageError).toBeDefined();
            // Since Simpson 1/3 is EXACT for quadratic, error is effectively 0
            expect(result.absoluteError).toBeCloseTo(0, 10);
        });

        it('returns proper structured payload preventing arbitrary DOM crashes', () => {
            const result = trapezoidal(fLinear, 0, 1, 2, 0.5);
            expect(result).toHaveProperty('executionTime');
            expect(result).toHaveProperty('steps');
            expect(result.steps.length).toBeGreaterThan(0);
        });
    });
});
