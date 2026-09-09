import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import { Search, BookOpen, Presentation, Calculator, CheckCircle } from 'lucide-react';
import { learningContent } from '../../data/learningContent';
import { calculateCategoryProgress, getProgress } from '../../utils/learningProgress';

const LearnHome = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [rootProgress, setRootProgress] = useState(0);
    const [intProgress, setIntProgress] = useState(0);
    const [diffProgress, setDiffProgress] = useState(0);
    const [completed, setCompleted] = useState([]);

    useEffect(() => {
        const rootIds = ['bisection', 'regula-falsi', 'newton-raphson', 'secant'];
        const intIds = ['trapezoidal', 'simpson-13', 'simpson-38'];
        const diffIds = ['forward-diff', 'backward-diff', 'central-diff'];

        setRootProgress(calculateCategoryProgress(rootIds));
        setIntProgress(calculateCategoryProgress(intIds));
        setDiffProgress(calculateCategoryProgress(diffIds));

        const data = getProgress();
        setCompleted(data.completedLessons);
    }, []);

    const allMethods = Object.values(learningContent.methods);

    // Quick inline search matching
    const filteredMethods = allMethods.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderMethodBlocks = (categoryFilter) => {
        return filteredMethods
            .filter(m => m.category === categoryFilter)
            .map(m => {
                const isDone = completed.includes(m.id);
                return (
                    <Link to={`/learn/method/${m.id}`} key={m.id} className="block transition-transform hover:-translate-y-1">
                        <div className={`p-4 rounded-lg border flex flex-col h-full bg-white dark:bg-slate-800 ${isDone ? 'border-green-300 dark:border-green-700' : 'border-slate-200 dark:border-slate-700'}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{m.title}</h4>
                                {isDone ? <CheckCircle className="h-5 w-5 text-green-500" /> : <BookOpen className="h-5 w-5 text-slate-300" />}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow line-clamp-2">
                                {m.purpose}
                            </p>
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Read Guide →</span>
                        </div>
                    </Link>
                );
            });
    };

    return (
        <PageContainer>
            <SectionHeader
                title="Learn Numerical Methods"
                description="Understand the mathematical mechanics, follow interactive worked examples, and prepare for academic viva exams."
            />

            {/* Toolbar and Progress Map */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search methods, formulas, or rules..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-4">
                        <Link to="/learn/viva" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <Presentation className="h-5 w-5" /> Viva Practice
                        </Link>
                        <Link to="/learn/quiz" className="flex-1 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                            <CheckCircle className="h-5 w-5" /> Quick Quiz
                        </Link>
                    </div>
                </div>

                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Your Progress</h3>

                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-400">
                                <span>Root Finding</span>
                                <span>{rootProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${rootProgress}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-400">
                                <span>Integration</span>
                                <span>{intProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${intProgress}%` }}></div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs mb-1 font-semibold text-slate-600 dark:text-slate-400">
                                <span>Differentiation</span>
                                <span>{diffProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${diffProgress}%` }}></div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Curriculum Sections */}
            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Root Finding</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {renderMethodBlocks('Root Finding')}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Calculator className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Numerical Integration</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderMethodBlocks('Integration')}
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Calculator className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Numerical Differentiation</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderMethodBlocks('Differentiation')}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">Core Theory & Fundamentals</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/learn/article/errors" className="block transition-transform hover:-translate-y-1">
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Error Analysis Essentials</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Absolute, Relative, Percent, and Residual bounds.</p>
                            </div>
                        </Link>
                        <Link to="/learn/article/convergence" className="block transition-transform hover:-translate-y-1">
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Understanding Convergence</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Tolerances, limits, divergence, and mathematical scaling.</p>
                            </div>
                        </Link>
                        <Link to="/learn/article/precision" className="block transition-transform hover:-translate-y-1">
                            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Numerical Precision Limits</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Truncation, Round-Off, and IEEE 754 Floating-point restrictions.</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
        </PageContainer>
    );
};

export default LearnHome;
