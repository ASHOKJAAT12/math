import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage presentation state, keyboard events, and fullscreen.
 */
export const usePresentationState = (totalSteps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [showTheory, setShowTheory] = useState(false);

    // Slide progression
    const nextStep = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }, [totalSteps]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback((step) => {
        setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    }, [totalSteps]);

    // Keyboard bindings
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input or textarea
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

            switch (e.key) {
                case 'ArrowRight':
                    nextStep();
                    break;
                case 'ArrowLeft':
                    prevStep();
                    break;
                case ' ':
                    e.preventDefault(); // prevent page scroll
                    setIsPlaying(prev => !prev);
                    break;
                case 'Escape':
                    // If fullscreen, the browser exits it automatically firing fullscreenchange
                    // Here we can catch other escapable elements like drawers
                    setShowTheory(false);
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextStep, prevStep]);

    // Fullscreen handling
    const toggleFullscreen = useCallback(async () => {
        try {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
                    await document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
                    await document.documentElement.msRequestFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    await document.msExitFullscreen();
                }
            }
        } catch (err) {
            console.warn(`Fullscreen toggle failed: ${err.message}`);
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('msfullscreenchange', handleFullscreenChange);
        };
    }, []);

    return {
        currentStep,
        nextStep,
        prevStep,
        goToStep,
        isFullscreen,
        toggleFullscreen,
        isPlaying,
        setIsPlaying,
        showNotes,
        setShowNotes,
        showTheory,
        setShowTheory
    };
};
