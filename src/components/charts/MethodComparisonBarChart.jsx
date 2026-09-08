import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { METHOD_COLORS } from './ConvergenceLineChart';

export const MethodComparisonBarChart = ({ data, dataKey, name = "Value", yLabel, formatter }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.4} vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#cbd5e1' }} />
                <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    label={yLabel ? { value: yLabel, angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 } : null}
                />
                <Tooltip
                    cursor={{ fill: 'rgba(15, 23, 42, 0.05)' }}
                    formatter={(v) => [formatter ? formatter(v) : v, name]}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                        <cell key={`cell-${entry.id}`} fill={METHOD_COLORS[entry.id] || "#94a3b8"} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default MethodComparisonBarChart;
