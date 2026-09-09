import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from '../../components/layout/PageContainer';
import SectionHeader from '../../components/common/SectionHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { quizBank } from '../../data/quizBank';
import { saveQuizScore } from '../../utils/learningProgress';
import { ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';

const QuizMode = () => {
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleOptionSelect = (optIndex) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentIdx]: optIndex
        }));
    };

    const handleNext = () => {
        if (currentIdx < quizBank.length - 1) {
            setCurrentIdx(c => c + 1);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(c => c - 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        const score = calculateScore();
        saveQuizScore(score, quizBank.length);
    };

    const calculateScore = () => {
        let sc = 0;
        quizBank.forEach((q, idx) => {
            if (userAnswers[idx] === q.correctAnswer) sc++;
        });
        return sc;
    };

    const getRecommendedReviews = () => {
        const topics = new Set();
        quizBank.forEach((q, idx) => {
            if (userAnswers[idx] !== q.correctAnswer) {
                topics.add(q.topic);
            }
        });
        return Array.from(topics);
    };

    const resetQuiz = () => {
        setUserAnswers({});
        setCurrentIdx(0);
        setSubmitted(false);
    };

    if (submitted) {
        const score = calculateScore();
        const percent = Math.round((score / quizBank.length) * 100);
        const recommendations = getRecommendedReviews();

        return (
            <PageContainer>
                <div className="max-w-2xl mx-auto py-12">
                    <Card className="text-center p-10 border-t-8 border-t-indigo-500 shadow-xl">
                        <Award className="h-20 w-20 text-indigo-500 mx-auto mb-4" />
                        <h2 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-2">Quiz Completed!</h2>
                        <div className="text-6xl font-black text-indigo-600 dark:text-indigo-400 mb-6">
                            {percent}%
                        </div>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                            You scored <strong>{score}</strong> out of <strong>{quizBank.length}</strong> correctly.
                        </p>

                        {recommendations.length > 0 && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 text-left mb-8">
                                <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-3 uppercase tracking-wider text-sm">Recommended Study Areas</h3>
                                <div className="flex flex-wrap gap-2">
                                    {recommendations.map(r => (
                                        <span key={r} className="bg-white dark:bg-slate-900 px-3 py-1 rounded shadow-sm text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            {r.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            <Button variant="outline" onClick={resetQuiz}>Retake Quiz</Button>
                            <Link to="/learn"><Button variant="primary">Return to Learning Hub</Button></Link>
                        </div>
                    </Card>
                </div>
            </PageContainer>
        );
    }

    const q = quizBank[currentIdx];
    const isAnswered = userAnswers[currentIdx] !== undefined;

    return (
        <PageContainer>
            <div className="mb-6 flex justify-between items-center">
                <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ArrowLeft className="h-4 w-4" /> Quit Quiz
                </Link>
                <div className="text-sm font-bold text-slate-500">
                    Question {currentIdx + 1} of {quizBank.length}
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <Card className="p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 leading-relaxed">
                        {q.question}
                    </h2>

                    <div className="space-y-3 mb-8">
                        {q.options.map((opt, optIdx) => {
                            const isSelected = userAnswers[currentIdx] === optIdx;
                            return (
                                <button
                                    key={optIdx}
                                    onClick={() => handleOptionSelect(optIdx)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between
                                        ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-900 dark:text-indigo-100 font-semibold'
                                            : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 text-slate-700 dark:text-slate-300'}
                                    `}
                                >
                                    <span>{opt}</span>
                                    {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-6">
                        <Button variant="ghost" disabled={currentIdx === 0} onClick={handlePrev}>Previous</Button>

                        {currentIdx === quizBank.length - 1 ? (
                            <Button
                                variant="primary"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={Object.keys(userAnswers).length !== quizBank.length}
                                onClick={handleSubmit}
                            >
                                Submit Final Exam
                            </Button>
                        ) : (
                            <Button variant="primary" onClick={handleNext}>Next Question</Button>
                        )}
                    </div>
                </Card>
            </div>
        </PageContainer>
    );
};

export default QuizMode;
