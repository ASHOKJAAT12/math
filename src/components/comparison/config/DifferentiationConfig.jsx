import React from 'react';
import { differentiationPresets } from '../../../data/differentiationPresets.js';
import Button from '../../common/Button';
import Input from '../../common/Input';

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
                <Input type="text" name="func" label="Function f(x)" value={inputs.func || ''} onChange={handleInputChange} placeholder="x^3" className="mb-2" />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <div>
                    <Input type="number" name="x" label="Eval Point (x)" value={inputs.x || ''} onChange={handleInputChange} />
                </div>
                <div>
                    <Input type="number" name="h" label="Step Size (h)" value={inputs.h || ''} onChange={handleInputChange} />
                </div>
            </div>

            <div className="pt-1 border-t border-slate-200 dark:border-slate-700/50">
                <Input type="number" name="exactDerivative" label="Known Exact Derivative" helperText="(Optional)" value={inputs.exactDerivative || ''} onChange={handleInputChange} placeholder="e.g. 12" />
            </div>

            {/* Optional Multi-h */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700/50">
                <Input
                    type="text"
                    name="customHList"
                    label="Multi-h Analysis"
                    helperText="(Optional CSV)"
                    value={inputs.customHList || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. 0.1, 0.01, 0.001"
                />
                <Button size="sm" variant="outline" className="w-full mt-2 text-[10px] py-1" onClick={loadAutoHList}>
                    Load Automatic Logarithmic Set
                </Button>
            </div>
        </div>
    );
};

export default DifferentiationConfig;
