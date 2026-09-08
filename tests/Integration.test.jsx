import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Integration from '../src/pages/Integration.jsx';
import { ThemeProvider } from '../src/context/ThemeContext.jsx';

// Mock matchMedia for JSDOM
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Integration UI Component', () => {
    beforeEach(() => {
        render(
            <ThemeProvider>
                <Integration />
            </ThemeProvider>
        );
    });

    const setNativeValue = (element, value) => {
        const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        valueSetter.call(element, value);
        fireEvent.change(element);
    };

    it('renders numerical integration page and default methods', () => {
        expect(screen.getAllByText('Numerical Integration')[0]).toBeDefined();
        expect(screen.getAllByText('Trapezoidal Rule')[0]).toBeDefined();
        expect(screen.getAllByText("Simpson's 1/3 Rule")[0]).toBeDefined();
        expect(screen.getAllByText("Simpson's 3/8 Rule")[0]).toBeDefined();
    });
});
