import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

// Config Components
import RootFindingConfig from '../components/comparison/config/RootFindingConfig';
import IntegrationConfig from '../components/comparison/config/IntegrationConfig';
import DifferentiationConfig from '../components/comparison/config/DifferentiationConfig';

// Metadata
import { rootFindingMetadata } from '../methods/rootFinding/index.js';
import { integrationMetadata } from '../methods/integration/index.js';
import { diffMetadata } from '../methods/differentiation/index.js';

// Comparison Executors
import { compareRootFindingMethods } from '../comparison/rootFindingComparison.js';
import { compareIntegrationMethods } from '../comparison/integrationComparison.js';
import { compareDifferentiationMethods } from '../comparison/differentiationComparison.js';

import { rankMethods } from '../comparison/ranking.js';
import { buildConvergenceData } from '../comparison/convergence.js';

// Generic Comparison UI
import ComparisonSummary from '../components/comparison/ComparisonSummary';
import MethodRanking from '../components/comparison/MethodRanking';
import ComparisonTable from '../components/comparison/ComparisonTable';
import { ChartCard, ConvergenceLineChart, MethodComparisonBarChart, PerformanceChart, ErrorComparisonChart } from '../components/charts';
import { createConvergenceDataset, createIterationDataset, createPerformanceDataset, createErrorDataset, createValueComparisonDataset } from '../utils/chartData.js';
import { formatNumber } from '../utils/formatters.js';
import { saveCalculation } from '../utils/historyManager.js';

const CATEGORIES = {
    ROOT_FINDING: 'rootFinding',
    INTEGRATION: 'integration',
    DIFFERENTIATION: 'differentiation'
};

const INITIAL_INPUTS = {
    [CATEGORIES.ROOT_FINDING]: { func: '', deriv: '', lowerBound: '', upperBound: '', initialGuess: '', secondGuess: '', exactRoot: '', tolerance: '1e-6', maxIterations: '50' },
    [CATEGORIES.INTEGRATION]: { func: '', a: '', b: '', n: '10', exactValue: '' },
    [CATEGORIES.DIFFERENTIATION]: { func: '', x: '', h: '0.1', exactDerivative: '', customHList: '' }
};

const Compare = () => {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES.ROOT_FINDING);

    // Config state
    const [inputs, setInputs] = useState(INITIAL_INPUTS[CATEGORIES.ROOT_FINDING]);
    const [methods, setMethods] = useState(rootFindingMetadata.map(m => ({ ...m, selected: true })));

    // Execution state
    const [isCalculating, setIsCalculating] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);
    const [rankings, setRankings] = useState(null);
    const [convergenceData, setConvergenceData] = useState([]);
    const [expandedMethod, setExpandedMethod] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Handle Category Switch
    const changeCategory = (cat) => {
        if (cat === activeCategory) return;
        setActiveCategory(cat);
        setInputs(INITIAL_INPUTS[cat]);

        let newMethods = [];
        if (cat === CATEGORIES.ROOT_FINDING) newMethods = rootFindingMetadata;
        if (cat === CATEGORIES.INTEGRATION) newMethods = integrationMetadata;
        if (cat === CATEGORIES.DIFFERENTIATION) newMethods = diffMetadata;

        setMethods(newMethods.map(m => ({ ...m, selected: true })));

        // Clear stale results
        handleClear();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
        setErrorMsg(null);
    };

    const toggleMethod = (id) => {
        setMethods(prev => prev.map(m => m.id === id ? { ...m, selected: !m.selected } : m));
    };

    const setAllMethods = (state) => {
        setMethods(prev => prev.map(m => ({ ...m, selected: state })));
    };

    const handleClear = () => {
        setComparisonResult(null);
        setRankings(null);
        setConvergenceData([]);
        setExpandedMethod(null);
        setErrorMsg(null);
    };

    const handleSave = () => {
        if (!comparisonResult) return;

        let operationName = 'Compare ';
        if (activeCategory === CATEGORIES.ROOT_FINDING) operationName += 'Root Finding Methods';
        if (activeCategory === CATEGORIES.INTEGRATION) operationName += 'Numerical Integration Methods';
        if (activeCategory === CATEGORIES.DIFFERENTIATION) operationName += 'Multi-h Analysis';

        const dataToSave = {
            category: 'Comparison',
            operation: operationName,
            input: { ...inputs },
            methods: methods.filter(m => m.selected).map(m => m.id),
            resultSummary: {
                bestMethod: rankings?.overallRanking?.[0]?.name || 'N/A',
                methodsCompared: methods.filter(m => m.selected).length
            },
            detailedResults: comparisonResult.data,
            hasExact: comparisonResult.hasExactReference
        };
        const res = saveCalculation(dataToSave);
        alert(res.message);
    };

    const handleCompare = () => {
        setErrorMsg(null);
        setComparisonResult(null);
        setIsCalculating(true);

        setTimeout(() => {
            const selectedCount = methods.filter(m => m.selected).length;
            if (selectedCount < 1) {
                setErrorMsg("Select at least one method to perform a comparison.");
                setIsCalculating(false);
                return;
            }

            let payloadConfig;

            if (activeCategory === CATEGORIES.ROOT_FINDING) {
                payloadConfig = compareRootFindingMethods(methods, inputs);
            } else if (activeCategory === CATEGORIES.INTEGRATION) {
                payloadConfig = compareIntegrationMethods(methods, inputs);
            } else if (activeCategory === CATEGORIES.DIFFERENTIATION) {
                payloadConfig = compareDifferentiationMethods(methods, inputs);
            }

            if (payloadConfig.error) {
                setErrorMsg(payloadConfig.error);
                setIsCalculating(false);
                return;
            }

            const { data, hasExactReference } = payloadConfig;

            // Build Ranking
            const calculatedRanks = rankMethods(data, activeCategory);
            // Verify if all failed
            const areAllInvalid = Object.values(data).every(m => !m.valid || (m.status && m.status !== 'Converged' && m.status !== 'success'));

            if (areAllInvalid && activeCategory === CATEGORIES.ROOT_FINDING) {
                setErrorMsg("All selected methods failed during numerical execution! Check bounds and function.");
            }

            setRankings(calculatedRanks);
            if (activeCategory === CATEGORIES.ROOT_FINDING) {
                setConvergenceData(buildConvergenceData(data));
            } else {
                setConvergenceData([]);
            }

            setComparisonResult({ ...payloadConfig, category: activeCategory });
            setExpandedMethod(null);
            setIsCalculating(false);
        }, 50);
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Unified Methods Comparison Dashboard"
                description="Objectively compare numerical algorithms across Root Finding, Integration, and Differentiation."
            />

            {/* Category Selector */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                <Button
                    variant={activeCategory === CATEGORIES.ROOT_FINDING ? 'primary' : 'outline'}
                    onClick={() => changeCategory(CATEGORIES.ROOT_FINDING)}
                >
                    Root Finding
                </Button>
                <Button
                    variant={activeCategory === CATEGORIES.INTEGRATION ? 'primary' : 'outline'}
                    onClick={() => changeCategory(CATEGORIES.INTEGRATION)}
                >
                    Numerical Integration
                </Button>
                <Button
                    variant={activeCategory === CATEGORIES.DIFFERENTIATION ? 'primary' : 'outline'}
                    onClick={() => changeCategory(CATEGORIES.DIFFERENTIATION)}
                >
                    Numerical Differentiation
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                {/* Side Config Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <Card>
                        <CardHeader className="pb-3 text-sm">
                            <CardTitle>Problem Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {activeCategory === CATEGORIES.ROOT_FINDING && (
                                <RootFindingConfig inputs={inputs} handleInputChange={handleInputChange} setInputs={setInputs} setErrorMsg={setErrorMsg} />
                            )}
                            {activeCategory === CATEGORIES.INTEGRATION && (
                                <IntegrationConfig inputs={inputs} handleInputChange={handleInputChange} setInputs={setInputs} setErrorMsg={setErrorMsg} />
                            )}
                            {activeCategory === CATEGORIES.DIFFERENTIATION && (
                                <DifferentiationConfig inputs={inputs} handleInputChange={handleInputChange} setInputs={setInputs} setErrorMsg={setErrorMsg} />
                            )}
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
                    {!comparisonResult && !isCalculating && (
                        <div className="flex flex-col items-center justify-center p-12 h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 text-center">
                            <span className="text-slate-400 dark:text-slate-500 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </span>
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Comparison Actively Processed</h3>
                            <p className="text-sm text-slate-500 max-w-sm mt-1">Select a category above, configure parameters, and run the calculation.</p>
                        </div>
                    )}

                    {comparisonResult && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                            {/* Ranking Card Strip */}
                            {rankings && !rankings.error && (
                                <MethodRanking rankings={rankings} category={activeCategory} />
                            )}

                            {/* Summary Text Panel */}
                            <Card>
                                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <CardTitle className="flex justify-between items-center">
                                        <span>Comparison Summary</span>
                                        <Button variant="outline" size="sm" onClick={handleSave}>
                                            Save Comparison
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <ComparisonSummary results={comparisonResult.data} hasExactReference={comparisonResult.hasExactReference} category={activeCategory} />
                                </CardContent>
                            </Card>

                            {/* Dense Table */}
                            <Card>
                                <CardHeader className="bg-slate-100/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 pb-3"><CardTitle>Normalized Comparison Matrix</CardTitle></CardHeader>
                                <ComparisonTable results={comparisonResult.data} category={activeCategory} />
                            </Card>

                            {/* Charts Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {activeCategory === CATEGORIES.ROOT_FINDING && (
                                    <>
                                        <div className="md:col-span-2">
                                            <ChartCard
                                                title="Convergence Pattern"
                                                description="Displays Iteration Count against Absolute Error bounds on a logarithmic scale."
                                                isEmpty={!convergenceData || convergenceData.length === 0}
                                                emptyMessage="Convergence bounds iteration tracking dynamically maps execution."
                                            >
                                                <ConvergenceLineChart data={convergenceData} selectedMethods={methods.filter(m => m.selected)} />
                                            </ChartCard>
                                        </div>
                                        <ChartCard
                                            title="Iterations Required"
                                            description="Comparison of total execution iterations required to reach parameters."
                                            isEmpty={!comparisonResult || Object.keys(comparisonResult.data).length === 0}
                                        >
                                            <MethodComparisonBarChart
                                                data={createIterationDataset(comparisonResult.data, methods.filter(m => m.selected))}
                                                dataKey="iterations"
                                                name="Iterations"
                                                yLabel="Iterations"
                                            />
                                        </ChartCard>
                                    </>
                                )}

                                {(activeCategory === CATEGORIES.INTEGRATION || activeCategory === CATEGORIES.DIFFERENTIATION) && (
                                    <ChartCard
                                        title="Value Approximation"
                                        description="Direct mapping of evaluated numerical estimates vs method formulation."
                                        isEmpty={!comparisonResult || Object.keys(comparisonResult.data).length === 0}
                                    >
                                        <MethodComparisonBarChart
                                            data={createValueComparisonDataset(comparisonResult.data, methods.filter(m => m.selected))}
                                            dataKey="value"
                                            name="Approximation"
                                            formatter={(v) => v.toExponential ? v.toExponential(4) : v}
                                        />
                                    </ChartCard>
                                )}

                                <ChartCard
                                    title="Execution Speed"
                                    description="Physical execution runtime comparisons (ms). Tiny disparities fluctuate based on JIT JS optimization."
                                    isEmpty={!comparisonResult || Object.keys(comparisonResult.data).length === 0}
                                    footerNote="Execution time is measured in the current JavaScript runtime and can vary significantly."
                                >
                                    <PerformanceChart data={createPerformanceDataset(comparisonResult.data, methods.filter(m => m.selected))} />
                                </ChartCard>

                                <div className="md:col-span-2">
                                    <ChartCard
                                        title={comparisonResult.hasExactReference ? "Absolute Error bounds" : "Residual Error Formulations"}
                                        description="Maps distance parameters on Logarithmic scales avoiding arbitrary truncations."
                                        isEmpty={!comparisonResult || Object.keys(comparisonResult.data).length === 0 || createErrorDataset(comparisonResult.data, methods.filter(m => m.selected), comparisonResult.hasExactReference, activeCategory).length === 0}
                                        emptyMessage={activeCategory === CATEGORIES.ROOT_FINDING ? "No valid errors mapped." : "Accuracy comparison requires a known exact/reference value."}
                                    >
                                        <ErrorComparisonChart
                                            data={createErrorDataset(comparisonResult.data, methods.filter(m => m.selected), comparisonResult.hasExactReference, activeCategory)}
                                            isExact={comparisonResult.hasExactReference}
                                        />
                                    </ChartCard>
                                </div>
                            </div>

                            {/* Details expander */}
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

                                    {expandedMethod && comparisonResult.data[expandedMethod] && (
                                        <div className="overflow-x-auto rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in slide-in-from-top-2 p-4">
                                            <h4 className="font-bold text-md mb-2">{comparisonResult.data[expandedMethod].name} Details</h4>
                                            <p className="text-sm">Status: <Badge variant={comparisonResult.data[expandedMethod].status === 'success' || comparisonResult.data[expandedMethod].converged ? 'success' : 'warning'}>{comparisonResult.data[expandedMethod].status}</Badge></p>
                                            <p className="text-sm font-mono mt-2">Result: {formatNumber(comparisonResult.data[expandedMethod].resultValue)}</p>
                                            <p className="text-sm font-mono">Exec Time: {formatNumber(comparisonResult.data[expandedMethod].executionTime, 4)} ms</p>

                                            {/* Could conditionally render steps here if available */}
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
