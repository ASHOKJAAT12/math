import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { METHOD_COLORS } from './ConvergenceLineChart';

export const ErrorComparisonChart = ({ data, isExact = false }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                    scale="log"
                    domain={['auto', 'auto']}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={{ value: 'Absolute Error (Log Scale)', angle: -90, position: 'insideLeft', offset: -10, fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                    formatter={(v) => [v.toExponential(4), isExact ? 'Absolute Error' : 'Residual Error']}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Bar dataKey="error" radius={[4, 4, 0, 0]} fill="#ef4444">
                    {data.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={METHOD_COLORS[entry.id] || "#ef4444"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ErrorComparisonChart;
