import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { ArrowLeft, PlayCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { learningContent } from '../../data/learningContent';
import { markLessonComplete, isLessonComplete } from '../../utils/learningProgress';
import WorkedExample from './WorkedExample';

const MethodGuide = () => {
    const { id } = useParams();
    const method = learningContent.methods[id];
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (method) {
            setCompleted(isLessonComplete(method.id));
        }
    }, [method]);

    if (!method) {
        return (
            <PageContainer>
                <div className="text-center py-20 text-slate-500 text-xl">Method guide not found.</div>
            </PageContainer>
        );
    }

    const handleMarkComplete = () => {
        markLessonComplete(method.id);
        setCompleted(true);
    };

    // Determine calculator pathway
    let calcPath = '/root-finding';
    if (method.category === 'Integration') calcPath = '/integration';
    if (method.category === 'Differentiation') calcPath = '/differentiation';

    return (
        <PageContainer>
            <div className="mb-4">
                <Link to="/learn" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ArrowLeft className="h-4 w-4" /> Back to Learning Hub
                </Link>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white">{method.title}</h1>
                        <Badge variant="primary">{method.category}</Badge>
                        {completed && <Badge variant="success">Completed</Badge>}
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400">{method.purpose}</p>
                </div>
                <div className="flex gap-3">
                    <Link to={calcPath}>
                        <Button variant="primary" className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4" /> Try Calculator
                        </Button>
                    </Link>
                    {!completed && (
                        <Button variant="outline" onClick={handleMarkComplete}>
                            Mark as Completed
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Theory & Steps (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Mathematical Formula */}
                    <Card className="border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-900/10">
                        <div className="p-6">
                            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">Mathematical Formula</div>
                            <div className="text-2xl font-mono text-center text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 py-4 px-6 rounded border border-indigo-100 dark:border-indigo-900/50 overflow-x-auto shadow-sm">
                                {method.formula}
                            </div>
                        </div>
                    </Card>

                    {/* Step by Step Algorithm */}
                    <section>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Algorithm Execution Steps
                        </h3>
                        <div className="space-y-3">
                            {method.algorithmSteps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                                        {idx + 1}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">{step}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Interactive Worked Example */}
                    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <WorkedExample config={method.exampleObj} />
                    </section>

                </div>

                {/* Right Column: Parameters & Warnings (1/3 width) */}
                <div className="space-y-6">

                    <Card className="p-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Required Inputs</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-sm">
                            {method.inputs.map((inp, idx) => <li key={idx}>{inp}</li>)}
                        </ul>
                    </Card>

                    <Card className="p-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Mathematical Conditions</h4>
                        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300 text-sm">
                            {method.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                        </ul>
                    </Card>

                    <Card className="p-5 bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2 border-b border-red-100 dark:border-red-900/30 pb-2">
                            <AlertTriangle className="h-4 w-4 text-red-500" /> Common Mistakes
                        </h4>
                        <ul className="list-disc pl-5 space-y-2 text-red-800 dark:text-red-300 text-sm">
                            {method.mistakes.map((mis, idx) => <li key={idx} className="leading-relaxed">{mis}</li>)}
                        </ul>
                    </Card>

                    <Card className="p-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Practical Usage & Limits</h4>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">When to Use:</span>
                                <p className="text-slate-600 dark:text-slate-400">{method.useCases}</p>
                            </div>
                            <div>
                                <span className="font-bold text-green-600 dark:text-green-400 block mb-1">Advantages:</span>
                                <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400">
                                    {method.advantages.map((adv, idx) => <li key={idx}>{adv}</li>)}
                                </ul>
                            </div>
                            <div>
                                <span className="font-bold text-orange-600 dark:text-orange-400 block mb-1">Limitations:</span>
                                <ul className="list-disc pl-5 text-slate-600 dark:text-slate-400">
                                    {method.limitations.map((lim, idx) => <li key={idx}>{lim}</li>)}
                                </ul>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
        </PageContainer>
    );
};

export default MethodGuide;
