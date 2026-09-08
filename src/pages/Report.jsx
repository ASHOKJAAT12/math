import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { ArrowLeft, Printer, Download, Copy, AlertTriangle } from 'lucide-react';

import { getCalculationById } from '../utils/historyManager.js';
import { exportJSON, exportCSV } from '../utils/exportManager.js';
import { formatNumber } from '../utils/formatters.js';

const Report = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [calc, setCalc] = useState(null);

    useEffect(() => {
        const data = getCalculationById(id);
        if (data) {
            setCalc(data);
        }
    }, [id]);

    if (!calc) {
        return (
            <PageContainer>
                <div className="pt-10">
                    <Button variant="outline" onClick={() => navigate('/history')} className="mb-6 flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to History
                    </Button>
                    <Card className="min-h-[300px] flex items-center justify-center">
                        <div className="max-w-md w-full p-6 text-center">
                            <EmptyState
                                icon={AlertTriangle}
                                title="Report Not Found"
                                description="The requested calculation report could not be found or has been deleted."
                            />
                        </div>
                    </Card>
                </div>
            </PageContainer>
        );
    }

    const { timestamp, category, operation, input, methods, resultSummary, detailedResults } = calc;
    const dateStr = new Date(timestamp).toLocaleString();

    const handlePrint = () => {
        window.print();
    };

    const handleUseAgain = () => {
        // Simple routing mapping logic based on category
        let path = '';
        if (category === 'Root Finding') path = '/root-finding';
        else if (category === 'Numerical Integration') path = '/integration';
        else if (category === 'Numerical Differentiation') path = '/differentiation';
        else if (category === 'Comparison') path = '/compare';

        // NOTE: Ideal approach is to pass state or query params.
        // For now, navigate back to the page. The user will manually re-enter or we could use session storage.
        navigate(path);
    };

    return (
        <PageContainer>
            <div className="mb-6 flex items-center justify-between print:hidden">
                <Button variant="outline" onClick={() => navigate('/history')} className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to History
                </Button>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={handleUseAgain} className="flex items-center gap-2">
                        <Copy className="h-4 w-4" /> Use Algorithm
                    </Button>
                    <Button variant="outline" onClick={() => exportJSON(calc)} className="flex items-center gap-2">
                        JSON Analysis
                    </Button>
                    <Button variant="outline" onClick={() => exportCSV(calc)} className="flex items-center gap-2">
                        <Download className="h-4 w-4" /> Export CSV
                    </Button>
                    <Button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600">
                        <Printer className="h-4 w-4" /> Print Report
                    </Button>
                </div>
            </div>

            <div className="print:m-0 print:p-0 space-y-8">
                {/* Header Section */}
                <Card className="border-none shadow-none bg-transparent print:border-b print:rounded-none">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                                {operation}
                            </h1>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Badge variant="primary">{category}</Badge>
                                <span>Report generated on {dateStr}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
                    {/* Input Parameters */}
                    <Card className="print:shadow-none print:border-slate-300">
                        <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-3 border-b border-slate-100 dark:border-slate-800">
                            <CardTitle>Configuration & Input</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(input).map(([key, value]) => {
                                    if (value === '' || value === undefined) return null;
                                    return (
                                        <div key={key}>
                                            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{key}</dt>
                                            <dd className="text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded inline-block break-all">
                                                {value}
                                            </dd>
                                        </div>
                                    )
                                })}
                            </dl>
                        </CardContent>
                    </Card>

                    {/* Result Summary */}
                    <Card className="print:shadow-none print:border-slate-300 bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30">
                        <CardHeader className="pb-3 border-b border-indigo-100 dark:border-indigo-900/30">
                            <CardTitle>Result Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.entries(resultSummary).map(([key, value]) => {
                                    if (value === undefined || value === null) return null;
                                    let formattedVal = value;
                                    if (typeof value === 'number') formattedVal = formatNumber(value, 6);
                                    if (typeof value === 'boolean') formattedVal = value ? 'Yes' : 'No';

                                    return (
                                        <div key={key}>
                                            <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                                            <dd className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                {formattedVal}
                                            </dd>
                                        </div>
                                    )
                                })}
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Steps/Table (Generic Rendering) */}
                <Card className="print:shadow-none print:border-slate-300">
                    <CardHeader className="bg-slate-50 dark:bg-slate-900/50 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <CardTitle>Raw Execution Matrix (JSON)</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <pre className="text-xs sm:text-sm font-mono text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-4 rounded-md overflow-x-auto print:whitespace-pre-wrap print:break-words">
                            {JSON.stringify(detailedResults, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            </div>

            {/* Print specific CSS hidden in screen mode */}
            <style jsx="true">{`
                @media print {
                    @page { size: auto; margin: 20mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    * {
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </PageContainer>
    );
};

export default Report;
