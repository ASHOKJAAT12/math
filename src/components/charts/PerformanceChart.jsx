import React from 'react';
import MethodComparisonBarChart from './MethodComparisonBarChart';

export const PerformanceChart = ({ data }) => {
    return (
        <MethodComparisonBarChart
            data={data}
            dataKey="time"
            name="Execution Time (ms)"
            yLabel="Time (ms)"
            formatter={(v) => `${v.toFixed(4)} ms`}
        />
    );
};

export default PerformanceChart;
