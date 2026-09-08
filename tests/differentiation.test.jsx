import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Differentiation from '../src/pages/Differentiation.jsx';
import { ThemeProvider } from '../src/context/ThemeContext.jsx';
import { MemoryRouter } from 'react-router-dom';

describe('Differentiation UI Component', () => {
    // Basic wrapper to provide router and theme context
    const renderWithContext = (component) => {
        return render(
            <MemoryRouter>
                <ThemeProvider>
                    {component}
                </ThemeProvider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        // Mock ResizeObserver for Recharts
        window.ResizeObserver = class {
            observe() { }
            unobserve() { }
            disconnect() { }
        };

        // Mock matchMedia for ThemeProvider
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: (query) => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => { },
                removeListener: () => { },
                addEventListener: () => { },
                removeEventListener: () => { },
                dispatchEvent: () => false,
            }),
        });
    });

    it('renders differentiation page with base numerical containers', () => {
        renderWithContext(<Differentiation />);
        expect(screen.getAllByText('Numerical Differentiation')[0]).toBeDefined();
        expect(screen.getAllByText('Forward Difference')[0]).toBeDefined();
        expect(screen.getAllByText('Central Difference')[0]).toBeDefined();
    });

    it('calculates numerical derivative evaluating central method strictly', async () => {
        renderWithContext(<Differentiation />);
        const user = userEvent.setup();

        fireEvent.click(screen.getAllByText('Central Difference')[0]);

        const presetSelect = screen.getByRole('combobox');
        await user.selectOptions(presetSelect, 'Polynomial: x³');

        await waitFor(() => {
            expect(document.querySelector('#func').value).toBe('x^3');
            expect(document.querySelector('#x').value).toBe('2');
        });

        // Run calculation
        const calcButton = screen.getByText('Calculate Derivative');
        await user.click(calcButton);

        await waitFor(() => {
            // Result 3*(2^2) = 12
            // Since h=0.01, central diff should be ~ 12.0001
            const elements = screen.getAllByText(/12\.0001/);
            expect(elements.length).toBeGreaterThan(0);

            // Error mapped
            expect(screen.getByText('Absolute Error')).toBeDefined();
        });
    });

    it('clears exact error charts structurally resolving Unavailable property successfully', async () => {
        renderWithContext(<Differentiation />);
        const user = userEvent.setup();

        const funcInput = document.querySelector('#func');
        await user.clear(funcInput);
        await user.type(funcInput, 'sin(x)');

        const xInput = document.querySelector('#x');
        await user.clear(xInput);
        await user.type(xInput, '1');

        const hInput = document.querySelector('#h');
        await user.clear(hInput);
        await user.type(hInput, '0.01');

        // Ensure exact deriv is empty
        const exactInput = document.querySelector('#exactDerivative');
        await user.clear(exactInput);

        const calcButton = screen.getByText('Calculate Derivative');
        await user.click(calcButton);

        await waitFor(() => {
            expect(screen.getByText('Exact-error analysis unavailable')).toBeDefined();
        });
    });

    it('executes multi-step size analyzer seamlessly rendering matrix grids naturally avoiding missing limits', async () => {
        // Need to simulate testing multi h sizes
        renderWithContext(<Differentiation />);
        const user = userEvent.setup();

        const presetSelect = screen.getByRole('combobox');
        await user.selectOptions(presetSelect, 'Polynomial: x³'); // Load f(x)=x^3, x=2, h=0.01

        // Use custom h list
        const loadAutoSetButton = screen.getByText('Load Automatic Logarithmic Set');
        await user.click(loadAutoSetButton);

        const analyzeButton = screen.getByText('Analyze Step Sizes');
        await user.click(analyzeButton);

        await waitFor(() => {
            // Check matrix column labels
            expect(screen.getByText('Step-Size Analysis Matrix')).toBeDefined();
            // Should contain multiple rows matching the dataset generator
            expect(screen.getByText('0.001')).toBeDefined();

            // Best observed 'h' section checking
            expect(screen.getAllByText('Central Difference:')[0]).toBeDefined();
        });
    });
});
