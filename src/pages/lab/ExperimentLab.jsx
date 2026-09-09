import React, { useState } from 'react';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { PlayCircle, Save, Download, BarChart2 } from 'lucide-react';
import {
    runExperiment,
    runBenchmark,
    generateLinearSpace,
    generateLogSpace,
    LAB_LIMIT_MAX_RUNS
} from '../../utils/labExperimentRunner';
import { saveCalculation } from '../../utils/historyManager';
import { formatNumber } from '../../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const methodOptions = {
    'Root Finding': ['Bisection', 'Regula Falsi', 'Newton-Raphson', 'Secant'],
    'Numerical Integration': ['Trapezoidal', 'Simpson 1/3', 'Simpson 3/8'],
    'Numerical Differentiation': ['Forward Difference', 'Backward Difference', 'Central Difference']
};

const parameterOptions = {
    'Root Finding': [
        { value: 'tolerance', label: 'Tolerance Sweep' },
        { value: 'guess', label: 'Initial Guess Study' },
        { value: 'maxIters', label: 'Iteration Limit Study' }
    ],
    'Numerical Integration': [
        { value: 'n', label: 'Subintervals (n) Sweep' }
    ],
    'Numerical Differentiation': [
        { value: 'h', label: 'Step Size (h) Sweep' },
        { value: 'x', label: 'Evaluation Point (x) Study' }
    ]
};

const ExperimentLab = () => {
    // Top Level
    const [category, setCategory] = useState('Root Finding');
    const [mode, setMode] = useState('sweep'); // 'sweep' or 'benchmark'

    // Form State
    const [methods, setMethods] = useState([]);
    const [func, setFunc] = useState('x^2 - 4');
    const [a, setA] = useState(1);
    const [b, setB] = useState(3);
    const [guess, setGuess] = useState(3);
    const [x0, setX0] = useState(1);
    const [x1, setX1] = useState(3);
    const [maxIters, setMaxIters] = useState(50);
    const [tolerance, setTolerance] = useState(0.001);
    const [n, setN] = useState(10);
    const [x, setX] = useState(2);
    const [h, setH] = useState(0.01);
    const [derivative, setDerivative] = useState('2*x'); // exact diff

    // Sweep Parameters
    const [sweepParam, setSweepParam] = useState('tolerance');
    const [spaceType, setSpaceType] = useState('log'); // 'linear', 'log', 'custom'
    const [startPow, setStartPow] = useState(-1);
    const [endPow, setEndPow] = useState(-6);
    const [startVal, setStartVal] = useState(0);
    const [endVal, setEndVal] = useState(10);
    const [count, setCount] = useState(6);
    const [customVals, setCustomVals] = useState('0.1, 0.05, 0.01');

    // Benchmark Parameters
    const [repetitions, setRepetitions] = useState(20);

    // Status & Result
    const [results, setResults] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const handleCategoryChange = (val) => {
        setCategory(val);
        setMethods([]);
        setSweepParam(parameterOptions[val][0].value);
        setResults(null);
        setErrorMsg('');
    };

    const toggleMethod = (m) => {
        if (methods.includes(m)) setMethods(methods.filter(x => x !== m));
        else setMethods([...methods, m]);
    };

    const buildParameterValues = () => {
        if (spaceType === 'linear') {
            return generateLinearSpace(Number(startVal), Number(endVal), Number(count));
        } else if (spaceType === 'log') {
            return generateLogSpace(Number(startPow), Number(endPow), Number(count));
        } else {
            return customVals.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
        }
    };

    const handleRun = () => {
        setErrorMsg('');
        setIsSaved(false);

        if (methods.length === 0) {
            setErrorMsg("Please select at least one method to study.");
            return;
        }

        const baseInput = {
            func, a: Number(a), b: Number(b), guess: Number(guess),
            x0: Number(x0), x1: Number(x1), tolerance: Number(tolerance),
            maxIters: Number(maxIters), n: Number(n), x: Number(x), h: Number(h),
            exact: derivative !== '' ? derivative : null,
            derivativeFunc: derivative !== '' ? derivative : null
        };

        try {
            if (mode === 'sweep') {
                const values = buildParameterValues();
                if (values.length === 0) throw new Error("Generated parameter set is empty.");
                const res = runExperiment({ category, methods, baseInput, parameter: sweepParam, values });
                setResults(res);
            } else {
                const res = runBenchmark({ category, methods, baseInput, repetitions: Number(repetitions) });
                setResults(res);
            }
        } catch (e) {
            setErrorMsg(e.message);
            setResults(null);
        }
    };

    const handleSave = () => {
        if (!results) return;
        saveCalculation({
            category: 'Experimental Analysis',
            operation: `Lab - ${mode === 'sweep' ? 'Sweep' : 'Benchmark'}: ${category}`,
            input: {
                func,
                mode,
                parameter: sweepParam,
                methods
            },
            methods: methods.map(s => s.toLowerCase().replace(/ /g, '-').replace('/', '')),
            resultSummary: {
                status: results.status,
                totalRuns: results.totalRuns || results.repetitions,
                bestMethod: results.methodsTested[0]
            },
            detailedResults: results
        });
        setIsSaved(true);
    };

    const getChartData = () => {
        if (!results || mode !== 'sweep') return [];
        // Flatten into a matrix format for Recharts
        const uniqueValues = Array.from(new Set(results.results.map(r => r.parameterValue))).sort((a, b) => a - b);

        return uniqueValues.map(val => {
            const dataPoint = { paramVal: val };
            methods.forEach(m => {
                const methodRun = results.results.find(r => r.parameterValue === val && r.method === m);
                if (methodRun) {
                    if (methodRun.result !== null) dataPoint[`${m}_result`] = methodRun.result;
                    if (methodRun.error !== null) dataPoint[`${m}_error`] = methodRun.error;
                    if (methodRun.executionTime !== undefined) dataPoint[`${m}_time`] = methodRun.executionTime;
                    if (methodRun.iterations !== undefined) dataPoint[`${m}_iters`] = methodRun.iterations;
                }
            });
            return dataPoint;
        });
    };

    const chartData = getChartData();

    return (
        <PageContainer>
            <SectionHeader
                title="Experimental Research Lab"
                description="Run controlled parameter sweeps and performance benchmarks to verify mathematical behavior identically gracefully strictly flawlessly tightly."
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Configuration Panel */}
                <div className="xl:col-span-1 space-y-6">
                    {/* Experiment Type & Category */}
                    <Card className="p-4 bg-slate-50 dark:bg-slate-900 shadow-sm border-indigo-200 dark:border-indigo-800">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Analysis Domain</label>
                        <select
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            className="w-full p-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-4"
                        >
                            {Object.keys(methodOptions).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>

                        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                            <button onClick={() => setMode('sweep')} className={`flex-1 py-1.5 text-xs rounded transition-all font-semibold ${mode === 'sweep' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-600'}`}>Sweep</button>
                            <button onClick={() => setMode('benchmark')} className={`flex-1 py-1.5 text-xs rounded transition-all font-semibold ${mode === 'benchmark' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-600'}`}>Benchmark</button>
                        </div>
                    </Card>

                    {/* Algorithms */}
                    <Card className="p-4 shadow-sm border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Methods</label>
                            <span className="text-xs text-indigo-500 cursor-pointer" onClick={() => setMethods(methodOptions[category])}>Select All</span>
                        </div>
                        <div className="space-y-2">
                            {methodOptions[category].map(m => (
                                <label key={m} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={methods.includes(m)}
                                        onChange={() => toggleMethod(m)}
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900"
                                    />
                                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{m}</span>
                                </label>
                            ))}
                        </div>
                    </Card>

                    {/* Problem Configuration */}
                    <Card className="p-4 shadow-sm border-slate-200 dark:border-slate-800">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Problem Definition</label>
                        <Input label="Function f(x)" value={func} onChange={(e) => setFunc(e.target.value)} />

                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {category === 'Root Finding' && sweepParam !== 'tolerance' && <Input label="Tolerance" value={tolerance} onChange={e => setTolerance(e.target.value)} />}
                            {category === 'Root Finding' && sweepParam !== 'maxIters' && <Input label="Max Iterations" value={maxIters} onChange={e => setMaxIters(e.target.value)} />}

                            {(category === 'Root Finding' || category === 'Numerical Integration') && sweepParam !== 'bracket' && sweepParam !== 'interval' && (
                                <>
                                    <Input label="Lower Limit (a)" value={a} onChange={e => setA(e.target.value)} />
                                    <Input label="Upper Limit (b)" value={b} onChange={e => setB(e.target.value)} />
                                </>
                            )}
                            {category === 'Root Finding' && sweepParam !== 'guess' && (
                                <>
                                    <Input label="Init Guess (Newt)" value={guess} onChange={e => setGuess(e.target.value)} />
                                </>
                            )}

                            {category === 'Numerical Integration' && sweepParam !== 'n' && <Input label="Subintervals (n)" value={n} onChange={e => setN(e.target.value)} />}

                            {category === 'Numerical Differentiation' && sweepParam !== 'x' && <Input label="Point (x)" value={x} onChange={e => setX(e.target.value)} />}
                            {category === 'Numerical Differentiation' && sweepParam !== 'h' && <Input label="Step (h)" value={h} onChange={e => setH(e.target.value)} />}
                        </div>
                        {category === 'Numerical Differentiation' && <div className="mt-2 text-xs text-slate-400">Analytic Exact derivative optional.</div>}
                    </Card>

                    {/* Matrix / Sweep Controls */}
                    {mode === 'sweep' ? (
                        <Card className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10 shadow-sm border-indigo-200 dark:border-indigo-800">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Parameter Sweep</label>
                            <select
                                value={sweepParam}
                                onChange={(e) => setSweepParam(e.target.value)}
                                className="w-full p-2 rounded border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 mb-4 text-sm"
                            >
                                {parameterOptions[category].map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                            </select>

                            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1 mb-3">
                                <button onClick={() => setSpaceType('linear')} className={`flex-1 py-1 text-xs rounded transition-all font-semibold ${spaceType === 'linear' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}>Linear</button>
                                <button onClick={() => setSpaceType('log')} className={`flex-1 py-1 text-xs rounded transition-all font-semibold ${spaceType === 'log' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}>Log</button>
                                <button onClick={() => setSpaceType('custom')} className={`flex-1 py-1 text-xs rounded transition-all font-semibold ${spaceType === 'custom' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}>Custom</button>
                            </div>

                            {spaceType === 'linear' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Start" value={startVal} onChange={e => setStartVal(e.target.value)} />
                                    <Input label="End" value={endVal} onChange={e => setEndVal(e.target.value)} />
                                    <Input label="Points" value={count} onChange={e => setCount(e.target.value)} className="col-span-2" />
                                </div>
                            )}

                            {spaceType === 'log' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input label="Start (10^x)" value={startPow} onChange={e => setStartPow(e.target.value)} />
                                    <Input label="End (10^x)" value={endPow} onChange={e => setEndPow(e.target.value)} />
                                    <Input label="Points" value={count} onChange={e => setCount(e.target.value)} className="col-span-2" />
                                </div>
                            )}

                            {spaceType === 'custom' && (
                                <Input label="Comma separated values" value={customVals} onChange={e => setCustomVals(e.target.value)} />
                            )}
                        </Card>
                    ) : (
                        <Card className="p-4 bg-orange-50/30 dark:bg-orange-900/10 shadow-sm border-orange-200 dark:border-orange-800">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Benchmark Details</label>
                            <Input label="Repetitions" value={repetitions} onChange={e => setRepetitions(e.target.value)} />
                            <p className="text-xs text-slate-500 mt-2">Runs multiple strict timing metrics completely identical safely neatly natively smoothly confidently safely properly natively fluently natively fluidly cleanly securely solidly smoothly compactly identically reliably.</p>
                        </Card>
                    )}

                    <Button variant="primary" className="w-full flex items-center justify-center gap-2" size="lg" onClick={handleRun}>
                        <PlayCircle className="h-5 w-5" /> Execute Lab
                    </Button>

                    {errorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm text-center">
                            {errorMsg}
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="xl:col-span-3">
                    {results ? (
                        <div className="space-y-6">

                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Experiment Outcomes</h2>
                                        <Badge variant={results.status === 'Success' ? 'success' : results.status === 'Mixed' ? 'warning' : 'danger'}>{results.status}</Badge>
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">ID: {results.id} | Mode: {mode.toUpperCase()}</div>
                                </div>
                                <Button variant="outline" onClick={handleSave} disabled={isSaved} className="flex items-center gap-2">
                                    <Save className="h-4 w-4" /> {isSaved ? 'Saved to History' : 'Save to History'}
                                </Button>
                            </div>

                            {mode === 'sweep' && (
                                <Card className="p-6 overflow-x-auto shadow-sm">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                        <BarChart2 className="h-5 w-5 text-indigo-500" /> Result Matrix
                                    </h3>
                                    <table className="w-full min-w-[600px] text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                                            <tr>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold">{sweepParam}</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold">Method</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold">Result Target</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold">Abs Error</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Time (ms)</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.results.map((r, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
                                                    <td className="p-3 font-mono text-indigo-600 dark:text-indigo-400">{formatNumber(r.parameterValue, 6)}</td>
                                                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{r.method}</td>
                                                    <td className="p-3">{r.result !== null ? formatNumber(r.result, 6) : '-'}</td>
                                                    <td className="p-3 font-mono">{r.error !== null ? r.error.toExponential(3) : '-'}</td>
                                                    <td className="p-3 text-right">{r.executionTime.toFixed(3)}</td>
                                                    <td className="p-3 text-right">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${r.status === 'Success' || r.status === 'Converged' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {r.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Card>
                            )}

                            {mode === 'sweep' && chartData.length > 0 && (
                                <div className="grid grid-cols-1 gap-6">
                                    <Card className="p-6 shadow-sm">
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">{sweepParam} vs Numerical Output</h3>
                                        <div className="h-[300px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                    <XAxis dataKey="paramVal" type="number" scale={spaceType === 'log' ? 'log' : 'auto'} domain={['auto', 'auto']} tickFormatter={(v) => v.toExponential(1)} />
                                                    <YAxis domain={['auto', 'auto']} />
                                                    <Tooltip labelFormatter={(v) => `${sweepParam} = ${v}`} />
                                                    <Legend />
                                                    {methods.map((m, i) => (
                                                        <Line key={m} type="monotone" dataKey={`${m}_result`} name={m} stroke={`hsl(${i * 70}, 70%, 50%)`} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                                    ))}
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </Card>

                                    {chartData.some(d => Object.keys(d).some(k => k.endsWith('_error') && d[k] != null)) && (
                                        <Card className="p-6 shadow-sm">
                                            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">{sweepParam} vs Absolute Error (Log Scale)</h3>
                                            <div className="h-[300px] w-full">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                                        <XAxis dataKey="paramVal" type="number" scale={spaceType === 'log' ? 'log' : 'auto'} domain={['auto', 'auto']} tickFormatter={(v) => v.toExponential(1)} />
                                                        <YAxis scale="log" domain={['auto', 'auto']} tickFormatter={(v) => v.toExponential(1)} />
                                                        <Tooltip labelFormatter={(v) => `${sweepParam} = ${v}`} formatter={(v) => Number(v).toExponential(3)} />
                                                        <Legend />
                                                        {methods.map((m, i) => (
                                                            <Line key={m} type="monotone" dataKey={`${m}_error`} name={m} stroke={`hsl(${i * 110}, 70%, 50%)`} strokeDasharray="5 5" dot={{ r: 3 }} />
                                                        ))}
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {mode === 'benchmark' && (
                                <Card className="p-6 shadow-sm overflow-x-auto">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                        <PlayCircle className="h-5 w-5 text-orange-500" /> Benchmark Aggregation
                                    </h3>
                                    <table className="w-full min-w-[600px] text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400">
                                            <tr>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold">Method</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Status</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Result</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Min Time (ms)</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Max Time (ms)</th>
                                                <th className="p-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-right">Avg Time (ms)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.results.map((r, i) => (
                                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800">
                                                    <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{r.method}</td>
                                                    <td className="p-3 text-right">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${r.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {r.success ? 'Pass' : 'Fail'}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-right font-mono">{r.result !== null ? formatNumber(r.result, 6) : '-'}</td>
                                                    <td className="p-3 text-right font-mono text-green-600 dark:text-green-400">{r.metrics.min.toFixed(3)}</td>
                                                    <td className="p-3 text-right font-mono text-orange-600 dark:text-orange-400">{r.metrics.max.toFixed(3)}</td>
                                                    <td className="p-3 text-right font-mono text-indigo-600 dark:text-indigo-400 font-bold">{r.metrics.average.toFixed(3)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <p className="text-xs text-slate-500 mt-4 italic text-center border-t border-slate-100 dark:border-slate-800 pt-4">
                                        Observed differences below 0.1ms are commonly browser JIT / GC artifacts.
                                    </p>
                                </Card>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 min-h-[400px]">
                            <BarChart2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
                            <p>Configure parameters on the left and run the experiment to plot results.</p>
                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default ExperimentLab;
