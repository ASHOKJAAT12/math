import React from 'react';
import { Calculator } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:justify-start mb-6 md:mb-0">
                        <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-semibold text-slate-900 dark:text-white">
                                Numerical Methods Analyzer
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <p className="text-center md:text-left text-sm text-slate-500 dark:text-slate-400">
                            &copy; {new Date().getFullYear()} College Project. Educational purposes only.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
