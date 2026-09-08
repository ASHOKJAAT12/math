import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const METHOD_COLORS = {
    bisection: "#3b82f6",      // Blue
    regulaFalsi: "#f59e0b",    // Amber
    newtonRaphson: "#10b981",  // Emerald
    secant: "#8b5cf6",         // Violet
    trapezoidal: "#6366f1",    // Indigo
    simpson13: "#0ea5e9",      // Sky
    simpson38: "#ec4899",      // Pink
    forward: "#f43f5e",        // Rose
    backward: "#d946ef",       // Fuchsia
    central: "#8b5cf6"         // Violet
};

export const ConvergenceLineChart = ({ data, selectedMethods }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis
                    dataKey="iteration"
                    label={{ value: 'Iteration Count', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                    label={{ value: 'Error Scale Log₁₀(e)', angle: -90, position: 'insideLeft', offset: -5, fill: '#64748b', fontSize: 12 }}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    formatter={(value, name) => {
                        const originalName = name.replace('LogError', '');
                        const displayVal = value === -16 ? '0 (Exact Match)' : `10^${value.toFixed(2)}`;
                        return [displayVal, originalName];
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />

                {selectedMethods.map(m => (
                    <Line
                        key={m.id}
                        type="monotone"
                        dataKey={`${m.id}LogError`}
                        name={`${m.name}`}
                        stroke={METHOD_COLORS[m.id] || "#94a3b8"}
                        strokeWidth={2}
                        dot={{ r: 3, fill: METHOD_COLORS[m.id] || "#94a3b8", strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                        connectNulls
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ConvergenceLineChart;
