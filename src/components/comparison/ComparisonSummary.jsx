import React from 'react';
import Badge from '../common/Badge';

const ComparisonSummary = ({ results, exactRootAvailable }) => {
    const validMethods = Object.values(results).filter(m => m.valid);
    if (validMethods.length === 0) return null;

    const totalMethods = validMethods.length;
    const convergedCount = validMethods.filter(m => m.converged).length;

    // Sort logic isolated for analytical blurbs
    const convergedMethods = validMethods.filter(m => m.converged);
    let bestIterations = null;
    let bestSpeed = null;
    let bestBracket = [];

    if (convergedMethods.length > 0) {
        bestIterations = [...convergedMethods].sort((a, b) => a.iterations - b.iterations)[0];
        bestSpeed = [...convergedMethods].sort((a, b) => a.executionTime - b.executionTime)[0];
        bestBracket = convergedMethods.filter(m => m.id === 'bisection' || m.id === 'regulaFalsi').map(m => m.name);
    }

    return (
        <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Methods Tested</span>
                    <span className="text-xl font-bold text-slate-900 dark:text-white mt-1">{totalMethods}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Methods Converged</span>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">{convergedCount}</span>
                        {convergedCount === totalMethods ? <Badge variant="success">100%</Badge> : <Badge variant="warning">{totalMethods - convergedCount} Failed</Badge>}
                    </div>
                </div>
                <div className="flex flex-col sm:col-span-2">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Exact Root Reference</span>
                    <div className="mt-1 flex h-full items-center">
                        {exactRootAvailable ? (
                            <Badge variant="primary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                Available (Absolute Errors Traced)
                            </Badge>
                        ) : (
                            <span className="text-slate-400 italic">Not available (Using residual iteration error)</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">Which method performed best?</h3>
                <ul className="space-y-4 list-none p-0 m-0">
                    {bestIterations ? (
                        <li className="flex flex-col">
                            <span className="font-semibold text-indigo-700 dark:text-indigo-400">Iteration Efficiency:</span>
                            <span className="mt-0.5"><b>{bestIterations.name}</b> used the fewest iterations ({bestIterations.iterations}) to achieve the requested tolerance bounds for this specific function.</span>
                        </li>
                    ) : (
                        <li className="text-red-500">No methods converged to measure efficiency.</li>
                    )}

                    {bestSpeed && (
                        <li className="flex flex-col">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Execution Speed:</span>
                            <span className="mt-0.5"><b>{bestSpeed.name}</b> measured the lowest physical runtime ({bestSpeed.executionTime.toFixed(4)} ms) in this browser compilation sequence. <i>(Note: Tiny time spans heavily depend on JIT JS compilation overlaps across threads)</i>.</span>
                        </li>
                    )}

                    {bestBracket.length > 0 && (
                        <li className="flex flex-col">
                            <span className="font-semibold text-amber-700 dark:text-amber-400">Bracket Robustness:</span>
                            <span className="mt-0.5">{bestBracket.join(' and ')} successfully maintained bounding root encapsulation, ensuring guaranteed convergence limits.</span>
                        </li>
                    )}
                </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-md font-bold text-slate-900 dark:text-white pb-1">Mathematical Insight Summaries</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {validMethods.map(m => (
                        <div key={m.id} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1">{m.name}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {m.id === 'bisection' && "Safest bounding algorithm cutting intervals in half. Always converges if root exists, but rate is linearly sluggish."}
                                {m.id === 'regulaFalsi' && "Enhances bisection bridging secant lines between roots. Can get trapped on concave curves delaying convergence massively against robust endpoints."}
                                {m.id === 'newtonRaphson' && "Scales quadratically achieving lightning-fast conversions assuming derivative paths are well-behaved away from zero gradients and local minimum traps."}
                                {m.id === 'secant' && "Yields superlinear speeds escaping explicit derivative parsing (f'(x)) by drawing secant bridges over guesses, but risks failing if denominators vanish identically."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ComparisonSummary;
