import React from 'react';
import { differentiationPresets } from '../../../data/differentiationPresets.js';
import Button from '../../common/Button';

const DifferentiationConfig = ({ inputs, handleInputChange, setInputs, setErrorMsg }) => {

    const handlePresetChange = (e) => {
        const presetName = e.target.value;
        if (!presetName) return;

        const preset = differentiationPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                ...inputs,
                func: preset.func,
                x: preset.x,
                h: preset.h || '0.1',
                exactDerivative: preset.exactDerivative || ''
            });
            setErrorMsg(null);
        }
    };

    const loadAutoHList = () => {
        setInputs({
            ...inputs,
            customHList: '0.1, 0.01, 0.001, 0.0001, 0.00001'
        });
    };

    return (
        <div className="space-y-3">
            <select
                className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 mb-2"
                onChange={handlePresetChange}
                value=""
            >
                <option value="" disabled>Load Demo Profile...</option>
                {differentiationPresets.map((preset, idx) => (
                    <option key={idx} value={preset.name}>{preset.name}</option>
                ))}
            </select>

            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Function f(x)</label>
                <input type="text" name="func" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^3" className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Eval Point (x)</label>
                    <input type="number" name="x" value={inputs.x || ''} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Step Size (h)</label>
                    <input type="number" name="h" value={inputs.h || ''} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">Known Exact Derivative (Optional)</label>
                <input type="number" name="exactDerivative" value={inputs.exactDerivative || ''} onChange={handleInputChange} placeholder="e.g. 12" className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10 dark:text-white" />
            </div>

            {/* Optional Multi-h */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Multi-h Analysis (Optional CSV)</label>
                <input
                    type="text"
                    name="customHList"
                    value={inputs.customHList || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 0.1, 0.01, 0.001"
                    className="w-full text-xs px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-indigo-50/20 dark:bg-indigo-900/10 dark:text-white"
                />
                <Button size="sm" variant="outline" className="w-full mt-2 text-[10px] py-1" onClick={loadAutoHList}>
                    Load Automatic Logarithmic Set
                </Button>
            </div>
        </div>
    );
};

export default DifferentiationConfig;
