import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-lg font-semibold text-slate-900 dark:text-white ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 border-t border-slate-100 dark:border-slate-800 flex items-center ${className}`} {...props}>
            {children}
        </div>
    );
};

export default Card;
