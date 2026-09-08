import React from 'react';
import { integrationPresets } from '../../../data/integrationPresets.js';

const IntegrationConfig = ({ inputs, handleInputChange, setInputs, setErrorMsg }) => {

    const handlePresetChange = (e) => {
        const presetName = e.target.value;
        if (!presetName) return;

        const preset = integrationPresets.find(p => p.name === presetName);
        if (preset) {
            setInputs({
                ...inputs,
                func: preset.func,
                a: preset.a,
                b: preset.b,
                n: preset.n || '10',
                exactValue: preset.exactValue || ''
            });
            setErrorMsg(null);
        }
    };

    return (
        <div className="space-y-3">
            <select
                className="w-full text-xs px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200 mb-2"
                onChange={handlePresetChange}
                value=""
            >
                <option value="" disabled>Load Demo Profile...</option>
                {integrationPresets.map((preset, idx) => (
                    <option key={idx} value={preset.name}>{preset.name}</option>
                ))}
            </select>

            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Function f(x)</label>
                <input type="text" name="func" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^2" className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 dark:text-white" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Lower Limit (a)</label>
                    <input type="number" name="a" value={inputs.a || ''} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                    <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Upper Limit (b)</label>
                    <input type="number" name="b" value={inputs.b || ''} onChange={handleInputChange} className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <label className="block text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">Known Exact Integral (Optional)</label>
                <input type="number" name="exactValue" value={inputs.exactValue || ''} onChange={handleInputChange} placeholder="e.g. 0.3333..." className="w-full text-sm px-3 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-amber-900/10 dark:text-white" />
            </div>

            <div className="pt-1">
                <label className="block text-xs text-slate-600 dark:text-slate-400 mb-0.5">Subintervals (n)</label>
                <input type="number" name="n" value={inputs.n || '10'} onChange={handleInputChange} placeholder="Must be even or multiple of 3" className="w-full text-xs px-2 py-1.5 border rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white" />
            </div>
        </div>
    );
};

export default IntegrationConfig;
