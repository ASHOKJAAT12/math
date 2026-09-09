import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { ChartCard, ConvergenceLineChart } from '../components/charts';

import { bisection, regulaFalsi, newtonRaphson, secant, rootFindingMetadata } from '../methods/rootFinding/index.js';
import { createEvaluator } from '../utils/evaluator.js';
import { createConvergenceDataset } from '../utils/chartData.js';
import { rootFindingPresets } from '../data/rootFindingPresets.js';
import { formatNumber } from '../utils/formatters.js';
import { saveCalculation } from '../utils/historyManager.js';

const INITIAL_STATE = {
    func: '',
    deriv: '',
    lowerBound: '',
    upperBound: '',
    initialGuess: '',
    secondGuess: '',
    tolerance: '1e-6',
    maxIterations: '50'
};

const RootFinding = () => {
    const [selectedMethodId, setSelectedMethodId] = useState('bisection');
    const [inputs, setInputs] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [runResult, setRunResult] = useState(null);

    const currentMetadata = rootFindingMetadata.find(m => m.id === selectedMethodId);

    // Clear results whenever method or inputs fundamentally change to avoid mismatched tables
    useEffect(() => {
        setRunResult(null);
        setErrors({});
    }, [selectedMethodId, inputs.func, inputs.lowerBound, inputs.upperBound, inputs.initialGuess, inputs.secondGuess]);

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

        const preset = rootFindingPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                ...inputs,
                func: preset.func,
                deriv: preset.deriv,
                lowerBound: preset.lowerBound,
                upperBound: preset.upperBound,
                initialGuess: preset.initialGuess,
                secondGuess: preset.secondGuess,
                tolerance: preset.tolerance,
                maxIterations: preset.maxIterations
            });
            setErrors({});
        }
    };

    const handleReset = () => {
        setInputs(INITIAL_STATE);
        setErrors({});
        setRunResult(null);
    };

    const handleSave = () => {
        if (!runResult) return;
        const dataToSave = {
            category: 'Root Finding',
            operation: currentMetadata.name,
            input: { ...inputs },
            methods: [currentMetadata.id],
            resultSummary: {
                method: runResult.method,
                root: runResult.root,
                error: runResult.error,
                iterations: runResult.iterations,
                converged: runResult.converged,
                executionTime: runResult.executionTime
            },
            detailedResults: {
                [currentMetadata.id]: {
                    ...runResult,
                    name: currentMetadata.name,
                    valid: runResult.root !== null || runResult.converged
                }
            }
        };

        const res = saveCalculation(dataToSave);
        alert(res.message);
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!inputs.func) newErrors.func = "Please enter a function.";

        if (currentMetadata.requiresBracket) {
            if (!inputs.lowerBound || isNaN(inputs.lowerBound)) newErrors.lowerBound = "Please enter a valid number.";
            if (!inputs.upperBound || isNaN(inputs.upperBound)) newErrors.upperBound = "Please enter a valid number.";
            if (inputs.lowerBound && inputs.upperBound && (parseFloat(inputs.lowerBound) >= parseFloat(inputs.upperBound))) {
                newErrors.upperBound = "Upper bound must be greater than lower bound.";
            }
        }

        if (currentMetadata.requiresOneInitialGuess && !inputs.initialGuess) {
            newErrors.initialGuess = "Please enter a valid initial guess.";
        }

        if (currentMetadata.requiresTwoInitialGuesses) {
            if (!inputs.initialGuess || isNaN(inputs.initialGuess)) newErrors.initialGuess = "Please enter a valid initial guess.";
            if (!inputs.secondGuess || isNaN(inputs.secondGuess)) newErrors.secondGuess = "Please enter a valid second guess.";
            if (inputs.initialGuess === inputs.secondGuess) newErrors.secondGuess = "Please provide two different initial guesses.";
        }

        if (!inputs.tolerance || isNaN(inputs.tolerance) || parseFloat(inputs.tolerance) <= 0) {
            newErrors.tolerance = "Tolerance must be greater than 0.";
        }

        if (!inputs.maxIterations || isNaN(inputs.maxIterations) || parseInt(inputs.maxIterations) <= 0) {
            newErrors.maxIterations = "Maximum iterations must be a positive integer.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const executeSolver = () => {
        if (!validateInputs()) return;

        let f, fPrime;
        try {
            f = createEvaluator(inputs.func);
        } catch (e) {
            setErrors({ func: `Math Error: ${e.message}. Use standard syntax like 'x^2' or 'sin(x)'.` });
            return;
        }

        if (currentMetadata.requiresDerivative && inputs.deriv) {
            try {
                fPrime = createEvaluator(inputs.deriv);
            } catch (e) {
                setErrors({ deriv: `Math Error: ${e.message}` });
                return;
            }
        }

        const tol = parseFloat(inputs.tolerance);
        const maxIters = parseInt(inputs.maxIterations);
        let result = null;

        if (selectedMethodId === 'bisection') {
            result = bisection(f, inputs.lowerBound, inputs.upperBound, tol, maxIters);
        } else if (selectedMethodId === 'regulaFalsi') {
            result = regulaFalsi(f, inputs.lowerBound, inputs.upperBound, tol, maxIters);
        } else if (selectedMethodId === 'newtonRaphson') {
            // fPrime can be undefined if empty, newtonRaphson handles the fallback.
            result = newtonRaphson(f, fPrime || null, inputs.initialGuess, tol, maxIters);
        } else if (selectedMethodId === 'secant') {
            result = secant(f, inputs.initialGuess, inputs.secondGuess, tol, maxIters);
        }

        if (result) {
            setRunResult(result);
        }
    };

    const getStatusBadge = (statusObj) => {
        if (!statusObj) return null;
        if (statusObj.converged) return <Badge variant="success">Converged</Badge>;
        if (statusObj.message.includes('Max Iterations')) return <Badge variant="warning">Max Iterations Reached</Badge>;
        if (statusObj.message.includes('Invalid Input')) return <Badge variant="danger">Invalid Input</Badge>;
        return <Badge variant="danger">Numerical Failure</Badge>;
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Root Finding Methods"
                description="Select a numerical method, input your mathematical problem, and observe the iterative convergence."
            />

            {/* Main Grid: Inputs vs Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">

                    {/* Method Selector Tabs */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Method Selector</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {rootFindingMetadata.map((method) => (
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

                    {/* Problem Input Form */}
                    <Card>
                        <CardHeader className="pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Problem Input</CardTitle>
                            <select
                                className="text-sm px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
                                onChange={handlePresetChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Load Preset Example...</option>
                                {rootFindingPresets.map((preset, idx) => (
                                    <option key={idx} value={preset.name}>{preset.name}</option>
                                ))}
                            </select>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <Input
                                    id="func"
                                    type="text"
                                    name="func"
                                    label="Function f(x)"
                                    value={inputs.func}
                                    onChange={handleInputChange}
                                    placeholder="e.g., x^3 - x - 2"
                                    error={errors.func}
                                />
                            </div>

                            {currentMetadata.requiresDerivative && (
                                <div>
                                    <Input
                                        id="deriv"
                                        type="text"
                                        name="deriv"
                                        label="Derivative f'(x)"
                                        helperText="(Optional, uses numerical fallback if blank)"
                                        value={inputs.deriv}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 3*x^2 - 1"
                                        error={errors.deriv}
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                {currentMetadata.requiresBracket && (
                                    <>
                                        <div>
                                            <Input id="lowerBound" type="number" name="lowerBound" label="Lower Bound a" value={inputs.lowerBound} onChange={handleInputChange} placeholder="e.g., 1" error={errors.lowerBound} />
                                        </div>
                                        <div>
                                            <Input id="upperBound" type="number" name="upperBound" label="Upper Bound b" value={inputs.upperBound} onChange={handleInputChange} placeholder="e.g., 2" error={errors.upperBound} />
                                        </div>
                                    </>
                                )}

                                {currentMetadata.requiresOneInitialGuess && (
                                    <div>
                                        <Input id="initialGuess" type="number" name="initialGuess" label="Initial Guess x₀" value={inputs.initialGuess} onChange={handleInputChange} placeholder="e.g., 1.5" error={errors.initialGuess} />
                                    </div>
                                )}

                                {currentMetadata.requiresTwoInitialGuesses && (
                                    <>
                                        <div>
                                            <Input id="initialGuess2" type="number" name="initialGuess" label="Initial Guess x₀" value={inputs.initialGuess} onChange={handleInputChange} placeholder="e.g., 1" error={errors.initialGuess} />
                                        </div>
                                        <div>
                                            <Input id="secondGuess" type="number" name="secondGuess" label="Second Guess x₁" value={inputs.secondGuess} onChange={handleInputChange} placeholder="e.g., 2" error={errors.secondGuess} />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Input id="tolerance" type="text" name="tolerance" label="Tolerance" value={inputs.tolerance} onChange={handleInputChange} placeholder="e.g., 1e-6" error={errors.tolerance} />
                                </div>
                                <div>
                                    <Input id="maxIter" type="number" name="maxIterations" label="Max Iterations" value={inputs.maxIterations} onChange={handleInputChange} placeholder="e.g., 50" error={errors.maxIterations} />
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button onClick={executeSolver} size="lg" className="w-full sm:w-auto px-8">Run Method</Button>
                                <Button onClick={handleReset} variant="outline" size="lg" className="w-full sm:w-auto">Reset</Button>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* Info Column Sidebar */}
                <div className="space-y-6">
                    <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/40">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>Method Information</span>
                                <Badge variant="primary">{currentMetadata.category}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Algorithm</h4>
                                <p className="text-slate-800 dark:text-slate-200 font-medium text-sm">{currentMetadata.name}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Formula</h4>
                                <p className="text-slate-800 dark:text-slate-200 font-mono text-sm bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-words">{currentMetadata.formula}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{currentMetadata.shortDescription}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Convergence</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{currentMetadata.convergenceDescription}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {runResult && (
                        <Card className="border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10 transition-all">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base text-green-900 dark:text-green-100">Result Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Approx. Root</span>
                                    <span className="text-base font-bold text-green-700 dark:text-green-400">
                                        {runResult.root !== null ? formatNumber(runResult.root) : '---'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Convergence</span>
                                    <Badge variant={runResult.converged ? 'success' : 'destructive'} size="lg">
                                        {runResult.converged ? 'Converged' : 'Passed Max Iterations'}
                                    </Badge>
                                </div>
                                <div className="pt-2">
                                    <Button variant="outline" onClick={handleSave} className="w-full">
                                        Save Result
                                    </Button>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Iterations</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{runResult.iterations}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500">Exec Time</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formatNumber(runResult.executionTime, 4)} ms</span>
                                </div>
                                <div className="pt-2">
                                    <span className="text-sm font-medium text-slate-500 block mb-1">Engine Message</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">{runResult.message}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                </div>
            </div>

            {/* Iteration Details Table */}
            {runResult && runResult.steps.length > 0 && (
                <Card className="mt-8 overflow-hidden">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <CardTitle>Iteration Details</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-100/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Iter</th>

                                    {/* Bisection & Regula Falsi Headers */}
                                    {(selectedMethodId === 'bisection' || selectedMethodId === 'regulaFalsi') && (
                                        <>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">a</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">b</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-indigo-50/50 dark:bg-indigo-900/20">c (Root)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(a)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(b)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(c)</th>
                                        </>
                                    )}

                                    {/* Newton Raphson Headers */}
                                    {selectedMethodId === 'newtonRaphson' && (
                                        <>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f'(x)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-indigo-50/50 dark:bg-indigo-900/20">Next x (Root)</th>
                                        </>
                                    )}

                                    {/* Secant Headers */}
                                    {selectedMethodId === 'secant' && (
                                        <>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x₀</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">x₁</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x₀)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(x₁)</th>
                                            <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-indigo-50/50 dark:bg-indigo-900/20">Next x (Root)</th>
                                        </>
                                    )}

                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-l border-slate-200 dark:border-slate-700">Iteration Error</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {runResult.steps.map((step, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{step.iteration}</td>

                                        {/* Bisection / Regula Falsi */}
                                        {(selectedMethodId === 'bisection' || selectedMethodId === 'regulaFalsi') && (
                                            <>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.a)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.b)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold bg-indigo-50/20 dark:bg-indigo-900/10">{formatNumber(step.c)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fA)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fB)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fC)}</td>
                                            </>
                                        )}

                                        {/* Newton Raphson */}
                                        {selectedMethodId === 'newtonRaphson' && (
                                            <>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.x)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fx)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.derivative)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold bg-indigo-50/20 dark:bg-indigo-900/10">{formatNumber(step.nextX)}</td>
                                            </>
                                        )}

                                        {/* Secant */}
                                        {selectedMethodId === 'secant' && (
                                            <>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.x0)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.x1)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.f0)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.f1)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold bg-indigo-50/20 dark:bg-indigo-900/10">{formatNumber(step.nextX)}</td>
                                            </>
                                        )}

                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-amber-700 dark:text-amber-400 font-mono font-medium border-l border-slate-200 dark:border-slate-800">
                                            {step.error === null ? '---' : formatNumber(step.error)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Convergence Chart below table */}
            {runResult && runResult.steps.length > 0 && (
                <div className="mt-6 md:col-span-2">
                    <ChartCard
                        title="Convergence Trace"
                        description="Visual trace of Error Limits across numerical iterations"
                        isEmpty={false}
                    >
                        <ConvergenceLineChart
                            data={createConvergenceDataset({ [selectedMethodId]: { ...runResult, valid: true } }, [{ id: selectedMethodId, name: currentMetadata.name }])}
                            selectedMethods={[{ id: selectedMethodId, name: currentMetadata.name }]}
                        />
                    </ChartCard>
                </div>
            )}

        </PageContainer>
    );
};

export default RootFinding;
