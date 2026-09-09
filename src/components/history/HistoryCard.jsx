import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { formatNumber } from '../../utils/formatters.js';

const HistoryCard = ({ calculation, onDelete, onViewReport }) => {
    const { id, timestamp, category, operation, input, resultSummary } = calculation;
    const dateStr = new Date(timestamp).toLocaleString();

    let resultValue = null;
    let label = 'Result';
    let failed = false;

    if (category === 'Root Finding') {
        label = 'Approx. Root';
        resultValue = resultSummary.root;
        failed = resultSummary.root === null;
    } else if (category === 'Numerical Integration') {
        label = 'Integral';
        resultValue = resultSummary.result;
        failed = resultSummary.result === null;
    } else if (category === 'Numerical Differentiation') {
        label = 'Derivative';
        // Multi-h
        if (operation === 'Multi-h Analysis') {
            label = 'Best H';
            resultValue = resultSummary.bestH;
        } else {
            resultValue = resultSummary.result;
            failed = resultSummary.result === null || resultValue === undefined;
        }
    } else if (category === 'Comparison') {
        label = 'Best Method';
        resultValue = resultSummary.bestMethod;
        failed = resultSummary.bestMethod === 'N/A';
    }

    if (operation === 'Advanced Experiment') {
        label = 'Experiment Status';
        resultValue = 'Completed Suite';
        failed = false;
    } else if (category === 'Experimental Analysis') {
        label = 'Lab Outcome';
        resultValue = resultSummary.status;
        failed = resultSummary.status === 'Failed';
    }

    const formatResult = (val) => {
        if (typeof val === 'number') return formatNumber(val, 6);
        return val || '---';
    };

    return (
        <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="text-base flex items-center gap-2 mb-1">
                        <span className="truncate max-w-[200px]" title={operation}>{operation}</span>
                        <Badge variant="primary" size="sm">{category}</Badge>
                    </CardTitle>
                    <p className="text-xs text-slate-500 font-mono">{dateStr}</p>
                </div>
                <button
                    onClick={() => onDelete(id)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Record"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col gap-4">
                {/* Result Highlights */}
                <div className={`p-3 rounded-md border ${failed ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800'}`}>
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                        {failed && <Badge variant="danger" size="sm">Failed</Badge>}
                        {!failed && resultSummary.executionTime && <span className="text-xs text-slate-400">{formatNumber(resultSummary.executionTime, 2)} ms</span>}
                    </div>
                    <div className={`font-mono font-bold truncate ${failed ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        {failed ? 'Numerical Error' : formatResult(resultValue)}
                    </div>
                </div>

                {/* Formatted Function string */}
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-slate-500">Problem Function</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 font-mono truncate bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200 dark:border-slate-700 rounded" title={input.func || 'N/A'}>
                        {input.func || 'N/A'}
                    </span>
                </div>

                <div className="flex justify-end gap-2 mt-auto">
                    {/* Placeholder action for now */}
                    <Button variant="outline" size="sm" onClick={() => onViewReport(id)}>
                        View Report
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HistoryCard;
