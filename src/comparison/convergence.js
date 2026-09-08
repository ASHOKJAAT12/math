/**
 * Transforms normalized iterations arrays into flattened recharts compatible datasets
 */

export const buildConvergenceData = (normalizedResults) => {
    // Goal format mapping for recharts:
    // [ { iteration: 1, methodAError: 0.1, methodBError: 0.2 }, { iteration: 2, methodAError: 0.01 } ]

    const validMethods = Object.values(normalizedResults).filter(m => m.valid && m.steps.length > 0);
    if (!validMethods.length) return [];

    // Find absolute maximum iterations taken by any method to pad chart axis
    const maxIters = Math.max(...validMethods.map(m => m.steps.length));

    const chartData = [];

    for (let i = 0; i < maxIters; i++) {
        // Human 1-indexed iterations
        let tick = { iteration: i + 1 };

        validMethods.forEach(method => {
            if (i < method.steps.length) {
                const step = method.steps[i];
                let errorVal = step.error;

                // Some iteration steps returning null err initially (i.e. first iter x0)
                if (errorVal === null) return;

                // Log10 transform to help visualizing massive scale changes, skipping <= 0
                if (errorVal !== null && errorVal > 0) {
                    tick[`${method.id}Error`] = errorVal;
                    tick[`${method.id}LogError`] = Math.log10(errorVal);
                }
            }
        });

        // Add tick only if at least one parameter holds valid log/error stats inside object keys length > 1
        if (Object.keys(tick).length > 1) {
            chartData.push(tick);
        }
    }

    return chartData;
};
