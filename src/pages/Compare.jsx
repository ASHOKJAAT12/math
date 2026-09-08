import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

import { rootFindingMetadata } from '../methods/rootFinding/index.js';
import { rootFindingPresets } from '../data/rootFindingPresets.js';
import { compareRootFindingMethods } from '../comparison/rootFindingComparison.js';
import { rankMethods } from '../comparison/ranking.js';
import { buildConvergenceData } from '../comparison/convergence.js';

import ComparisonSummary from '../components/comparison/ComparisonSummary';
import MethodRanking from '../components/comparison/MethodRanking';
import ComparisonTable from '../components/comparison/ComparisonTable';
import { ConvergenceChart, IterationChart, TimeChart, ErrorChart } from '../components/comparison/ChartComponents';
import { formatNumber } from '../utils/formatters.js';

const INITIAL_INPUTS = {
    func: '',
    deriv: '',
    lowerBound: '',
    upperBound: '',
    initialGuess: '',
    secondGuess: '',
    exactRoot: '',
    tolerance: '1e-6',
    maxIterations: '50'
};

const Compare = () => {
    // 1. Setup states
    const [inputs, setInputs] = useState(INITIAL_INPUTS);
    const [methods, setMethods] = useState(
        rootFindingMetadata.map(m => ({ ...m, selected: true }))
    );
    const [isCalculating, setIsCalculating] = useState(false);

    // Results
    const [comparisonResult, setComparisonResult] = useState(null);
    const [rankings, setRankings] = useState(null);
    const [convergenceData, setConvergenceData] = useState([]);

    const [expandedMethod, setExpandedMethod] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // 2. Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrorMsg(null);
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
                maxIterations: preset.maxIterations,
                exactRoot: preset.exactRoot || '' // Optional exact root in preset
            });
            setErrorMsg(null);
        }
    };

    const toggleMethod = (id) => {
        setMethods(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m));
    };

    const setAllMethods = (state) => {
        setMethods(prev => prev.map(m => ({ ...m, selected: state })));
    };

    const handleCompare = () => {
        setErrorMsg(null);
        setComparisonResult(null);
        setIsCalculating(true);

        setTimeout(() => {
            const selectedCount = methods.filter(m => m.selected).length;
            if (selectedCount < 2) {
                setErrorMsg("Select at least two methods to perform a comparison.");
                setIsCalculating(false);
                return;
            }

            const payloadConfig = compareRootFindingMethods(methods, inputs);

            if (payloadConfig.error) {
                setErrorMsg(payloadConfig.error);
                setIsCalculating(false);
                return;
            }

            const { data, exactRootAvailable } = payloadConfig;

            // Build Ranking
            const calculatedRanks = rankMethods(data);
            if (calculatedRanks.error && Object.keys(calculatedRanks).length === 1) {
                setErrorMsg("All selected methods failed during numerical execution! Check bounds and function.");
            }

            setRankings(calculatedRanks);
            setConvergenceData(buildConvergenceData(data));
            setComparisonResult(payloadConfig);
            setExpandedMethod(null);
            setIsCalculating(false);
        }, 50); // tiny async yield for UI "running" button state
    };

    const handleClear = () => {
        setComparisonResult(null);
        setRankings(null);
        setConvergenceData([]);
        setExpandedMethod(null);
        setErrorMsg(null);
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Method Comparison & Convergence Analysis"
                description="Objectively pit root finding algorithms against identical configurations to judge efficiency, processing speeds, and convergence limits."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">

                {/* Side Config Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3 text-sm">
                            <CardTitle>Global Input Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <select
                                className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 mb-2"
                                onChange={handlePresetChange}
                                defaultValue=""
                            >
                                <option value="" disabled>Load Demo Profile...</option>
                                {rootFindingPresets.map((preset, idx) => (
                                    <option key={idx} value={preset.name}>{preset.name}</option>
                                ))}
                            </select>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Function f(x)</label>
                                <input type="text" name="func" value={inputs.func} onChange={handleInputChange} placeholder="x^3 - x - 2" className={'w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white'} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Derivative f'(x) <span className="text-slate-400 font-normal">(Newton)</span></label>
                                <input type="text" name="deriv" value={inputs.deriv} onChange={handleInputChange} placeholder="3*x^2 - 1" className={'w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white'} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                                <div>
                                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Lower / x₀</label>
                                    <input type="number" name="lowerBound" value={inputs.lowerBound} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, initialGuess: e.target.value })) }} className={'w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white'} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Upper / x₁</label>
                                    <input type="number" name="upperBound" value={inputs.upperBound} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, secondGuess: e.target.value })) }} className={'w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white'} />
                                </div>
                            </div>

                            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">Known Exact Root (Optional)</label>
                                <input type="number" name="exactRoot" value={inputs.exactRoot} onChange={handleInputChange} placeholder="e.g. 1.5213..." className={'w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10 dark:text-white'} />
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <div>
                                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Tolerance</label>
                                    <input type="text" name="tolerance" value={inputs.tolerance} onChange={handleInputChange} className={'w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white'} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Max Iters</label>
                                    <input type="number" name="maxIterations" value={inputs.maxIterations} onChange={handleInputChange} className={'w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white'} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 text-sm flex justify-between items-center group">
                            <CardTitle>Method Selection</CardTitle>
                            <div className="flex gap-2">
                                <button onClick={() => setAllMethods(true)} className="text-[10px] uppercase font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">All</button>
                                <button onClick={() => setAllMethods(false)} className="text-[10px] uppercase font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400">Clear</button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {methods.map(m => (
                                <label key={m.id} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={m.selected}
                                        onChange={() => toggleMethod(m.id)}
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-offset-slate-900"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{m.name}</span>
                                </label>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-3 sticky top-4">
                        <Button
                            onClick={handleCompare}
                            disabled={isCalculating}
                            className={`w-full py-3 ${isCalculating ? 'opacity-80' : ''}`}
                        >
                            {isCalculating ? 'Running Math Engine...' : 'Compare Methods'}
                        </Button>

                        {comparisonResult && (
                            <Button onClick={handleClear} variant="outline" className="w-full text-xs">Clear Results</Button>
                        )}

                        {errorMsg && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400 rounded-md text-sm font-medium shadow-sm">
                                {errorMsg}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Results Area */}
                <div className="lg:col-span-3 space-y-6">

                    {/* Empty State */}
                    {!comparisonResult && !isCalculating && (
                        <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 text-center">
                            <span className="text-slate-400 dark:text-slate-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Comparison Actively Processed</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-1">Configure your problem parameters on the left and select algorithms to generate comparative analytics.</p>
                        </div>
                    )}

                    {/* Result Content */}
                    {comparisonResult && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                            {/* Ranking Card Strip */}
                            {rankings && !rankings.error && (
                                <MethodRanking rankings={rankings} />
                            )}

                            {/* Summary Text Panel */}
                            <Card>
                                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 pb-3"><CardTitle>Comparison Summary</CardTitle></CardHeader>
                                <CardContent className="pt-4">
                                    <ComparisonSummary results={comparisonResult.data} exactRootAvailable={comparisonResult.exactRootAvailable} />
                                </CardContent>
                            </Card>

                            {/* Dense Table */}
                            <Card>
                                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 pb-3"><CardTitle>Normalized Comparison Matrix</CardTitle></CardHeader>
                                <ComparisonTable results={comparisonResult.data} />
                            </Card>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="md:col-span-2 text-center">
                                    <CardHeader className="pb-2"><CardTitle className="justify-center">Convergence Pattern (Iteration vs Log Error)</CardTitle></CardHeader>
                                    <CardContent className="pt-2">
                                        <ConvergenceChart data={convergenceData} methods={methods} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="justify-center text-sm font-bold">Iterations Required</CardTitle></CardHeader>
                                    <CardContent><IterationChart results={comparisonResult.data} /></CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="justify-center text-sm font-bold">Execution Timings</CardTitle></CardHeader>
                                    <CardContent><TimeChart results={comparisonResult.data} /></CardContent>
                                </Card>

                                <Card className="md:col-span-2">
                                    <CardHeader className="pb-2"><CardTitle className="justify-center text-sm font-bold">Accuracy / End Residual (Log)</CardTitle></CardHeader>
                                    <CardContent><ErrorChart results={comparisonResult.data} exactRootAvailable={comparisonResult.exactRootAvailable} /></CardContent>
                                </Card>
                            </div>

                            {/* Drill-down Step Explainer */}
                            <Card className="border-indigo-100 dark:border-indigo-900">
                                <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/30">
                                    <CardTitle>Method Specific Logs</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {Object.values(comparisonResult.data).filter(m => m.valid).map(m => (
                                            <Button
                                                key={m.id}
                                                size="sm"
                                                variant={expandedMethod === m.id ? 'primary' : 'outline'}
                                                onClick={() => setExpandedMethod(expandedMethod === m.id ? null : m.id)}
                                            >
                                                {m.name} Details
                                            </Button>
                                        ))}
                                    </div>

                                    {expandedMethod && comparisonResult.data[expandedMethod] && comparisonResult.data[expandedMethod].steps.length > 0 && (
                                        <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in slide-in-from-top-2">
                                            <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center">
                                                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{comparisonResult.data[expandedMethod].name} Trajectory Trace</span>
                                                {comparisonResult.data[expandedMethod].converged ? <Badge variant="success" className="text-xs">Identified Root: {formatNumber(comparisonResult.data[expandedMethod].root)}</Badge> : <Badge variant="danger" className="text-xs">Failed or Max Traversals Hit</Badge>}
                                            </div>
                                            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                                                <thead>
                                                    <tr className="bg-slate-50/80 dark:bg-slate-900">
                                                        <th className="px-3 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Iter</th>
                                                        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider bg-indigo-50/40 dark:bg-indigo-900/20">Approx Root</th>
                                                        <th className="px-3 py-2 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Iter Error</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                                    {comparisonResult.data[expandedMethod].steps.map((step, idx) => {
                                                        let approxRoot;
                                                        if (expandedMethod === 'bisection' || expandedMethod === 'regulaFalsi') approxRoot = step.c;
                                                        else if (expandedMethod === 'newtonRaphson' || expandedMethod === 'secant') approxRoot = step.nextX;

                                                        return (
                                                            <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                                <td className="px-3 py-1.5 text-sm font-medium text-slate-900 dark:text-slate-100">{step.iteration}</td>
                                                                <td className="px-3 py-1.5 text-sm text-right text-indigo-700 dark:text-indigo-400 font-mono font-semibold bg-indigo-50/10 dark:bg-indigo-900/10">{formatNumber(approxRoot)}</td>
                                                                <td className="px-3 py-1.5 text-sm text-right text-slate-500 dark:text-slate-400 font-mono">{step.error !== null ? formatNumber(step.error) : '---'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                        </div>
                    )}
                </div>
            </div>
        </PageContainer>
    );
};

export default Compare;
