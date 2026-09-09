import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { vivaBank } from '../../data/vivaBank';
import { ArrowLeft, RefreshCw, Eye, Target, BookOpen } from 'lucide-react';

const VivaPractice = () => {
    const [mode, setMode] = useState('study'); // study, practice
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [difficultyFilter, setDifficultyFilter] = useState('All');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    // Initial categorization and extraction
    const categories = ['All', ...new Set(vivaBank.map(q => q.category))];
    const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

    let filteredQuestions = vivaBank.filter(q => {
        const catMatch = categoryFilter === 'All' || q.category === categoryFilter;
        const diffMatch = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
        return catMatch && diffMatch;
    });

    if (filteredQuestions.length === 0) {
        filteredQuestions = [
            { question: 'No questions match these filters.', answer: 'Adjust filters to continue.', keyPoints: [], difficulty: 'Beginner', category: 'General' }
        ];
    }

    const currentQuestion = filteredQuestions[Math.min(currentIndex, filteredQuestions.length - 1)];

    const handleNext = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev + 1) % filteredQuestions.length);
    };

    const handlePrev = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev - 1 + filteredQuestions.length) % filteredQuestions.length);
    };

    const handleRandomize = () => {
        setShowAnswer(false);
        const randomIdx = Math.floor(Math.random() * filteredQuestions.length);
        setCurrentIndex(randomIdx);
    };

    return (
        <PageContainer>
            <div className="mb-6">
                <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ArrowLeft className="h-4 w-4" /> Back to Learning Hub
                </Link>
            </div>

            <SectionHeader
                title="Viva Practice Room"
                description="Hone your verbal responses and mathematical reasoning for academic examinations."
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                {/* Control Panel */}
                <Card className="p-5 lg:col-span-1 space-y-5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Practice Mode</label>
                        <div className="flex bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
                            <button
                                onClick={() => { setMode('study'); setShowAnswer(true); }}
                                className={`flex-1 py-2 text-sm rounded flex items-center justify-center gap-2 transition-all ${mode === 'study' ? 'bg-white dark:bg-slate-700 shadow-sm font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                                <BookOpen className="h-4 w-4" /> Study
                            </button>
                            <button
                                onClick={() => { setMode('practice'); setShowAnswer(false); }}
                                className={`flex-1 py-2 text-sm rounded flex items-center justify-center gap-2 transition-all ${mode === 'practice' ? 'bg-white dark:bg-slate-700 shadow-sm font-bold text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                            >
                                <Target className="h-4 w-4" /> Practice
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Category Filter</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentIndex(0); setShowAnswer(mode === 'study'); }}
                            className="w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded text-sm text-slate-800 dark:text-slate-200"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold uppercase text-slate-500 mb-2 block">Difficulty Limit</label>
                        <select
                            value={difficultyFilter}
                            onChange={(e) => { setDifficultyFilter(e.target.value); setCurrentIndex(0); setShowAnswer(mode === 'study'); }}
                            className="w-full border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 rounded text-sm text-slate-800 dark:text-slate-200"
                        >
                            {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                        </select>
                    </div>

                    <Button variant="outline" className="w-full flex justify-center items-center gap-2 mt-4" onClick={handleRandomize}>
                        <RefreshCw className="h-4 w-4" /> Pick Random
                    </Button>
                </Card>

                {/* Question Display */}
                <div className="lg:col-span-3 flex flex-col">
                    <Card className="flex-grow p-8 flex flex-col justify-center border-2 border-indigo-100 dark:border-indigo-900/50 bg-white dark:bg-slate-800 shadow-sm relative min-h-[400px]">

                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge variant="primary">{currentQuestion.category}</Badge>
                            <Badge variant={currentQuestion.difficulty === 'Beginner' ? 'success' : currentQuestion.difficulty === 'Intermediate' ? 'warning' : 'danger'}>
                                {currentQuestion.difficulty}
                            </Badge>
                        </div>
                        <div className="absolute top-4 right-4 text-sm font-semibold text-slate-400">
                            Q {Math.min(currentIndex + 1, filteredQuestions.length)} / {filteredQuestions.length}
                        </div>

                        <div className="text-center max-w-2xl mx-auto mt-6">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
                                {currentQuestion.question}
                            </h2>

                            {(!showAnswer && mode === 'practice') ? (
                                <Button
                                    size="lg"
                                    className="mx-auto flex items-center gap-2 animate-bounce-subtle mt-10"
                                    onClick={() => setShowAnswer(true)}
                                >
                                    <Eye className="h-5 w-5" /> Reveal Answer
                                </Button>
                            ) : (
                                <div className="text-left bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/40 p-6 rounded-xl animate-fade-in shadow-inner">
                                    <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3 border-b border-indigo-200 dark:border-indigo-800 pb-2">Academic Response</div>
                                    <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-4">
                                        {currentQuestion.answer}
                                    </p>

                                    {currentQuestion.keyPoints && currentQuestion.keyPoints.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800/50">
                                            <span className="text-sm font-semibold text-indigo-500 block mb-2">Key Grading Points:</span>
                                            <div className="flex flex-wrap gap-2">
                                                {currentQuestion.keyPoints.map((kp, idx) => (
                                                    <span key={idx} className="bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        ✓ {kp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </Card>

                    <div className="flex justify-between mt-4">
                        <Button variant="outline" onClick={handlePrev}>Previous Question</Button>
                        <Button variant="primary" onClick={handleNext}>Next Question</Button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default VivaPractice;
