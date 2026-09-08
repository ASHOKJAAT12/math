import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

import { forwardDifference, backwardDifference, centralDifference, diffMetadata } from '../methods/differentiation/index.js';
import { analyzeStepSizes } from '../analysis/differentiation/errorVsStepSize.js';
import { generateLogarithmicStepSizes } from '../utils/stepSizeGenerator.js';
import { createEvaluator } from '../utils/evaluator.js';
import { differentiationPresets } from '../data/differentiationPresets.js';
import { formatNumber } from '../utils/formatters.js';
import { ChartCard, HErrorChart } from '../components/charts';
import { saveCalculation } from '../utils/historyManager.js';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const INITIAL_STATE = {
    func: '',
    x: '',
    h: '',
    exactDerivative: ''
};

const Differentiation = () => {
    const [selectedMethodId, setSelectedMethodId] = useState('forward');
    const [inputs, setInputs] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});

    // Single Run Calculation State
    const [runResult, setRunResult] = useState(null);

    // Multi-h Analysis State
    const [hAnalysisMethods, setHAnalysisMethods] = useState({ forward: false, backward: false, central: true });
    const [customHList, setCustomHList] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisErrors, setAnalysisErrors] = useState({});

    const currentMetadata = diffMetadata[selectedMethodId];

    // Clear single result if fundamental inputs change
    useEffect(() => {
        setRunResult(null);
        setErrors({});
    }, [selectedMethodId, inputs.func, inputs.x, inputs.h]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePresetChange = (e) => {
        const presetName = e.target.value;
        if (!presetName) return;

        const preset = differentiationPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                func: preset.func,
                x: preset.x,
                h: preset.h,
                exactDerivative: preset.exactDerivative || ''
            });
            setErrors({});
            setRunResult(null);
        }
    };

    const handleReset = () => {
        setInputs(INITIAL_STATE);
        setErrors({});
        setRunResult(null);
        setAnalysisResult(null);
        setCustomHList('');
    };

    const handleSaveSingle = () => {
        if (!runResult) return;
        const dataToSave = {
            category: 'Numerical Differentiation',
            operation: currentMetadata.name,
            input: { ...inputs },
            methods: [currentMetadata.id],
            resultSummary: {
                method: currentMetadata.name,
                result: runResult.result,
                absoluteError: runResult.absoluteError,
                executionTime: runResult.executionTime
            },
            detailedResults: {
                [currentMetadata.id]: {
                    ...runResult,
                    name: currentMetadata.name,
                    valid: runResult.status === 'success'
                }
            }
        };
        const res = saveCalculation(dataToSave);
        alert(res.message);
    };

    const handleSaveMulti = () => {
        if (!analysisResult) return;
        const methodsUsed = [];
        if (hAnalysisMethods.forward) methodsUsed.push('forward');
        if (hAnalysisMethods.backward) methodsUsed.push('backward');
        if (hAnalysisMethods.central) methodsUsed.push('central');

        const dataToSave = {
            category: 'Numerical Differentiation',
            operation: 'Multi-h Analysis',
            input: { x: inputs.x, func: inputs.func, exactDerivative: inputs.exactDerivative, hList: analysisResult.dataset.map(d => d.h).join(', ') },
            methods: methodsUsed,
            resultSummary: {
                method: 'Multi-h Optimization',
                stepsCount: analysisResult.dataset.length,
                bestH: analysisResult.bestOverallH
            },
            detailedResults: analysisResult.dataset
        };

        const res = saveCalculation(dataToSave);
        alert(res.message);
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!inputs.func) newErrors.func = "Please enter a function.";

        if (inputs.x === '' || isNaN(inputs.x)) newErrors.x = "Please enter a valid finite number.";

        const hVal = parseFloat(inputs.h);
        if (inputs.h === '' || isNaN(hVal) || hVal <= 0) {
            newErrors.h = "Step size (h) must be a number > 0.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const executeSolver = () => {
        if (!validateInputs()) return;

        let f;
        try {
            f = createEvaluator(inputs.func);
        } catch (e) {
            setErrors({ func: `Math Error: ${e.message}.` });
            return;
        }

        const xVal = parseFloat(inputs.x);
        const hVal = parseFloat(inputs.h);

        let exactValueCalculated = null;
        if (inputs.exactDerivative) {
            try {
                // If it's a direct number
                if (!isNaN(inputs.exactDerivative)) {
                    exactValueCalculated = parseFloat(inputs.exactDerivative);
                } else {
                    // Evaluate the exact derivative function at x
                    const exactFunc = createEvaluator(inputs.exactDerivative);
                    exactValueCalculated = exactFunc(xVal);
                }
            } catch (e) {
                setErrors({ exactDerivative: `Exact derivative evaluation failed: ${e.message}` });
                return;
            }
        }

        let result = null;
        if (selectedMethodId === 'forward') {
            result = forwardDifference(f, xVal, hVal, exactValueCalculated);
        } else if (selectedMethodId === 'backward') {
            result = backwardDifference(f, xVal, hVal, exactValueCalculated);
        } else if (selectedMethodId === 'central') {
            result = centralDifference(f, xVal, hVal, exactValueCalculated);
        }

        if (result) {
            setRunResult(result);
        }
    };

    const getStatusBadge = (statusStr) => {
        if (!statusStr) return null;
        if (statusStr === 'success') return <Badge variant="success">Calculated successfully</Badge>;
        if (statusStr === 'invalid-input') return <Badge variant="danger">Invalid Input</Badge>;
        return <Badge variant="danger">Numerical Failure</Badge>;
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Numerical Differentiation"
                description="Approximate derivatives from mathematical operators exploring absolute scalar stability versus round-off truncations structurally."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">
                    {/* Method Selector */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Method Selection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(diffMetadata).map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethodId(method.id)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedMethodId === method.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        {method.name}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Problem Input */}
                    <Card>
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Problem Input</CardTitle>
                            <select
                                className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                                onChange={handlePresetChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Load Preset Example...</option>
                                {differentiationPresets.map((preset, idx) => (
                                    <option key={idx} value={preset.name}>{preset.name}</option>
                                ))}
                            </select>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label htmlFor="func" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Function f(x)
                                </label>
                                <input
                                    id="func" type="text" name="func" value={inputs.func} onChange={handleInputChange} placeholder="e.g., x^3"
                                    className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.func ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                />
                                {errors.func && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.func}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label htmlFor="x" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Evaluation Point (x)</label>
                                    <input id="x" type="number" name="x" value={inputs.x} onChange={handleInputChange} placeholder="e.g., 2" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.x ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.x && <p className="mt-1 text-xs text-red-600">{errors.x}</p>}
                                </div>
                                <div>
                                    <label htmlFor="h" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Step Size (h)
                                    </label>
                                    <input id="h" type="number" name="h" step="0.001" value={inputs.h} onChange={handleInputChange} placeholder="e.g., 0.01" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.h ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.h ? <p className="mt-1 text-xs text-red-600">{errors.h}</p> : <p className="mt-1 text-xs text-slate-500">Smaller h does not always mean smaller numerical error because floating-point round-off can become important.</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="exactDerivative" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Exact Derivative f'(x) <span className="text-slate-400 font-normal">(Optional function or value)</span>
                                    </label>
                                    <input id="exactDerivative" type="text" name="exactDerivative" value={inputs.exactDerivative} onChange={handleInputChange} placeholder="e.g., 3*x^2 or 12" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.exactDerivative ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.exactDerivative && <p className="mt-1 text-xs text-red-600">{errors.exactDerivative}</p>}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button onClick={executeSolver} size="lg" className="w-full sm:w-auto px-8">Calculate Derivative</Button>
                                <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">Reset</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info & Output */}
                <div className="space-y-6">
                    <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Method Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Formula</h4>
                                <p className="text-slate-800 dark:text-slate-200 font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-words">{currentMetadata.formula}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Accuracy</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{currentMetadata.accuracy}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">How It Works</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    {currentMetadata.description} {currentMetadata.advantages} {currentMetadata.limitations}
                                    {selectedMethodId === 'central' && ' Central formula provides better truncation accuracy mathematically than first-order.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {runResult && (
                        <Card className="border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-green-900 dark:text-green-100">Result Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Status</span>
                                    {getStatusBadge(runResult.status)}
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500 pt-1">Numerical Derivative</span>
                                    <span className="text-2xl font-black text-green-700 dark:text-green-400 tracking-tight">
                                        {runResult.result !== null ? formatNumber(runResult.result) : '---'}
                                    </span>
                                </div>

                                {runResult.absoluteError !== null ? (
                                    <>
                                        <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                            <span className="text-sm font-medium text-slate-500">Absolute Error</span>
                                            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatNumber(runResult.absoluteError, 10)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                            <span className="text-sm font-medium text-slate-500">Relative Error</span>
                                            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatNumber(runResult.relativeError, 10)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                            <span className="text-sm font-medium text-slate-500">% Error</span>
                                            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{formatNumber(runResult.percentageError, 4)}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="pt-1 pb-2 border-b border-green-100 dark:border-green-900/30">
                                        <span className="text-xs text-slate-500 font-medium italic">Exact-error analysis unavailable</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-1 pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Exec Time</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatNumber(runResult.executionTime, 4)} ms</span>
                                </div>
                                <div className="pt-2">
                                    <Button variant="outline" onClick={handleSaveSingle} className="w-full">
                                        Save Result
                                    </Button>
                                </div>
                                {runResult.message && runResult.status !== 'success' && (
                                    <div className="pt-2">
                                        <span className="text-sm font-medium text-red-500 block mb-1">Engine Output</span>
                                        <p className="text-xs text-red-600 dark:text-red-400 leading-snug">{runResult.message}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Calculation Details Table */}
            {runResult && runResult.steps.length > 0 && (
                <Card className="mt-8 mb-12 overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <CardTitle>Calculation Details</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-100/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Evaluation Point (x)</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">h</th>
                                    {selectedMethodId === 'forward' && <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x + h</th>}
                                    {selectedMethodId === 'backward' && <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x - h</th>}
                                    {selectedMethodId === 'central' && (
                                        <>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x + h</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x - h</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x + h)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x - h)</th>
                                        </>
                                    )}
                                    {selectedMethodId !== 'central' && (
                                        <>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">{selectedMethodId === 'forward' ? 'f(x + h)' : 'f(x - h)'}</th>
                                        </>
                                    )}
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-indigo-50/30 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400">Approximate Derivative</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {runResult.steps.map((step, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100 font-mono">{formatNumber(step.x)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.h)}</td>
                                        {selectedMethodId === 'forward' && <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.xPlusH)}</td>}
                                        {selectedMethodId === 'backward' && <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.xMinusH)}</td>}
                                        {selectedMethodId === 'central' && (
                                            <>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.xPlusH)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.xMinusH)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fxPlusH)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fxMinusH)}</td>
                                            </>
                                        )}
                                        {selectedMethodId !== 'central' && (
                                            <>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fx)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{selectedMethodId === 'forward' ? formatNumber(step.fxPlusH) : formatNumber(step.fxMinusH)}</td>
                                            </>
                                        )}
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-bold bg-indigo-50/10 dark:bg-indigo-900/10">{formatNumber(step.derivative)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Multi-h Error Analysis Section */}
            <Card className="mt-8 mb-2">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Analyze Error for Different h Values</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Methods to Analyze</h4>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" checked={hAnalysisMethods.forward} onChange={(e) => setHAnalysisMethods(p => ({ ...p, forward: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Forward Difference</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" checked={hAnalysisMethods.backward} onChange={(e) => setHAnalysisMethods(p => ({ ...p, backward: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Backward Difference</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input type="checkbox" checked={hAnalysisMethods.central} onChange={(e) => setHAnalysisMethods(p => ({ ...p, central: e.target.checked }))} className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Central Difference</span>
                                    </label>
                                </div>
                                {analysisErrors.methods && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{analysisErrors.methods}</p>}
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Step Sizes (h)</h4>
                                <div className="flex items-center gap-3 mb-2">
                                    <Button size="sm" variant="outline" onClick={() => setCustomHList('0.1, 0.01, 0.001, 0.0001, 0.00001')}>Load Automatic Logarithmic Set</Button>
                                </div>
                                <input
                                    type="text"
                                    value={customHList}
                                    onChange={(e) => {
                                        setCustomHList(e.target.value);
                                        if (analysisErrors.hList) setAnalysisErrors(p => ({ ...p, hList: null }));
                                    }}
                                    placeholder="e.g., 0.1, 0.01, 0.001"
                                    className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${analysisErrors.hList ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                />
                                {analysisErrors.hList && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{analysisErrors.hList}</p>}
                            </div>

                            <div className="pt-4 flex gap-4">
                                <Button onClick={() => {
                                    const errs = {};
                                    if (!hAnalysisMethods.forward && !hAnalysisMethods.backward && !hAnalysisMethods.central) {
                                        errs.methods = "Select at least one method.";
                                    }
                                    if (!inputs.func) errs.hList = "Please provide f(x) in Problem Input above.";
                                    if (inputs.x === '' || isNaN(inputs.x)) errs.hList = "Please provide valid x in Problem Input above.";

                                    const parsedH = customHList.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                                    if (parsedH.length === 0 || parsedH.some(n => n <= 0)) {
                                        errs.hList = "Provide a comma-separated list of positive numbers for h.";
                                    }

                                    let exactValueCalculated = null;
                                    if (inputs.exactDerivative) {
                                        try {
                                            if (!isNaN(inputs.exactDerivative)) {
                                                exactValueCalculated = parseFloat(inputs.exactDerivative);
                                            } else {
                                                const exactFunc = createEvaluator(inputs.exactDerivative);
                                                exactValueCalculated = exactFunc(parseFloat(inputs.x));
                                            }
                                        } catch (e) {
                                            errs.hList = "Failed to evaluate Exact Derivative.";
                                        }
                                    }

                                    if (Object.keys(errs).length > 0) {
                                        setAnalysisErrors(errs);
                                        return;
                                    }

                                    let f;
                                    try {
                                        f = createEvaluator(inputs.func);
                                    } catch (e) {
                                        setAnalysisErrors({ hList: "Failed to evaluate f(x)." });
                                        return;
                                    }

                                    const dataset = analyzeStepSizes(f, parseFloat(inputs.x), parsedH, exactValueCalculated);

                                    let best = {};
                                    if (exactValueCalculated !== null) {
                                        if (hAnalysisMethods.forward) best.forward = dataset.reduce((prev, curr) => curr.forwardError !== null && curr.forwardError < prev.forwardError ? curr : prev).h;
                                        if (hAnalysisMethods.backward) best.backward = dataset.reduce((prev, curr) => curr.backwardError !== null && curr.backwardError < prev.backwardError ? curr : prev).h;
                                        if (hAnalysisMethods.central) best.central = dataset.reduce((prev, curr) => curr.centralError !== null && curr.centralError < prev.centralError ? curr : prev).h;
                                    }

                                    setAnalysisResult({ dataset, best, hasExact: exactValueCalculated !== null });
                                }} className="px-6">Analyze Step Sizes</Button>
                                <Button onClick={() => { setAnalysisResult(null); setCustomHList(''); }} variant="outline">Clear Analysis</Button>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded p-4">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Important h Analysis Insight</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                Observe how the error changes as h decreases. Very small h values can eventually suffer from floating-point round-off and cancellation, so accuracy may stop improving.
                            </p>
                            {analysisResult?.hasExact && (
                                <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Best observed h</h5>
                                    {hAnalysisMethods.forward && <div className="text-sm"><span className="text-slate-500">Forward Difference:</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{analysisResult.best.forward}</span></div>}
                                    {hAnalysisMethods.backward && <div className="text-sm"><span className="text-slate-500">Backward Difference:</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{analysisResult.best.backward}</span></div>}
                                    {hAnalysisMethods.central && <div className="text-sm"><span className="text-slate-500">Central Difference:</span> <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{analysisResult.best.central}</span></div>}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {analysisResult && (
                <>
                    {analysisResult.hasExact && (
                        <div className="mb-8 h-[450px]">
                            <ChartCard
                                title="Error vs Step Size (h)"
                                description="Scale is Logarithmic (Base 10). Zero errors are skipped."
                                isEmpty={false}
                            >
                                <HErrorChart
                                    data={analysisResult.dataset.filter(d =>
                                        (hAnalysisMethods.forward ? d.forwardError > 0 && d.forwardError !== null : true) &&
                                        (hAnalysisMethods.backward ? d.backwardError > 0 && d.backwardError !== null : true) &&
                                        (hAnalysisMethods.central ? d.centralError > 0 && d.centralError !== null : true)
                                    )}
                                    methodsMap={hAnalysisMethods}
                                />
                            </ChartCard>
                        </div>
                    )}

                    <Card className="mb-12 overflow-hidden">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-row items-center justify-between">
                            <CardTitle>Step-Size Analysis Matrix</CardTitle>
                            <Button variant="outline" size="sm" onClick={handleSaveMulti}>
                                Save Multi-h Result
                            </Button>
                        </CardHeader>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                                <thead className="bg-slate-100/50 dark:bg-slate-800/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">h</th>
                                        {hAnalysisMethods.forward && (
                                            <>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Fwd Deriv</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Fwd Error</th>
                                            </>
                                        )}
                                        {hAnalysisMethods.backward && (
                                            <>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Bwd Deriv</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Bwd Error</th>
                                            </>
                                        )}
                                        {hAnalysisMethods.central && (
                                            <>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cen Deriv</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Cen Error</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                    {analysisResult.dataset.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">{formatNumber(row.h)}</td>
                                            {hAnalysisMethods.forward && (
                                                <>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{row.forwardDerivative !== null ? formatNumber(row.forwardDerivative) : 'Failure'}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400 font-mono">{analysisResult.hasExact && row.forwardError !== null ? formatNumber(row.forwardError, 10) : 'Unavailable'}</td>
                                                </>
                                            )}
                                            {hAnalysisMethods.backward && (
                                                <>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{row.backwardDerivative !== null ? formatNumber(row.backwardDerivative) : 'Failure'}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-blue-600 dark:text-blue-400 font-mono">{analysisResult.hasExact && row.backwardError !== null ? formatNumber(row.backwardError, 10) : 'Unavailable'}</td>
                                                </>
                                            )}
                                            {hAnalysisMethods.central && (
                                                <>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{row.centralDerivative !== null ? formatNumber(row.centralDerivative) : 'Failure'}</td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400 font-mono">{analysisResult.hasExact && row.centralError !== null ? formatNumber(row.centralError, 10) : 'Unavailable'}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </>
            )
            }
        </PageContainer >
    );
};

export default Differentiation;
