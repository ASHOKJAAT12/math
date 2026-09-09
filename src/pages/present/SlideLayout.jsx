import React, { useEffect } from 'react';
import Card from '../../components/common/Card';

/**
 * Slide layout optimized for classroom projector environments.
 * Uses large typography, clear separation of notes, and animated transitions natively purely identically.
 */
const SlideLayout = ({
    title,
    subtitle,
    children,
    notes,
    theory,
    pState,
    stepIndex // If provided, ensures notes and theory only inject if this matches currentStep
}) => {
    // If the slide is active, inject it into the side panel conceptually
    const isActive = pState.currentStep === stepIndex;

    useEffect(() => {
        if (!isActive) return;

        if (pState.showNotes && notes) {
            const container = document.getElementById('notes-content');
            if (container) container.innerHTML = notes;
        } else if (pState.showNotes && !notes) {
            const container = document.getElementById('notes-content');
            if (container) container.innerHTML = 'No notes provided for this slide.';
        }

        if (pState.showTheory && theory) {
            const container = document.getElementById('theory-content');
            if (container) container.innerHTML = theory;
        } else if (pState.showTheory && !theory) {
            const container = document.getElementById('theory-content');
            if (container) container.innerHTML = 'No theoretical insight provided for this slide.';
        }
    }, [isActive, pState.showNotes, pState.showTheory, notes, theory]);

    if (!isActive) return null;

    return (
        <div className="h-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 w-full max-w-6xl mx-auto">
            {title && (
                <div className="text-center mb-8">
                    <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-tight mb-2 flex items-center justify-center gap-4">
                        {title}
                    </h1>
                    {subtitle && <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 font-light">{subtitle}</p>}
                </div>
            )}

            <Card className="w-full bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-8 lg:p-12 overflow-hidden flex flex-col text-lg lg:text-2xl">
                {children}
            </Card>
        </div>
    );
};

export default SlideLayout;
