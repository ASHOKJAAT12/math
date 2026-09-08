import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';

const Integration = () => {
    const methods = ['Trapezoidal Rule', "Simpson's 1/3 Rule", "Simpson's 3/8 Rule"];

    return (
        <PageContainer>
            <SectionHeader
                title="Numerical Integration"
                description="Approximate definite integrals and compare numerical integration techniques."
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
                                        placeholder="e.g., sin(x)"
                                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Lower Limit (a)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 0"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Upper Limit (b)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 3.14159"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Number of Intervals (n)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g., 10"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Tolerance (optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 1e-6"
                                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                        />
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
                                    <label key={idx} className="flex flex-col p-3 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{method}</span>
                                            <input type="radio" name="method" className="text-indigo-600 focus:ring-indigo-500" />
                                        </div>
                                    </label>
                                ))}
                            </div>
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
                            <Button variant="outline" className="w-full" disabled>
                                Compare Methods
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

export default Integration;
