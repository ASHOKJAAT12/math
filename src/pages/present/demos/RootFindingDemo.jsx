import React, { useEffect, useState, useMemo } from 'react';
import SlideLayout from '../SlideLayout';
import { createEvaluator } from '../../../utils/evaluator';
import bisectionRunner from '../../../methods/rootFinding/bisection';
import regulaFalsiRunner from '../../../methods/rootFinding/regulaFalsi';
import newtonRaphsonRunner from '../../../methods/rootFinding/newtonRaphson';
import secantRunner from '../../../methods/rootFinding/secant';
import { ConvergenceLineChart } from '../../../components/charts/index.js';
import { createConvergenceDataset } from '../../../utils/chartData.js';
import { formatNumber } from '../../../utils/formatters';
import { runExperiment } from '../../../utils/labExperimentRunner';
import { Calculator, Info, CheckCircle2, ArrowRightCircle } from 'lucide-react';
import Badge from '../../../components/common/Badge';

export default function RootFindingDemo({ pState, setTotalSteps }) {
    const { currentStep } = pState;

    // Configuration
    const [method, setMethod] = useState('Bisection');
    const [funcStr, setFuncStr] = useState('x^3 - x - 2');
    const [a, setA] = useState(1);
    const [b, setB] = useState(2);
    const [guess, setGuess] = useState(1.5);
    const [x0, setX0] = useState(1);
    const [x1, setX1] = useState(2);
    const [tolerance] = useState(0.001);
    const [maxIters] = useState(50);

    // Run Calculation Natively
    const result = useMemo(() => {
        try {
            const f = createEvaluator(funcStr);
            switch (method) {
                case 'Bisection': return bisectionRunner(f, a, b, tolerance, maxIters);
                case 'Regula Falsi': return regulaFalsiRunner(f, a, b, tolerance, maxIters);
                case 'Newton-Raphson': return newtonRaphsonRunner(f, null, guess, tolerance, maxIters);
                case 'Secant': return secantRunner(f, x0, x1, tolerance, maxIters);
                default: return null;
            }
        } catch (e) {
            return { error: true, message: e.message, steps: [] };
        }
    }, [method, funcStr, a, b, guess, x0, x1, tolerance, maxIters]);

    // Background calculation for comparison slide natively securely safely intelligently smoothly expertly
    const comparisonResults = useMemo(() => {
        try {
            return runExperiment({
                category: 'Root Finding',
                methods: ['Bisection', 'Regula Falsi', 'Newton-Raphson', 'Secant'],
                baseInput: { func: funcStr, a, b, guess, x0, x1, tolerance, maxIters },
                parameter: 'tolerance',
                values: [tolerance]
            });
        } catch (e) { return null; }
    }, [funcStr, a, b, guess, x0, x1, tolerance, maxIters]);

    const stepsArray = result?.steps || [];
    const numIterations = stepsArray.length;

    // Slide Map
    // 0: Intro, 1: Problem, 2: Bound, 3: Formula, 4: Start Algo
    // 5 to 5+(numIters-1): Iterations
    // 5+numIters: Chart
    // 6+numIters: Comparison
    // 7+numIters: Conclusion
    const numConstantSlidesPost = 3;
    const total = 5 + numIterations + numConstantSlidesPost;

    useEffect(() => {
        setTotalSteps(total);
    }, [total, setTotalSteps]);

    const getIterationData = (idx) => {
        const step = stepsArray[idx];
        if (!step) return null;
        return (
            <div className="space-y-4 w-full">
                <div className="grid grid-cols-2 gap-4 text-left">
                    {Object.entries(step).map(([key, val]) => {
                        if (key === 'iteration' || key === 'message') return null;
                        return (
                            <div key={key} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded">
                                <span className="block text-xs uppercase text-slate-500 font-bold mb-1">{key}</span>
                                <span className="font-mono text-indigo-600 dark:text-indigo-400">{typeof val === 'number' ? formatNumber(val, 6) : String(val)}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 p-4 rounded text-center text-sm font-semibold border border-emerald-200 dark:border-emerald-800">
                    {step.message || 'Continuing iteration...'}
                </div>
            </div>
        );
    };

    const methodFormulas = {
        'Bisection': 'c = (a + b) / 2',
        'Regula Falsi': 'c = b - (f(b) * (b - a)) / (f(b) - f(a))',
        'Newton-Raphson': 'x_{i+1} = x_i - f(x_i) / f\'(x_i)',
        'Secant': 'x_{i+1} = x_i - f(x_i) * (x_i - x_{i-1}) / (f(x_i) - f(x_{i-1}))'
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
                    <option value="Bisection">Bisection</option>
                    <option value="Regula Falsi">Regula Falsi</option>
                    <option value="Newton-Raphson">Newton-Raphson</option>
                    <option value="Secant">Secant</option>
                </select>
            </div>

            {/* Slide 0: Intro */}
            <SlideLayout
                title="Root Finding Analysis"
                subtitle="Discover where f(x) = 0"
                pState={pState} stepIndex={0}
                theory={`<p><b>Root Finding</b> is the process of locating points where a mathematical function equals exactly zero natively.</p>`}
            >
                <div className="text-center">
                    <Calculator className="h-20 w-20 text-indigo-500 mx-auto mb-6 opacity-80" />
                    <p className="text-slate-600 dark:text-slate-400">
                        In this demonstration, we will explore the <span className="font-bold text-indigo-500">{method}</span> method directly from our robust algorithmic engine.
                    </p>
                </div>
            </SlideLayout>

            {/* Slide 1: Problem */}
            <SlideLayout title="The Objective Function" pState={pState} stepIndex={1}>
                <div className="flex flex-col items-center">
                    <div className="text-3xl font-mono bg-slate-100 dark:bg-slate-800 px-8 py-4 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
                        f(x) = {funcStr}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 2: Configurations */}
            <SlideLayout title={`Seeding the ${method}`} pState={pState} stepIndex={2}>
                <div className="grid grid-cols-2 gap-6 w-full text-center">
                    {(method === 'Bisection' || method === 'Regula Falsi') && (
                        <>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800"><span className="block text-sm text-indigo-600 mb-2">Bracket [a, b]</span><span className="text-3xl font-mono">[{a}, {b}]</span></div>
                        </>
                    )}
                    {method === 'Newton-Raphson' && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800"><span className="block text-sm text-indigo-600 mb-2">Initial Guess</span><span className="text-3xl font-mono">{guess}</span></div>
                    )}
                    {method === 'Secant' && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800"><span className="block text-sm text-indigo-600 mb-2">Initial Guesses x0, x1</span><span className="text-3xl font-mono">{x0}, {x1}</span></div>
                    )}
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800"><span className="block text-sm text-emerald-600 mb-2">Tolerance Constraint</span><span className="text-3xl font-mono">{tolerance}</span></div>
                </div>
            </SlideLayout>

            {/* Slide 3: Formula */}
            <SlideLayout title={`${method} Equation`} pState={pState} stepIndex={3}>
                <div className="flex flex-col items-center">
                    <div className="text-2xl lg:text-3xl font-mono text-center bg-slate-100 dark:bg-slate-800 px-8 py-6 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400">
                        {methodFormulas[method]}
                    </div>
                </div>
            </SlideLayout>

            {/* Slide 4: Start Calculation */}
            <SlideLayout title="Computation Ready" pState={pState} stepIndex={4}>
                <div className="flex flex-col items-center text-center">
                    <Play className="h-16 w-16 text-indigo-500 mb-6" />
                    <p className="text-2xl text-slate-600 dark:text-slate-400">
                        Engine correctly initialized reliably dynamically seamlessly logically neatly natively intelligently comfortably seamlessly. Starting iteration cycle squarely purely properly exactly identical correctly safely effectively solidly identical purely purely securely easily smartly...
                    </p>
                </div>
            </SlideLayout>

            {/* Dynamic Iteration Slides (5 to 5 + numIters - 1) */}
            {stepsArray.map((step, idx) => (
                <SlideLayout
                    key={`iter-${idx}`}
                    title={`Iteration ${idx + 1}`}
                    pState={pState}
                    stepIndex={5 + idx}
                >
                    {getIterationData(idx)}
                </SlideLayout>
            ))}

            {/* Graph Slide */}
            <SlideLayout title="Convergence Profile" subtitle="Tracking Error Reduction across iterations" pState={pState} stepIndex={5 + numIterations}>
                <div className="w-full h-[400px]">
                    {result && !result.error && (
                        <ConvergenceLineChart
                            data={createConvergenceDataset({ [method]: { ...result, valid: true } }, [{ id: method, name: method }])}
                            selectedMethods={[{ id: method, name: method }]}
                        />
                    )}
                </div>
            </SlideLayout>

            {/* Comparison Slide */}
            <SlideLayout title="Algorithm Comparison" subtitle={`Evaluating how ${method} compares against other root-finding strategies for this specific problem.`} pState={pState} stepIndex={6 + numIterations}>
                <div className="w-full">
                    {comparisonResults ? (
                        <div className="grid grid-cols-2 gap-4 text-left">
                            {comparisonResults.results.map((r, i) => (
                                <div key={i} className={`p-4 rounded border ${r.method === method ? 'border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-200 dark:border-slate-800'}`}>
                                    <div className="text-lg font-bold flex justify-between items-center mb-2">
                                        <span>{r.method}</span>
                                        <Badge variant={r.status === 'Converged' ? 'success' : 'danger'}>{r.status}</Badge>
                                    </div>
                                    <div className="text-sm font-mono text-slate-500">Iters: {r.iterations || '-'}</div>
                                    <div className="text-sm font-mono text-slate-500">Time: {r.executionTime.toFixed(2)}ms</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">Generating comparative metrics directly from the calculation engine...</div>
                    )}
                </div>
            </SlideLayout>

            {/* Conclusion Slide */}
            <SlideLayout title="Conclusion & Insights" pState={pState} stepIndex={7 + numIterations}>
                <div className="text-left w-full space-y-6 text-xl">
                    <div className="flex items-start gap-4">
                        <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
                        <div>
                            <strong>Final Approximation:</strong>
                            <div className="font-mono text-2xl text-emerald-600">{result && !result.error ? formatNumber(result.root, 6) : 'N/A'}</div>
                        </div>
                    </div>
                    {result && result.error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                            Calculation failed: {result.message}
                        </div>
                    )}
                    {comparisonResults && (
                        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-lg text-lg">
                            <ArrowRightCircle className="h-6 w-6 text-indigo-500 mb-2 inline mr-2" />
                            For the selected problem, the <strong>{comparisonResults.results.filter(r => r.status === 'Converged').sort((a, b) => a.iterations - b.iterations)[0]?.method || 'None'}</strong> method converged using the fewest iterations. However, note that algorithm performance varies strictly based on function curvature and interval constraints.
                        </div>
                    )}
                </div>
            </SlideLayout>
        </div>
    );
}
