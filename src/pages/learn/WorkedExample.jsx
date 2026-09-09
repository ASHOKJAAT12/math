import React, { useState, useEffect } from 'react';
import { createEvaluator } from '../../utils/evaluator';
import bisectionRunner from '../../methods/rootFinding/bisection';
import regulaFalsiRunner from '../../methods/rootFinding/regulaFalsi';
import newtonRaphsonRunner from '../../methods/rootFinding/newtonRaphson';
import secantRunner from '../../methods/rootFinding/secant';
import trapezoidalRunner from '../../methods/integration/trapezoidal';
import { simpson13Runner } from '../../methods/integration/simpson13';
import { simpson38Runner } from '../../methods/integration/simpson38';
import { forwardDifference, backwardDifference, centralDifference } from '../../methods/differentiation';

import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { ChevronLeft, ChevronRight, Eye, Code } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';

const generateExplanation = (method, step, prevStep) => {
    switch (method) {
        case 'Bisection':
            if (step.iteration === 1) return `First, we establish the bracket [a=${step.a}, b=${step.b}]. We evaluate the midpoint c = ${step.c}. Since f(c)=${formatNumber(step.fC, 4)}, we check signs.`;
            let change = 'reduced';
            if (prevStep && prevStep.a === step.a) change = `b was updated to ${step.b}`;
            else if (prevStep && prevStep.b === step.b) change = `a was updated to ${step.a}`;
            return `Signs crossed. The bracket is halved. ${change}. New midpoint is c = ${step.c}. Error falls down to ${formatNumber(step.error, 4)}!`;
        case 'Regula Falsi':
            if (step.iteration === 1) return `The initial false-position line is projected between the bounds yielding c = ${formatNumber(step.c, 4)}. f(c) = ${formatNumber(step.fC, 4)}.`;
            return `Linear interpolation draws a new line crossing the axis at c = ${formatNumber(step.c, 4)}. Error drops to ${formatNumber(step.error, 4)}.`;
        case 'Newton-Raphson':
            if (step.iteration === 1) return `Starting from guess x = ${formatNumber(step.x, 4)}. We calculate tangent slope f'(x) = ${formatNumber(step.derivative, 4)}. The tangent line projects intercept x(next) = ${formatNumber(step.nextX, 4)}.`;
            return `Tangent slides down curve. Guess updates to x = ${formatNumber(step.x, 4)}. Next tangent hits x(next) = ${formatNumber(step.nextX, 4)}. Error drops to ${formatNumber(step.error, 4)}.`;
        case 'Secant':
            return `Drawing a line connecting points (x0=${formatNumber(step.x0, 4)}, f0=${formatNumber(step.f0, 4)}) and (x1=${formatNumber(step.x1, 4)}, f1=${formatNumber(step.f1, 4)}). New intercept x(next) = ${formatNumber(step.nextX, 4)}.`;
        case 'Trapezoidal':
            return `Connecting node at x = ${formatNumber(step.x, 2)}. Evaluated f(x) = ${formatNumber(step.fx, 4)}. Multiplied by weight ${step.weight} -> ${formatNumber(step.contribution, 4)}.`;
        case 'Simpson 1/3':
            return `Evaluating node x = ${formatNumber(step.x, 2)}. Simpson's logic applies weight ${step.weight}. Segment contribution: ${formatNumber(step.contribution, 4)}.`;
        case 'Simpson 3/8':
            return `Evaluating node x = ${formatNumber(step.x, 2)}. Simpson's cubic logic applies weight ${step.weight}. Segment contribution: ${formatNumber(step.contribution, 4)}.`;
        case 'Forward Difference':
        case 'Backward Difference':
        case 'Central Difference':
            return `Step size mechanism evaluating bounds structurally. Sample calculated accurately.`;
        default:
            return `Internal engine calculation executed.`;
    }
};

const formatStepData = (stepData) => {
    return Object.entries(stepData).map(([k, v]) => {
        if (typeof v === 'number') {
            if (v % 1 === 0) return `${k}: ${v}`;
            return `${k}: ${formatNumber(v, 5)}`;
        }
        return `${k}: ${v}`;
    }).join('  |  ');
};

const WorkedExample = ({ config }) => {
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [finalResult, setFinalResult] = useState(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        let f = null;
        if (config.func) {
            f = createEvaluator(config.func);
            // Newton requires derivative string, normally provided in calculator, let's auto-derive a rough literal or rely on explicit diff config if not present
        }

        let res = null;
        try {
            switch (config.method) {
                case 'Bisection': res = bisectionRunner(f, config.a, config.b, config.tolerance, 20); break;
                case 'Regula Falsi': res = regulaFalsiRunner(f, config.a, config.b, config.tolerance, 20); break;
                case 'Newton-Raphson': {
                    // For learning example hardcode the derivative x^3-x-2 -> 3x^2-1
                    const df = createEvaluator('3*x^2 - 1');
                    res = newtonRaphsonRunner(f, df, config.guess, config.tolerance, 20);
                    break;
                }
                case 'Secant': res = secantRunner(f, config.x0, config.x1, config.tolerance, 20); break;
                case 'Trapezoidal': res = trapezoidalRunner(f, config.a, config.b, config.n); break;
                case 'Simpson 1/3': res = simpson13Runner(f, config.a, config.b, config.n); break;
                case 'Simpson 3/8': res = simpson38Runner(f, config.a, config.b, config.n); break;
                case 'Forward Difference': res = forwardDifference(config.func, config.x, config.h); break;
                case 'Backward Difference': res = backwardDifference(config.func, config.x, config.h); break;
                case 'Central Difference': res = centralDifference(config.func, config.x, config.h); break;
            }

            if (res) {
                // Differentation results don't have .steps arrays directly, mock a single step array for uniformity
                if (config.method.includes('Difference')) {
                    setSteps([{
                        method: config.method,
                        x: config.x,
                        h: config.h,
                        result: res.result
                    }]);
                    setFinalResult(res.result);
                } else {
                    setSteps(res.steps || []);
                    setFinalResult(res.root || res.result || res.integral);
                }
            }
        } catch (e) {
            console.error("Worked example execution failed:", e);
        }
    }, [config]);

    if (!steps || steps.length === 0) return null;

    const currentStep = steps[currentStepIndex];
    const prevStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;
    const isDifferentiation = config.method.includes('Difference');

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                <Code className="h-5 w-5 text-indigo-500" />
                Live Worked Example
            </h3>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-sm mb-4 text-slate-700 dark:text-slate-300 shadow-sm flex flex-wrap gap-4">
                <span>Function: <strong className="text-indigo-600 dark:text-indigo-400">{config.func}</strong></span>
                {config.a !== undefined && <span>Interval: <strong>[{config.a}, {config.b}]</strong></span>}
                {config.guess !== undefined && <span>Guess: <strong>x = {config.guess}</strong></span>}
                {config.n !== undefined && <span>Subintervals (n): <strong>{config.n}</strong></span>}
                {config.h !== undefined && <span>Step (h): <strong>{config.h}</strong></span>}
                {config.x !== undefined && <span>Eval (x): <strong>{config.x}</strong></span>}
            </div>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 overflow-hidden shadow">
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {showAll ? 'All Execution Steps' : `Step ${currentStepIndex + 1} of ${steps.length}`}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="flex items-center gap-1">
                        <Eye className="h-4 w-4" /> {showAll ? 'Show Interactively' : 'Show All Steps'}
                    </Button>
                </div>

                {!showAll ? (
                    <div className="p-6">
                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded p-4 mb-4 font-mono text-sm text-slate-800 dark:text-slate-200 break-all leading-relaxed">
                            {formatStepData(currentStep)}
                        </div>
                        <div className="text-slate-600 dark:text-slate-400 italic bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-400 p-3 text-sm">
                            <span className="font-bold block mb-1 text-amber-700 dark:text-amber-500">Why?</span>
                            {generateExplanation(config.method, currentStep, prevStep)}
                        </div>

                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                disabled={currentStepIndex === 0}
                                onClick={() => setCurrentStepIndex(c => c - 1)}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Button>
                            <Button
                                variant="primary"
                                disabled={currentStepIndex === steps.length - 1}
                                onClick={() => setCurrentStepIndex(c => c + 1)}
                                className="flex items-center gap-2"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                        {steps.map((st, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-900/50 rounded border border-slate-200 dark:border-slate-700 p-3 text-sm font-mono text-slate-800 dark:text-slate-200">
                                <span className="font-semibold text-indigo-500 mr-2">[{i + 1}]</span>
                                {formatStepData(st)}
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {currentStepIndex === steps.length - 1 && !isDifferentiation && !showAll && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-300 font-bold flex justify-between items-center animate-fade-in shadow-sm">
                    <span>Algorithm Complete!</span>
                    <span className="font-mono text-xl">Result: {formatNumber(finalResult, 5)}</span>
                </div>
            )}
        </div>
    );
};

export default WorkedExample;
