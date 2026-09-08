/**
 * Normalizes root finding iterations mapping for Recharts ConvergenceLineChart.
 */
export const createConvergenceDataset = (results, selectedMethods) => {
    const iterationData = {};

    // Collect all unique iteration indices
    selectedMethods.forEach(methodMeta => {
        const m = results[methodMeta.id];
        if (m && m.valid && m.status !== 'error' && m.steps) {
            m.steps.forEach(step => {
                const iter = step.iteration;
                if (!iterationData[iter]) {
                    iterationData[iter] = { iteration: iter };
                }

                // Track logarithmic error: Log10 of (error if exact exists, otherwise final residual/interval width)
                const errorVal = step.error; // Already calculated iteratively normally
                // Logarithmic plots require positive values; map zero/negatives explicitly to null to omit.
                const safeLog = (val) => val > 0 ? Math.log10(val) : null;

                iterationData[iter][`${methodMeta.id}LogError`] = safeLog(errorVal);
            });
        }
    });

    return Object.values(iterationData).sort((a, b) => a.iteration - b.iteration);
};

/**
 * Normalizes absolute execution times formatting for generic charts safely
 */
export const createPerformanceDataset = (results, selectedMethods, timeKey = 'executionTime') => {
    return selectedMethods
        .filter(meta => results[meta.id] && results[meta.id].valid && (results[meta.id].converged || results[meta.id].status === 'success'))
        .map(meta => {
            const m = results[meta.id];

            let timeVal = m[timeKey];
            // If benchmark wrapper was used
            if (m.metrics && m.metrics.median !== undefined) {
                timeVal = m.metrics.median;
            }

            return {
                id: meta.id,
                name: meta.name,
                time: timeVal || 0
            };
        });
};

/**
 * Normalizes iteration counts efficiently handling methods failing bounds.
 */
export const createIterationDataset = (results, selectedMethods) => {
    return selectedMethods
        .filter(meta => results[meta.id] && results[meta.id].valid && results[meta.id].converged)
        .map(meta => ({
            id: meta.id,
            name: meta.name,
            iterations: results[meta.id].iterations || 0
        }));
};

/**
 * Creates datasets mapped directly mapping errors explicitly handling identical zeros dynamically
 */
export const createErrorDataset = (results, selectedMethods, hasExactReference = false, category = 'rootFinding') => {
    return selectedMethods
        .filter(meta => results[meta.id] && results[meta.id].valid && (results[meta.id].converged || results[meta.id].status === 'success' || results[meta.id].status === 'Converged'))
        .map(meta => {
            const m = results[meta.id];

            let errVal = null;
            if (hasExactReference) {
                errVal = m.absoluteError;
            } else if (category === 'rootFinding') {
                errVal = m.finalError;
            }

            return {
                id: meta.id,
                name: meta.name,
                error: (errVal === undefined || errVal === null || errVal <= 0) ? null : errVal
            };
        }).filter(d => d.error !== null); // Strip invalid or zero mappings silently to avoid crashing log axes
};

/**
 * Normalizes mathematical derivative approximations formatting for comparisons natively
 */
export const createValueComparisonDataset = (results, selectedMethods) => {
    return selectedMethods
        .filter(meta => results[meta.id] && results[meta.id].valid && (results[meta.id].converged || results[meta.id].status === 'success' || results[meta.id].status === 'Converged'))
        .map(meta => {
            const m = results[meta.id];
            return {
                id: meta.id,
                name: meta.name,
                value: m.result
            };
        });
};
