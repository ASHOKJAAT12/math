import React from 'react';

const Input = ({
    id,
    label,
    type = 'text',
    error,
    helperText,
    className = '',
    inputClassName = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>{label}</span>
                    {helperText && <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{helperText}</span>}
                </label>
            )}
            <input
                id={id}
                type={type}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white 
                focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-all
                ${error
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
                    } ${inputClassName}`}
                {...props}
            />
            {error && (
                <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
