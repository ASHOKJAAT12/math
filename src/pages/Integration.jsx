import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { ChartCard, ErrorComparisonChart } from '../components/charts';

import { trapezoidal, simpson13, simpson38, integrationMetadata } from '../methods/integration/index.js';
import { createEvaluator } from '../utils/evaluator.js';
import { integrationPresets } from '../data/integrationPresets.js';
import { formatNumber } from '../utils/formatters.js';
import { createErrorDataset } from '../utils/chartData.js';
import { saveCalculation } from '../utils/historyManager.js';

const INITIAL_STATE = {
    func: '',
    lowerBound: '',
    upperBound: '',
    n: '',
    exactValue: ''
};

const Integration = () => {
    const [selectedMethodId, setSelectedMethodId] = useState('trapezoidal');
    const [inputs, setInputs] = useState(INITIAL_STATE);
    const [errors, setErrors] = useState({});
    const [runResult, setRunResult] = useState(null);

    const currentMetadata = integrationMetadata[selectedMethodId];

    // Clear results whenever inputs fundamentally change to avoid mismatched tables
    useEffect(() => {
        setRunResult(null);
        setErrors({});
    }, [selectedMethodId, inputs.func, inputs.lowerBound, inputs.upperBound, inputs.n]);

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

        const preset = integrationPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                ...inputs,
                func: preset.func,
                lowerBound: preset.lowerBound,
                upperBound: preset.upperBound,
                n: preset.n,
                exactValue: preset.exactValue || ''
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
            category: 'Numerical Integration',
            operation: currentMetadata.name,
            input: { ...inputs },
            methods: [currentMetadata.id],
            resultSummary: {
                method: runResult.method,
                result: runResult.result,
                absoluteError: runResult.absoluteError,
                executionTime: runResult.executionTime
            },
            detailedResults: {
                [currentMetadata.id]: {
                    ...runResult,
                    name: currentMetadata.name,
                    valid: runResult.result !== null
                }
            }
        };

        const res = saveCalculation(dataToSave);
        alert(res.message);
    };

    const validateInputs = () => {
        const newErrors = {};

        if (!inputs.func) newErrors.func = "Please enter a function.";

        if (inputs.lowerBound === '' || isNaN(inputs.lowerBound)) newErrors.lowerBound = "Please enter a valid number.";
        if (inputs.upperBound === '' || isNaN(inputs.upperBound)) newErrors.upperBound = "Please enter a valid number.";

        const nVal = parseInt(inputs.n, 10);
        if (inputs.n === '' || isNaN(nVal) || nVal <= 0) {
            newErrors.n = "Number of subintervals must be a positive integer.";
        } else {
            if (selectedMethodId === 'simpson13' && nVal % 2 !== 0) {
                newErrors.n = "Simpson's 1/3 Rule requires an even number of subintervals.";
            } else if (selectedMethodId === 'simpson38' && nVal % 3 !== 0) {
                newErrors.n = "Simpson's 3/8 Rule requires n to be divisible by 3.";
            }
        }

        if (inputs.exactValue !== '') {
            if (isNaN(inputs.exactValue)) {
                newErrors.exactValue = "Exact value must be a valid number if provided.";
            }
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
            setErrors({ func: `Math Error: ${e.message}. Use standard syntax like 'x^2' or 'sin(x)'.` });
            return;
        }

        const a = parseFloat(inputs.lowerBound);
        const b = parseFloat(inputs.upperBound);
        const n = parseInt(inputs.n, 10);
        const exactVal = inputs.exactValue !== '' ? parseFloat(inputs.exactValue) : null;

        let result = null;

        if (selectedMethodId === 'trapezoidal') {
            result = trapezoidal(f, a, b, n, exactVal);
        } else if (selectedMethodId === 'simpson13') {
            result = simpson13(f, a, b, n, exactVal);
        } else if (selectedMethodId === 'simpson38') {
            result = simpson38(f, a, b, n, exactVal);
        }

        if (result) {
            setRunResult(result);
        }
    };

    const getStatusBadge = (statusStr) => {
        if (!statusStr) return null;
        if (statusStr === 'converged') return <Badge variant="success">Calculated successfully</Badge>;
        if (statusStr === 'invalid-input') return <Badge variant="danger">Invalid Input</Badge>;
        return <Badge variant="danger">Numerical Failure</Badge>;
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Numerical Integration"
                description="Approximate definite integrals using geometric slice summations mapping underlying intervals accurately."
            />

            {/* Main Grid: Inputs vs Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2 space-y-6">

                    {/* Method Selector Tabs */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base">Method Selection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {Object.values(integrationMetadata).map((method) => (
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
                                {integrationPresets.map((preset, idx) => (
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
                                    id="func"
                                    type="text"
                                    name="func"
                                    value={inputs.func}
                                    onChange={handleInputChange}
                                    placeholder="e.g., x^2"
                                    className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 ${errors.func ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`}
                                />
                                {errors.func && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.func}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label htmlFor="lowerBound" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lower Limit (a)</label>
                                    <input id="lowerBound" type="number" name="lowerBound" value={inputs.lowerBound} onChange={handleInputChange} placeholder="e.g., 0" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.lowerBound ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.lowerBound && <p className="mt-1 text-xs text-red-600">{errors.lowerBound}</p>}
                                </div>
                                <div>
                                    <label htmlFor="upperBound" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Upper Limit (b)</label>
                                    <input id="upperBound" type="number" name="upperBound" value={inputs.upperBound} onChange={handleInputChange} placeholder="e.g., 1" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.upperBound ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.upperBound && <p className="mt-1 text-xs text-red-600">{errors.upperBound}</p>}
                                </div>
                                <div>
                                    <label htmlFor="n" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Number of Subintervals (n)
                                    </label>
                                    <input id="n" type="number" name="n" value={inputs.n} onChange={handleInputChange} placeholder="e.g., 6" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.n ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.n && <p className="mt-1 text-xs text-red-600">{errors.n}</p>}
                                </div>
                                <div>
                                    <label htmlFor="exactValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Exact Value <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <input id="exactValue" type="number" name="exactValue" value={inputs.exactValue} onChange={handleInputChange} placeholder="For error analysis" className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${errors.exactValue ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'}`} />
                                    {errors.exactValue && <p className="mt-1 text-xs text-red-600">{errors.exactValue}</p>}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button onClick={executeSolver} size="lg" className="w-full sm:w-auto px-8">Calculate Integral</Button>
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
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Requirements</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold">{currentMetadata.requirements}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">How It Works</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">
                                    Evaluates integrals dividing limits into <b>n</b> subintervals calculating a uniform spacing <b>h</b>. Models geometries mapping {currentMetadata.advantages} iteratively assigning formula pattern weights across sequential spans natively returning area under boundaries. ({currentMetadata.accuracyNotes})
                                </p>
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
                                    <span className="text-sm font-medium text-slate-500">Status</span>
                                    {getStatusBadge(runResult.status)}
                                </div>
                                <div className="flex items-center justify-between pb-3 border-b border-green-100 dark:border-green-900/30">
                                    <span className="text-sm font-medium text-slate-500 pt-1">Numerical Integral</span>
                                    <span className="text-2xl font-black text-green-700 dark:text-green-400 tracking-tight">
                                        {runResult.result !== null ? formatNumber(runResult.result) : '---'}
                                    </span>
                                </div>
                                <div className="pt-2">
                                    <Button variant="outline" onClick={handleSave} className="w-full">
                                        Save Result
                                    </Button>
                                </div>

                                {runResult.absoluteError !== null ? (
                                    <>
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
                                        <span className="text-xs text-slate-500 font-medium italic">Exact-value error analysis unavailable</span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center pt-1">
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
                <Card className="mt-8 overflow-hidden mb-8">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <CardTitle>Calculation Details</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-100/50 dark:bg-slate-800/50 sticky top-0">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">i</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider bg-indigo-50/30 dark:bg-indigo-900/20">xᵢ</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">f(xᵢ)</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Weight</th>
                                    <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider border-l border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-500">Contribution</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                                {runResult.steps.map((step, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{step.index}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold bg-indigo-50/10 dark:bg-indigo-900/10">{formatNumber(step.x)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono">{formatNumber(step.fx)}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono font-bold">{step.weight}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-slate-600 dark:text-slate-400 font-mono border-l border-slate-200 dark:border-slate-800">{formatNumber(step.contribution)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Error Graph */}
            {runResult && (inputs.exactValue !== '') && runResult.absoluteError !== null && (
                <div className="mt-6">
                    <ChartCard
                        title="Absolute Error"
                        description="Magnitude of deviation from exact integral."
                        isEmpty={false}
                    >
                        <ErrorComparisonChart
                            data={createErrorDataset({ [selectedMethodId]: { ...runResult, valid: true } }, [{ id: selectedMethodId, name: currentMetadata.name }], true, 'integration')}
                            isExact={true}
                        />
                    </ChartCard>
                </div>
            )}

        </PageContainer>
    );
};

export default Integration;
