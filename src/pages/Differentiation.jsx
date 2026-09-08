import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const Differentiation = () => {
    const methods = ['Forward Difference', 'Backward Difference', 'Central Difference'];

    return (
        <PageContainer>
            <SectionHeader
                title="Numerical Differentiation"
                description="Approximate derivatives and study numerical error as the step size changes."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Problem Definition</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Function f(x)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., exp(x) * sin(x)"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Evaluation Point (x)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 2.5"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Step Size (h)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 0.1, 0.01, 0.001"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Supports multiple values separated by commas.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Method Selection</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {methods.map((method, idx) => (
                                    <label key={idx} className="flex justify-between items-center p-3 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{method}</span>
                                        <input type="radio" name="method" className="text-indigo-600 focus:ring-indigo-500" />
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Placeholder for Error vs Step Size graph Layout */}
                    <Card>
                        <CardContent className="pt-6 h-64 flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                            <Badge variant="warning" className="mb-4">UI Placeholder</Badge>
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">Error vs Step Size</h3>
                            <p className="text-sm text-slate-500 text-center max-w-sm">
                                A logarithmic graph will appear here displaying the relationship between step size and truncation/round-off error.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                        <CardContent className="pt-6 space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center">Execution Controls</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-6">
                                Calculations and visualizations will be enabled in Phase 2.
                            </p>
                            <Button className="w-full" disabled>
                                Run Method
                            </Button>
                            <div className="pt-4 mt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded-full text-xs font-semibold">
                                    Coming in Phase 2
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default Differentiation;
