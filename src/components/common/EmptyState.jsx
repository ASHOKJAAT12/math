import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyState = ({
    icon: Icon = AlertCircle,
    title,
    description,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <div className="flex bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
                <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                {description}
            </p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
