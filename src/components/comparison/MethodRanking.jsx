import React from 'react';
import Badge from '../common/Badge';

export const PerformanceCard = ({ title, methodNode, icon }) => {
    return (
        <div className="flex flex-col p-4 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-800 shadow-sm transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                {icon && <span className="text-indigo-500">{icon}</span>}
                {title}
            </span>
            <div className="flex items-center gap-2">
                {typeof methodNode === 'string' ? (
                    <span className="text-base font-semibold text-slate-900 dark:text-white">{methodNode}</span>
                ) : methodNode ? (
                    methodNode
                ) : (
                    <span className="text-sm font-medium text-slate-400 italic">No valid data</span>
                )}
            </div>
        </div>
    );
};

const MethodRanking = ({ rankings, category }) => {
    if (!rankings) return null;

    const renderMethodValue = (method, propertyName, suffix = '') => {
        if (!method) return null;
        return (
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{method.name}</span>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {method[propertyName] !== undefined ? `${method[propertyName]}${suffix}` : ''}
                </span>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {rankings.categorySpecific && (
                <PerformanceCard
                    title={rankings.categorySpecific.title}
                    methodNode={renderMethodValue(rankings.categorySpecific.method, rankings.categorySpecific.param, rankings.categorySpecific.suffix)}
                />
            )}

            <PerformanceCard
                title="Fastest Execution"
                methodNode={renderMethodValue(rankings.fastestExecution, 'executionTime', ' ms')}
            />
            {rankings.lowestErrorMetric && (
                <PerformanceCard
                    title={rankings.lowestErrorMetric}
                    methodNode={renderMethodValue(rankings.lowestError, rankings.lowestErrorMetric === 'Lowest Absolute Error' ? 'absoluteError' : 'finalError')}
                />
            )}
            <PerformanceCard
                title="Successful Methods"
                methodNode={
                    rankings.mostSuccessful && rankings.mostSuccessful.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                            {rankings.mostSuccessful.map((name, i) => (
                                <Badge key={i} variant="success" className="text-[10px] py-0 px-1.5">{name}</Badge>
                            ))}
                        </div>
                    ) : null
                }
            />
        </div>
    );
};

export default MethodRanking;
