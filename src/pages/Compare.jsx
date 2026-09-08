import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import { BarChart3 } from 'lucide-react';

const Compare = () => {
    return (
        <PageContainer className="max-w-7xl">
            <SectionHeader
                title="Numerical Method Comparison"
                description="Evaluate methods across accuracy, iterations, error, execution time, and convergence."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3 border-b-0">
                            <CardTitle className="text-base text-slate-900 dark:text-white">Select Problem Type</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {['Root Finding', 'Integration', 'Differentiation'].map((type, idx) => (
                                    <label key={idx} className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                                        <input type="radio" name="problemType" className="text-indigo-600 focus:ring-indigo-500" />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3 border-b-0">
                            <CardTitle className="text-base text-slate-900 dark:text-white">Method Selection</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-slate-500 mb-4 tracking-tight">Select a problem type to view available methods.</p>
                            <div className="space-y-2 opacity-50">
                                {['Method 1', 'Method 2', 'Method 3', 'Method 4'].map((method, idx) => (
                                    <label key={idx} className="flex items-center space-x-3 text-sm text-slate-700 dark:text-slate-300">
                                        <input type="checkbox" disabled className="rounded text-indigo-600 focus:ring-indigo-500" />
                                        <span>{method}</span>
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    {/* Results Table Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Results Comparison</CardTitle>
                        </CardHeader>
                        <div className="px-6 pb-6 overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        {['Method', 'Result', 'Absolute Error', 'Relative Error', 'Iterations', 'Execution Time', 'Status'].map((header, idx) => (
                                            <th key={idx} scope="col" className="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="7" className="p-4">
                                            <EmptyState
                                                icon={BarChart3}
                                                title="No comparison data"
                                                description="Run a calculation from one of the module pages or configure a comparison here (available in Phase 2)."
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Visualization Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-slate-800 dark:text-slate-200">Accuracy Comparison</CardTitle>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 m-6 rounded-md border border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-400">Chart rendering coming in Phase 3</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-slate-800 dark:text-slate-200">Iteration Comparison</CardTitle>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 m-6 rounded-md border border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-400">Chart rendering coming in Phase 3</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-slate-800 dark:text-slate-200">Convergence Graph</CardTitle>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 m-6 rounded-md border border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-400">Chart rendering coming in Phase 3</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-slate-800 dark:text-slate-200">Error Analysis</CardTitle>
                            </CardHeader>
                            <CardContent className="h-48 flex items-center justify-center bg-slate-50 dark:bg-slate-800/20 m-6 rounded-md border border-slate-100 dark:border-slate-800">
                                <p className="text-sm text-slate-400">Chart rendering coming in Phase 3</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Compare;
