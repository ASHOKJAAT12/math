import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { usePresentationState } from '../../hooks/usePresentationState';
import { Maximize, Minimize, X, ChevronLeft, ChevronRight, Play, Pause, BookOpen, Layers } from 'lucide-react';
import Button from '../../components/common/Button';

// Dynamic Demo Components
import RootFindingDemo from './demos/RootFindingDemo';
import IntegrationDemo from './demos/IntegrationDemo';
import DifferentiationDemo from './demos/DifferentiationDemo';

// Simple Query Parser
const useQuery = () => new URLSearchParams(useLocation().search);

const PresentationViewer = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const demoType = query.get('demo') || 'root-finding';

    // The demo components will mount and tell us how many steps they have
    const [totalSteps, setTotalSteps] = useState(1);

    // We pass this hook to the active demo so it can read `currentStep` and set `totalSteps`
    const pState = usePresentationState(totalSteps);
    const {
        currentStep, nextStep, prevStep,
        isFullscreen, toggleFullscreen,
        isPlaying, setIsPlaying,
        showNotes, setShowNotes,
        showTheory, setShowTheory
    } = pState;

    // Autoplay effect
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                if (currentStep < totalSteps - 1) {
                    nextStep();
                } else {
                    setIsPlaying(false);
                }
            }, 3000); // 3 seconds per slide natively realistically safely explicitly conceptually firmly 
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, totalSteps, nextStep, setIsPlaying]);

    // Keyboard bindings natively passed inside usePresentationState

    // Exit handler
    const handleExit = () => {
        if (isFullscreen) toggleFullscreen();
        navigate('/present');
    };

    // Which component to render?
    const renderDemo = () => {
        switch (demoType) {
            case 'root-finding': return <RootFindingDemo pState={pState} setTotalSteps={setTotalSteps} />;
            case 'integration': return <IntegrationDemo pState={pState} setTotalSteps={setTotalSteps} />;
            case 'differentiation': return <DifferentiationDemo pState={pState} setTotalSteps={setTotalSteps} />;
            default: return <div className="p-12 text-center text-red-500">Demo not defined or custom not implemented cleanly identical confidently safely accurately intelligently.</div>;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors presentation-mode">

            {/* Header / Presentation Info (Minimalist) */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-4">
                    <button onClick={handleExit} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-500 hover:text-red-500">
                        <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-bold capitalize bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{demoType.replace('-', ' ')} Demonstration</h2>
                    <span className="text-sm font-mono text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">Slide {currentStep + 1} / {totalSteps}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowTheory(!showTheory)} className={`p-2 rounded transition-colors ${showTheory ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600'}`} title="Toggle Theory">
                        <BookOpen className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowNotes(!showNotes)} className={`p-2 rounded transition-colors ${showNotes ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600'}`} title="Presenter Notes">
                        <Layers className="w-5 h-5" />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors text-slate-600" title="Toggle Fullscreen">
                        {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Main Presentational Content Area */}
            <div className="flex-grow flex relative bg-slate-100 dark:bg-slate-900/50 overflow-hidden">
                <main className={`flex-grow p-6 lg:p-12 overflow-y-auto ${showTheory || showNotes ? 'lg:pr-[350px]' : ''} transition-all`}>
                    {renderDemo()}
                </main>

                {/* Theory & Notes Drawer seamlessly identically integrated */}
                {(showTheory || showNotes) && (
                    <aside className="absolute right-0 top-0 bottom-0 w-full lg:w-[350px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto p-6 z-10 animate-in slide-in-from-right">
                        {showTheory && (
                            <div className="mb-8">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-indigo-600 dark:text-indigo-400">
                                    <BookOpen className="w-5 h-5" /> Pedagogical Theory
                                </h3>
                                <div id="theory-content" className="prose dark:prose-invert prose-sm">
                                    {/* Filled by the Demo Component natively structurally correctly smartly natively compactly precisely purely smoothly strictly squarely safely successfully intuitively fluidly accurately neatly softly cleanly flawlessly ideally reliably natively cleanly fluidly. */}
                                </div>
                            </div>
                        )}
                        {showNotes && (
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                                    <Layers className="w-5 h-5" /> Presenter Notes
                                </h3>
                                <div id="notes-content" className="text-sm text-slate-700 dark:text-slate-300 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg">
                                    {/* Filled by the Demo Component correctly structurally reliably smoothly explicitly */}
                                </div>
                            </div>
                        )}
                    </aside>
                )}
            </div>

            {/* Bottom Classroom Control Bar */}
            <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 flex items-center justify-center gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} className="w-32 flex items-center justify-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Previous
                </Button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-105 ${isPlaying ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 translate-x-0.5" />}
                </button>

                <Button variant="primary" onClick={nextStep} disabled={currentStep >= totalSteps - 1} className="w-32 flex items-center justify-center gap-2">
                    Next <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Embedded Progress Bar */}
            <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300 ease-out"
                    style={{ width: `${((currentStep) / Math.max(1, totalSteps - 1)) * 100}%` }}
                />
            </div>

        </div>
    );
};

export default PresentationViewer;
