import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { runRootFindingExperiment, runIntegrationExperiment, runDifferentiationExperiment } from '../utils/experimentRunner';
import { analyzeSuitability, generateExperimentInsights } from '../utils/insightEngine';
import { saveCalculation } from '../utils/historyManager';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const EXPERIMENT_TEMPLATES = {
    ROOT_TOLERANCE: {
        id: 'TOL_STUDY',
        label: 'Root Finding: Tolerance vs Iterations',
        category: 'Root Finding',
        type: 'tolerance',
        desc: 'Observe how tightening tolerance affects the number of iterations required to converge.',
        defaultExp: 'x^3 - x - 2',
        defaultValues: '0.01, 0.001, 0.0001, 0.00001, 0.000001'
    },
    ROOT_GUESS: {
        id: 'NR_GUESS',
        label: 'Newton-Raphson: Initial Guess Sensitivity',
        category: 'Root Finding',
        type: 'guess',
        desc: 'Testing how highly sensitive Newton-Raphson can be depending on the starting guess.',
        defaultExp: 'x^3 - x - 2',
        defaultValues: '-3, -2, -1, 0, 1, 2, 3'
    },
    INT_N: {
        id: 'INT_N',
        label: 'Integration: Approximations by n',
        category: 'Integration',
        type: 'n_study',
        desc: 'Study numerical error behavior as you increase subinterval fidelity (n).',
        defaultExp: 'x^2',
        defaultValues: '2, 4, 6, 8, 10, 12, 14, 16'
    },
    DIFF_H: {
        id: 'DIFF_H',
        label: 'Differentiation: Error by Step Size h',
        category: 'Differentiation',
        type: 'h_study',
        desc: 'Observe how central difference behaves as h decreases. Beware floating-point roundoff at tiny ranges.',
        defaultExp: 'x^3',
        defaultValues: '0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001'
    }
};

const AdvancedAnalysis = () => {
    const [templateId, setTemplateId] = useState('TOL_STUDY');
    const [expression, setExpression] = useState(EXPERIMENT_TEMPLATES.ROOT_TOLERANCE.defaultExp);
    const [paramList, setParamList] = useState(EXPERIMENT_TEMPLATES.ROOT_TOLERANCE.defaultValues);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Experiment Results State
    const [experimentData, setExperimentData] = useState(null);
    const [insights, setInsights] = useState([]);
    const [suitabilityRules, setSuitabilityRules] = useState([]);
    const [savedStatus, setSavedStatus] = useState(false);

    const handleTemplateChange = (e) => {
        const tId = e.target.value;
        setTemplateId(tId);
        setExpression(EXPERIMENT_TEMPLATES[tId].defaultExp);
        setParamList(EXPERIMENT_TEMPLATES[tId].defaultValues);
        setExperimentData(null);
        setErrorMsg(null);
        setSavedStatus(false);
    };

    const parseParams = (str, type) => {
        return str.split(',')
            .map(s => s.trim())
            .map(Number)
            .filter(n => !isNaN(n));
    };

    const runExperiment = () => {
        setIsCalculating(true);
        setErrorMsg(null);
        setSavedStatus(false);
        setExperimentData(null);

        // Small delay to allow UI to render "Calculating..." badge
        setTimeout(() => {
            const template = EXPERIMENT_TEMPLATES[templateId];

            try {
                let params = parseParams(paramList);
                if (params.length === 0) throw new Error("Please provide valid comma separated numbers.");
                if (params.length > 50) throw new Error("Experiment too large. Reduce the parameter range (max 50).");

                let result;
                let context = {};

                if (template.category === 'Root Finding') {
                    const method = template.id === 'NR_GUESS' ? 'Newton-Raphson' : 'Bisection';
                    const config = {
                        methodName: method,
                        a: 1, b: 2, // Fixed for demo simplicity
                        x0: 1, x1: 2,
                        baseTolerance: 0.001,
                        baseGuess: 1,
                        maxIters: 100
                    };
                    context = { hasBracket: true, hasDerivative: true };
                    result = runRootFindingExperiment(expression, template.type, params, config);
                } else if (template.category === 'Integration') {
                    // For x^2 from 0 to 1, exact is 1/3
                    const exact = expression === 'x^2' ? (1 / 3) : null;
                    context = { n: params[0] || 2 };
                    result = runIntegrationExperiment(expression, 0, 1, params, 'Simpson 1/3', exact);
                } else if (template.category === 'Differentiation') {
                    // For x^3 at x=2, exact is 12
                    const exact = expression === 'x^3' ? 12 : null;
                    result = runDifferentiationExperiment(expression, 2, params, 'Central', exact);
                }

                setExperimentData(result);
                setSuitabilityRules(analyzeSuitability(template.category, context));
                setInsights(generateExperimentInsights(result));
            } catch (err) {
                setErrorMsg(err.message);
            }
            setIsCalculating(false);
        }, 100);
    };

    const handleSaveExperiment = () => {
        if (!experimentData) return;
        saveCalculation({
            type: 'Advanced Experiment',
            module: experimentData.category,
            expression: experimentData.expression,
            exactValue: null,
            result: 'Experiment Suite',
            details: `Experiment Type: ${experimentData.experimentType}`,
            timestamp: experimentData.timestamp,
            experimentData: experimentData,
            insights: insights
        });
        setSavedStatus(true);
    };

    const handleClear = () => {
        setExperimentData(null);
        setSavedStatus(false);
        setErrorMsg(null);
        setInsights([]);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Advanced Analysis Dashboard</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Investigate convergence sensitivity and study error distributions mathematically.
                </p>

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200">Educational Sidebar: Round-off vs Truncation</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        <strong>Truncation Error</strong> arises when a mathematical process is approximated (e.g. limiting series or finite steps).
                        <strong> Round-off Error</strong> originates from physical computer memory restrictions representing irrational or infinite decimal numbers natively in JS (IEEE 754 Floating-point).
                    </p>
                </div>
            </header>

            <Card title="Experiment Configuration">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Templates
                        </label>
                        <select
                            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={templateId}
                            onChange={handleTemplateChange}
                        >
                            {Object.values(EXPERIMENT_TEMPLATES).map(t => (
                                <option key={t.id} value={t.id}>{t.label}</option>
                            ))}
                        </select>
                        <p className="text-sm mt-1 text-gray-500">{EXPERIMENT_TEMPLATES[templateId].desc}</p>
                    </div>

                    <div className="space-y-4">
                        <Input
                            label="Mathematical Expression"
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                        />
                        <Input
                            label="Parameter Sequence (Comma Separated)"
                            value={paramList}
                            onChange={(e) => setParamList(e.target.value)}
                        />
                    </div>
                </div>

                {errorMsg && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
                        {errorMsg}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-2">
                    <Button onClick={runExperiment} disabled={isCalculating}>
                        {isCalculating ? 'Running Experiment...' : 'Run Experiment'}
                    </Button>
                    <Button variant="secondary" onClick={handleClear}>Clear</Button>

                    {experimentData && (
                        <Button
                            variant="secondary"
                            onClick={handleSaveExperiment}
                            disabled={savedStatus}
                        >
                            {savedStatus ? 'Saved to History' : 'Save Experiment'}
                        </Button>
                    )}
                </div>
            </Card>

            {experimentData && (
                <>
                    <Card title="Method Suitability & Educational Insights">
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            {suitabilityRules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </Card>

                    <Card title="Analytical Insights from Run">
                        <ul className="list-disc pl-5 space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                            <li className="font-semibold text-gray-800 dark:text-gray-200">What did the actual experiment show?</li>
                            {insights.map((insight, idx) => (
                                <li key={idx}>{insight}</li>
                            ))}
                            {insights.length === 0 && (
                                <li className="text-gray-500 italic">No significant insights derived from this dataset.</li>
                            )}
                        </ul>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Experiment Data Table">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-2 border-b dark:border-gray-600">{experimentData.metrics.parameterName}</th>
                                            <th className="px-4 py-2 border-b dark:border-gray-600">Result</th>
                                            <th className="px-4 py-2 border-b dark:border-gray-600">{experimentData.category === 'Root Finding' ? 'Iterations' : 'Error'}</th>
                                            <th className="px-4 py-2 border-b dark:border-gray-600">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {experimentData.results.map((r, i) => (
                                            <tr key={i} className="border-b dark:border-gray-700">
                                                <td className="px-4 py-2 font-mono">{r.parameterValue}</td>
                                                <td className="px-4 py-2 font-mono">{r.result !== null ? Number(r.result).toPrecision(6) : 'N/A'}</td>
                                                <td className="px-4 py-2 font-mono">
                                                    {experimentData.category === 'Root Finding' ? r.iterations : (r.error !== null ? r.error.toExponential(4) : 'N/A')}
                                                </td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 rounded text-xs ${r.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        <Card title="Analysis Chart">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={experimentData.results.filter(r => r.status !== 'Failed')}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                        <XAxis
                                            dataKey="parameterValue"
                                            name={experimentData.metrics.parameterName}
                                        // Handle log scales visually by just sorting or letting recharts space them
                                        // Note: Proper log scales in Recharts require specific configurations, 
                                        // falling back to linear categorical x-axis for stability across all experiment types.
                                        />
                                        <YAxis dataKey={experimentData.category === 'Root Finding' ? 'iterations' : 'error'} />
                                        <RechartsTooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey={experimentData.category === 'Root Finding' ? 'iterations' : 'error'}
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                            name={experimentData.category === 'Root Finding' ? 'Iterations required' : 'Absolute Error'}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdvancedAnalysis;
