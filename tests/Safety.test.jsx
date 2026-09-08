import { describe, it, expect } from 'vitest';
import bisectionRunner from '../src/methods/rootFinding/bisection.js';
import secantRunner from '../src/methods/rootFinding/secant.js';
import trapezoidalRunner from '../src/methods/integration/trapezoidal.js';
import forwardDifferenceRunner from '../src/methods/differentiation/forwardDifference.js';
import { createEvaluator } from '../src/utils/evaluator.js';

describe('Phase 11: Global Numerical Engine Safety & Validation Audit', () => {

    describe('Math Parser Safety (`expr-eval`)', () => {
        it('throws appropriately on invalid expressions instead of executing arbitrary JavaScript', () => {
            expect(() => createEvaluator('x + * 2')).toThrow('Failed to parse expression');
            expect(() => createEvaluator('')).toThrow('Valid mathematical expression is required.');
        });
    });

    describe('Root Finding Bisection Safety', () => {
        it('handles non-finite limits mathematically gracefully', () => {
            const f = (x) => x * x - 4;
            const res = bisectionRunner(f, -Infinity, 2, 0.001, 100);
            expect(res.converged).toBe(false);
            expect(res.message).toContain('non-finite values');
        });

        it('returns exact endpoints gracefully before iterations', () => {
            const f = (x) => x - 2;
            const res = bisectionRunner(f, 2, 10, 0.001, 100);
            expect(res.converged).toBe(true);
            expect(res.root).toBe(2);
            expect(res.message).toContain('Lower bound is an exact root');
        });
    });

    describe('Root Finding Secant Safety', () => {
        it('detects identically equivalent initial seeds natively avoiding division by zero', () => {
            const f = (x) => x * x - 4;
            const res = secantRunner(f, 2, 2, 0.001, 100);
            expect(res.converged).toBe(false);
            expect(res.message).toContain('distinctly different');
        });
    });

    describe('Integration Trapezoidal Safety', () => {
        it('blocks astronomically large intervals natively protecting arrays', () => {
            const f = (x) => x;
            const res = trapezoidalRunner(f, 0, 10, 2000000);
            expect(res.status).toBe('invalid-input');
            expect(res.message).toContain('must not exceed 1,000,000');
        });

        it('handles exact identically equivalent arrays returning 0 cleanly', () => {
            const f = (x) => x;
            const res = trapezoidalRunner(f, 5, 5, 20);
            expect(res.result).toBe(0);
            expect(res.status).toBe('converged');
        });
    });

    describe('Differentiation Forward Safety', () => {
        it('catches strictly non-positive step sizes actively mapping constraints cleanly', () => {
            const f = (x) => x;
            const res = forwardDifferenceRunner(f, 2, -1);
            expect(res.status).toBe('invalid-input');
            expect(res.message).toContain('positive number');
        });

        it('validates strictly finite mathematical domains smoothly terminating faults correctly', () => {
            const f = (x) => x;
            const res = forwardDifferenceRunner(f, Infinity, 0.1);
            expect(res.status).toBe('invalid-input');
            expect(res.message).toContain('finite number');
        });
    });
});
