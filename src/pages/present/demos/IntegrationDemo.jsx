import React, { useEffect, useState, useMemo } from 'react';
import SlideLayout from '../SlideLayout';
import { createEvaluator } from '../../../utils/evaluator';
import trapezoidalRunner from '../../../methods/integration/trapezoidal';
import simpson13Runner from '../../../methods/integration/simpson13';
import simpson38Runner from '../../../methods/integration/simpson38';
import { formatNumber } from '../../../utils/formatters';
import { runExperiment } from '../../../utils/labExperimentRunner';
import { Activity, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import Badge from '../../../components/common/Badge';

export default function IntegrationDemo({ pState, setTotalSteps }) {
    const { currentStep } = pState;

    // Configuration
    const [method, setMethod] = useState('Trapezoidal');
    const [funcStr, setFuncStr] = useState('x^2');
    const [a, setA] = useState(0);
    const [b, setB] = useState(1);
    const [n, setN] = useState(4); // Default to a small number of intervals for the demo
    const [exact, setExact] = useState(0.33333333333); // 1/3

    const ensureValidN = (method, currentN) => {
        let newN = currentN;
        if (method === 'Simpson 1/3' && currentN % 2 !== 0) newN += 1;
        if (method === 'Simpson 3/8' && currentN % 3 !== 0) newN += (3 - (currentN % 3));
        return newN;
    };

    const validN = useMemo(() => ensureValidN(method, n), [method, n]);

    // Run Calculation Natively
    const result = useMemo(() => {
        try {
            const f = createEvaluator(funcStr);
            switch (method) {
                case 'Trapezoidal': return trapezoidalRunner(f, a, b, validN, exact);
                case 'Simpson 1/3': return simpson13Runner(f, a, b, validN, exact);
                case 'Simpson 3/8': return simpson38Runner(f, a, b, validN, exact);
                default: return null;
            }
        } catch (e) {
            return { error: true, message: e.message, steps: [] };
        }
    }, [method, funcStr, a, b, validN, exact]);

    // Background calculation for comparison slide
    const comparisonResults = useMemo(() => {
        try {
            return runExperiment({
                category: 'Numerical Integration',
                methods: ['Trapezoidal', 'Simpson 1/3', 'Simpson 3/8'],
                baseInput: { func: funcStr, a, b, n: validN, exact },
                parameter: 'n',
                values: [validN]
            });
        } catch (e) { return null; }
    }, [funcStr, a, b, validN, exact]);

    const stepsArray = result?.steps || [];
    const numPoints = stepsArray.length;

    // Slide Map
    // 0: Intro, 1: Problem scope, 2: Formula, 3: Start
    // 4 to 4 + numPoints - 1: Points
    // 4 + numPoints: Result
    // 5 + numPoints: Error
    // 6 + numPoints: Compare
    // 7 + numPoints: Conclusion

    // Instead of showing every point as a single slide if n is large, let's group them or just show the table
    // For presentation purposes, if n is very large, it's boring. Let's cap the individual point slides to max 10.
    const displayablePoints = numPoints <= 10 ? stepsArray : stepsArray.slice(0, 5).concat(stepsArray.slice(-5));
    const isTruncated = numPoints > 10;

    const numConstantSlidesPost = 4; // Result, Error, Compare, Conclusion
    const total = 4 + (isTruncated ? 1 : numPoints) + numConstantSlidesPost;

    useEffect(() => {
        setTotalSteps(total);
    }, [total, setTotalSteps]);

    const methodFormulas = {
        'Trapezoidal': '(h / 2) * (f(x_0) + 2*f(x_1) + ... + f(x_n))',
        'Simpson 1/3': '(h / 3) * (f(x_0) + 4*f(x_1) + 2*f(x_2) + ... + f(x_n))',
        'Simpson 3/8': '(3h / 8) * (f(x_0) + 3*f(x_1) + 3*f(x_2) + 2*f(x_3) + ... + f(x_n))'
    };

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
                    <option value="Trapezoidal">Trapezoidal</option>
                    <option value="Simpson 1/3">Simpson 1/3</option>
                    <option value="Simpson 3/8">Simpson 3/8</option>
                </select>
            </div>

            {/* Slide 0: Intro */}
            <SlideLayout
                title="Numerical Integration Analysis"
                subtitle="Approximating the area under a curve."
                pState={pState} stepIndex={0}
                theory={`<p><b>Numerical Integration</b> partitions an area into smaller geometric shapes to approximate the integral of a function without needing an analytical anti-derivative.</p>`}
            >
                <div className="text-center">
                    <Activity className="h-20 w-20 text-indigo-500 mx-auto mb-6 opacity-80" />
                    <p className="text-slate-600 dark:text-slate-400">
                        In this demonstration, we will explore the <span className="font-bold text-indigo-500">{method}</span> method cleanly and interactively.
                    </p>
                </div>
            </SlideLayout>

            {/* Slide 1: Problem */}
            <SlideLayout title="The Integral Objective" pState={pState} stepIndex={1}>
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-mono bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 mb-6">
                        ∫ f(x) dx  where f(x) = {funcStr}
                    </div>
                    <div className="grid grid-cols-2 gap-6 w-full text-center">
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800">
                            <span className="block text-sm text-indigo-600 mb-2">Interval [a, b]</span>
                            <span className="text-3xl font-mono">[{a}, {b}]</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                            <span className="block text-sm text-emerald-600 mb-2">Subintervals (n)</span>
                            <span className="text-3xl font-mono">{validN}</span>
                        </div>
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 2: Formula */}
            <SlideLayout title={`${method} Equation`} pState={pState} stepIndex={2}>
                <div className="flex flex-col items-center">
                    <div className="text-2xl lg:text-3xl font-mono text-center bg-slate-100 dark:bg-slate-800 px-8 py-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                        {methodFormulas[method]}
                    </div>
                    <p className="mt-8 text-slate-500 text-center max-w-2xl">
                        This formula assigns specific <strong>weights</strong> to each evaluated point based on the geometric interpolation polynomial used by the method.
                    </p>
                </div>
            </SlideLayout>

            {/* Slide 3: Start */}
            <SlideLayout title="Computation Ready" pState={pState} stepIndex={3}>
                <div className="flex flex-col items-center text-center">
                    <p className="text-2xl text-slate-600 dark:text-slate-400">
                        Dividing the interval [{a}, {b}] into {validN} segments...
                    </p>
                    <div className="mt-6 font-mono text-xl text-indigo-500">
                        Step size (h) = {result ? formatNumber(result.h, 6) : '...'}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 4 -> 4 + (points) */}
            {isTruncated ? (
                <SlideLayout title="Evaluated Nodes & Weights" pState={pState} stepIndex={4}>
                    <div className="overflow-auto max-h-[400px] w-full">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 border-b-2 border-indigo-200">
                                    <th className="p-3">Index (i)</th>
                                    <th className="p-3">x_i</th>
                                    <th className="p-3">f(x_i)</th>
                                    <th className="p-3">Weight Mult.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stepsArray.map((step, idx) => (
                                    <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="p-2 pl-3">{step.i}</td>
                                        <td className="p-2 font-mono">{formatNumber(step.x, 4)}</td>
                                        <td className="p-2 font-mono text-indigo-600">{formatNumber(step.fx, 6)}</td>
                                        <td className="p-2 font-bold text-emerald-600">{step.multiplier}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </SlideLayout>
            ) : (
                displayablePoints.map((step, idx) => (
                    <SlideLayout
                        key={`pt-${idx}`}
                        title={`Node Evaluation ${step.i}`}
                        pState={pState}
                        stepIndex={4 + idx}
                    >
                        <div className="grid grid-cols-2 gap-6 w-full text-center">
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                                <span className="block text-sm text-slate-500 font-bold mb-2 uppercase">Position (x)</span>
                                <span className="text-3xl font-mono text-indigo-600 dark:text-indigo-400">{formatNumber(step.x, 6)}</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
                                <span className="block text-sm text-slate-500 font-bold mb-2 uppercase">Function Value f(x)</span>
                                <span className="text-3xl font-mono text-indigo-600 dark:text-indigo-400">{formatNumber(step.fx, 6)}</span>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xl col-span-2">
                                <span className="block text-sm text-emerald-600 font-bold mb-2 uppercase">Integration Weight Multiplier</span>
                                <span className="text-4xl font-mono text-emerald-700 dark:text-emerald-400 font-bold">{step.multiplier}</span>
                            </div>
                        </div>
                    </SlideLayout>
                ))
            )}

            {/* Slide: Result */}
            <SlideLayout title="Numerical Result" pState={pState} stepIndex={4 + (isTruncated ? 1 : numPoints)}>
                <div className="text-center w-full">
                    <div className="text-5xl font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 p-12 rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 shadow-inner">
                        {result && !result.error ? formatNumber(result.result, 8) : 'Error'}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide: Exact Error Analysis */}
            <SlideLayout title="Error Analysis" pState={pState} stepIndex={5 + (isTruncated ? 1 : numPoints)}>
                <div className="grid grid-cols-2 gap-8 w-full">
                    <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                        <span className="block text-sm text-slate-500 font-bold mb-4 uppercase">Exact Reference Value</span>
                        <span className="text-3xl font-mono text-indigo-600 dark:text-indigo-400">{exact !== null ? exact : 'N/A'}</span>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-8 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                        <span className="block text-sm text-orange-600 font-bold mb-4 uppercase">Absolute Error</span>
                        <span className="text-4xl font-mono text-orange-700 dark:text-orange-400">
                            {result && exact !== null && result.absoluteError !== undefined
                                ? result.absoluteError.toExponential(4)
                                : '-'}
                        </span>
                    </div>
                </div>
            </SlideLayout>

            {/* Slide: Compare */}
            <SlideLayout title="Method Comparison" pState={pState} stepIndex={6 + (isTruncated ? 1 : numPoints)}>
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
                        <div className="text-center text-slate-400">Generating comparative metrics directly from the calculation engine...</div>
                    )}
                </div>
            </SlideLayout>

            {/* Slide: Conclusion */}
            <SlideLayout title="Conclusion & Insights" pState={pState} stepIndex={7 + (isTruncated ? 1 : numPoints)}>
                <div className="text-left w-full space-y-6 text-xl">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                        <div>
                            <strong>Final Area Approximation:</strong>
                            <div className="font-mono text-3xl text-emerald-600 mt-2">{result && !result.error ? formatNumber(result.result, 6) : 'N/A'}</div>
                        </div>
                    </div>

                    {comparisonResults && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-lg text-lg mt-8">
                            <ArrowRightCircle className="h-6 w-6 text-indigo-500 mb-2 inline mr-2" />
                            For this function over the interval [{a}, {b}] with {validN} subintervals, the <strong>{comparisonResults.results.sort((a, b) => a.error - b.error)[0]?.method || 'None'}</strong> method achieved the lowest truncation error. Increasing the number of subintervals (n) would exponentially decrease the truncation error further, provided floating-point precision limits aren't hit.
                        </div>
                    )}
                </div>
            </SlideLayout>

        </div>
    );
}
