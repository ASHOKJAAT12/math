import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const METHOD_COLORS = {
    // Root Finding
    bisection: "#3b82f6",      // Blue
    regulaFalsi: "#f59e0b",    // Amber
    newtonRaphson: "#10b981",  // Emerald
    secant: "#8b5cf6",         // Violet

    // Integration
    trapezoidal: "#6366f1",    // Indigo
    simpson13: "#0ea5e9",      // Sky
    simpson38: "#ec4899",      // Pink

    // Differentiation
    forward: "#f43f5e",        // Rose
    backward: "#d946ef",       // Fuchsia
    central: "#8b5cf6"         // Violet
};

export const ConvergenceChart = ({ data, methods }) => {
    if (!data || data.length === 0) return (
        <div className="w-full h-64 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-sm text-slate-400 italic">No convergence iteration data available.</span>
        </div>
    );

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis
                        dataKey="iteration"
                        label={{ value: 'Iteration Count', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                        label={{ value: 'Error Scale Log₁₀(e)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        formatter={(value, name) => [value.toFixed(4), name.replace('LogError', '')]}
                        labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />

                    {methods.map(m => m.valid && (
                        <Line
                            key={m.id}
                            type="monotone"
                            dataKey={`${m.id}LogError`}
                            name={`${m.name}`}
                            stroke={METHOD_COLORS[m.id]}
                            strokeWidth={2}
                            dot={{ r: 3, fill: METHOD_COLORS[m.id], strokeWidth: 0 }}
                            activeDot={{ r: 6 }}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export const IterationChart = ({ results }) => {
    const data = Object.values(results).filter(m => m.valid && (m.converged || m.status === 'success' || m.status === 'Converged')).map(m => ({
        name: m.name,
        iterations: m.iterations || m.resultParam, // Map to resultParam if no iterations
        fill: METHOD_COLORS[m.id]
    }));

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="iterations" name="Iterations Required" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const TimeChart = ({ results }) => {
    const data = Object.values(results).filter(m => m.valid && (m.converged || m.status === 'success' || m.status === 'Converged')).map(m => ({
        name: m.name,
        time: m.executionTime,
        fill: METHOD_COLORS[m.id] || "#94a3b8"
    }));

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(v) => [`${v.toFixed(4)} ms`, 'Execution Time']} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="time" name="Execution Time (ms)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ErrorChart = ({ results, hasExactReference, category }) => {
    const data = Object.values(results).filter(m => m.valid && (m.converged || m.status === 'success' || m.status === 'Converged')).map(m => {
        let errVal = hasExactReference ? m.absoluteError : m.finalError;
        // In case it's not rootfinding and no exact reference is provided, there is no finalError
        if (errVal === undefined || errVal === null) errVal = 1e-16; // small dummy value to avoid breaking log scale completely if missing

        return {
            name: m.name,
            error: errVal,
            fill: METHOD_COLORS[m.id] || "#94a3b8"
        };
    });

    if (!data || data.length === 0) return null;

    return (
        <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
                    <YAxis scale="log" domain={['auto', 'auto']} tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(v) => [v.toExponential(4), hasExactReference ? 'Absolute Error' : (category === 'rootFinding' ? 'Iterative Residual' : 'Dummy Error')]} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="error" name={hasExactReference ? "Abs Error (Log Scale)" : "Residual Error (Log Scale)"} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
