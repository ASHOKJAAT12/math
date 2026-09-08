import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const HErrorChart = ({ data, methodsMap }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis
                    dataKey="h"
                    scale="log"
                    domain={['auto', 'auto']}
                    type="number"
                    stroke="#94a3b8"
                    tickFormatter={(val) => val.toExponential(1)}
                    label={{ value: 'Step Size (h)', position: 'bottom', offset: -5, fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                    scale="log"
                    domain={['auto', 'auto']}
                    stroke="#94a3b8"
                    tickFormatter={(val) => val.toExponential(1)}
                    label={{ value: 'Absolute Error', angle: -90, position: 'insideLeft', offset: -10, fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                    formatter={(value) => value.toExponential(4)}
                    labelFormatter={(label) => `h = ${label.toExponential(6)}`}
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} />
                {methodsMap.forward && <Line type="monotone" name="Forward Error" dataKey="forwardError" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />}
                {methodsMap.backward && <Line type="monotone" name="Backward Error" dataKey="backwardError" stroke="#d946ef" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />}
                {methodsMap.central && <Line type="monotone" name="Central Error" dataKey="centralError" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default HErrorChart;
