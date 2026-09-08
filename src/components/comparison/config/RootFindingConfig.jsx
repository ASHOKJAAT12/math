import React from 'react';
import { rootFindingPresets } from '../../../data/rootFindingPresets.js';

const RootFindingConfig = ({ inputs, handleInputChange, setInputs, setErrorMsg }) => {

    const handlePresetChange = (e) => {
        const presetName = e.target.value;
        if (!presetName) return;

        const preset = rootFindingPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                ...inputs,
                func: preset.func,
                deriv: preset.deriv,
                lowerBound: preset.lowerBound,
                upperBound: preset.upperBound,
                initialGuess: preset.initialGuess,
                secondGuess: preset.secondGuess,
                tolerance: preset.tolerance,
                maxIterations: preset.maxIterations,
                exactRoot: preset.exactRoot || ''
            });
            setErrorMsg(null);
        }
    };

    return (
        <div className="space-y-3">
            <select
                className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 mb-2"
                onChange={handlePresetChange}
                value="" // Always resets so choosing same preset triggers onChange if needed, or defaultValue=""
            >
                <option value="" disabled>Load Demo Profile...</option>
                {rootFindingPresets.map((preset, idx) => (
                    <option key={idx} value={preset.name}>{preset.name}</option>
                ))}
            </select>

            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Function f(x)</label>
                <input type="text" name="func" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^3 - x - 2" className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Derivative f'(x) <span className="text-slate-400 font-normal">(Newton)</span></label>
                <input type="text" name="deriv" value={inputs.deriv || ''} onChange={handleInputChange} placeholder="3*x^2 - 1" className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Lower / x₀</label>
                    <input type="number" name="lowerBound" value={inputs.lowerBound || ''} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, initialGuess: e.target.value })) }} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Upper / x₁</label>
                    <input type="number" name="upperBound" value={inputs.upperBound || ''} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, secondGuess: e.target.value })) }} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">Known Exact Root (Optional)</label>
                <input type="number" name="exactRoot" value={inputs.exactRoot || ''} onChange={handleInputChange} placeholder="e.g. 1.5213..." className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Tolerance</label>
                    <input type="text" name="tolerance" value={inputs.tolerance || '1e-6'} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Max Iters</label>
                    <input type="number" name="maxIterations" value={inputs.maxIterations || '50'} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
            </div>
        </div>
    );
};

export default RootFindingConfig;
