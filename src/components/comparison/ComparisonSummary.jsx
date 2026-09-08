import { generateRootFindingInsights, generateIntegrationInsights } from '../../comparison/insights';
import Badge from '../common/Badge';

const LABELS = {
    rootFinding: { exactType: 'Exact Root' },
    integration: { exactType: 'Exact Integral' },
    differentiation: { exactType: 'Exact Derivative' }
};

const ComparisonSummary = ({ results, hasExactReference, category }) => {
    let insights;
    if (category === 'rootFinding') {
        insights = generateRootFindingInsights(results);
    } else {
        insights = generateIntegrationInsights(results); // Handles differentiation structurally as well if mapped
    }

    if (insights.tested === 0) return null;

    const labels = LABELS[category] || LABELS['rootFinding'];

    return (
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Methods Tested</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white mt-1">{insights.tested}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Valid Evaluations</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{insights.converged}</span>
                        {insights.converged === insights.tested ? <Badge variant="success">100%</Badge> : <Badge variant="warning">{insights.tested - insights.converged} Failed</Badge>}
                    </div>
                </div>
                <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{labels.exactType} Reference</span>
                    <div className="mt-1 flex h-full items-center">
                        {hasExactReference ? (
                            <Badge variant="primary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                Available (Absolute Errors Traced)
                            </Badge>
                        ) : (
                            <span className="text-slate-400 italic">Not available (Using alternative bounds or skipping exact metrics)</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Data-Driven Observations</h3>
                <ul className="space-y-4 list-none p-0 m-0 text-sm">
                    {category === 'rootFinding' && insights.fewestIterations ? (
                        <li className="flex flex-col">
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">Fewest Iterations Required:</span>
                            <span className="mt-0.5"><b>{insights.fewestIterations.name}</b> converged fastest mathematically requiring <b>{insights.fewestIterations.val}</b> iterations natively.</span>
                        </li>
                    ) : null}

                    {insights.lowestError ? (
                        <li className="flex flex-col">
                            <span className="font-semibold text-rose-700 dark:text-rose-400">Highest Absolute Accuracy:</span>
                            <span className="mt-0.5"><b>{insights.lowestError.name}</b> exhibited the closest boundary relative to the exact value generating <b>{insights.lowestError.val.toExponential(4)}</b> absolute error.</span>
                        </li>
                    ) : (hasExactReference ? null : (
                        <li className="text-amber-500">Absolute error analytics unavailable without an exact reference evaluation.</li>
                    ))}

                    {insights.fastest ? (
                        <li className="flex flex-col">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Execution Speed:</span>
                            <span className="mt-0.5"><b>{insights.fastest.name}</b> recorded the fastest physical execution time at <b>{insights.fastest.val.toFixed(4)} ms</b>.</span>
                        </li>
                    ) : null}
                </ul>
                <p className="text-xs text-slate-500 italic mt-4 border-t border-slate-100 dark:border-slate-800 pt-2">Note: Numerical performance depends highly on functions, limits, constraints, and algorithmic conditioning. No single method is universally superior in all scenarios.</p>
            </div>
        </div>
    );
};

export default ComparisonSummary;
