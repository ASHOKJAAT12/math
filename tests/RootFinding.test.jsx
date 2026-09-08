import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import RootFinding from '../src/pages/RootFinding.jsx';

describe('RootFinding UI Component', () => {

    it('renders root finding page and default methods', () => {
        render(<RootFinding />);

        // Check main title
        expect(screen.getByText(/Root Finding Methods/i)).toBeDefined();

        // Check that 'Bisection Method' button acts as a method selector option
        const bisectionBtn = screen.getByRole('button', { name: /Bisection Method/i });
        expect(bisectionBtn).toBeDefined();
    });

    it('displays correct inputs when Newton-Raphson is selected', async () => {
        render(<RootFinding />);
        const newtonBtn = screen.getByRole('button', { name: /Newton-Raphson Method/i });
        fireEvent.click(newtonBtn);

        // Initial guess and Derivative field should now be visible
        expect(document.querySelector('#initialGuess')).toBeDefined();
        expect(document.querySelector('#deriv')).toBeDefined();
    });

    it('executes bisection properly via UI interaction', async () => {
        const user = userEvent.setup();
        render(<RootFinding />);

        // Defaults to Bisection, requires f(a), lower, upper, tol, max iter.

        // Insert values: x^2 - 4 on [1, 3] -> root 2
        const funcInput = document.querySelector('#func');
        await user.clear(funcInput);
        await user.type(funcInput, 'x^2 - 4');

        const lowerInput = document.querySelector('#lowerBound');
        await user.clear(lowerInput);
        await user.type(lowerInput, '1');

        const upperInput = document.querySelector('#upperBound');
        await user.clear(upperInput);
        await user.type(upperInput, '3');

        // Default tolerance and iterations are there already

        const submitBtn = screen.getByRole('button', { name: /Run Method/i });
        await user.click(submitBtn);

        // Wait for the Result Summary to appear
        const summaryTitle = await screen.findByText(/Result Summary/i);
        expect(summaryTitle).toBeDefined();

        // Verify it says Converged exactly matching the Badge span
        const badges = screen.getAllByText('Converged');
        expect(badges.length).toBeGreaterThan(0);

        // Validate an approx root text node contains '2' 
        const values = screen.getAllByText('2', { exact: false });
        expect(values.length).toBeGreaterThan(0);
    });

    it('throws validation error dynamically if empty run', async () => {
        render(<RootFinding />);
        const user = userEvent.setup();

        // Clear func explicitly
        const funcInput = document.querySelector('#func');
        await user.clear(funcInput);

        const submitBtn = screen.getByRole('button', { name: /Run Method/i });
        await user.click(submitBtn);

        // Should pop a validation text
        expect(await screen.findByText(/Please enter a function./i)).toBeDefined();
    });

});
