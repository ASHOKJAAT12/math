import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../common/Card';
import SectionHeader from '../common/SectionHeader';

const FeaturesData = [
    {
        title: 'Step-by-Step Calculations',
        description: 'Understand how every iteration is calculated.',
    },
    {
        title: 'Accuracy Analysis',
        description: 'Compare exact and approximate values using multiple error metrics.',
    },
    {
        title: 'Convergence Analysis',
        description: 'Visualize how quickly methods approach a solution.',
    },
    {
        title: 'Performance Comparison',
        description: 'Compare iteration count and execution time.',
    },
    {
        title: 'Interactive Graphs',
        description: 'Visualize convergence and error behavior.',
    },
    {
        title: 'Method Insights',
        description: 'Understand advantages, disadvantages, and best-use scenarios.',
    }
];

const FeatureSection = () => {
    return (
        <div className="py-12">
            <SectionHeader
                title="Educational Value & Analytics"
                description="The platform offers the following analytical tools to enhance your learning and comparison experience."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FeaturesData.map((feature, idx) => (
                    <Card key={idx} className="bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-3 border-b-0">
                            <CardTitle className="text-base text-indigo-700 dark:text-indigo-400">
                                {feature.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FeatureSection;
