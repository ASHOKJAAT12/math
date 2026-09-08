import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardContent } from '../components/common/Card';

const About = () => {
    return (
        <PageContainer className="max-w-3xl">
            <Card className="overflow-hidden">
                <div className="bg-indigo-600 dark:bg-indigo-900 px-6 py-10 text-center">
                    <h1 className="text-3xl font-bold text-white mb-2">Numerical Methods Analyzer</h1>
                    <p className="text-indigo-100">College Project - Phase 1 Architecture</p>
                </div>
                <CardContent className="p-8 space-y-8">

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Objective</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Develop an interactive platform for implementing, analyzing, and comparing numerical methods for root finding, numerical integration, and numerical differentiation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Educational Purpose</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            The system is designed to help students understand not only the final numerical answer but also the algorithmic process, accuracy, convergence, and performance characteristics of different numerical methods.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Technologies</h2>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'JavaScript', 'Tailwind CSS', 'React Router', 'Recharts'].map((tech, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default About;
