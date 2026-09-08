import React from 'react';
import { formatNumber } from '../../utils/formatters.js';
import Badge from '../common/Badge';

const CATEGORY_HEADERS = {
    'rootFinding': { result: 'Approx Root', param: 'Iterations', showFinalError: true },
    'integration': { result: 'Integral', param: 'Subintervals', showFinalError: false },
    'differentiation': { result: 'Derivative', param: 'Step Size (h)', showFinalError: false },
};

const ComparisonTable = ({ results, category }) => {
    const validMethods = Object.values(results).filter(m => m.valid);
    if (!validMethods.length) return null;

    const hasExactRef = validMethods.some(m => m.absoluteError !== null);

    // Fallbacks if category isn't properly matched (should not happen in phase 9)
    const headers = CATEGORY_HEADERS[category] || CATEGORY_HEADERS['rootFinding'];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 border-x border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-100/50 dark:bg-slate-800/50">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Method</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{headers.result}</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{headers.param}</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Exec Time (ms)</th>
                        {headers.showFinalError && (
                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Final Iter Error</th>
                        )}
                        {hasExactRef && (
                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider border-l border-amber-200 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-900/10">Absolute Error</th>
                        )}
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                    {validMethods.map((method) => (
                        <tr key={method.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                                {method.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                {method.converged || method.status === 'success' || method.status === 'Converged'
                                    ? <Badge variant="success">{method.status || 'Success'}</Badge>
                                    : (method.status === 'Max Iterations'
                                        ? <Badge variant="warning">Max Iterations</Badge>
                                        : <Badge variant="danger">{method.status || 'Failed'}</Badge>)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold">
                                {method.resultValue !== null ? formatNumber(method.resultValue) : (method.root !== undefined && method.root !== null ? formatNumber(method.root) : '---')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">
                                {method.resultParam !== undefined ? method.resultParam : method.iterations}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">
                                {formatNumber(method.executionTime, 4)}
                            </td>
                            {headers.showFinalError && (
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">
                                    {method.finalError !== null ? formatNumber(method.finalError) : '---'}
                                </td>
                            )}
                            {hasExactRef && (
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-amber-700 dark:text-amber-400 font-mono font-semibold border-l border-slate-200 dark:border-slate-800 bg-amber-50/10 dark:bg-amber-900/5">
                                    {method.absoluteError !== null ? formatNumber(method.absoluteError) : '---'}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComparisonTable;
