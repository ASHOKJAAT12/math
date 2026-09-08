/**
 * Ranks methods logically based on various metrics utilizing normalized output grids
 */
export const rankMethods = (normalizedResults) => {
    const methods = Object.values(normalizedResults).filter(m => m.valid);
    if (methods.length === 0) return { error: "No valid methods to rank." };

    const convergedMethods = methods.filter(m => m.converged);

    let rankings = {
        fastestConvergence: null,
        lowestError: null,
        fastestExecution: null,
        mostSuccessful: convergedMethods.map(m => m.name)
    };

    if (convergedMethods.length > 0) {
        // Fastest convergence (fewest iterations)
        rankings.fastestConvergence = [...convergedMethods].sort((a, b) => a.iterations - b.iterations)[0];

        // Fastest Execution (lowest MS time)
        rankings.fastestExecution = [...convergedMethods].sort((a, b) => a.executionTime - b.executionTime)[0];

        // Lowest Error. Prioritize absoluteError based on exact root if provided.
        const hasExactRoot = convergedMethods.some(m => m.absoluteError !== null);
        if (hasExactRoot) {
            rankings.lowestError = [...convergedMethods].sort((a, b) => {
                if (a.absoluteError === null) return 1;
                if (b.absoluteError === null) return -1;
                return a.absoluteError - b.absoluteError;
            })[0];
            rankings.lowestErrorMetric = 'Absolute Error (Exact Root)';
        } else {
            // Alternatively, sort by iteration error if available
            rankings.lowestError = [...convergedMethods].sort((a, b) => {
                if (a.finalError === null) return 1;
                if (b.finalError === null) return -1;
                return a.finalError - b.finalError;
            })[0];
            rankings.lowestErrorMetric = 'Final Iteration Error';
        }
    }

    return rankings;
};
