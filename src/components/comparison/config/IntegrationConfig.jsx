import React from 'react';
import { integrationPresets } from '../../../data/integrationPresets.js';
import Input from '../../common/Input';

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
                <Input type="text" name="func" label="Function f(x)" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^2" className="mb-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <Input type="number" name="a" label="Lower Limit (a)" value={inputs.a || ''} onChange={handleInputChange} />
                </div>
                <div>
                    <Input type="number" name="b" label="Upper Limit (b)" value={inputs.b || ''} onChange={handleInputChange} />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <Input type="number" name="exactValue" label="Known Exact Integral" helperText="(Optional)" value={inputs.exactValue || ''} onChange={handleInputChange} placeholder="e.g. 0.3333..." />
            </div>

            <div className="pt-1">
                <Input type="number" name="n" label="Subintervals (n)" value={inputs.n || '10'} onChange={handleInputChange} placeholder="Must be even or multiple of 3" />
            </div>
        </div>
    );
};

export default IntegrationConfig;
