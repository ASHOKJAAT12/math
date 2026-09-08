import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../components/layout/PageContainer';
import SectionHeader from '../components/common/SectionHeader';
import { Card, CardHeader, CardTitle, CardContent } from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { History as HistoryIcon, Search, Trash2, Download } from 'lucide-react';

import { getHistory, deleteCalculation, clearHistory } from '../utils/historyManager.js';
import { exportJSON } from '../utils/exportManager.js';
import HistoryCard from '../components/history/HistoryCard.jsx';

const CATEGORY_OPTIONS = ['All', 'Root Finding', 'Numerical Integration', 'Numerical Differentiation', 'Comparison'];
const SORT_OPTIONS = ['Newest', 'Oldest'];

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSort, setSelectedSort] = useState('Newest');

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = () => {
        setHistory(getHistory());
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this calculation?")) {
            const res = deleteCalculation(id);
            if (res.success) {
                loadHistory();
            } else {
                alert(res.message);
            }
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to delete ALL calculation history? This action cannot be undone.")) {
            const res = clearHistory();
            if (res.success) {
                loadHistory();
            } else {
                alert(res.message);
            }
        }
    };

    const handleViewReport = (id) => {
        navigate(`/report/${id}`);
    };

    const handleExportJSON = (calc) => {
        exportJSON(calc);
    };

    // Filter and Sort Logic
    const filteredHistory = history.filter(item => {
        // Category Filter
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
            return false;
        }
        // Search Filter (checks function string or method names)
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            const funcStr = (item.input?.func || '').toLowerCase();
            const opStr = (item.operation || '').toLowerCase();
            if (!funcStr.includes(term) && !opStr.includes(term)) {
                return false;
            }
        }
        return true;
    }).sort((a, b) => {
        if (selectedSort === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
        if (selectedSort === 'Oldest') return new Date(a.timestamp) - new Date(b.timestamp);
        return 0;
    });

    return (
        <PageContainer>
            <SectionHeader
                title="Calculation History"
                description="View past calculations, export results, and analyze historical runtime performance matrices."
            />

            {history.length > 0 ? (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <div className="relative w-full sm:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search functions or methods..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full px-4 py-2 text-sm border rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-300 dark:border-slate-700"
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                                >
                                    {CATEGORY_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt === 'All' ? 'All Categories' : opt}</option>
                                    ))}
                                </select>
                                <select
                                    value={selectedSort}
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    className="px-3 py-2 text-sm border rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700"
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>Sort: {opt}</option>
                                    ))}
                                </select>
                            </div>

                            <Button variant="danger" size="sm" onClick={handleClearAll} className="flex items-center gap-2 whitespace-nowrap">
                                <Trash2 className="h-4 w-4" /> Clear History
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Dashboard Grid */}
                    {filteredHistory.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredHistory.map(calc => (
                                <HistoryCard
                                    key={calc.id}
                                    calculation={calc}
                                    onDelete={handleDelete}
                                    onViewReport={handleViewReport}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="py-12">
                            <EmptyState
                                icon={Search}
                                title="No matching results found"
                                description="Try adjusting your search or category filters to find saved calculations."
                            />
                        </div>
                    )}
                </div>
            ) : (
                <Card className="min-h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-dashed border-2 pb-10">
                    <div className="max-w-md w-full p-6 text-center">
                        <EmptyState
                            icon={HistoryIcon}
                            title="No calculation history yet"
                            description="Calculations you save from the numerical method pages will appear here. Run an analysis and click 'Save Result' to start building your history."
                        />
                    </div>
                </Card>
            )}
        </PageContainer>
    );
};

export default History;
