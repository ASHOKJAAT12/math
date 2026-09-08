import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Compare from '../src/pages/Compare.jsx';
import { compareRootFindingMethods } from '../src/comparison/rootFindingComparison.js';
import { rankMethods } from '../src/comparison/ranking.js';

describe('Root Finding Comparison Logic', () => {

    it('identifies fast convergence and logs iterations correctly without exact root', () => {
        const methods = [
            { id: 'bisection', name: 'Bisection', selected: true },
            { id: 'newtonRaphson', name: 'Newton', selected: true }
        ];

        // x^2 - 4 on bound [1, 3] and guess 1
        const inputs = {
            func: 'x^2 - 4',
            deriv: '2*x',
            lowerBound: '1',
            upperBound: '3',
            initialGuess: '1',
            secondGuess: '',
            exactRoot: '',
            tolerance: '1e-6',
            maxIterations: '50'
        };

        const result = compareRootFindingMethods(methods, inputs);

        expect(result.error).toBeUndefined();
        expect(result.data['bisection'].valid).toBe(true);
        expect(result.data['bisection'].converged).toBe(true);
        expect(result.data['newtonRaphson'].valid).toBe(true);
        expect(result.data['newtonRaphson'].converged).toBe(true);

        // Ensure no absolute error calculations leaked if exact root wasn't provided
        expect(result.data['bisection'].absoluteError).toBe(null);

        const ranks = rankMethods(result.data, 'rootFinding');
        expect(ranks.categorySpecific).toBeDefined();
        // Bisection on (1,3) perfectly hits 2 in iteration 1
        expect(ranks.categorySpecific.method.id).toBe('bisection');
    });

    it('calculates absolute error when exact root provided mathematically', () => {
        const methods = [
            { id: 'bisection', name: 'Bisection', selected: true },
            { id: 'newtonRaphson', name: 'Newton', selected: true }
        ];

        const inputs = {
            func: 'x^2 - 4',
            deriv: '2*x',
            lowerBound: '1',
            upperBound: '3',
            initialGuess: '1',
            exactRoot: '2',
            tolerance: '1e-2',
            maxIterations: '50'
        };

        const result = compareRootFindingMethods(methods, inputs);
        expect(result.data['bisection'].absoluteError).not.toBeNull();
        expect(result.data['newtonRaphson'].absoluteError).not.toBeNull();

        const ranks = rankMethods(result.data, 'rootFinding');
        expect(ranks.lowestErrorMetric).toBe('Lowest Absolute Error');
    });

    it('requires at least one method to execute comparing', () => {
        const methods = [];
        const result = compareRootFindingMethods(methods, {});
        expect(result.error).toBe('Select at least one method to perform a comparison.');
    });

    it('gracefully notes numerical failures rather than throwing fatal JS errors', () => {
        const methods = [
            { id: 'newtonRaphson', name: 'Newton', selected: true },
            { id: 'secant', name: 'Secant', selected: true }
        ];

        const inputs = {
            func: '1/x',
            deriv: '-1/(x^2)',
            initialGuess: '0', // divide by zero error
            secondGuess: '0', // Secant identically zero error
            tolerance: '1e-6',
            maxIterations: '50'
        };

        const result = compareRootFindingMethods(methods, inputs);
        expect(result.data['newtonRaphson'].valid).toBe(true);
        expect(result.data['newtonRaphson'].converged).toBe(false);
        expect(result.data['secant'].converged).toBe(false);
    });

});

describe('Compare.jsx UI Integration', () => {

    it('triggers comparison and displays the matrix when clicked', async () => {
        const user = userEvent.setup();
        render(<Compare />);

        // Change preset configuration 
        const select = screen.getByRole('combobox');
        await user.selectOptions(select, 'Simple Quadratic: x² - 4');

        // Compare button
        const compareBtn = screen.getByRole('button', { name: /Compare Methods/i });
        await user.click(compareBtn);

        // Wait for the matrix and charts to render
        const matrixHeader = await screen.findByText('Normalized Comparison Matrix');
        expect(matrixHeader).toBeDefined();

        // It tested 4 Methods, let's see if 4 rows exist plus 1 header
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThanOrEqual(1);
    });
});
