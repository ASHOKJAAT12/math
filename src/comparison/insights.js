/**
 * Generates analytical insights natively parsing raw properties avoiding generic universality claims.
 */

export const generateRootFindingInsights = (results) => {
    const validMethods = Object.values(results).filter(m => m.valid && (m.converged || m.status === 'success'));
    if (validMethods.length === 0) return { fewestIterations: null, lowestResidual: null, lowestError: null, fastest: null };

    const sortedByIter = [...validMethods].sort((a, b) => a.iterations - b.iterations);
    const sortedByRes = [...validMethods].sort((a, b) => (a.finalError ?? Infinity) - (b.finalError ?? Infinity));
    const sortedByErr = [...validMethods].filter(m => m.absoluteError !== null && m.absoluteError !== undefined)
        .sort((a, b) => a.absoluteError - b.absoluteError);

    const sortedByTime = [...validMethods].sort((a, b) => {
        const timeA = a.metrics?.median ?? a.executionTime ?? Infinity;
        const timeB = b.metrics?.median ?? b.executionTime ?? Infinity;
        return timeA - timeB;
    });

    return {
        tested: Object.values(results).filter(m => m.valid).length,
        converged: validMethods.length,
        fewestIterations: sortedByIter.length > 0 ? { name: sortedByIter[0].name, val: sortedByIter[0].iterations } : null,
        lowestResidual: sortedByRes.length > 0 ? { name: sortedByRes[0].name, val: sortedByRes[0].finalError } : null,
        lowestError: sortedByErr.length > 0 ? { name: sortedByErr[0].name, val: sortedByErr[0].absoluteError } : null,
        fastest: sortedByTime.length > 0 ? { name: sortedByTime[0].name, val: sortedByTime[0].metrics?.median ?? sortedByTime[0].executionTime } : null
    };
};

export const generateIntegrationInsights = (results) => {
    const validMethods = Object.values(results).filter(m => m.valid && (m.converged || m.status === 'success'));
    if (validMethods.length === 0) return { lowestError: null, fastest: null };

    const sortedByErr = [...validMethods].filter(m => m.absoluteError !== null && m.absoluteError !== undefined)
        .sort((a, b) => a.absoluteError - b.absoluteError);

    const sortedByTime = [...validMethods].sort((a, b) => {
        const timeA = a.metrics?.median ?? a.executionTime ?? Infinity;
        const timeB = b.metrics?.median ?? b.executionTime ?? Infinity;
        return timeA - timeB;
    });

    return {
        tested: Object.values(results).filter(m => m.valid).length,
        converged: validMethods.length,
        lowestError: sortedByErr.length > 0 ? { name: sortedByErr[0].name, val: sortedByErr[0].absoluteError } : null,
        fastest: sortedByTime.length > 0 ? { name: sortedByTime[0].name, val: sortedByTime[0].metrics?.median ?? sortedByTime[0].executionTime } : null
    };
};

export const generateDifferentiationInsights = (dataset, hasExact) => {
    if (!dataset || dataset.length === 0 || !hasExact) return { bestH: {}, instabilityNote: false };

    let bestH = {};
    let instabilityNote = false;

    // Detect best mappings
    if (dataset.some(d => d.forwardError !== null)) {
        bestH.forward = dataset.reduce((prev, curr) => curr.forwardError !== null && curr.forwardError < prev.forwardError ? curr : prev).h;
    }
    if (dataset.some(d => d.backwardError !== null)) {
        bestH.backward = dataset.reduce((prev, curr) => curr.backwardError !== null && curr.backwardError < prev.backwardError ? curr : prev).h;
    }
    if (dataset.some(d => d.centralError !== null)) {
        bestH.central = dataset.reduce((prev, curr) => curr.centralError !== null && curr.centralError < prev.centralError ? curr : prev).h;
    }

    // Detect structural instability (Error decreasing then increasing as h gets very small)
    const checkInstability = (key) => {
        const errors = dataset.map(d => d[key]).filter(e => e !== null);
        if (errors.length < 3) return false;

        // Find minimum index
        const minVal = Math.min(...errors);
        const minIdx = errors.indexOf(minVal);

        // If the minimum error isn't at the smallest h (which is at the end since h decreases),
        // and we have errors rising *after* hitting the minimum (for smaller h values).
        // Note: dataset has `h` decreasing if standard map used, so later indices = smaller h.
        if (minIdx < errors.length - 1) {
            // Error went back up after minIdx
            return errors[errors.length - 1] > minVal * 1.5; // Significant rise
        }
        return false;
    };

    if (checkInstability('forwardError') || checkInstability('backwardError') || checkInstability('centralError')) {
        instabilityNote = true;
    }

    return { bestH, instabilityNote };
};
