import React from 'react';

const SectionHeader = ({ title, description }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                {title}
            </h2>
            {description && (
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionHeader;
