/**
 * Ranks methods logically based on various metrics utilizing normalized output grids
 */
export const rankMethods = (normalizedResults, category = 'rootFinding') => {
    const methods = Object.values(normalizedResults).filter(m => m.valid);
    if (methods.length === 0) return { error: "No valid methods to rank." };

    const successfulMethods = methods.filter(m => m.converged || m.status === 'success' || m.status === 'Converged');

    let rankings = {
        fastestExecution: null,
        lowestError: null,
        mostSuccessful: successfulMethods.map(m => m.name),
        // Expose category-specific metrics
        categorySpecific: null
    };

    if (successfulMethods.length > 0) {
        // Fastest Execution (lowest MS time)
        rankings.fastestExecution = [...successfulMethods].sort((a, b) => a.executionTime - b.executionTime)[0];

        // Lowest Error. Prioritize absoluteError based on exact reference if provided.
        const hasExactRef = successfulMethods.some(m => m.absoluteError !== null);
        if (hasExactRef) {
            rankings.lowestError = [...successfulMethods].sort((a, b) => {
                if (a.absoluteError === null) return 1;
                if (b.absoluteError === null) return -1;
                return a.absoluteError - b.absoluteError;
            })[0];
            rankings.lowestErrorMetric = 'Lowest Absolute Error';
        } else {
            // Alternatively, sort by iteration error if available (usually Root Finding)
            if (category === 'rootFinding') {
                rankings.lowestError = [...successfulMethods].sort((a, b) => {
                    if (a.finalError === null) return 1;
                    if (b.finalError === null) return -1;
                    return a.finalError - b.finalError;
                })[0];
                rankings.lowestErrorMetric = 'Final Iteration Error';
            }
        }

        if (category === 'rootFinding') {
            rankings.categorySpecific = {
                title: "Fewest Iterations",
                method: [...successfulMethods].sort((a, b) => a.iterations - b.iterations)[0],
                param: 'iterations',
                suffix: ' iterations'
            };
        } else if (category === 'integration') {
            rankings.categorySpecific = {
                title: "Fewest Subintervals",
                method: [...successfulMethods].sort((a, b) => a.resultParam - b.resultParam)[0],
                param: 'resultParam',
                suffix: ' slices'
            };
        } else if (category === 'differentiation') {
            // For differentiation we might not rank Best 'h' natively here unless it's multi-h, but we can just use step-size tracking if varied
            // If all h are same, it doesn't matter.
            rankings.categorySpecific = null;
        }
    }

    return rankings;
};
