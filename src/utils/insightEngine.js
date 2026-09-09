// src/utils/insightEngine.js

/**
 * Method Suitability Analyzer Rules
 */
export const analyzeSuitability = (category, context) => {
    const insights = [];
    if (category === 'Root Finding') {
        if (context.hasBracket) {
            insights.push("Since you have a valid bracket that bounds the root, Bisection and Regula Falsi are guaranteed to converge.");
        } else {
            insights.push("Without a known bracket, open methods like Newton-Raphson or Secant are recommended.");
        }

        if (context.hasDerivative) {
            insights.push("Since the exact derivative is known, Newton-Raphson is a strong candidate for rapid quadratic convergence.");
        } else {
            insights.push("If evaluating the exact derivative is difficult, Secant method can offer superlinear convergence without needing it.");
        }
    } else if (category === 'Numerical Integration') {
        insights.push("Trapezoidal rule is globally applicable but may suffer truncation error if the curve is highly nonlinear.");
        if (context.n % 2 !== 0) {
            insights.push("Warning: Simpson's 1/3 is not usable here since it strictly requires an even partition count (n).");
        } else {
            insights.push("Simpson's 1/3 is applicable and generally more accurate than Trapezoidal for smooth curves since it fits parabolas.");
        }
        if (context.n % 3 !== 0) {
            insights.push("Warning: Simpson's 3/8 is not usable here since it strictly requires an partition count (n) divisible by 3.");
        }
    } else if (category === 'Numerical Differentiation') {
        insights.push("Forward and Backward differences provide standard O(h) truncation error approximations.");
        insights.push("Central difference structurally cancels error terms giving a more precise O(h^2) approximation when both bounds are calculable.");
        insights.push("Remember: Reducing h infinitely does not guarantee zero error. Floating-point round-off will eventually dominate truncation error.");
    }

    return insights;
};

/**
 * Empirical Experiment Result Analyzer
 */
export const generateExperimentInsights = (experiment) => {
    const rulesTriggered = [];
    const validResults = experiment.results.filter(r => r.status === 'Converged' || r.status === 'Success');

    if (validResults.length === 0) {
        return ["The experiment yielded no valid convergent runs. Please check your parameter bounds."];
    }

    if (experiment.category === 'Root Finding' && experiment.experimentType === 'tolerance') {
        // Did stricter tolerance cause more iterations?
        const sorted = [...validResults].sort((a, b) => b.parameterValue - a.parameterValue); // highest tol to lowest tol
        let iterationsIncreased = false;
        let lastIter = 0;
        sorted.forEach(s => {
            if (s.iterations > lastIter && lastIter > 0) iterationsIncreased = true;
            lastIter = s.iterations;
        });

        if (iterationsIncreased) {
            rulesTriggered.push(`For the tested problem using ${experiment.method}, decreasing tolerance resulted in a higher required iteration count to achieve convergence.`);
        }
    }

    if (experiment.category === 'Root Finding' && experiment.experimentType === 'guess') {
        const failed = experiment.results.filter(r => r.status === 'Failed');
        if (failed.length > 0) {
            rulesTriggered.push(`The tested ${experiment.method} method was highly sensitive to the initial guess, failing to converge for ${failed.length} of the tested values.`);
        } else {
            rulesTriggered.push(`The ${experiment.method} method successfully converged across all tested initial guesses.`);
        }
    }

    if (experiment.category === 'Numerical Differentiation' && experiment.experimentType === 'h_study') {
        // Is there an error minimum point (floating point threshold)
        if (validResults[0].error !== null) {
            let lowestError = validResults[0].error;
            let bestH = validResults[0].parameterValue;

            validResults.forEach(r => {
                if (r.error < lowestError) {
                    lowestError = r.error;
                    bestH = r.parameterValue;
                }
            });
            rulesTriggered.push(`In this experiment, the lowest observed absolute error occurred at step size h = ${bestH}.`);

            // Check if error starts increasing as h gets smaller (round-off dominance)
            const sortedHDesc = [...validResults].sort((a, b) => b.parameterValue - a.parameterValue);
            let roundOffObserved = false;
            let lastErr = sortedHDesc[0].error;

            for (let i = 1; i < sortedHDesc.length; i++) {
                if (sortedHDesc[i].error > lastErr && sortedHDesc[i].error > 0.0000000001) {
                    roundOffObserved = true; // Error got worse when h got smaller
                }
                lastErr = sortedHDesc[i].error;
            }
            if (roundOffObserved) {
                rulesTriggered.push(`Notice that making 'h' excessively small does not continuously decrease error; eventually, floating-point round-off error dominates the truncation error advantage.`);
            }
        }
    }

    if (experiment.category === 'Numerical Integration' && experiment.experimentType === 'n_study') {
        const validN = validResults.filter(r => r.error !== null);
        if (validN.length > 1) {
            const sortedN = [...validN].sort((a, b) => a.parameterValue - b.parameterValue);
            const firstErr = sortedN[0].error;
            const lastErr = sortedN[sortedN.length - 1].error;
            if (lastErr < firstErr) {
                rulesTriggered.push(`For the tested problem running ${experiment.method}, increasing subintervals (n) generally decreased the approximation error.`);
            }
        }
    }

    return rulesTriggered;
};
