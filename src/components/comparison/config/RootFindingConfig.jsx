import React from 'react';
import { rootFindingPresets } from '../../../data/rootFindingPresets.js';
import Input from '../../common/Input';

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
                <Input type="text" name="func" label="Function f(x)" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^3 - x - 2" className="mb-2" />
            </div>
            <div>
                <Input type="text" name="deriv" label="Derivative f'(x)" helperText="(Newton)" value={inputs.deriv || ''} onChange={handleInputChange} placeholder="3*x^2 - 1" className="mb-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <Input type="number" name="lowerBound" label="Lower / x₀" value={inputs.lowerBound || ''} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, initialGuess: e.target.value })) }} />
                </div>
                <div>
                    <Input type="number" name="upperBound" label="Upper / x₁" value={inputs.upperBound || ''} onChange={(e) => { handleInputChange(e); setInputs(p => ({ ...p, secondGuess: e.target.value })) }} />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <Input type="number" name="exactRoot" label="Known Exact Root" helperText="(Optional)" value={inputs.exactRoot || ''} onChange={handleInputChange} placeholder="e.g. 1.5213..." />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                    <Input type="text" name="tolerance" label="Tolerance" value={inputs.tolerance || '1e-6'} onChange={handleInputChange} />
                </div>
                <div>
                    <Input type="number" name="maxIterations" label="Max Iters" value={inputs.maxIterations || '50'} onChange={handleInputChange} />
                </div>
            </div>
        </div>
    );
};

export default RootFindingConfig;
