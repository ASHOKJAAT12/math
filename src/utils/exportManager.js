/**
 * Safely downloads a Blob as a file
 */
const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Generates a standard filename based on category and date.
 */
const getFileName = (category, ext) => {
    const dateStr = new Date().toISOString().split('T')[0];
    const catSafe = (category || 'analysis').replace(/\s+/g, '-').toLowerCase();
    return `nma-${catSafe}-${dateStr}.${ext}`;
};

/**
 * Handles JSON export of history objects.
 * Maintains deep numeric precision natively.
 */
export const exportJSON = (calculationData) => {
    try {
        const jsonString = JSON.stringify(calculationData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        downloadFile(blob, getFileName(calculationData.category, 'json'));
        return { success: true };
    } catch (err) {
        console.error('Failed to export JSON', err);
        return { success: false, message: 'Failed to generate JSON.' };
    }
};

/**
 * Main CSV exporter delegating to category-specific builders
 */
export const exportCSV = (calculationData) => {
    try {
        let csvString = '';

        switch (calculationData.category) {
            case 'Root Finding':
                csvString = buildRootFindingCSV(calculationData);
                break;
            case 'Numerical Integration':
                csvString = buildIntegrationCSV(calculationData);
                break;
            case 'Numerical Differentiation':
                csvString = buildDifferentiationCSV(calculationData);
                break;
            case 'Comparison':
                csvString = buildComparisonCSV(calculationData);
                break;
            default:
                csvString = buildGenericCSV(calculationData);
        }

        if (!csvString) {
            throw new Error('CSV Generation returned empty string.');
        }

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        downloadFile(blob, getFileName(calculationData.category, 'csv'));
        return { success: true };
    } catch (err) {
        console.error('Failed to export CSV', err);
        return { success: false, message: 'Failed to generate CSV.' };
    }
};

/** Utility to escape CSV fields */
const escapeCSV = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

const buildRootFindingCSV = (data) => {
    const lines = [];
    lines.push(['Method', 'Iteration', 'Approximation (x)', 'Error', 'f(x)', 'Additional Details'].join(','));

    const results = data.detailedResults;
    if (!results) return lines.join('\n');

    Object.values(results).filter(m => m.valid && m.steps).forEach(methodResult => {
        methodResult.steps.forEach(step => {
            const row = [
                escapeCSV(methodResult.name),
                step.iteration,
                step.c ?? step.x ?? step.nextX ?? step.x1 ?? '',
                step.error ?? '',
                step.fC ?? step.fx ?? step.f1 ?? ''
            ];

            let details = [];
            if (step.a !== undefined && step.b !== undefined) details.push(`Interval: [${step.a}, ${step.b}]`);
            if (step.derivative !== undefined) details.push(`f'(x): ${step.derivative}`);
            if (step.intervalWidth !== undefined) details.push(`Width: ${step.intervalWidth}`);
            row.push(escapeCSV(details.join(' | ')));

            lines.push(row.join(','));
        });
    });

    return lines.join('\n');
};

const buildIntegrationCSV = (data) => {
    const lines = [];
    lines.push(['Method', 'n', 'Result', 'Absolute Error', 'Execution Time (ms)'].join(','));

    const results = data.detailedResults;
    if (!results) return lines.join('\n');

    Object.values(results).filter(m => m.valid).forEach(methodResult => {
        lines.push([
            escapeCSV(methodResult.name),
            methodResult.subintervals,
            methodResult.result,
            methodResult.absoluteError ?? '',
            methodResult.executionTime ?? (methodResult.metrics?.median) ?? ''
        ].join(','));
    });

    lines.push('');
    lines.push(['Method', 'Index', 'x', 'f(x)', 'Weight', 'Contribution'].join(','));

    Object.values(results).filter(m => m.valid && m.steps).forEach(methodResult => {
        methodResult.steps.forEach(step => {
            lines.push([
                escapeCSV(methodResult.name),
                step.index,
                step.x,
                step.fx,
                step.weight,
                step.contribution
            ].join(','));
        });
    });

    return lines.join('\n');
};

const buildDifferentiationCSV = (data) => {
    const lines = [];
    const results = data.detailedResults;
    if (!results) return '';

    if (Array.isArray(results) && results.length > 0 && results[0].h !== undefined) {
        // Multi-H Analysis
        lines.push(['h', 'Forward Result', 'Forward Error', 'Backward Result', 'Backward Error', 'Central Result', 'Central Error'].join(','));
        results.forEach(row => {
            lines.push([
                row.h,
                row.forwardDerivative ?? '',
                row.forwardError ?? '',
                row.backwardDerivative ?? '',
                row.backwardError ?? '',
                row.centralDerivative ?? '',
                row.centralError ?? ''
            ].join(','));
        });
    } else {
        // Normal Single-Point Evaluation
        lines.push(['Method', 'x', 'h', 'Approximation', 'Exact', 'Absolute Error', 'Execution Time (ms)'].join(','));
        Object.values(results).filter(m => m.status === 'success' || m.valid).forEach(methodResult => {
            lines.push([
                escapeCSV(methodResult.name || methodResult.method),
                methodResult.point,
                methodResult.h,
                methodResult.result,
                methodResult.exactDerivative ?? '',
                methodResult.absoluteError ?? '',
                methodResult.executionTime ?? (methodResult.metrics?.median) ?? ''
            ].join(','));
        });
    }

    return lines.join('\n');
};

const buildComparisonCSV = (data) => {
    // If it's a comparison, it delegates dynamically based on data.operation actually but 
    // we can reuse the generic category builder. 
    // The structured UI configures the category as the native type (e.g. 'Root Finding Comparison', or just 'Root Finding')
    // We handle it generically or delegate loosely
    if (data.operation && data.operation.includes('Multi-h')) {
        return buildDifferentiationCSV(data);
    }

    if (data.operation && data.operation.includes('Find Root')) {
        return buildRootFindingCSV(data);
    }

    return buildGenericCSV(data);
}

const buildGenericCSV = (data) => {
    // Failsafe for unclassified
    const lines = ['Data'];
    lines.push(escapeCSV(JSON.stringify(data.resultSummary || data)));
    return lines.join('\n');
};
