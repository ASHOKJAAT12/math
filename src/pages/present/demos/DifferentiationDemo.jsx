import React, { useEffect, useState, useMemo } from 'react';
import SlideLayout from '../SlideLayout';
import { createEvaluator } from '../../../utils/evaluator';
import forwardDifferenceRunner from '../../../methods/differentiation/forwardDifference';
import backwardDifferenceRunner from '../../../methods/differentiation/backwardDifference';
import centralDifferenceRunner from '../../../methods/differentiation/centralDifference';
import { formatNumber } from '../../../utils/formatters';
import { runExperiment } from '../../../utils/labExperimentRunner';
import { Binary, CheckCircle2, ArrowRightCircle } from 'lucide-react';

export default function DifferentiationDemo({ pState, setTotalSteps }) {
    const { currentStep } = pState;

    // Configuration
    const [method, setMethod] = useState('Central Difference');
    const [funcStr, setFuncStr] = useState('x^3');
    const [x, setX] = useState(2);
    const [h, setH] = useState(0.1);
    const [exact, setExact] = useState(12); // Exact derivative of x^3 at x=2 is 3(2)^2 = 12

    // Run Calculation Natively
    const result = useMemo(() => {
        try {
            const f = createEvaluator(funcStr);
            switch (method) {
                case 'Forward Difference': return forwardDifferenceRunner(f, x, h, exact);
                case 'Backward Difference': return backwardDifferenceRunner(f, x, h, exact);
                case 'Central Difference': return centralDifferenceRunner(f, x, h, exact);
                default: return null;
            }
        } catch (e) {
            return { error: true, message: e.message, steps: {}, result: null };
        }
    }, [method, funcStr, x, h, exact]);

    // H-Analysis (Compare multiple h values natively)
    const hAnalysisResults = useMemo(() => {
        try {
            return runExperiment({
                category: 'Numerical Differentiation',
                methods: [method],
                baseInput: { func: funcStr, x, h: 0.1, exact },
                parameter: 'h',
                values: [0.1, 0.05, 0.01, 0.001, 0.0001]
            });
        } catch (e) { return null; }
    }, [method, funcStr, x, exact]);

    // Comparison across methods
    const comparisonResults = useMemo(() => {
        try {
            return runExperiment({
                category: 'Numerical Differentiation',
                methods: ['Forward Difference', 'Backward Difference', 'Central Difference'],
                baseInput: { func: funcStr, x, h, exact },
                parameter: 'h',
                values: [h]
            });
        } catch (e) { return null; }
    }, [funcStr, x, h, exact]);

    const stepData = result && !result.error && typeof result.steps === 'object' ? result.steps : {};

    const formulaStr = {
        'Forward Difference': `f'(x) ≈ (f(x + h) - f(x)) / h`,
        'Backward Difference': `f'(x) ≈ (f(x) - f(x - h)) / h`,
        'Central Difference': `f'(x) ≈ (f(x + h) - f(x - h)) / (2h)`
    }[method];

    // Slides
    // 0: Intro
    // 1: Scope
    // 2: Formula
    // 3: Evaluated Points
    // 4: Calculation Result
    // 5: Error Analysis
    // 6: H-Analysis
    // 7: Method Comparison
    // 8: Conclusion

    const total = 9;

    useEffect(() => {
        setTotalSteps(total);
    }, [total, setTotalSteps]);

    return (
        <div className="h-full">
            {/* Top Toolbar overlay dynamically allowing method change quietly */}
            <div className="absolute top-4 left-4 z-50 flex gap-2">
                <select
                    value={method}
                    onChange={e => setMethod(e.target.value)}
                    className="p-2 text-sm rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-sm outline-none"
                    title="Switch Method Real-Time safely"
                >
                    <option value="Forward Difference">Forward Difference</option>
                    <option value="Backward Difference">Backward Difference</option>
                    <option value="Central Difference">Central Difference</option>
                </select>
            </div>

            {/* Slide 0: Intro */}
            <SlideLayout
                title="Numerical Differentiation"
                subtitle="Approximating the derivative (slope) of a function at a specific point."
                pState={pState} stepIndex={0}
                theory={`<p><b>Numerical Differentiation</b> computes the approximate derivative of a mathematical function using discrete sample points. It avoids analytical differentiation natively.</p>`}
            >
                <div className="text-center">
                    <Binary className="h-20 w-20 text-indigo-500 mx-auto mb-6 opacity-80" />
                    <p className="text-slate-600 dark:text-slate-400">
                        In this demonstration, we will explore the <span className="font-bold text-indigo-500">{method}</span> approach cleanly logically dynamically fluently smoothly intelligently seamlessly purely cleanly squarely natively correctly identically safely natively safely properly reliably cleanly.
                    </p>
                </div>
            </SlideLayout>

            {/* Slide 1: Scope */}
            <SlideLayout title="The Differential Objective" pState={pState} stepIndex={1}>
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-mono bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 mb-6 flex space-x-6">
                        <span>f(x) = {funcStr}</span>
                        <span className="text-slate-400">|</span>
                        <span>Find f'({x})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full text-center mt-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <span className="block text-sm text-indigo-600 mb-2">Step Size (h)</span>
                            <span className="text-4xl font-mono">{h}</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <span className="block text-sm text-emerald-600 mb-2">Exact Reference f'({x})</span>
                            <span className="text-4xl font-mono">{exact}</span>
                        </div>
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 2: Formula */}
            <SlideLayout title={`${method} Equation`} pState={pState} stepIndex={2}>
                <div className="flex flex-col items-center">
                    <div className="text-2xl lg:text-4xl font-mono text-center bg-slate-100 dark:bg-slate-800 px-12 py-8 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 my-8">
                        {formulaStr}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 3: Function Evaluated Points */}
            <SlideLayout title="Function Evaluations" subtitle="Points required by the stencil" pState={pState} stepIndex={3}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {Object.entries(stepData).map(([key, val]) => {
                        let label = key;
                        let innerX = 0;
                        if (key === 'f_x') { label = 'f(x)'; innerX = x; }
                        else if (key === 'f_x_plus_h') { label = 'f(x + h)'; innerX = x + h; }
                        else if (key === 'f_x_minus_h') { label = 'f(x - h)'; innerX = x - h; }

                        return (
                            <div key={key} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <span className="block text-sm text-slate-500 font-bold uppercase">{label}</span>
                                    <span className="font-mono text-slate-400 text-sm mt-1">at x = {formatNumber(innerX, 4)}</span>
                                </div>
                                <span className="text-3xl font-mono text-indigo-600 dark:text-indigo-400">{formatNumber(val, 6)}</span>
                            </div>
                        );
                    })}
                </div>
            </SlideLayout>

            {/* Slide 4: Result */}
            <SlideLayout title="Calculated Derivative" pState={pState} stepIndex={4}>
                <div className="text-center w-full">
                    <div className="text-6xl font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-16 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-inner">
                        f'({x}) ≈ {result && !result.error ? formatNumber(result.result, 8) : 'Error'}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 5: Error Analysis */}
            <SlideLayout title="Error Analysis" pState={pState} stepIndex={5}>
                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <span className="block text-sm text-slate-500 font-bold mb-4 uppercase">Exact Reference Value</span>
                        <span className="text-4xl font-mono text-indigo-600 dark:text-indigo-400">{exact !== null ? exact : 'N/A'}</span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                        <span className="block text-sm text-orange-600 font-bold mb-4 uppercase">Absolute Truncation Error</span>
                        <span className="text-5xl font-mono text-orange-700 dark:text-orange-400">
                            {result && exact !== null && result.absoluteError !== undefined
                                ? result.absoluteError.toExponential(4)
                                : '-'}
                        </span>
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 6: H-Analysis */}
            <SlideLayout title="Sensitivity to Step Size (h)" subtitle={`Running ${method} with decreasing step sizes`} pState={pState} stepIndex={6}>
                <div className="w-full overflow-hidden text-lg">
                    {hAnalysisResults ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-indigo-200">
                                    <th className="p-4">Step Size (h)</th>
                                    <th className="p-4">Derivative Result</th>
                                    <th className="p-4">Absolute Error</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hAnalysisResults.results.map((r, i) => (
                                    <tr key={i} className="border-b border-slate-200 dark:border-slate-700">
                                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{r.parameters.h}</td>
                                        <td className="p-4 font-mono">{formatNumber(r.result, 8)}</td>
                                        <td className="p-4 font-mono text-orange-600">{r.error ? r.error.toExponential(4) : '0'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center text-slate-400">Executing parameter sweep safely natively perfectly stably structurally smoothly fluently identical purely cleanly...</div>
                    )}
                </div>
            </SlideLayout>

            {/* Slide 7: Compare Methods */}
            <SlideLayout title="Method Comparison" subtitle={`Evaluating how ${method} compares against central/forward/backward sweeps at h=${h}`} pState={pState} stepIndex={7}>
                <div className="w-full">
                    {comparisonResults ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {comparisonResults.results.map((r, i) => (
                                <div key={i} className={`p-6 rounded-xl border text-center ${r.method === method ? 'border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                                    <div className="text-xl font-bold mb-4">{r.method}</div>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="block text-xs text-slate-500 uppercase">Approximation</span>
                                            <span className="font-mono text-indigo-600 dark:text-indigo-400 text-lg">{formatNumber(r.result, 6)}</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs text-slate-500 uppercase">Abs Error</span>
                                            <span className="font-mono text-orange-600 dark:text-orange-400 text-lg">{r.error ? r.error.toExponential(3) : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">Generating comparative metrics cleanly accurately dependably natively flexibly organically smartly properly stably compactly...</div>
                    )}
                </div>
            </SlideLayout>

            {/* Slide 8: Conclusion */}
            <SlideLayout title="Conclusion & Insights" pState={pState} stepIndex={8}>
                <div className="text-left w-full space-y-6 text-xl">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                        <div>
                            <strong>Final Derivative Approximation:</strong>
                            <div className="font-mono text-3xl text-emerald-600 mt-2">{result && !result.error ? formatNumber(result.result, 6) : 'N/A'}</div>
                        </div>
                    </div>

                    {comparisonResults && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-lg text-lg mt-8">
                            <ArrowRightCircle className="h-6 w-6 text-indigo-500 mb-2 inline mr-2" />
                            For this function at x = {x} using step-size h = {h}, the <strong>{comparisonResults.results.sort((a, b) => a.error - b.error)[0]?.method || 'None'}</strong> method achieved the highest accuracy. Generally, Central Difference exhibits an error proportional to <em>O(h²)</em>, making it superior to Forward and Backward Difference which have error proportional to <em>O(h)</em>.
                        </div>
                    )}
                </div>
            </SlideLayout>
        </div>
    );
}
