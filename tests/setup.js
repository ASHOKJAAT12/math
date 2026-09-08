import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Recharts requires ResizeObserver to be mocked in JSDOM environments
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

afterEach(() => {
    cleanup();
});
