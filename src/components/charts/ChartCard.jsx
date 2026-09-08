import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import { InfoIcon, AlertCircleIcon } from 'lucide-react';

export const ChartCard = ({ title, description, emptyMessage = "Data unavailable.", isEmpty, children, footerNote }) => {
    return (
        <Card className="h-full flex flex-col shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</CardTitle>
                        {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6 flex-grow flex flex-col">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center flex-grow bg-slate-50/50 dark:bg-slate-900/30 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center min-h-[250px]">
                        <AlertCircleIcon className="w-8 h-8 text-slate-400 mb-3 opacity-50" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{emptyMessage}</span>
                    </div>
                ) : (
                    <div className="flex-grow w-full h-[280px]">
                        {children}
                    </div>
                )}

                {footerNote && !isEmpty && (
                    <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5 opacity-70" />
                        <span>{footerNote}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ChartCard;
